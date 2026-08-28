-- QR-редирект с автонаклейки: /qr → WhatsApp (see src/app/qr/route.ts).
-- One row per scan, written after the redirect is already sent (next/server
-- `after()`), so a failed insert can never delay or break the redirect.
--
-- Apply via the Supabase SQL editor or the Supabase MCP apply_migration.
create table if not exists public.qr_scans (
  id uuid primary key default gen_random_uuid(),
  scanned_at timestamptz not null default now(),
  user_agent text,
  referrer text,
  country text, -- x-vercel-ip-country
  source text not null default 'car-sticker'
);

create index if not exists qr_scans_scanned_at_idx on public.qr_scans (scanned_at desc);

alter table public.qr_scans enable row level security;

-- Intentionally NO policies: writes come only from the service role in the
-- route handler, and nothing on the site reads this table. RLS with zero
-- policies denies anon/authenticated everything, which is exactly what we want.
