-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor) to create the faqs table.

-- category is free-form text: admins/editors can create new categories from the UI,
-- so it is intentionally not constrained to a fixed list.
create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  category text not null,
  question text not null,
  answer text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists faqs_category_order_idx on public.faqs (category, order_index);
