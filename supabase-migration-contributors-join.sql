-- =====================================================================
-- REFLAX — Migration: Contributor posts + approval for new profiles
-- Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once.
-- =====================================================================

-- 1) Contributor (guest) posts
create table if not exists contributor_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  featured_image_url text,
  author text,
  niche text not null default 'technology',
  meta_title text,
  meta_description text,
  canonical_url text,
  focus_keyword text
);

alter table contributor_posts enable row level security;

drop policy if exists "Public can read contributor posts" on contributor_posts;
create policy "Public can read contributor posts"
  on contributor_posts for select
  using (true);

-- 2) Profiles (professional profiles) can now wait for admin approval.
--    Existing profiles stay live (default 'approved').
alter table profiles add column if not exists status text not null default 'approved';

drop policy if exists "Public can read profiles" on profiles;
create policy "Public can read profiles"
  on profiles for select
  using (status = 'approved');
