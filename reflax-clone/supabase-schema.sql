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

-- Public (anon key) can INSERT new applications (status defaults to pending).
create policy "Anyone can submit a freelancer application"
  on freelancers for insert
  with check (status = 'pending');

create policy "Anyone can submit a business application"
  on businesses for insert
  with check (status = 'pending');

-- NOTE: Reading pending rows, and updating status (approve/reject), is done
-- from the /api/admin routes using the SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS entirely. Never expose the service role key to the browser.
