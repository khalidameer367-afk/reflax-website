-- ============================================================
-- REFLAX — Migration: enhance redirects (type + active status)
-- Run this once in Supabase Dashboard → SQL Editor → New query.
-- Safe to run even if you've already run supabase-migration-cms-system.sql.
-- ============================================================

alter table redirects
  add column if not exists redirect_type int not null default 301
    check (redirect_type in (301, 302));

alter table redirects
  add column if not exists is_active boolean not null default true;

-- Helpful index for the middleware lookup that runs on every page request.
create index if not exists redirects_source_path_idx on redirects (source_path);
