-- ============================================================
-- REFLAX — Migration: freelancer accounts (email + password login)
-- Run this in Supabase SQL Editor AFTER the previous migrations.
-- ============================================================

-- Link each freelancer profile to a Supabase Auth user, so the person
-- who created it can log in later and edit or delete it themselves.
alter table freelancers add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Remove the old "anyone can insert" policy — profiles are now created
-- by an authenticated user (their own account), not anonymously.
drop policy if exists "Anyone can submit a freelancer application" on freelancers;
drop policy if exists "Anyone can submit a freelancer profile" on freelancers;

-- A logged-in freelancer can create their own profile (must be approved
-- immediately, and user_id must match their own account).
create policy "Freelancer can insert own profile"
  on freelancers for insert
  with check (auth.uid() = user_id and status = 'approved');

-- A logged-in freelancer can update their own profile.
create policy "Freelancer can update own profile"
  on freelancers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- A logged-in freelancer can delete their own profile.
create policy "Freelancer can delete own profile"
  on freelancers for delete
  using (auth.uid() = user_id);

-- (Public can still read approved profiles — that policy already exists
-- from the first schema and does not need to change.)
