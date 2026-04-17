-- Reviews from Google Places (synced via cron /api/sync-reviews)
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_photo_url text,
  text text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  time timestamptz not null,
  created_at timestamptz default now(),
  unique (author_name, time)
);

create index if not exists idx_reviews_time on public.reviews (time desc);

alter table public.reviews enable row level security;

-- Public can read (for displaying on site)
create policy "Public read reviews"
  on public.reviews for select
  using (true);

-- No anon/authenticated insert/update/delete (only service role from cron)
-- So do not create insert/update/delete policies for anon or authenticated.
