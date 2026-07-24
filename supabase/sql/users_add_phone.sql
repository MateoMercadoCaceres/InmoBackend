-- Run this once in the Supabase SQL editor to allow storing an agent's phone
-- number, used for the "Chat con agente" WhatsApp link on the property page.
alter table public.users add column if not exists phone text;
