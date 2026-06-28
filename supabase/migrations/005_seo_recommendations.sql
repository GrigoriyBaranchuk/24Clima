-- Agent SEO recommendations (written by /api/admin/seo/analyze, read/updated by the
-- admin dashboard at /consejos-y-guias/admin/seo). Internal data: RLS on, no select
-- policy -> only the service role can read/write.

create table if not exists public.seo_recommendations (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null default 'agent',          -- agent | manual
  category text not null default '',              -- rankings | ai | cwv | onpage | content | technical | ...
  severity text not null default 'info',          -- critical | warning | info
  title text not null,
  detail text not null default '',
  evidence jsonb not null default '{}'::jsonb,     -- the data delta that justified it
  status text not null default 'new'              -- new | accepted | rejected | done
);

create index if not exists idx_seo_reco_status on public.seo_recommendations (status, created_at desc);
alter table public.seo_recommendations enable row level security;

-- No anon/authenticated policies: only the service role (admin API routes) reads/writes.
