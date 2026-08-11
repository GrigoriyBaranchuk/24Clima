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

/** «2026-08-05» + (-6) → «2026-07-30». */
function isoShift(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function pctDelta(curr: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

type Row = Record<string, unknown>;

/**
 * PostgREST silently caps an un-ranged select at 1000 rows — seo_gsc_daily
 * alone holds several thousand per 60-day window, and the old un-paginated
 * read aggregated an arbitrary subset. Deterministic order (date + tiebreaker)
 * is mandatory: .range() over an unordered set can skip/repeat rows between
 * pages. `orderKeys` defaults to ["date","id"]; tables without an id column
 * (seo_gsc_totals — date is the PK) pass ["date"].
 */
async function fetchSince(
  supabase: SupabaseClient,
  table: string,
  fromDate: string,
  orderKeys: string[] = ["date", "id"],
): Promise<Row[]> {
  const pageSize = 1000;
  const all: Row[] = [];
  for (let from = 0; ; from += pageSize) {
    let q = supabase.from(table).select("*").gte("date", fromDate);
    for (const key of orderKeys) q = q.order(key, { ascending: true });
    const { data, error } = await q.range(from, from + pageSize - 1);
    if (error) {
      // Not silent: a missing table/column or RLS mistake must not read as
      // "zero traffic" without a trace.
      console.error(`[seo-aggregate] ${table} read failed: ${error.message}`);
      break;
    }
    const rows = (data ?? []) as Row[];
    all.push(...rows);
    if (rows.length < pageSize) break;
  }
  return all;
}

function sumBy(rows: Row[], key: string, pred: (r: Row) => boolean): number {
  return rows.reduce((s, r) => (pred(r) ? s + (Number(r[key]) || 0) : s), 0);
}

export type SeoAggregate = {
  /** Start dates of the compare windows + the anchor (last date with GSC data).
      Windows are anchored to the anchor, not to today: GSC final data lags
      2-3 days, and a today-anchored "current week" held only ~5 days of data. */
  windows: { curr7: string; prev7: string; series: string; anchor: string };
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
    topQueries: {
      query: string;
      clicks: number;
      clicksPrev: number;
      avgPosition: number | null;
    }[];
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
  cwv: {
    latestDate: string | null;
    breaches: {
      url: string;
      lcp: number | null;
      inp: number | null;
      cls: number | null;
    }[];
  };
  psi: {
    scores: {
      url: string;
      strategy: string;
      perf: number | null;
      a11y: number | null;
      bestPractices: number | null;
      seo: number | null;
    }[];
    audits: {
      url: string;
      strategy: string;
      category: string;
      title: string;
      displayValue: string | null;
      score: number;
    }[];
  };
  onpage: {
    latestDate: string | null;
    total: number;
    critical: { url: string; issueType: string }[];
  };
  backlinks: { snapshot: Record<string, unknown> | null; date: string | null };
};

export async function buildSeoAggregate(
  supabase: SupabaseClient,
): Promise<SeoAggregate> {
  const d7 = isoDaysAgo(7);
  const d14 = isoDaysAgo(14);
  const d60 = isoDaysAgo(60);

  // Site-wide GSC totals (date-only rows, match the GSC UI) anchor the compare
  // windows: current = anchor-6..anchor, previous = anchor-13..anchor-7. When
  // the table is empty (migration not yet applied) fall back to today-2 — the
  // typical freshness of GSC final data.
  const totals = await fetchSince(supabase, "seo_gsc_totals", d60, ["date"]);
  const anchor =
    totals.reduce((m, r) => (String(r.date) > m ? String(r.date) : m), "") ||
    isoDaysAgo(2);
  const currStart = isoShift(anchor, -6);
  const prevStart = isoShift(anchor, -13);
  const inCurr = (r: Row) =>
    String(r.date) >= currStart && String(r.date) <= anchor;
  const inPrev = (r: Row) =>
    String(r.date) >= prevStart && String(r.date) < currStart;

  // --- Sync health ---
  const { data: runs } = await supabase
    .from("seo_sync_runs")
    .select("*")
    .gte("run_at", new Date(Date.now() - 8 * 864e5).toISOString())
    .order("run_at", { ascending: false });
  const runRows = (runs ?? []) as Row[];
  // AI Overview visibility is now ingested by the rankings sync (one SERP call),
  // so there is no standalone dfs_ai run — dfs_rankings health covers it.
  const sources = [
    "gsc_totals",
    "gsc",
    "ga4",
    "psi",
    "dfs_rankings",
    "dfs_onpage",
    "dfs_backlinks",
  ];
  const weeklyCost = runRows.reduce((s, r) => s + (Number(r.cost) || 0), 0);
  const syncHealth = sources.map((src) => {
    const last = runRows.find((r) => r.source === src);
    if (!last)
      return {
        source: src,
        status: null,
        ageDays: null,
        lastRunAt: null,
        error: null,
        stale: true,
      };
    const ageDays = Math.floor(
      (Date.now() - new Date(String(last.run_at)).getTime()) / 864e5,
    );
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
  // KPI sums and the series come from seo_gsc_totals. seo_gsc_daily
  // (date+query+page) only feeds topQueries: Google drops anonymized queries
  // from query-grouped responses, so its sums undercount the site ~6x — never
  // total that table.
  const totalsByDate = new Map<string, Row>();
  for (const r of totals) totalsByDate.set(String(r.date), r);
  const seriesStart = isoShift(anchor, -59);
  const gscSeries: { date: string; clicks: number; impressions: number }[] = [];
  for (let i = 59; i >= 0; i--) {
    const date = isoShift(anchor, -i);
    const t = totalsByDate.get(date);
    // GSC omits zero-activity days; fill them so the X axis is a true calendar.
    gscSeries.push({
      date,
      clicks: Number(t?.clicks) || 0,
      impressions: Number(t?.impressions) || 0,
    });
  }

  const gsc = await fetchSince(supabase, "seo_gsc_daily", prevStart);
  const byQuery = new Map<
    string,
    { c: number; cPrev: number; posImprSum: number; imprSum: number }
  >();
  for (const r of gsc) {
    const q = String(r.query);
    if (!q) continue;
    const e = byQuery.get(q) ?? { c: 0, cPrev: 0, posImprSum: 0, imprSum: 0 };
    if (inCurr(r)) {
      e.c += Number(r.clicks) || 0;
      const impr = Number(r.impressions) || 0;
      e.posImprSum += (Number(r.position) || 0) * impr;
      e.imprSum += impr;
    }
    if (inPrev(r)) e.cPrev += Number(r.clicks) || 0;
    byQuery.set(q, e);
  }
  const topQueries = [...byQuery.entries()]
    .sort((a, b) => b[1].c - a[1].c)
    .slice(0, 10)
    .map(([query, e]) => ({
      query,
      clicks: e.c,
      clicksPrev: e.cPrev,
      // Impression-weighted, like the GSC UI — an unweighted row mean skews
      // toward low-volume days.
      avgPosition: e.imprSum ? e.posImprSum / e.imprSum : null,
    }));

  // --- GA4 ---
  const ga4 = await fetchSince(supabase, "seo_ga4_daily", d60);
  const ga4Series = ga4
    .map((r) => ({ date: String(r.date), sessions: Number(r.sessions) || 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // --- Rankings ---
  const ranks = await fetchSince(supabase, "seo_rankings", d14);
  const latestRankDate = ranks.reduce(
    (m, r) => (String(r.date) > m ? String(r.date) : m),
    "",
  );
  const prevRankDate =
    ranks
      .map((r) => String(r.date))
      .filter((dt) => dt < latestRankDate)
      .sort()
      .pop() ?? null;
  const rankRows = ranks
    .filter((r) => String(r.date) === latestRankDate)
    .map((r) => {
      const prev = ranks.find(
        (p) => p.keyword === r.keyword && String(p.date) === prevRankDate,
      );
      return {
        keyword: String(r.keyword),
        position: r.our_position == null ? null : Number(r.our_position),
        prevPosition:
          prev?.our_position == null ? null : Number(prev.our_position),
        searchVolume: r.search_volume == null ? null : Number(r.search_volume),
        competitors: (r.top_competitors as unknown[]) ?? [],
      };
    });

  // --- AI mentions ---
  // prevStart, not d14: the anchor sits 2-3 days behind today, so a
  // today-relative 14-day fetch would clip the tail of the previous window.
  const ai = await fetchSince(supabase, "seo_ai_mentions", prevStart);
  const aiCurr = ai.filter(inCurr);
  const aiPrev = ai.filter(inPrev);
  const aiMentions = {
    citedCurr: aiCurr.filter((r) => r.cited).length,
    totalCurr: aiCurr.length,
    citedPrev: aiPrev.filter((r) => r.cited).length,
    totalPrev: aiPrev.length,
    notCited: aiCurr
      .filter((r) => !r.cited)
      .map((r) => ({
        keyword: String(r.keyword),
        aiSource: String(r.ai_source),
      })),
  };

  // --- CWV (field rows only) ---
  const cwv = await fetchSince(supabase, "seo_cwv_snapshots", d14);
  const latestCwvDate = cwv.reduce(
    (m, r) => (String(r.date) > m ? String(r.date) : m),
    "",
  );
  const breaches = cwv
    .filter((r) => String(r.date) === latestCwvDate && r.source === "field")
    .map((r) => ({
      url: String(r.url),
      lcp: r.lcp_ms == null ? null : Number(r.lcp_ms),
      inp: r.inp_ms == null ? null : Number(r.inp_ms),
      cls: r.cls == null ? null : Number(r.cls),
    }))
    .filter(
      (r) => (r.lcp ?? 0) > 2500 || (r.inp ?? 0) > 200 || (r.cls ?? 0) > 0.1,
    );

  // --- PSI lab scores + failed audits ---
  // Deliberately separate from `breaches` above: those are field (CrUX) numbers
  // and the playbook forbids comparing the two. In practice CrUX has no data for
  // this site, so without these lab rows the agent sees no page-speed signal at
  // all.
  const psiScores = cwv
    .filter((r) => String(r.date) === latestCwvDate && r.source === "lab")
    .map((r) => ({
      url: String(r.url),
      strategy: String(r.strategy),
      perf: r.perf_score == null ? null : Number(r.perf_score),
      a11y: r.a11y_score == null ? null : Number(r.a11y_score),
      bestPractices:
        r.best_practices_score == null ? null : Number(r.best_practices_score),
      seo: r.seo_score == null ? null : Number(r.seo_score),
    }));
  const psiAuditRows = await fetchSince(supabase, "seo_psi_audits", d7);
  const latestAuditDate = psiAuditRows.reduce(
    (m, r) => (String(r.date) > m ? String(r.date) : m),
    "",
  );
  const psiAudits = psiAuditRows
    .filter((r) => String(r.date) === latestAuditDate)
    .map((r) => ({
      url: String(r.url),
      strategy: String(r.strategy),
      category: String(r.category),
      title: String(r.title),
      displayValue: r.display_value == null ? null : String(r.display_value),
      score: r.score == null ? 1 : Number(r.score),
    }))
    .sort((a, b) => a.score - b.score);

  // --- On-page ---
  const onpage = await fetchSince(supabase, "seo_onpage_issues", d7);
  const latestOpDate = onpage.reduce(
    (m, r) => (String(r.date) > m ? String(r.date) : m),
    "",
  );
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
  const latestBl = bl.sort((a, b) =>
    String(b.date).localeCompare(String(a.date)),
  )[0];

  return {
    windows: {
      curr7: currStart,
      prev7: prevStart,
      series: seriesStart,
      anchor,
    },
    syncHealth,
    weeklyCost,
    gsc: {
      clicksCurr: sumBy(totals, "clicks", inCurr),
      clicksPrev: sumBy(totals, "clicks", inPrev),
      imprCurr: sumBy(totals, "impressions", inCurr),
      imprPrev: sumBy(totals, "impressions", inPrev),
      topQueries,
      series: gscSeries,
    },
    ga4: {
      sessionsCurr: sumBy(ga4, "sessions", inCurr),
      sessionsPrev: sumBy(ga4, "sessions", inPrev),
      series: ga4Series,
    },
    rankings: {
      latestDate: latestRankDate || null,
      prevDate: prevRankDate,
      rows: rankRows,
    },
    aiMentions,
    cwv: { latestDate: latestCwvDate || null, breaches },
    psi: { scores: psiScores, audits: psiAudits },
    onpage: onpageOut,
    backlinks: {
      snapshot: latestBl
        ? (latestBl.metric_snapshot as Record<string, unknown>)
        : null,
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
  lines.push(
    `Sync health: ${stale.length ? `STALE/failed: ${stale.join(", ")}` : "all sources fresh"}. Weekly DataForSEO cost: $${a.weeklyCost.toFixed(2)}.`,
  );
  lines.push(
    `GSC site-wide totals, week ending ${a.windows.anchor} vs prev week: clicks ${a.gsc.clicksCurr} (prev ${a.gsc.clicksPrev}), impressions ${a.gsc.imprCurr} (prev ${a.gsc.imprPrev}).`,
  );
  lines.push(
    `GA4 organic sessions: ${a.ga4.sessionsCurr} (prev ${a.ga4.sessionsPrev}).`,
  );
  lines.push(
    "Top GSC queries (visible queries only — Google hides anonymized ones, so these do NOT sum to the totals above):",
  );
  for (const q of a.gsc.topQueries.slice(0, 8)) {
    lines.push(
      `  - "${q.query}": ${q.clicks} clicks (prev ${q.clicksPrev}), avg pos ${q.avgPosition?.toFixed(1) ?? "—"}`,
    );
  }
  lines.push("SERP positions (DataForSEO, current vs prev week):");
  for (const r of a.rankings.rows.slice(0, 12)) {
    lines.push(
      `  - "${r.keyword}": ${r.position ?? ">20"} (prev ${r.prevPosition ?? "—"}), vol ${r.searchVolume ?? "—"}`,
    );
  }
  lines.push(
    `AI citations: cited in ${a.aiMentions.citedCurr}/${a.aiMentions.totalCurr} queries (prev ${a.aiMentions.citedPrev}/${a.aiMentions.totalPrev}).`,
  );
  if (a.aiMentions.notCited.length) {
    lines.push(
      `  Not cited: ${a.aiMentions.notCited
        .slice(0, 8)
        .map((n) => `${n.keyword} (${n.aiSource})`)
        .join(", ")}`,
    );
  }
  if (a.psi.scores.length) {
    lines.push(
      "PageSpeed Insights (Lighthouse LAB, no son datos de campo — no compares con CrUX):",
    );
    for (const s of a.psi.scores.slice(0, 12)) {
      lines.push(
        `  - ${s.url} [${s.strategy}]: perf ${s.perf ?? "—"}, accesibilidad ${s.a11y ?? "—"}, buenas prácticas ${s.bestPractices ?? "—"}, SEO ${s.seo ?? "—"}`,
      );
    }
  }
  if (a.psi.audits.length) {
    lines.push("Auditorías PSI que fallan (peores primero):");
    for (const au of a.psi.audits.slice(0, 12)) {
      lines.push(
        `  - [${au.strategy}/${au.category}] ${au.title}${au.displayValue ? ` (${au.displayValue})` : ""} — ${au.url}`,
      );
    }
  }
  if (a.cwv.breaches.length) {
    lines.push("CWV field breaches (LCP>2.5s / INP>200ms / CLS>0.1):");
    for (const b of a.cwv.breaches.slice(0, 8)) {
      lines.push(
        `  - ${b.url}: LCP ${b.lcp ?? "—"}ms, INP ${b.inp ?? "—"}ms, CLS ${b.cls ?? "—"}`,
      );
    }
  }
  if (a.onpage.critical.length) {
    lines.push(
      `On-page critical issues: ${a.onpage.critical
        .map((c) => `${c.url} (${c.issueType})`)
        .slice(0, 8)
        .join(", ")}`,
    );
  }
  if (a.backlinks.snapshot) {
    const s = a.backlinks.snapshot;
    lines.push(
      `Backlinks: referring_domains ${s.referring_domains ?? "—"}, backlinks ${s.backlinks ?? "—"}, rank ${s.rank ?? "—"}.`,
    );
  }
  return lines.join("\n");
}
