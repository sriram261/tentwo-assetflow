-- TenTwo AssetFlow Supabase Schema
-- Run this full file in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Main asset tracker table.
-- This includes wide columns for AMF, master tracker, telecom assets, warehouse status, and return workflow.
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),

  -- ownership / audit
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,

  -- master tracker fields
  entry_no integer,
  tracker_date date,
  assigned_to text,

  -- AMF fields
  amf_number text,
  amf_file_name text,
  amf_date date,
  work_type text,
  source_status text,

  -- vendor / site fields
  vendor text,
  contractor text,
  site_id text,
  site_name text,

  -- asset fields
  asset_category text,
  asset_type text,
  asset_description text,
  quantity integer default 1,
  att_id text,
  serial_number text,
  model_number text,
  part_number text,
  manufacturer text,
  condition text,

  -- warehouse / return process fields
  pallet_id text,
  pallet_status text,
  warehouse_location text,
  attachment_status text,
  banding_status text,
  return_status text,
  returned_date date,

  -- flexible fields
  notes text,
  raw_data jsonb default '{}'::jsonb,
  search_text text
);

create table if not exists public.amf_files (
  id uuid primary key default gen_random_uuid(),
  uploaded_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text,
  imported_rows integer default 0,
  file_size bigint,
  source text,
  raw_data jsonb default '{}'::jsonb
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  asset_id uuid references public.assets(id) on delete cascade,
  action text not null,
  changes jsonb default '{}'::jsonb
);

-- Keep updated_at current
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_assets_updated_at on public.assets;

create trigger trg_assets_updated_at
before update on public.assets
for each row
execute function public.set_updated_at();

-- Helpful indexes for searching/filtering
create index if not exists idx_assets_att_id on public.assets(att_id);
create index if not exists idx_assets_serial_number on public.assets(serial_number);
create index if not exists idx_assets_site_id on public.assets(site_id);
create index if not exists idx_assets_amf_number on public.assets(amf_number);
create index if not exists idx_assets_amf_file_name on public.assets(amf_file_name);
create index if not exists idx_assets_vendor on public.assets(vendor);
create index if not exists idx_assets_asset_type on public.assets(asset_type);
create index if not exists idx_assets_return_status on public.assets(return_status);
create index if not exists idx_assets_pallet_id on public.assets(pallet_id);
create index if not exists idx_assets_updated_at on public.assets(updated_at desc);

-- RLS: simple shared team mode.
-- Any authenticated user can read/write data.
-- Good enough for a 2-3 user MVP. Later, add organizations/team_id for customers.
alter table public.assets enable row level security;
alter table public.amf_files enable row level security;
alter table public.activity_logs enable row level security;

drop policy if exists "Authenticated users can view assets" on public.assets;
drop policy if exists "Authenticated users can insert assets" on public.assets;
drop policy if exists "Authenticated users can update assets" on public.assets;
drop policy if exists "Authenticated users can delete assets" on public.assets;

create policy "Authenticated users can view assets"
on public.assets for select
to authenticated
using (true);

create policy "Authenticated users can insert assets"
on public.assets for insert
to authenticated
with check (auth.uid() is not null);

create policy "Authenticated users can update assets"
on public.assets for update
to authenticated
using (true)
with check (auth.uid() is not null);

create policy "Authenticated users can delete assets"
on public.assets for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can view files" on public.amf_files;
drop policy if exists "Authenticated users can insert files" on public.amf_files;
drop policy if exists "Authenticated users can update files" on public.amf_files;
drop policy if exists "Authenticated users can delete files" on public.amf_files;

create policy "Authenticated users can view files"
on public.amf_files for select
to authenticated
using (true);

create policy "Authenticated users can insert files"
on public.amf_files for insert
to authenticated
with check (auth.uid() is not null);

create policy "Authenticated users can update files"
on public.amf_files for update
to authenticated
using (true)
with check (auth.uid() is not null);

create policy "Authenticated users can delete files"
on public.amf_files for delete
to authenticated
using (true);

drop policy if exists "Authenticated users can view logs" on public.activity_logs;
drop policy if exists "Authenticated users can insert logs" on public.activity_logs;

create policy "Authenticated users can view logs"
on public.activity_logs for select
to authenticated
using (true);

create policy "Authenticated users can insert logs"
on public.activity_logs for insert
to authenticated
with check (auth.uid() is not null);
