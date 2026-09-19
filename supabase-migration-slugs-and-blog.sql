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
