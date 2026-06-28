-- SEO/GEO/AI-search monitoring time-series.
-- Written by cron endpoints /api/sync-seo (Google) and /api/sync-dataforseo (DataForSEO);
-- read by the weekly digest (scripts/seo-digest.ts) and the analysis agent.
-- All these tables are INTERNAL analytics: RLS is enabled with NO select policy,
-- so only the service role (cron + digest) can read/write. Never exposed to the site.
--
-- Apply via the Supabase SQL editor or the Supabase MCP apply_migration.

-- ---------------------------------------------------------------------------
-- Run tracking: distinguishes "zero results" from "API failed" / "never ran".
-- The digest/agent reads this FIRST and skips/flags stale or failed sources.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_sync_runs (
  id bigint generated always as identity primary key,
  run_at timestamptz not null default now(),
  source text not null,                 -- gsc | ga4 | psi | dfs_rankings | dfs_ai | dfs_onpage | dfs_backlinks
  status text not null,                 -- ok | partial | error
  rows_written int not null default 0,
  window_start date,
  window_end date,
  cost numeric not null default 0,      -- DataForSEO spend for this run (USD); 0 for free Google sources
  error text
);
create index if not exists idx_seo_sync_runs_run_at on public.seo_sync_runs (run_at desc);
create index if not exists idx_seo_sync_runs_source on public.seo_sync_runs (source, run_at desc);
alter table public.seo_sync_runs enable row level security;

-- ---------------------------------------------------------------------------
-- Google Search Console: daily query x page performance (first-party data).
-- ---------------------------------------------------------------------------
create table if not exists public.seo_gsc_daily (
  id bigint generated always as identity primary key,
  date date not null,
  page text not null default '',
  query text not null default '',
  clicks int not null default 0,
  impressions int not null default 0,
  ctr double precision not null default 0,
  position double precision not null default 0,
  created_at timestamptz default now(),
  unique (date, page, query)
);
create index if not exists idx_seo_gsc_daily_date on public.seo_gsc_daily (date desc);
create index if not exists idx_seo_gsc_daily_query on public.seo_gsc_daily (query);
alter table public.seo_gsc_daily enable row level security;

-- ---------------------------------------------------------------------------
-- Google Analytics 4: daily organic metrics (one row per date x channel).
-- ---------------------------------------------------------------------------
create table if not exists public.seo_ga4_daily (
  id bigint generated always as identity primary key,
  date date not null,
  channel text not null default 'Organic Search',
  sessions int not null default 0,
  total_users int not null default 0,
  engaged_sessions int not null default 0,
  engagement_rate double precision not null default 0,
  avg_session_duration double precision not null default 0,
  created_at timestamptz default now(),
  unique (date, channel)
);
create index if not exists idx_seo_ga4_daily_date on public.seo_ga4_daily (date desc);
alter table public.seo_ga4_daily enable row level security;

-- ---------------------------------------------------------------------------
-- Core Web Vitals: field (CrUX) and lab (Lighthouse) kept as DISTINCT source
-- rows. Never overwrite one with the other or compare across sources.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_cwv_snapshots (
  id bigint generated always as identity primary key,
  date date not null,
  url text not null,
  strategy text not null default 'mobile',  -- mobile | desktop
  source text not null default 'lab',       -- field (CrUX) | lab (Lighthouse)
  lcp_ms double precision,
  inp_ms double precision,
  cls double precision,
  perf_score double precision,              -- 0..100 lab score (null for field rows)
  created_at timestamptz default now(),
  unique (date, url, strategy, source)
);
create index if not exists idx_seo_cwv_date on public.seo_cwv_snapshots (date desc);
alter table public.seo_cwv_snapshots enable row level security;

-- ---------------------------------------------------------------------------
-- DataForSEO: AI-search citations (Google AI Overview + ChatGPT). Reproducible
-- replacement for ad-hoc web-search probes.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_ai_mentions (
  id bigint generated always as identity primary key,
  date date not null,
  keyword text not null,
  ai_source text not null,                 -- ai_overview | chatgpt
  cited boolean not null default false,    -- did 24clima.com appear?
  position int,                            -- rank of our mention if cited
  competitors jsonb not null default '[]'::jsonb,
  source_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  unique (date, keyword, ai_source)
);
create index if not exists idx_seo_ai_mentions_date on public.seo_ai_mentions (date desc);
alter table public.seo_ai_mentions enable row level security;

-- ---------------------------------------------------------------------------
-- DataForSEO: absolute SERP positions + competitors + search volume.
-- Distinct from GSC position (first-party) — never average the two together.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_rankings (
  id bigint generated always as identity primary key,
  date date not null,
  keyword text not null,
  location_code int not null,
  our_position int,                        -- null if not in tracked SERP depth
  our_url text,
  search_volume int,
  top_competitors jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  unique (date, keyword, location_code)
);
create index if not exists idx_seo_rankings_date on public.seo_rankings (date desc);
create index if not exists idx_seo_rankings_keyword on public.seo_rankings (keyword);
alter table public.seo_rankings enable row level security;

-- ---------------------------------------------------------------------------
-- DataForSEO On-Page (instant_pages): crawl-detected technical issues.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_onpage_issues (
  id bigint generated always as identity primary key,
  date date not null,
  url text not null,
  issue_type text not null,                -- broken_link | duplicate_meta | missing_title | invalid_schema | redirect | ...
  severity text not null default 'info',   -- critical | warning | info
  detail text not null default '',
  created_at timestamptz default now(),
  unique (date, url, issue_type)
);
create index if not exists idx_seo_onpage_date on public.seo_onpage_issues (date desc);
alter table public.seo_onpage_issues enable row level security;

-- ---------------------------------------------------------------------------
-- DataForSEO Backlinks: one snapshot per date.
-- ---------------------------------------------------------------------------
create table if not exists public.seo_backlinks (
  id bigint generated always as identity primary key,
  date date not null,
  metric_snapshot jsonb not null default '{}'::jsonb,  -- referring_domains, backlinks, new, lost, rank, ...
  created_at timestamptz default now(),
  unique (date)
);
create index if not exists idx_seo_backlinks_date on public.seo_backlinks (date desc);
alter table public.seo_backlinks enable row level security;

-- NOTE: deliberately NO select/insert/update/delete policies for anon or
-- authenticated roles. The service role bypasses RLS, so cron + digest can
-- read/write; everyone else is denied. This is internal monitoring data.
