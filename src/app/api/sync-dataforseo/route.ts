import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  TARGET_DOMAIN,
  TRACKED_KEYWORDS,
  MAX_TRACKED_KEYWORDS,
  monitoredUrls,
  DEFAULT_LOCATION_CODE,
  DEFAULT_LANGUAGE_CODE,
} from "@/lib/seo-tracking";

// Node runtime (default). Weekly cadence — DataForSEO is pay-per-request.
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DFS_LOGIN = process.env.DATAFORSEO_LOGIN;
const DFS_PASSWORD = process.env.DATAFORSEO_PASSWORD;
const LOCATION_CODE = Number(process.env.DATAFORSEO_LOCATION_CODE) || DEFAULT_LOCATION_CODE;
const LANGUAGE_CODE = process.env.DATAFORSEO_LANGUAGE_CODE || DEFAULT_LANGUAGE_CODE;

const DFS_BASE = "https://api.dataforseo.com/v3";

function checkCronAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const headerSecret = req.headers.get("x-cron-secret");
  const secret = bearer ?? headerSecret ?? null;
  return !!CRON_SECRET && secret === CRON_SECRET;
}

function dfsAuthHeader(): string {
  return "Basic " + Buffer.from(`${DFS_LOGIN}:${DFS_PASSWORD}`).toString("base64");
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** POST a DataForSEO live endpoint with a single task. Returns parsed JSON. */
async function dfsPost(path: string, task: Record<string, unknown>): Promise<DfsResponse> {
  const res = await fetch(`${DFS_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: dfsAuthHeader(), "Content-Type": "application/json" },
    body: JSON.stringify([task]),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as DfsResponse;
}

type DfsResponse = {
  cost?: number;
  tasks?: { status_code?: number; status_message?: string; cost?: number; result?: unknown[] }[];
};

/**
 * Run `worker` over `items` with at most `limit` in flight. Used to fan out the
 * per-keyword DataForSEO calls so a source finishes well under Vercel's 60s cap
 * (12 sequential SERP calls were ~59s — one keyword away from a 504). Bounded so
 * we never hammer DataForSEO with one request per keyword all at once.
 */
async function runBounded<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const pump = async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, pump));
  return results;
}

/** Max concurrent per-keyword DataForSEO requests within a single source. */
const KEYWORD_CONCURRENCY = 4;

async function writeRun(
  supabase: SupabaseClient,
  row: { source: string; status: "ok" | "partial" | "error"; rows_written?: number; window_start?: string; window_end?: string; cost?: number; error?: string | null }
) {
  try {
    await supabase.from("seo_sync_runs").insert({
      source: row.source,
      status: row.status,
      rows_written: row.rows_written ?? 0,
      window_start: row.window_start ?? null,
      window_end: row.window_end ?? null,
      cost: row.cost ?? 0,
      error: row.error ?? null,
    });
  } catch {
    /* swallow */
  }
}

type SourceResult = {
  source: string;
  status: "ok" | "partial" | "error";
  rows: number;
  cost: number;
  error?: string;
  duration_ms?: number;
};

// ---------------------------------------------------------------------------
// AI mentions — Google AI Overview + ChatGPT citations of TARGET_DOMAIN.
// ---------------------------------------------------------------------------
async function syncAiMentions(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  const keywords = TRACKED_KEYWORDS.slice(0, MAX_TRACKED_KEYWORDS);
  const perKeyword = await runBounded(keywords, KEYWORD_CONCURRENCY, async (keyword) => {
    try {
      const json = await dfsPost("/dataforseo_labs/ai_mentions/live", {
        keyword,
        target: TARGET_DOMAIN,
        location_code: LOCATION_CODE,
        language_code: LANGUAGE_CODE,
      });
      const cost = json.cost ?? 0;
      const items = (json.tasks?.[0]?.result?.[0] as { items?: AiMentionItem[] } | undefined)?.items ?? [];
      // Aggregate per ai_source for this keyword.
      const bySource = new Map<string, { cited: boolean; position: number | null; competitors: unknown[]; urls: string[] }>();
      for (const it of items) {
        const src = it.ai_source ?? "ai_overview";
        const entry = bySource.get(src) ?? { cited: false, position: null, competitors: [], urls: [] };
        const isOurs = (it.domain ?? "").includes(TARGET_DOMAIN);
        if (isOurs) {
          entry.cited = true;
          if (entry.position == null) entry.position = it.rank_absolute ?? null;
        } else if (it.domain) {
          entry.competitors.push({ domain: it.domain, rank: it.rank_absolute ?? null });
        }
        if (it.url) entry.urls.push(it.url);
        bySource.set(src, entry);
      }
      const rows = [...bySource.entries()].map(([ai_source, e]) => ({
        date,
        keyword,
        ai_source,
        cited: e.cited,
        position: e.position,
        competitors: e.competitors.slice(0, 10),
        source_urls: e.urls.slice(0, 10),
      }));
      if (!rows.length) return { rows: 0, cost, error: null as string | null };
      const { error } = await supabase
        .from("seo_ai_mentions")
        .upsert(rows, { onConflict: "date,keyword,ai_source", ignoreDuplicates: false });
      return { rows: error ? 0 : rows.length, cost, error: error?.message ?? null };
    } catch (e) {
      return { rows: 0, cost: 0, error: String(e).slice(0, 200) };
    }
  });
  return aggregate("dfs_ai", perKeyword);
}

/**
 * Status for a source: clean when no error; "partial" when some rows landed
 * despite an error; "error" when an error left nothing written (total failure).
 * Keeping the total-failure case as "error" lets the GET handler flag it (207 /
 * ok:false) instead of masquerading as a successful run.
 */
function statusFor(rows: number, error?: string | null): SourceResult["status"] {
  if (!error) return "ok";
  return rows > 0 ? "partial" : "error";
}

/** Fold per-keyword outcomes into a SourceResult; surface the first error seen. */
function aggregate(
  source: string,
  parts: { rows: number; cost: number; error: string | null }[]
): SourceResult {
  const rows = parts.reduce((s, p) => s + p.rows, 0);
  const cost = parts.reduce((s, p) => s + p.cost, 0);
  const firstError = parts.find((p) => p.error)?.error ?? undefined;
  return { source, status: statusFor(rows, firstError), rows, cost, error: firstError };
}

type AiMentionItem = {
  ai_source?: string;
  domain?: string;
  url?: string;
  rank_absolute?: number;
};

// ---------------------------------------------------------------------------
// Rankings — absolute SERP position + top competitors per tracked keyword.
// ---------------------------------------------------------------------------
async function syncRankings(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  const keywords = TRACKED_KEYWORDS.slice(0, MAX_TRACKED_KEYWORDS);
  const perKeyword = await runBounded(keywords, KEYWORD_CONCURRENCY, async (keyword) => {
    try {
      const json = await dfsPost("/serp/google/organic/live/advanced", {
        keyword,
        location_code: LOCATION_CODE,
        language_code: LANGUAGE_CODE,
        depth: 20, // keep 20 so positions 11-20 are still captured (we rank below 10 on most terms)
      });
      const cost = json.cost ?? 0;
      const result = json.tasks?.[0]?.result?.[0] as { items?: SerpItem[]; keyword_info?: { search_volume?: number } } | undefined;
      const items = (result?.items ?? []).filter((i) => i.type === "organic");
      let ourPos: number | null = null;
      let ourUrl: string | null = null;
      const competitors: { domain: string; position: number }[] = [];
      for (const it of items) {
        const domain = it.domain ?? "";
        if (domain.includes(TARGET_DOMAIN)) {
          if (ourPos == null) {
            ourPos = it.rank_absolute ?? null;
            ourUrl = it.url ?? null;
          }
        } else if (domain && competitors.length < 10) {
          competitors.push({ domain, position: it.rank_absolute ?? 0 });
        }
      }
      const row = {
        date,
        keyword,
        location_code: LOCATION_CODE,
        our_position: ourPos,
        our_url: ourUrl,
        search_volume: result?.keyword_info?.search_volume ?? null,
        top_competitors: competitors.slice(0, 5),
      };
      const { error } = await supabase
        .from("seo_rankings")
        .upsert(row, { onConflict: "date,keyword,location_code", ignoreDuplicates: false });
      return { rows: error ? 0 : 1, cost, error: error?.message ?? null };
    } catch (e) {
      return { rows: 0, cost: 0, error: String(e).slice(0, 200) };
    }
  });
  return aggregate("dfs_rankings", perKeyword);
}

type SerpItem = {
  type?: string;
  domain?: string;
  url?: string;
  rank_absolute?: number;
};

// ---------------------------------------------------------------------------
// On-Page — instant single-page audit for each monitored URL (no async crawl).
// ---------------------------------------------------------------------------
async function syncOnPage(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  let total = 0;
  let cost = 0;
  let firstError: string | undefined;
  for (const url of monitoredUrls()) {
    try {
      const json = await dfsPost("/on_page/instant_pages", { url });
      cost += json.cost ?? 0;
      const page = (json.tasks?.[0]?.result?.[0] as { items?: OnPageItem[] } | undefined)?.items?.[0];
      if (!page) {
        firstError ??= `no page for ${url}`;
        continue;
      }
      const rows: { date: string; url: string; issue_type: string; severity: string; detail: string }[] = [];
      const checks = page.checks ?? {};
      // Map the booleans DataForSEO flags as "problem present" → issue rows.
      const PROBLEM_CHECKS: Record<string, string> = {
        no_title: "missing_title",
        no_description: "missing_description",
        duplicate_title_tag: "duplicate_title",
        duplicate_description: "duplicate_meta",
        is_broken: "broken_page",
        is_4xx_code: "http_4xx",
        is_5xx_code: "http_5xx",
        is_redirect: "redirect",
        canonical_chain: "canonical_chain",
        no_image_alt: "missing_alt",
        no_h1_tag: "missing_h1",
        https_to_http_links: "mixed_content",
        low_content_rate: "thin_content",
      };
      for (const [check, issueType] of Object.entries(PROBLEM_CHECKS)) {
        if (checks[check]) {
          const severity =
            issueType.startsWith("http_") || issueType === "broken_page" ? "critical" : "warning";
          rows.push({ date, url, issue_type: issueType, severity, detail: check });
        }
      }
      if (rows.length) {
        const { error } = await supabase
          .from("seo_onpage_issues")
          .upsert(rows, { onConflict: "date,url,issue_type", ignoreDuplicates: false });
        if (error) {
          firstError ??= error.message;
        } else {
          total += rows.length;
        }
      }
    } catch (e) {
      firstError ??= String(e).slice(0, 200);
    }
  }
  return { source: "dfs_onpage", status: statusFor(total, firstError), rows: total, cost, error: firstError };
}

type OnPageItem = { checks?: Record<string, boolean> };

// ---------------------------------------------------------------------------
// Backlinks — one summary snapshot per run.
// ---------------------------------------------------------------------------
async function syncBacklinks(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  try {
    const json = await dfsPost("/backlinks/summary/live", {
      target: TARGET_DOMAIN,
      internal_list_limit: 10,
      backlinks_status_type: "live",
    });
    const cost = json.cost ?? 0;
    const task = json.tasks?.[0];
    const result = task?.result?.[0] as Record<string, unknown> | undefined;
    if (!result) {
      // Surface DataForSEO's own reason (e.g. 40204 "Access denied" = the
      // account has no Backlinks API subscription) instead of a bare "no result".
      const reason =
        task?.status_code && task.status_code !== 20000
          ? `DataForSEO ${task.status_code}: ${task.status_message ?? "no message"}`
          : "no result";
      return { source: "dfs_backlinks", status: "error", rows: 0, cost, error: reason };
    }
    const snapshot = {
      referring_domains: result.referring_domains ?? null,
      backlinks: result.backlinks ?? null,
      referring_main_domains: result.referring_main_domains ?? null,
      rank: result.rank ?? null,
      broken_backlinks: result.broken_backlinks ?? null,
      referring_domains_nofollow: result.referring_domains_nofollow ?? null,
    };
    const { error } = await supabase
      .from("seo_backlinks")
      .upsert({ date, metric_snapshot: snapshot }, { onConflict: "date", ignoreDuplicates: false });
    if (error) return { source: "dfs_backlinks", status: "partial", rows: 0, cost, error: error.message };
    return { source: "dfs_backlinks", status: "ok", rows: 1, cost };
  } catch (e) {
    return { source: "dfs_backlinks", status: "error", rows: 0, cost: 0, error: String(e).slice(0, 200) };
  }
}

// Each source individually finishes well under Vercel's 60s function cap; the
// full set (~78s) does not. The weekly GitHub Action invokes one source per
// request via ?source=… so every call stays in budget. The bare endpoint (no
// ?source) still runs all four sequentially — legacy/manual only, can time out.
type SyncFn = (supabase: SupabaseClient, date: string) => Promise<SourceResult>;
const SYNC_SOURCES: Record<string, SyncFn> = {
  ai: syncAiMentions,
  rankings: syncRankings,
  onpage: syncOnPage,
  backlinks: syncBacklinks,
};

export async function GET(req: NextRequest) {
  if (!checkCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase service role not configured" }, { status: 503 });
  }
  if (!DFS_LOGIN || !DFS_PASSWORD) {
    return NextResponse.json({ error: "DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD not set" }, { status: 503 });
  }

  // Optional ?source=ai|rankings|onpage|backlinks — run a single source so the
  // request stays under the 60s cap. Unknown values are rejected (a typo must
  // never silently fall through to the all-sources path and 504).
  const sourceParam = req.nextUrl.searchParams.get("source");
  if (sourceParam !== null && !(sourceParam in SYNC_SOURCES)) {
    return NextResponse.json(
      { error: `Unknown source "${sourceParam}". Valid: ${Object.keys(SYNC_SOURCES).join(", ")}` },
      { status: 400 }
    );
  }
  const fns: SyncFn[] = sourceParam ? [SYNC_SOURCES[sourceParam]] : Object.values(SYNC_SOURCES);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const date = ymd(new Date());

  // Run sequentially to keep concurrent DataForSEO load (and cost spikes) bounded.
  const results: SourceResult[] = [];
  for (const fn of fns) {
    const started = Date.now();
    const r = await fn(supabase, date);
    r.duration_ms = Date.now() - started;
    results.push(r);
    await writeRun(supabase, {
      source: r.source,
      status: r.status,
      rows_written: r.rows,
      window_start: date,
      window_end: date,
      cost: r.cost,
      error: r.error,
    });
  }

  const totalCost = results.reduce((s, r) => s + r.cost, 0);
  // Any non-ok source (partial OR total failure) → 207 + ok:false, so a run that
  // carries an error string in its body can never report as a clean success.
  const anyNonOk = results.some((r) => r.status !== "ok");
  return NextResponse.json(
    { ok: !anyNonOk, date, source: sourceParam ?? "all", total_cost: totalCost, results },
    { status: anyNonOk ? 207 : 200 }
  );
}
