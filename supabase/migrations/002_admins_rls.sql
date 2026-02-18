-- Enterprise: restrict articles write access to admins only (not any authenticated user).
-- Run after 001_articles.sql. Then add admin user_ids to public.admins (e.g. via Dashboard or SQL).

-- 1) Admins table: only listed user_ids can perform write operations
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.admins enable row level security;

-- Only existing admins can read the admins list (for server-side checks if needed)
create policy "Admins can read admins"
  on public.admins for select
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 2) Drop old permissive "authenticated" policies on articles
drop policy if exists "Admin insert articles" on public.articles;
drop policy if exists "Admin update articles" on public.articles;
drop policy if exists "Admin delete articles" on public.articles;

-- 3) New policies: only users in public.admins can insert/update/delete
create policy "Only admins insert articles"
  on public.articles for insert
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "Only admins update articles"
  on public.articles for update
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy "Only admins delete articles"
  on public.articles for delete
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- 4) Storage: restrict uploads to admins (bucket article-images)
-- If you use Storage for article-images, ensure policy allows only admins to insert/update.
-- Example (run if bucket policy is managed by SQL):
-- drop policy if exists "Authenticated upload" on storage.objects;
-- create policy "Admins upload article-images"
--   on storage.objects for insert
--   with check (
--     bucket_id = 'article-images'
--     and exists (select 1 from public.admins a where a.user_id = auth.uid())
--   );
