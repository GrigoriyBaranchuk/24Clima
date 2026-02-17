-- Run this in Supabase SQL Editor after creating your project

-- Articles table
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ru text not null,
  title_es text,
  title_en text,
  content_ru text not null,
  content_es text,
  content_en text,
  image_urls text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.articles enable row level security;

-- Public can read
create policy "Public read articles"
  on public.articles for select
  using (true);

-- Only authenticated users (admins) can insert/update/delete
create policy "Admin insert articles"
  on public.articles for insert
  with check (auth.role() = 'authenticated');

create policy "Admin update articles"
  on public.articles for update
  using (auth.role() = 'authenticated');

create policy "Admin delete articles"
  on public.articles for delete
  using (auth.role() = 'authenticated');

-- Storage bucket for article images (create in Supabase Dashboard > Storage)
-- Bucket name: article-images
-- Public: Yes (so images can be displayed on the site)
