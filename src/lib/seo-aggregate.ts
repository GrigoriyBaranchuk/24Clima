/**
 * Shared SEO aggregation. Reads the seo_* tables and computes week-over-week
 * deltas + time-series. Used by:
 *  - scripts/seo-digest.ts          (renders the weekly GitHub issue)
 *  - /api/admin/seo/metrics         (dashboard JSON)
 *  - /api/admin/seo/{analyze,chat}  (compact context for the agent)
 *
 * No LLM, no side effects — pure read + compute against a service-role client.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export const STALE_DAYS = 3;

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function pctDelta(curr: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

type Row = Record<string, unknown>;

async function fetchSince(supabase: SupabaseClient, table: string, fromDate: string): Promise<Row[]> {
  const { data, error } = await supabase.from(table).select("*").gte("date", fromDate);
  if (error) return [];
  return (data ?? []) as Row[];
}

function sumBy(rows: Row[], key: string, pred: (r: Row) => boolean): number {
  return rows.reduce((s, r) => (pred(r) ? s + (Number(r[key]) || 0) : s), 0);
}

export type SeoAggregate = {
  windows: { curr7: string; prev7: string; series: string };
  syncHealth: {
    source: string;
    status: string | null;
    ageDays: number | null;
    lastRunAt: string | null;
    error: string | null;
    stale: boolean;
  }[];
  weeklyCost: number;
  gsc: {
    clicksCurr: number;
    clicksPrev: number;
    imprCurr: number;
    imprPrev: number;
    topQueries: { query: string; clicks: number; clicksPrev: number; avgPosition: number | null }[];
    series: { date: string; clicks: number; impressions: number }[];
  };
  ga4: {
    sessionsCurr: number;
    sessionsPrev: number;
    series: { date: string; sessions: number }[];
  };
  rankings: {
    latestDate: string | null;
    prevDate: string | null;
    rows: {
      keyword: string;
      position: number | null;
      prevPosition: number | null;
      searchVolume: number | null;
      competitors: unknown[];
    }[];
  };
  aiMentions: {
    citedCurr: number;
    totalCurr: number;
    citedPrev: number;
    totalPrev: number;
    notCited: { keyword: string; aiSource: string }[];
  };
  cwv: { latestDate: string | null; breaches: { url: string; lcp: number | null; inp: number | null; cls: number | null }[] };
  onpage: { latestDate: string | null; total: number; critical: { url: string; issueType: string }[] };
  backlinks: { snapshot: Record<string, unknown> | null; date: string | null };
};

export async function buildSeoAggregate(supabase: SupabaseClient): Promise<SeoAggregate> {
  const d7 = isoDaysAgo(7);
  const d14 = isoDaysAgo(14);
  const d60 = isoDaysAgo(60);
  const inCurr = (r: Row) => String(r.date) >= d7;
  const inPrev = (r: Row) => String(r.date) >= d14 && String(r.date) < d7;

  // --- Sync health ---
  const { data: runs } = await supabase
    .from("seo_sync_runs")
    .select("*")
    .gte("run_at", new Date(Date.now() - 8 * 864e5).toISOString())
    .order("run_at", { ascending: false });
  const runRows = (runs ?? []) as Row[];
  const sources = ["gsc", "ga4", "psi", "dfs_ai", "dfs_rankings", "dfs_onpage", "dfs_backlinks"];
  const weeklyCost = runRows.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  const syncHealth = sources.map((src) => {
    const last = runRows.find((r) => r.source === src);
    if (!last) return { source: src, status: null, ageDays: null, lastRunAt: null, error: null, stale: true };
    const ageDays = Math.floor((Date.now() - new Date(String(last.run_at)).getTime()) / 864e5);
    return {
      source: src,
      status: String(last.status),
      ageDays,
      lastRunAt: String(last.run_at),
      error: last.error ? String(last.error) : null,
      stale: last.status === "error" || ageDays > STALE_DAYS,
    };
  });

  // --- GSC ---
  const gsc = await fetchSince(supabase, "seo_gsc_daily", d60);
  const byQuery = new Map<string, { c: number; cPrev: number; posSum: number; n: number }>();
  const gscByDate = new Map<string, { clicks: number; impressions: number }>();
  for (const r of gsc) {
    const date = String(r.date);
    const q = String(r.query);
    if (date >= d14) {
      const e = byQuery.get(q) ?? { c: 0, cPrev: 0, posSum: 0, n: 0 };
      if (inCurr(r)) {
        e.c += Number(r.clicks) || 0;
        e.posSum += Number(r.position) || 0;
        e.n += 1;
      }
      if (inPrev(r)) e.cPrev += Number(r.clicks) || 0;
      if (q) byQuery.set(q, e);
    }
    const g = gscByDate.get(date) ?? { clicks: 0, impressions: 0 };
    g.clicks += Number(r.clicks) || 0;
    g.impressions += Number(r.impressions) || 0;
    gscByDate.set(date, g);
  }
  const topQueries = [...byQuery.entries()]
    .sort((a, b) => b[1].c - a[1].c)
    .slice(0, 10)
    .map(([query, e]) => ({
      query,
      clicks: e.c,
      clicksPrev: e.cPrev,
      avgPosition: e.n ? e.posSum / e.n : null,
    }));
  const gscSeries = [...gscByDate.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, clicks: v.clicks, impressions: v.impressions }));

  // --- GA4 ---
  const ga4 = await fetchSince(supabase, "seo_ga4_daily", d60);
  const ga4Series = ga4
    .map((r) => ({ date: String(r.date), sessions: Number(r.sessions) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // --- Rankings ---
  const ranks = await fetchSince(supabase, "seo_rankings", d14);
  const latestRankDate = ranks.reduce((m, r) => (String(r.date) > m ? String(r.date) : m), "");
  const prevRankDate =
    ranks.map((r) => String(r.date)).filter((dt) => dt < latestRankDate).sort().pop() ?? null;
  const rankRows = ranks
    .filter((r) => String(r.date) === latestRankDate)
    .map((r) => {
      const prev = ranks.find((p) => p.keyword === r.keyword && String(p.date) === prevRankDate);
      return {
        keyword: String(r.keyword),
        position: r.our_position == null ? null : Number(r.our_position),
        prevPosition: prev?.our_position == null ? null : Number(prev.our_position),
        searchVolume: r.search_volume == null ? null : Number(r.search_volume),
        competitors: (r.top_competitors as unknown[]) ?? [],
      };
    });

  // --- AI mentions ---
  const ai = await fetchSince(supabase, "seo_ai_mentions", d14);
  const aiCurr = ai.filter(inCurr);
  const aiPrev = ai.filter(inPrev);
  const aiMentions = {
    citedCurr: aiCurr.filter((r) => r.cited).length,
    totalCurr: aiCurr.length,
    citedPrev: aiPrev.filter((r) => r.cited).length,
    totalPrev: aiPrev.length,
    notCited: aiCurr
      .filter((r) => !r.cited)
      .map((r) => ({ keyword: String(r.keyword), aiSource: String(r.ai_source) })),
  };

  // --- CWV (field rows only) ---
  const cwv = await fetchSince(supabase, "seo_cwv_snapshots", d14);
  const latestCwvDate = cwv.reduce((m, r) => (String(r.date) > m ? String(r.date) : m), "");
  const breaches = cwv
    .filter((r) => String(r.date) === latestCwvDate && r.source === "field")
    .map((r) => ({
      url: String(r.url),
      lcp: r.lcp_ms == null ? null : Number(r.lcp_ms),
      inp: r.inp_ms == null ? null : Number(r.inp_ms),
      cls: r.cls == null ? null : Number(r.cls),
    }))
    .filter((r) => (r.lcp ?? 0) > 2500 || (r.inp ?? 0) > 200 || (r.cls ?? 0) > 0.1);

  // --- On-page ---
  const onpage = await fetchSince(supabase, "seo_onpage_issues", d7);
  const latestOpDate = onpage.reduce((m, r) => (String(r.date) > m ? String(r.date) : m), "");
  const opLatest = onpage.filter((r) => String(r.date) === latestOpDate);
  const onpageOut = {
    latestDate: latestOpDate || null,
    total: opLatest.length,
    critical: opLatest
      .filter((r) => r.severity === "critical")
      .map((r) => ({ url: String(r.url), issueType: String(r.issue_type) })),
  };

  // --- Backlinks ---
  const bl = await fetchSince(supabase, "seo_backlinks", d60);
  const latestBl = bl.sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];

  return {
    windows: { curr7: d7, prev7: d14, series: d60 },
    syncHealth,
    weeklyCost,
    gsc: {
      clicksCurr: sumBy(gsc, "clicks", inCurr),
      clicksPrev: sumBy(gsc, "clicks", inPrev),
      imprCurr: sumBy(gsc, "impressions", inCurr),
      imprPrev: sumBy(gsc, "impressions", inPrev),
      topQueries,
      series: gscSeries,
    },
    ga4: {
      sessionsCurr: sumBy(ga4, "sessions", inCurr),
      sessionsPrev: sumBy(ga4, "sessions", inPrev),
      series: ga4Series,
    },
    rankings: { latestDate: latestRankDate || null, prevDate: prevRankDate, rows: rankRows },
    aiMentions,
    cwv: { latestDate: latestCwvDate || null, breaches },
    onpage: onpageOut,
    backlinks: {
      snapshot: latestBl ? (latestBl.metric_snapshot as Record<string, unknown>) : null,
      date: latestBl ? String(latestBl.date) : null,
    },
  };
}

/**
 * Compact text context for the agent (analyze + chat). Keeps tokens low: deltas
 * and top items only, not raw series.
 */
export function aggregateToContext(a: SeoAggregate): string {
  const lines: string[] = [];
  const stale = a.syncHealth.filter((s) => s.stale).map((s) => s.source);
  lines.push(`Sync health: ${stale.length ? `STALE/failed: ${stale.join(", ")}` : "all sources fresh"}. Weekly DataForSEO cost: $${a.weeklyCost.toFixed(2)}.`);
  lines.push(`GSC (week vs prev): clicks ${a.gsc.clicksCurr} (prev ${a.gsc.clicksPrev}), impressions ${a.gsc.imprCurr} (prev ${a.gsc.imprPrev}).`);
  lines.push(`GA4 organic sessions: ${a.ga4.sessionsCurr} (prev ${a.ga4.sessionsPrev}).`);
  lines.push("Top GSC queries:");
  for (const q of a.gsc.topQueries.slice(0, 8)) {
    lines.push(`  - "${q.query}": ${q.clicks} clicks (prev ${q.clicksPrev}), avg pos ${q.avgPosition?.toFixed(1) ?? "—"}`);
  }
  lines.push("SERP positions (DataForSEO, current vs prev week):");
  for (const r of a.rankings.rows.slice(0, 12)) {
    lines.push(`  - "${r.keyword}": ${r.position ?? ">20"} (prev ${r.prevPosition ?? "—"}), vol ${r.searchVolume ?? "—"}`);
  }
  lines.push(`AI citations: cited in ${a.aiMentions.citedCurr}/${a.aiMentions.totalCurr} queries (prev ${a.aiMentions.citedPrev}/${a.aiMentions.totalPrev}).`);
  if (a.aiMentions.notCited.length) {
    lines.push(`  Not cited: ${a.aiMentions.notCited.slice(0, 8).map((n) => `${n.keyword} (${n.aiSource})`).join(", ")}`);
  }
  if (a.cwv.breaches.length) {
    lines.push("CWV field breaches (LCP>2.5s / INP>200ms / CLS>0.1):");
    for (const b of a.cwv.breaches.slice(0, 8)) {
      lines.push(`  - ${b.url}: LCP ${b.lcp ?? "—"}ms, INP ${b.inp ?? "—"}ms, CLS ${b.cls ?? "—"}`);
    }
  }
  if (a.onpage.critical.length) {
    lines.push(`On-page critical issues: ${a.onpage.critical.map((c) => `${c.url} (${c.issueType})`).slice(0, 8).join(", ")}`);
  }
  if (a.backlinks.snapshot) {
    const s = a.backlinks.snapshot;
    lines.push(`Backlinks: referring_domains ${s.referring_domains ?? "—"}, backlinks ${s.backlinks ?? "—"}, rank ${s.rank ?? "—"}.`);
  }
  return lines.join("\n");
}
