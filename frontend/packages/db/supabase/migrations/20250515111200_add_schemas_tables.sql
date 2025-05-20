begin;

-- create building_schema_versions table
create table if not exists public.building_schema_versions (
  id uuid primary key default gen_random_uuid(),
  building_schema_id uuid not null references public.building_schemas(id) on delete cascade,
  number integer not null,
  created_at timestamp with time zone default now() not null,
  patch jsonb not null,
  reverse_patch jsonb not null
);

-- add indexes
create index if not exists building_schema_versions_building_schema_id_idx on public.building_schema_versions(building_schema_id);
create index if not exists building_schema_versions_number_idx on public.building_schema_versions(number);

-- add policies
alter table public.building_schema_versions enable row level security;

create policy "users can view schema versions in their organizations" on public.building_schema_versions
  for select
  using (
    building_schema_id in (
      select id from public.building_schemas
      where organization_id in (
        select organization_id from public.organization_members
        where user_id = auth.uid()
      )
    )
  );

create policy "users can insert schema versions in their organizations" on public.building_schema_versions
  for insert
  with check (
    building_schema_id in (
      select id from public.building_schemas
      where organization_id in (
        select organization_id from public.organization_members
        where user_id = auth.uid()
      )
    )
  );

create policy "users can update schema versions in their organizations" on public.building_schema_versions
  for update
  using (
    building_schema_id in (
      select id from public.building_schemas
      where organization_id in (
        select organization_id from public.organization_members
        where user_id = auth.uid()
      )
    )
  )
  with check (
    building_schema_id in (
      select id from public.building_schemas
      where organization_id in (
        select organization_id from public.organization_members
        where user_id = auth.uid()
      )
    )
  );

create policy "users can delete schema versions in their organizations" on public.building_schema_versions
  for delete
  using (
    building_schema_id in (
      select id from public.building_schemas
      where organization_id in (
        select organization_id from public.organization_members
        where user_id = auth.uid()
      )
    )
  );

commit;