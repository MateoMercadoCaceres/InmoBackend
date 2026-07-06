-- Run this once in the Supabase SQL editor to create the faq_categories table,
-- which lets admins/editors create, rename, and delete FAQ categories from the UI.
-- Renaming a category cascades to every faq row that references it (handled by the
-- backend, not by a DB trigger). Deleting a category is blocked while it still has
-- questions (also enforced by the backend).

create table if not exists public.faq_categories (
  id bigint generated always as identity primary key,
  label text not null unique,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.faq_categories (label, order_index) values
  ('Comprar y vender', 0),
  ('Alquiler', 1),
  ('Anticrético', 2),
  ('Agentes', 3),
  ('La plataforma', 4),
  ('Pagos y comisiones', 5),
  ('Legal y contratos', 6)
on conflict (label) do nothing;
