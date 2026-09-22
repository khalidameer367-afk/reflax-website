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
