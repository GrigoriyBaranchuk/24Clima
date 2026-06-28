# SEO monitoring playbook (weekly agent procedure)

This is the procedure the **analysis agent** runs (on-demand, or as a scheduled
cloud routine). It is the *judgement* layer of a hybrid system:

- **Data + the weekly digest are deterministic** — produced by `/api/sync-seo`
  (Google), `/api/sync-dataforseo` (DataForSEO), and `scripts/seo-digest.ts`
  (the `seo-digest` GitHub issue). The agent does **not** ingest data or own the
  digest, and no longer runs flaky web-search probes — AI visibility now comes
  from `seo_ai_mentions`.
- **The agent interprets** those deterministic signals and, where safe, proposes
  gated auto-fix PRs.

The cron/routine prompt should be one line:
> Read `.agents/skills/24clima-seo-guide/references/monitoring-playbook.md` and execute it.

## Inputs (Supabase, service role — read only)

Read the last ~8 weeks from:
`seo_sync_runs`, `seo_gsc_daily`, `seo_ga4_daily`, `seo_cwv_snapshots`,
`seo_ai_mentions`, `seo_rankings`, `seo_onpage_issues`, `seo_backlinks`.

**Always read `seo_sync_runs` first.** If a source's latest run is `error` or
older than 3 days, treat its data as STALE — flag it, do not interpret a missing
or zero value as a real regression.

## Step 1 — Interpret + prioritize (do not just restate the digest)

Using the rules in this skill (read the relevant reference before acting):

- **Falling positions / lost AI citations** — cross-reference `seo_rankings`
  (absolute SERP position vs competitors) and `seo_ai_mentions` (AI Overview /
  ChatGPT). For each meaningful drop, hypothesize a cause and the fix. Local-SEO
  rules: `local-seo.md`. AEO/AI rules: `ai-seo-aeo.md`.
- **High-impression / low-CTR pages** (`seo_gsc_daily`) — usually a title/meta
  opportunity. Check against `pre-merge-checklist.md`.
- **CWV breaches** (`seo_cwv_snapshots`, `source = 'field'` only) — LCP > 2.5s,
  INP > 200ms, CLS > 0.1. Compare like-for-like `source`; never compare a lab
  value to a field value. Animation/CWV rules: `animations-and-cwv.md`.
- **On-page issues** (`seo_onpage_issues`) — the crawl flags the *symptom*; you
  locate the *cause* in the repo. Validate JSON-LD against `json-ld-catalog.md`,
  hreflang/canonical against `i18n-hreflang.md`, sitemap/robots against
  `sitemap-and-robots.md`.

Rank findings by impact × confidence. Most findings are recommendations, not
code changes — those go to the digest (Step 3), not into PRs.

## Step 2 — Gated auto-fix PRs (narrow allowlist only)

Only open a PR for a fix that is mechanical, low-risk, and within this allowlist:

- missing `alt` text on an image
- an hreflang / canonical typo
- removing a deprecated `HowTo` schema block
- tightening a too-long/duplicate meta description or title
- fixing a broken internal link flagged by On-Page

Hard guards (all required): file allowlist (no config/build files), small diff,
**no dependency changes**, `bun run lint` passes.

**Every** proposed diff MUST be reviewed by the `seo-reviewer` subagent
(`.claude/agents/seo-reviewer.md`) BEFORE a PR is opened:

- `approve` → branch off `main`, `gh pr create`, label `seo`. Never push to
  `main`, never auto-merge. A human reviews and merges.
- `flag` / `reject` → do NOT open a PR. Record it as a recommendation in Step 3.

Anything touching the protected categories in `protected-elements.md` (JSON-LD
graph, hreflang, canonical, robots, sitemap, headers/CSP, analytics, geo meta,
AI summary block) is **never** an auto-PR — it becomes a recommendation.

## Step 3 — Append recommendations to the digest (no issue spam)

Append a single prioritized checklist to the existing open `seo-digest` issue
(the one `scripts/seo-digest.ts` maintains). One comment per weekly run. Include:

- content gaps and new keyword opportunities from `seo_rankings`
  (keywords with volume where we rank > 10 or are absent)
- AI-citation losses from `seo_ai_mentions` and the likely AEO fix
- any `flag`/`reject` fixes from Step 2 (so a human can decide)
- links to the PRs opened in Step 2

Do not open separate issues for each item — keep everything under the one digest
issue so the owner has a single place to look.

## Credentials the routine needs (verify before relying on a headless run)

- Supabase service-role key (read the tables).
- `gh` authenticated with a PAT (repo + issues + PR) for Step 2/3.
- WebSearch is optional now (AI data is deterministic) — only for ad-hoc checks.
- Email (Gmail MCP) is **best-effort only**; the `seo-digest` issue is the
  authoritative output. Interactively-authenticated MCP servers may be absent in
  a headless cloud run — never depend on email delivery.

## Guardrails

- Read before writing: never change a protected element without the matching
  rule in this skill.
- One PR per fix; small; reviewed by `seo-reviewer`; merged by a human.
- Treat AI-mention rate as directional (2-7 day index lag) — don't act on a
  single week's dip.
