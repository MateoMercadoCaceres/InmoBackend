-- Run this once in the Supabase SQL editor if you already created the `faqs` table
-- with the original fixed-category CHECK constraint. It lifts that restriction so
-- admins/editors can create arbitrary categories from the FAQ page UI.

alter table public.faqs drop constraint if exists faqs_category_check;
