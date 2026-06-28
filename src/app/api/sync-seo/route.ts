import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { JWT } from "google-auth-library";
import { monitoredUrls } from "@/lib/seo-tracking";

// Node runtime (default) — JWT signing needs Node crypto. Do NOT set edge.
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_SA_KEY_BASE64 = process.env.GOOGLE_SA_KEY_BASE64;
const GSC_SITE_URL = process.env.GSC_SITE_URL;
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = req.headers.get("x-cron-secret");
  const secret = bearer ?? headerSecret ?? null;
  return !!CRON_SECRET && secret === CRON_SECRET;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Records one ingestion attempt. Never throws — best effort. */
async function writeRun(
  supabase: SupabaseClient,
  row: {
    source: string;
    status: "ok" | "partial" | "error";
    rows_written?: number;
    window_start?: string | null;
    window_end?: string | null;
    error?: string | null;
  }
) {
  try {
    await supabase.from("seo_sync_runs").insert({
      source: row.source,
      status: row.status,
      rows_written: row.rows_written ?? 0,
      window_start: row.window_start ?? null,
      window_end: row.window_end ?? null,
      error: row.error ?? null,
    });
  } catch {
    /* swallow: run-tracking must never break ingestion */
  }
}

type SourceResult = {
  source: string;
  status: "ok" | "partial" | "error";
  rows: number;
  error?: string;
};

// ---------------------------------------------------------------------------
// GSC — Search Analytics, paginated, rolling window, dataState=final.
// ---------------------------------------------------------------------------
async function syncGsc(
  supabase: SupabaseClient,
  token: string,
  start: string,
  end: string
): Promise<SourceResult> {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    GSC_SITE_URL as string
  )}/searchAnalytics/query`;
  const rowLimit = 25000;
  let startRow = 0;
  let total = 0;
  let partial = false;

  // Paginate until a page returns fewer than rowLimit rows.
  for (;;) {
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: start,
          endDate: end,
          dimensions: ["date", "query", "page"],
          dataState: "final",
          rowLimit,
          startRow,
        }),
      });
    } catch (e) {
      return { source: "gsc", status: "error", rows: total, error: `fetch: ${String(e)}` };
    }
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        source: "gsc",
        status: total > 0 ? "partial" : "error",
        rows: total,
        error: `HTTP ${res.status}: ${body.slice(0, 300)}`,
      };
    }
    const data = (await res.json().catch(() => null)) as {
      rows?: { keys: string[]; clicks: number; impressions: number; ctr: number; position: number }[];
    } | null;
    const rows = data?.rows ?? [];
    if (rows.length === 0) break;

    const mapped = rows.map((r) => ({
      date: r.keys[0],
      query: r.keys[1] ?? "",
      page: r.keys[2] ?? "",
      clicks: Math.round(r.clicks ?? 0),
      impressions: Math.round(r.impressions ?? 0),
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));
    const { error } = await supabase
      .from("seo_gsc_daily")
      .upsert(mapped, { onConflict: "date,page,query", ignoreDuplicates: false });
    if (error) partial = true;
    else total += mapped.length;

    if (rows.length < rowLimit) break;
    startRow += rowLimit;
  }

  return { source: "gsc", status: partial ? "partial" : "ok", rows: total };
}

// ---------------------------------------------------------------------------
// GA4 — organic daily metrics via Data API runReport.
// ---------------------------------------------------------------------------
async function syncGa4(
  supabase: SupabaseClient,
  token: string,
  start: string,
  end: string
): Promise<SourceResult> {
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`;
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dateRanges: [{ startDate: start, endDate: end }],
        dimensions: [{ name: "date" }, { name: "sessionDefaultChannelGroup" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "engagedSessions" },
          { name: "engagementRate" },
          { name: "averageSessionDuration" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "sessionDefaultChannelGroup",
            stringFilter: { value: "Organic Search" },
          },
        },
      }),
    });
  } catch (e) {
    return { source: "ga4", status: "error", rows: 0, error: `fetch: ${String(e)}` };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { source: "ga4", status: "error", rows: 0, error: `HTTP ${res.status}: ${body.slice(0, 300)}` };
  }
  const data = (await res.json().catch(() => null)) as {
    rows?: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }[];
  } | null;
  const rows = data?.rows ?? [];
  if (rows.length === 0) return { source: "ga4", status: "ok", rows: 0 };

  const mapped = rows.map((r) => {
    const rawDate = r.dimensionValues[0]?.value ?? ""; // GA4 returns YYYYMMDD
    const date =
      rawDate.length === 8
        ? `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`
        : rawDate;
    const m = r.metricValues.map((v) => Number(v.value) || 0);
    return {
      date,
      channel: r.dimensionValues[1]?.value || "Organic Search",
      sessions: Math.round(m[0]),
      total_users: Math.round(m[1]),
      engaged_sessions: Math.round(m[2]),
      engagement_rate: m[3],
      avg_session_duration: m[4],
    };
  });
  const { error } = await supabase
    .from("seo_ga4_daily")
    .upsert(mapped, { onConflict: "date,channel", ignoreDuplicates: false });
  if (error) return { source: "ga4", status: "partial", rows: 0, error: error.message };
  return { source: "ga4", status: "ok", rows: mapped.length };
}

// ---------------------------------------------------------------------------
// PSI — PageSpeed Insights per monitored URL. Field (CrUX) + lab rows.
// ---------------------------------------------------------------------------
async function syncPsi(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  const urls = monitoredUrls();
  let total = 0;
  let partial = false;

  for (const url of urls) {
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", "mobile");
    endpoint.searchParams.set("category", "performance");
    if (PAGESPEED_API_KEY) endpoint.searchParams.set("key", PAGESPEED_API_KEY);

    let res: Response;
    try {
      res = await fetch(endpoint.toString());
    } catch {
      partial = true;
      continue;
    }
    if (!res.ok) {
      partial = true;
      continue;
    }
    const data = (await res.json().catch(() => null)) as PsiResponse | null;
    if (!data) {
      partial = true;
      continue;
    }

    const rows: CwvRow[] = [];

    // Lab (Lighthouse) — always present.
    const lab = data.lighthouseResult;
    if (lab) {
      rows.push({
        date,
        url,
        strategy: "mobile",
        source: "lab",
        lcp_ms: lab.audits?.["largest-contentful-paint"]?.numericValue ?? null,
        inp_ms: lab.audits?.["interaction-to-next-paint"]?.numericValue ?? null,
        cls: lab.audits?.["cumulative-layout-shift"]?.numericValue ?? null,
        perf_score:
          typeof lab.categories?.performance?.score === "number"
            ? lab.categories.performance.score * 100
            : null,
      });
    }
    // Field (CrUX) — only when the URL has enough real-user data.
    const field = data.loadingExperience?.metrics;
    if (field) {
      rows.push({
        date,
        url,
        strategy: "mobile",
        source: "field",
        lcp_ms: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
        inp_ms: field.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
        cls:
          typeof field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile === "number"
            ? field.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 // CrUX returns CLS×100
            : null,
        perf_score: null,
      });
    }

    if (rows.length) {
      const { error } = await supabase
        .from("seo_cwv_snapshots")
        .upsert(rows, { onConflict: "date,url,strategy,source", ignoreDuplicates: false });
      if (error) partial = true;
      else total += rows.length;
    }
  }

  return { source: "psi", status: partial ? "partial" : "ok", rows: total };
}

type CwvRow = {
  date: string;
  url: string;
  strategy: string;
  source: "lab" | "field";
  lcp_ms: number | null;
  inp_ms: number | null;
  cls: number | null;
  perf_score: number | null;
};

type PsiResponse = {
  lighthouseResult?: {
    categories?: { performance?: { score?: number } };
    audits?: Record<string, { numericValue?: number }>;
  };
  loadingExperience?: {
    metrics?: {
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile?: number };
      INTERACTION_TO_NEXT_PAINT?: { percentile?: number };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile?: number };
    };
  };
};

export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }
  if (!GOOGLE_SA_KEY_BASE64 || !GSC_SITE_URL || !GA4_PROPERTY_ID) {
    return NextResponse.json(
      { error: "Missing GOOGLE_SA_KEY_BASE64 / GSC_SITE_URL / GA4_PROPERTY_ID" },
      { status: 503 }
    );
  }

  // Decode SA key. On failure, do NOT echo key material.
  let saEmail: string;
  let saKey: string;
  try {
    const sa = JSON.parse(Buffer.from(GOOGLE_SA_KEY_BASE64, "base64").toString("utf8"));
    saEmail = sa.client_email;
    saKey = sa.private_key;
    if (!saEmail || !saKey) throw new Error("missing client_email/private_key");
  } catch {
    return NextResponse.json({ error: "GOOGLE_SA_KEY_BASE64 is not valid base64 SA JSON" }, { status: 503 });
  }

  const jwt = new JWT({ email: saEmail, key: saKey, scopes: [GSC_SCOPE, GA4_SCOPE] });
  let token: string;
  try {
    const t = await jwt.getAccessToken();
    if (!t.token) throw new Error("no access token");
    token = t.token;
  } catch (e) {
    return NextResponse.json(
      { error: "Service account auth failed", details: String(e).slice(0, 200) },
      { status: 502 }
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Preflight self-test: surface WHICH API the SA can't reach, not a generic 500.
  const preflight = new URL(req.url).searchParams.get("preflight") === "1";
  if (preflight) {
    const checks: Record<string, string> = {};
    const gscPing = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(GSC_SITE_URL)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((e) => ({ ok: false, status: 0, statusText: String(e) }) as Response);
    checks.gsc = gscPing.ok ? "ok" : `fail ${gscPing.status} — is ${saEmail} a GSC user?`;
    const ga4Ping = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}/metadata`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((e) => ({ ok: false, status: 0, statusText: String(e) }) as Response);
    checks.ga4 = ga4Ping.ok ? "ok" : `fail ${ga4Ping.status} — is ${saEmail} a GA4 Viewer? property numeric?`;
    return NextResponse.json({ ok: true, preflight: checks, sa: saEmail });
  }

  // Rolling window: GSC final data lags 2-3 days, so query a wider trailing window.
  const today = new Date();
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 11); // ~10-day window
  const startStr = ymd(start);
  const endStr = ymd(end);
  const psiDate = ymd(today);

  const results: SourceResult[] = [];

  const gsc = await syncGsc(supabase, token, startStr, endStr);
  results.push(gsc);
  await writeRun(supabase, { source: "gsc", status: gsc.status, rows_written: gsc.rows, window_start: startStr, window_end: endStr, error: gsc.error });

  const ga4 = await syncGa4(supabase, token, startStr, endStr);
  results.push(ga4);
  await writeRun(supabase, { source: "ga4", status: ga4.status, rows_written: ga4.rows, window_start: startStr, window_end: endStr, error: ga4.error });

  const psi = await syncPsi(supabase, psiDate);
  results.push(psi);
  await writeRun(supabase, { source: "psi", status: psi.status, rows_written: psi.rows, window_start: psiDate, window_end: psiDate, error: psi.error });

  const anyError = results.some((r) => r.status === "error");
  return NextResponse.json({ ok: !anyError, window: { start: startStr, end: endStr }, results }, {
    status: anyError ? 207 : 200,
  });
}
