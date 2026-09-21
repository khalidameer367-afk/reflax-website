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
