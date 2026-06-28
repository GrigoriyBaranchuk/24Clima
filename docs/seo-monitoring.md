# SEO/GEO/AI-search monitoring

Continuous monitoring pipeline: ingest SEO signals into Supabase, then a weekly
deterministic digest + an analysis agent that proposes gated fixes.

- **Plan / rationale:** see the approved plan (hybrid architecture, Codex review).
- **Data tables:** `supabase/migrations/004_seo_monitoring.sql` (9 tables).

## Architecture

| Layer | What | Where | Cadence |
|---|---|---|---|
| Ingest (Google, free) | GSC + GA4 + PageSpeed → Supabase | `src/app/api/sync-seo/route.ts` | daily (Vercel cron) |
| Ingest (DataForSEO, paid) | AI mentions + rankings + on-page + backlinks → Supabase | `src/app/api/sync-dataforseo/route.ts` | weekly (GitHub Action triggers it) |
| Digest (deterministic) | WoW deltas → single `seo-digest` GitHub issue | `scripts/seo-digest.ts` | weekly (GitHub Action) |
| Agent (judgement) | interpret + gated auto-fix PRs | `.agents/skills/24clima-seo-guide/references/monitoring-playbook.md` | on-demand, later scheduled |

What to track is centralized in `src/lib/seo-tracking.ts` (keywords + URLs). Keep
the keyword list small — DataForSEO bills per request.

## Environment variables

These live in `.env.local` / Vercel env (NOT in git — `.env*` is gitignored).

```
# Google sources (cron /api/sync-seo)
GOOGLE_SA_KEY_BASE64=     # service-account JSON, base64-encoded (see below)
GSC_SITE_URL=sc-domain:24clima.com
GA4_PROPERTY_ID=          # numeric property id (NOT the G-XXXX measurement id)
PAGESPEED_API_KEY=        # PageSpeed Insights API key

# DataForSEO (cron /api/sync-dataforseo) — Basic auth
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=
DATAFORSEO_LOCATION_CODE=2591   # Panama
DATAFORSEO_LANGUAGE_CODE=es

# Admin SEO dashboard agent (chat + analyze at /consejos-y-guias/admin/seo)
ANTHROPIC_API_KEY=

# already present, reused:
CRON_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
```

## Admin dashboard (`/consejos-y-guias/admin/seo`)

Admin-gated UI (login = same Supabase auth as the articles admin; `ADMIN_EMAILS`).
The interactive agent runs in the website backend via the Anthropic API. Routes
under `src/app/api/admin/seo/*` (all `requireAdmin`-gated):

- `GET metrics` — dashboard aggregates from the `seo_*` tables.
- `POST sync` — proxies `/api/sync-seo` or `/api/sync-dataforseo` (uses `CRON_SECRET`).
- `POST analyze` — Claude reads the aggregates and writes prioritized rows to `seo_recommendations`.
- `GET/PATCH recommendations` — list + accept/reject/done.
- `POST chat` — streaming Q&A grounded in the aggregates.

Needs `ANTHROPIC_API_KEY`. Model is a single constant in `src/lib/seo-agent.ts`
(`claude-opus-4-8`; switch to `claude-sonnet-4-6` to cut cost). Apply
`supabase/migrations/005_seo_recommendations.sql`. The page is internal — not in
`sitemap.ts`, under the noindex admin area.

## One-time setup (human)

### 1. Google Cloud
1. Enable APIs: **Search Console API**, **Google Analytics Data API**, **PageSpeed Insights API**.
2. Create a **service account** + JSON key.
3. Search Console → property `24clima.com` → Settings → Users and permissions → add the SA `client_email` (read is enough).
4. GA4 → Admin → Property Access Management → add the SA `client_email` as **Viewer**. Copy the **numeric** Property ID (Admin → Property Settings).
5. Create a **PageSpeed Insights API key** (restrict it to that API).
6. Base64-encode the key into `GOOGLE_SA_KEY_BASE64`:
   ```bash
   base64 -i service-account.json | tr -d '\n'
   ```

Verify with the built-in preflight (reports *which* API/permission failed):
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://24clima.com/api/sync-seo?preflight=1"
```

### 2. DataForSEO
Set `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`. Confirm `location_code` (2591 = Panama)
and `language_code` (`es`). Start with the small keyword set in `seo-tracking.ts`.

### 3. Supabase
Apply `supabase/migrations/004_seo_monitoring.sql` via the Supabase SQL editor or
the Supabase MCP. Confirm 9 `seo_*` tables exist.

### 4. Scheduling
- **Vercel crons** (`vercel.json`): `/api/sync-reviews` (06:00) + `/api/sync-seo` (07:00). Hobby allows 2 daily crons — that's the ceiling.
- **GitHub Actions** (weekly, dodges the Vercel cron limit):
  - `.github/workflows/seo-dataforseo.yml` — Mondays 06:00 UTC, curls `/api/sync-dataforseo`.
  - `.github/workflows/seo-digest.yml` — Mondays 09:00 UTC, runs the digest.
- **Repo secrets needed:** `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
  (`GITHUB_TOKEN` is automatic.) Optional repo var `SITE_URL` (defaults to `https://24clima.com`).

### 5. Agent (later)
Once ≥1–2 weeks of data have accumulated and the digest is proven, run the
playbook on-demand, then promote it to a scheduled cloud routine. Needs a `gh`
PAT (repo + issues + PR) and the Supabase service-role key as routine secrets.

## Verification

```bash
# Google ingest (rows land + a seo_sync_runs row per source)
curl -H "Authorization: Bearer $CRON_SECRET" https://24clima.com/api/sync-seo
# DataForSEO ingest (rows in 4 tables + cost tracked)
curl -H "Authorization: Bearer $CRON_SECRET" https://24clima.com/api/sync-dataforseo
# Digest (opens/updates the seo-digest issue)
bun run scripts/seo-digest.ts
```

## Notes & gotchas

- **GSC lag:** queried on a rolling ~10-day window with `dataState:"final"`; never alert on a single missing day.
- **CWV field vs lab:** stored as separate `source` rows — never compare across sources.
- **GSC position ≠ DataForSEO position:** first-party (where we appear) vs absolute SERP. The digest labels them separately; never average them.
- **AI-mention lag:** DataForSEO LLM Mentions has a 2–7 day index lag — treat citation rate as directional.
- **Cost:** DataForSEO is pay-per-request; `seo_sync_runs.cost` tracks per-run spend, surfaced in the digest. Bound the keyword list.
