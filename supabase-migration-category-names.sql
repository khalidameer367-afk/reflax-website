-- =====================================================================
-- REFLAX — Migration: new category names (SEO Experts, Video Editors, ...)
-- Run ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
-- Safe to run more than once.
-- =====================================================================

update freelancers set category = case category
  when 'SEO'                          then 'SEO Experts'
  when 'WordPress Development'        then 'WordPress Developers'
  when 'Google Ads (PPC)'             then 'Google Ads Experts'
  when 'Social Media Marketing'       then 'Social Media Marketers'
  when 'Content Writing'              then 'Content Writers'
  when 'Graphic Design'               then 'Graphic Designers'
  when 'Video Editing'                then 'Video Editors'
  when 'Web Development'              then 'Web Developers'
  when 'App Development'              then 'App Developers'
  when 'Virtual Assistance'           then 'Virtual Assistants'
  when 'Accounting & Finance'         then 'Accounting & Finance Experts'
  when 'Sales & Business Development' then 'Sales & Business Development Experts'
  else category end;

update profiles set category = case category
  when 'SEO'                          then 'SEO Experts'
  when 'WordPress Development'        then 'WordPress Developers'
  when 'Google Ads (PPC)'             then 'Google Ads Experts'
  when 'Social Media Marketing'       then 'Social Media Marketers'
  when 'Content Writing'              then 'Content Writers'
  when 'Graphic Design'               then 'Graphic Designers'
  when 'Video Editing'                then 'Video Editors'
  when 'Web Development'              then 'Web Developers'
  when 'App Development'              then 'App Developers'
  when 'Virtual Assistance'           then 'Virtual Assistants'
  when 'Accounting & Finance'         then 'Accounting & Finance Experts'
  when 'Sales & Business Development' then 'Sales & Business Development Experts'
  else category end
where category is not null;
