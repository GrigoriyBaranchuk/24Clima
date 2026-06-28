/**
 * Deterministic weekly SEO digest. No LLM.
 *
 * Reads the seo_* tables (via the shared aggregator in src/lib/seo-aggregate.ts),
 * renders a markdown report, and opens/updates ONE GitHub issue labelled
 * `seo-digest`. Idempotent: one living issue edited each week.
 *
 * Run (e.g. from a GitHub Action with bun):
 *   bun run scripts/seo-digest.ts
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo)  — to manage the issue
 */

import { createClient } from "@supabase/supabase-js";
import { buildSeoAggregate, pctDelta, type SeoAggregate } from "../src/lib/seo-aggregate";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const DIGEST_LABEL = "seo-digest";

function pct(curr: number, prev: number): string {
  const d = pctDelta(curr, prev);
  if (d == null) return curr === 0 ? "0%" : "new";
  return `${d >= 0 ? "+" : ""}${d.toFixed(0)}%`;
}

function arrow(curr: number, prev: number, higherIsBetter = true): string {
  if (curr === prev) return "→";
  const good = higherIsBetter ? curr > prev : curr < prev;
  return good ? "🟢" : "🔴";
}

function renderBody(a: SeoAggregate): string {
  const today = new Date().toISOString().slice(0, 10);
  const out: string[] = [];
  out.push(`# 📊 SEO digest — semana del ${today}`);
  out.push("_Generado por `scripts/seo-digest.ts`. Datos: GSC + GA4 + PSI + DataForSEO._");
  out.push("");

  // Health
  const staleNotes = a.syncHealth
    .filter((s) => s.stale)
    .map((s) =>
      s.status === null
        ? `- ⚠️ \`${s.source}\`: sin ejecuciones en 8 días`
        : s.status === "error"
          ? `- 🔴 \`${s.source}\`: última ejecución con ERROR — ${(s.error ?? "").slice(0, 120)}`
          : `- ⚠️ \`${s.source}\`: datos viejos (${s.ageDays}d)`
    );
  out.push("## 🩺 Salud del pipeline");
  out.push(staleNotes.length ? staleNotes.join("\n") : "- ✅ Todas las fuentes al día");
  out.push(`- 💵 Gasto DataForSEO (últimos 8d): **$${a.weeklyCost.toFixed(2)}**`);
  out.push("");

  // GSC
  out.push("## 🔎 Google Search Console (datos propios)");
  out.push(`- Clics: **${a.gsc.clicksCurr}** ${arrow(a.gsc.clicksCurr, a.gsc.clicksPrev)} (${pct(a.gsc.clicksCurr, a.gsc.clicksPrev)} vs semana previa)`);
  out.push(`- Impresiones: **${a.gsc.imprCurr}** ${arrow(a.gsc.imprCurr, a.gsc.imprPrev)} (${pct(a.gsc.imprCurr, a.gsc.imprPrev)})`);
  if (a.gsc.topQueries.length) {
    out.push("");
    out.push("| Query | Clics | Δ | Posición media |");
    out.push("|---|---|---|---|");
    for (const q of a.gsc.topQueries.slice(0, 8)) {
      out.push(`| ${q.query} | ${q.clicks} | ${pct(q.clicks, q.clicksPrev)} | ${q.avgPosition?.toFixed(1) ?? "—"} |`);
    }
  }
  out.push("");

  // GA4
  out.push("## 📈 GA4 — tráfico orgánico");
  out.push(`- Sesiones orgánicas: **${a.ga4.sessionsCurr}** ${arrow(a.ga4.sessionsCurr, a.ga4.sessionsPrev)} (${pct(a.ga4.sessionsCurr, a.ga4.sessionsPrev)})`);
  out.push("");

  // Rankings
  out.push("## 🏆 Posiciones SERP (DataForSEO)");
  if (a.rankings.latestDate) {
    out.push("");
    out.push("| Keyword | Pos. actual | Pos. previa | Vol. |");
    out.push("|---|---|---|---|");
    for (const r of a.rankings.rows.slice(0, 12)) {
      out.push(`| ${r.keyword} | ${r.position ?? ">20"} | ${r.prevPosition ?? "—"} | ${r.searchVolume ?? "—"} |`);
    }
  } else {
    out.push("- _Sin datos de posiciones todavía._");
  }
  out.push("");

  // AI
  out.push("## 🤖 Visibilidad en IA (AI Overview + ChatGPT)");
  if (a.aiMentions.totalCurr) {
    out.push(`- Citado en **${a.aiMentions.citedCurr}/${a.aiMentions.totalCurr}** consultas ${arrow(a.aiMentions.citedCurr, a.aiMentions.citedPrev)} (previa: ${a.aiMentions.citedPrev}/${a.aiMentions.totalPrev})`);
    if (a.aiMentions.notCited.length) {
      out.push(`- ❌ Sin cita: ${a.aiMentions.notCited.slice(0, 8).map((n) => `${n.keyword} (${n.aiSource})`).join(", ")}`);
    }
  } else {
    out.push("- _Sin datos de menciones IA todavía (lag de 2-7 días)._");
  }
  out.push("");

  // CWV
  out.push("## ⚡ Core Web Vitals (campo / CrUX)");
  out.push(
    a.cwv.breaches.length
      ? a.cwv.breaches
          .map((b) => {
            const bad: string[] = [];
            if ((b.lcp ?? 0) > 2500) bad.push(`LCP ${Math.round(b.lcp ?? 0)}ms`);
            if ((b.inp ?? 0) > 200) bad.push(`INP ${Math.round(b.inp ?? 0)}ms`);
            if ((b.cls ?? 0) > 0.1) bad.push(`CLS ${(b.cls ?? 0).toFixed(2)}`);
            return `- 🔴 ${b.url} — ${bad.join(", ")}`;
          })
          .join("\n")
      : "- ✅ Sin breaches de CWV en datos de campo"
  );
  out.push("");

  // On-page
  out.push("## 🧱 Auditoría on-page (DataForSEO)");
  if (a.onpage.total) {
    out.push(`- ${a.onpage.total} incidencias (${a.onpage.critical.length} críticas) en el último crawl`);
    for (const c of a.onpage.critical.slice(0, 8)) out.push(`  - 🔴 ${c.url}: ${c.issueType}`);
  } else {
    out.push("- ✅ Sin incidencias on-page registradas");
  }
  out.push("");

  // Backlinks
  out.push("## 🔗 Backlinks (DataForSEO)");
  if (a.backlinks.snapshot) {
    const s = a.backlinks.snapshot;
    out.push(`- Dominios de referencia: **${s.referring_domains ?? "—"}**, backlinks: **${s.backlinks ?? "—"}**, rank: ${s.rank ?? "—"}`);
  } else {
    out.push("- _Sin datos de backlinks todavía._");
  }
  out.push("");

  out.push("---");
  out.push(`<sub>Actualizado: ${new Date().toISOString()} · El agente de SEO añade recomendaciones priorizadas debajo.</sub>`);
  return out.join("\n");
}

async function gh(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

async function upsertIssue(title: string, body: string): Promise<void> {
  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
    console.log("[digest] No GITHUB_TOKEN/REPOSITORY — printing body instead:\n");
    console.log(body);
    return;
  }
  const repo = GITHUB_REPOSITORY;
  const findRes = await gh(`/repos/${repo}/issues?state=open&labels=${DIGEST_LABEL}&per_page=1`);
  const existing = (await findRes.json().catch(() => [])) as { number: number }[];
  if (Array.isArray(existing) && existing.length > 0) {
    const num = existing[0].number;
    await gh(`/repos/${repo}/issues/${num}`, { method: "PATCH", body: JSON.stringify({ title, body }) });
    console.log(`[digest] Updated issue #${num}`);
  } else {
    const createRes = await gh(`/repos/${repo}/issues`, {
      method: "POST",
      body: JSON.stringify({ title, body, labels: [DIGEST_LABEL] }),
    });
    const created = (await createRes.json().catch(() => ({}))) as { number?: number };
    console.log(`[digest] Created issue #${created.number ?? "?"}`);
  }
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const aggregate = await buildSeoAggregate(supabase);
  await upsertIssue("📊 SEO digest — 24clima.com", renderBody(aggregate));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
