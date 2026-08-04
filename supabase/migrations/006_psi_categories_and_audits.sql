-- ---------------------------------------------------------------------------
-- PageSpeed Insights: category scores + failed audits.
--
-- The sync used to request only category=performance on strategy=mobile, so the
-- accessibility / best-practices / SEO scores and the individual audit findings
-- (what actually fails and why) never reached the database — and therefore
-- never reached the SEO agent's context.
-- ---------------------------------------------------------------------------

alter table public.seo_cwv_snapshots
  add column if not exists a11y_score double precision,            -- 0..100, lab rows only
  add column if not exists best_practices_score double precision,  -- 0..100, lab rows only
  add column if not exists seo_score double precision;             -- 0..100, lab rows only

-- One row per failed Lighthouse audit per page/strategy/day. An audit can be
-- referenced by several categories; we keep the first one so the primary key
-- stays (date, url, strategy, audit_id).
create table if not exists public.seo_psi_audits (
  id bigint generated always as identity primary key,
  date date not null,
  url text not null,
  strategy text not null,             -- mobile | desktop
  category text not null,             -- performance | accessibility | best-practices | seo
  audit_id text not null,             -- lighthouse id, e.g. color-contrast
  title text not null,
  score double precision,             -- 0..1; rows are only written below 0.9
  display_value text,                 -- e.g. "Est savings of 226 KiB"
  created_at timestamptz default now(),
  unique (date, url, strategy, audit_id)
);

create index if not exists idx_seo_psi_audits_date on public.seo_psi_audits (date desc);
alter table public.seo_psi_audits enable row level security;
