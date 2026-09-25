-- ============================================================
-- REFLAX — Migration: freelancers go back to admin-approval flow
-- (accounts/login stay — only the approval step comes back)
-- Run this in Supabase SQL Editor AFTER the previous migrations.
-- ============================================================

-- A logged-in freelancer can create their OWN profile, but it starts as
-- 'pending' — same as businesses. Admin approves it from /admin.
drop policy if exists "Freelancer can insert own profile" on freelancers;

create policy "Freelancer can insert own profile"
  on freelancers for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Freelancer can still edit/delete their own profile any time (unchanged),
-- and editing does not require re-approval unless you want it to.
