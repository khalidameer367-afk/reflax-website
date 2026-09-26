-- ============================================================
-- REFLAX — Combined Supabase schema + migrations
-- Run these in order (top to bottom) in Supabase SQL Editor.
-- Each file below was originally a separate migration; they are
-- combined here only to keep the repo's file count low.
-- ============================================================

-- ============================================================
-- FILE: supabase-schema.sql
-- ============================================================
-- ============================================================
-- REFLAX — Supabase schema
-- Run this once in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. FREELANCERS ------------------------------------------------
create table if not exists freelancers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text,
  category text not null,
  title text not null,
  bio text not null,
  skills text[] not null default '{}',
  experience_years int,
  hourly_rate text,
  location text,
  portfolio_url text,
  linkedin_url text,
  avatar_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected'))
);

-- 2. BUSINESSES ---------------------------------------------------
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text,
  industry text not null,
  website text,
  company_size text,
  location text,
  description text not null,
  logo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected'))
);

-- 3. PROFILES (entrepreneurs — added manually by admin, not a public form) --
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  category text not null,
  title text not null,
  bio text not null,
  company_name text,
  location text,
  website text,
  linkedin_url text,
  avatar_url text,
  featured boolean not null default false
);

-- 4. Row Level Security -------------------------------------------
alter table freelancers enable row level security;
alter table businesses enable row level security;
alter table profiles enable row level security;

-- Profiles are added only by the admin (service role, bypasses RLS),
-- but anyone can read them since there's no approval workflow for this table.
create policy "Public can read profiles"
  on profiles for select
  using (true);

-- Public (anon key) can only READ rows that are already approved.
create policy "Public can read approved freelancers"
  on freelancers for select
  using (status = 'approved');

create policy "Public can read approved businesses"
  on businesses for select
  using (status = 'approved');

-- Public (anon key) can INSERT new freelancer profiles. These go live
-- immediately (status = 'approved'), so both statuses are allowed here.
create policy "Anyone can submit a freelancer profile"
  on freelancers for insert
  with check (status in ('pending', 'approved'));

create policy "Anyone can submit a business application"
  on businesses for insert
  with check (status = 'pending');

-- NOTE: Reading pending rows, and updating status (approve/reject), is done
-- from the /api/admin routes using the SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS entirely. Never expose the service role key to the browser.


-- ============================================================
-- FILE: supabase-migration-instant-live.sql
-- ============================================================
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


-- ============================================================
-- FILE: supabase-migration-freelancer-accounts.sql
-- ============================================================
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


-- ============================================================
-- FILE: supabase-migration-freelancer-pending.sql
-- ============================================================
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


-- ============================================================
-- FILE: supabase-migration-slugs-and-blog.sql
-- ============================================================
-- ============================================================
-- REFLAX — Migration: name-based URLs (slugs) + blog
-- Run this in Supabase SQL Editor AFTER the previous migrations.
-- ============================================================

-- 1. Add a "slug" column to each table that needs a clean, name-based URL.
alter table freelancers add column if not exists slug text;
alter table businesses add column if not exists slug text;
alter table profiles add column if not exists slug text;

create unique index if not exists freelancers_slug_idx on freelancers (slug);
create unique index if not exists businesses_slug_idx on businesses (slug);
create unique index if not exists profiles_slug_idx on profiles (slug);

-- 2. Blog posts table.
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  featured_image_url text,
  author text
);

alter table blog_posts enable row level security;

create policy "Public can read blog posts"
  on blog_posts for select
  using (true);


-- ============================================================
-- FILE: supabase-migration-backfill-slugs.sql
-- ============================================================
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


-- ============================================================
-- FILE: supabase-migration-fix-policies.sql
-- ============================================================
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


-- ============================================================
-- FILE: supabase-migration-seo-fields.sql
-- ============================================================
-- ============================================================
-- REFLAX — Migration: SEO fields + business featured image
-- Run this once in Supabase SQL Editor.
-- ============================================================

-- SEO fields on every content type.
alter table freelancers add column if not exists meta_title text;
alter table freelancers add column if not exists meta_description text;
alter table freelancers add column if not exists canonical_url text;
alter table freelancers add column if not exists focus_keyword text;

alter table businesses add column if not exists meta_title text;
alter table businesses add column if not exists meta_description text;
alter table businesses add column if not exists canonical_url text;
alter table businesses add column if not exists focus_keyword text;
alter table businesses add column if not exists featured_image_url text;

alter table profiles add column if not exists meta_title text;
alter table profiles add column if not exists meta_description text;
alter table profiles add column if not exists canonical_url text;
alter table profiles add column if not exists focus_keyword text;

alter table blog_posts add column if not exists meta_title text;
alter table blog_posts add column if not exists meta_description text;
alter table blog_posts add column if not exists canonical_url text;
alter table blog_posts add column if not exists focus_keyword text;

-- A generic table for managing SEO on static pages (Home, About Us, etc.)
create table if not exists page_seo (
  id uuid primary key default gen_random_uuid(),
  page_key text unique not null,
  meta_title text,
  meta_description text,
  canonical_url text,
  focus_keyword text
);

alter table page_seo enable row level security;
create policy "Public can read page seo" on page_seo for select using (true);


-- ============================================================
-- FILE: supabase-migration-cms-system.sql
-- ============================================================
-- ============================================================
-- REFLAX — Migration: robots.txt, redirects, page content system
-- Run this once in Supabase SQL Editor.
-- ============================================================

-- Site-wide settings (robots.txt content, etc.)
create table if not exists site_settings (
  key text primary key,
  value text
);
alter table site_settings enable row level security;
create policy "Public can read site settings" on site_settings for select using (true);

-- 301/302 redirects, managed from the admin panel to fix broken/404 links.
create table if not exists redirects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_path text unique not null,
  destination_path text not null
);
alter table redirects enable row level security;
create policy "Public can read redirects" on redirects for select using (true);

-- Admin-editable body content for static pages (Home, About Us, Services,
-- etc.) — the frontend layout stays fixed, only this content is swapped in.
create table if not exists page_content (
  id uuid primary key default gen_random_uuid(),
  page_key text unique not null,
  content text
);
alter table page_content enable row level security;
create policy "Public can read page content" on page_content for select using (true);


-- ============================================================
-- FILE: supabase-migration-profiles-optional-category.sql
-- ============================================================
-- ============================================================
-- REFLAX — Migration: profiles no longer require a category
-- Run this once in Supabase SQL Editor.
-- ============================================================

alter table profiles alter column category drop not null;


-- ============================================================
-- FILE: supabase-migration-verified-featured.sql
-- ============================================================
-- ============================================================
-- REFLAX — Add "verified" and "featured" flags
-- Run this once in Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Freelancers: can be marked verified and/or featured from the admin panel.
alter table freelancers add column if not exists verified boolean not null default false;
alter table freelancers add column if not exists featured boolean not null default false;

-- Businesses: same two flags.
alter table businesses add column if not exists verified boolean not null default false;
alter table businesses add column if not exists featured boolean not null default false;

-- Profiles: `featured` already exists in the base schema, but add it here
-- too (safe no-op if it's already there) plus the new `verified` flag.
alter table profiles add column if not exists featured boolean not null default false;
alter table profiles add column if not exists verified boolean not null default false;


