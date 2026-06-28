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
};

// ---------------------------------------------------------------------------
// AI mentions — Google AI Overview + ChatGPT citations of TARGET_DOMAIN.
// ---------------------------------------------------------------------------
async function syncAiMentions(supabase: SupabaseClient, date: string): Promise<SourceResult> {
  let total = 0;
  let cost = 0;
  let partial = false;
  for (const keyword of TRACKED_KEYWORDS.slice(0, MAX_TRACKED_KEYWORDS)) {
    try {
      const json = await dfsPost("/dataforseo_labs/ai_mentions/live", {
        keyword,
        target: TARGET_DOMAIN,
        location_code: LOCATION_CODE,
        language_code: LANGUAGE_CODE,
      });
      cost += json.cost ?? 0;
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
      if (rows.length) {
        const { error } = await supabase
          .from("seo_ai_mentions")
          .upsert(rows, { onConflict: "date,keyword,ai_source", ignoreDuplicates: false });
        if (error) partial = true;
        else total += rows.length;
      }
    } catch {
      partial = true;
    }
  }
  return { source: "dfs_ai", status: partial ? "partial" : "ok", rows: total, cost };
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
  let total = 0;
  let cost = 0;
  let partial = false;
  for (const keyword of TRACKED_KEYWORDS.slice(0, MAX_TRACKED_KEYWORDS)) {
    try {
      const json = await dfsPost("/serp/google/organic/live/advanced", {
        keyword,
        location_code: LOCATION_CODE,
        language_code: LANGUAGE_CODE,
        depth: 20,
      });
      cost += json.cost ?? 0;
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
      if (error) partial = true;
      else total += 1;
    } catch {
      partial = true;
    }
  }
  return { source: "dfs_rankings", status: partial ? "partial" : "ok", rows: total, cost };
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
  let partial = false;
  for (const url of monitoredUrls()) {
    try {
      const json = await dfsPost("/on_page/instant_pages", { url });
      cost += json.cost ?? 0;
      const page = (json.tasks?.[0]?.result?.[0] as { items?: OnPageItem[] } | undefined)?.items?.[0];
      if (!page) {
        partial = true;
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
        if (error) partial = true;
        else total += rows.length;
      }
    } catch {
      partial = true;
    }
  }
  return { source: "dfs_onpage", status: partial ? "partial" : "ok", rows: total, cost };
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
    const result = json.tasks?.[0]?.result?.[0] as Record<string, unknown> | undefined;
    if (!result) return { source: "dfs_backlinks", status: "error", rows: 0, cost, error: "no result" };
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

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const date = ymd(new Date());

  // Run sequentially to keep concurrent DataForSEO load (and cost spikes) bounded.
  const results: SourceResult[] = [];
  for (const fn of [syncAiMentions, syncRankings, syncOnPage, syncBacklinks]) {
    const r = await fn(supabase, date);
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
  const anyError = results.some((r) => r.status === "error");
  return NextResponse.json(
    { ok: !anyError, date, total_cost: totalCost, results },
    { status: anyError ? 207 : 200 }
  );
}
