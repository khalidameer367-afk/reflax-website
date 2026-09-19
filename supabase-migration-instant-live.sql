-- ============================================================
-- REFLAX — Migration: freelancer profiles go live instantly
-- Run this in Supabase SQL Editor (after the original schema)
-- ============================================================

-- Old policy only allowed inserting rows with status = 'pending'.
-- Freelancer profiles now go live immediately, so we allow 'approved' too.
drop policy if exists "Anyone can submit a freelancer application" on freelancers;

create policy "Anyone can submit a freelancer profile"
  on freelancers for insert
  with check (status in ('pending', 'approved'));
