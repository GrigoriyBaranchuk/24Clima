-- Site-wide GSC daily totals: searchAnalytics query with dimensions=["date"]
-- (NO query dimension). Grouping by query makes Google drop anonymized queries
-- — for this site that hides ~84% of clicks and ~64% of impressions — so KPI
-- cards and charts must read THIS table. seo_gsc_daily (date+query+page) stays
-- as the source for top-query analysis only.
--
-- date is the natural primary key (one row per day, upsert target).
-- updated_at, not created_at: rows are rewritten daily while GSC "final" data
-- settles, so creation time is meaningless.
--
-- Apply via the Supabase SQL editor or the Supabase MCP apply_migration.
create table if not exists public.seo_gsc_totals (
  date date primary key,
  clicks int not null default 0,
  impressions int not null default 0,
  ctr double precision not null default 0,
  position double precision not null default 0, -- impression-weighted by Google
  updated_at timestamptz not null default now()
);
alter table public.seo_gsc_totals enable row level security;
