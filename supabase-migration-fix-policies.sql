-- ============================================================
-- REFLAX — Definitive fix: freelancer insert/update/delete policies
-- Run this once. It removes every previous version of these
-- policies (from earlier migrations) and recreates them cleanly,
-- so there's no ambiguity about what's currently active.
-- ============================================================

drop policy if exists "Anyone can submit a freelancer application" on freelancers;
drop policy if exists "Anyone can submit a freelancer profile" on freelancers;
drop policy if exists "Freelancer can insert own profile" on freelancers;
drop policy if exists "Freelancer can update own profile" on freelancers;
drop policy if exists "Freelancer can delete own profile" on freelancers;

create policy "Freelancer can insert own profile"
  on freelancers for insert
  with check (auth.uid() = user_id and status = 'pending');

create policy "Freelancer can update own profile"
  on freelancers for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Freelancer can delete own profile"
  on freelancers for delete
  using (auth.uid() = user_id);
