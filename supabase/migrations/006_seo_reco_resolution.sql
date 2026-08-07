-- Close the loop "accepted recommendation -> terminal work -> chart marker":
-- resolution stores WHAT was done (free text + commit sha), done_at is the
-- moment the recommendation was completed (drives markers on the dashboard
-- charts). Backfill done_at for already-done rows from updated_at, then
-- guarantee consistency with a check constraint so neither the admin API nor
-- direct service-role SQL can create a done row without a date (or vice versa).

alter table public.seo_recommendations
  add column if not exists resolution text not null default '',
  add column if not exists done_at timestamptz;

update public.seo_recommendations
  set done_at = updated_at
  where status = 'done' and done_at is null;

alter table public.seo_recommendations
  drop constraint if exists seo_reco_done_at_consistency;
alter table public.seo_recommendations
  add constraint seo_reco_done_at_consistency
  check ((status = 'done') = (done_at is not null));
