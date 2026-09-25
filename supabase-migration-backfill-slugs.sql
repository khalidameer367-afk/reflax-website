-- ============================================================
-- REFLAX — Migration: backfill slugs for old records
-- (records created before the slug system was added)
-- Run this once in Supabase SQL Editor.
-- ============================================================

-- Businesses: unlikely to duplicate, simple update.
update businesses
set slug = lower(regexp_replace(trim(company_name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

-- Freelancers: unlikely to duplicate, simple update.
update freelancers
set slug = lower(regexp_replace(trim(full_name), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

-- Profiles: some names repeat, so number duplicates (john-doe, john-doe-2, ...).
with ranked as (
  select
    id,
    lower(regexp_replace(trim(full_name), '[^a-zA-Z0-9]+', '-', 'g')) as base_slug,
    row_number() over (
      partition by lower(regexp_replace(trim(full_name), '[^a-zA-Z0-9]+', '-', 'g'))
      order by created_at
    ) as rn
  from profiles
  where slug is null
)
update profiles
set slug = case when ranked.rn = 1 then ranked.base_slug else ranked.base_slug || '-' || ranked.rn end
from ranked
where profiles.id = ranked.id;
