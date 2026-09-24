-- ============================================================
-- REFLAX — Migration: profiles no longer require a category
-- Run this once in Supabase SQL Editor.
-- ============================================================

alter table profiles alter column category drop not null;
