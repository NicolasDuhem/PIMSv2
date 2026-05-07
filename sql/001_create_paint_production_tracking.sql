-- Paint Production Tracking - Phase 1
-- Target database: Neon Postgres
-- Apply manually in Neon SQL Editor or with psql against DATABASE_URL.

create extension if not exists pgcrypto;

create or replace function paint_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists paint_part_types (
  id uuid primary key default gen_random_uuid(),
  code varchar(40) not null,
  name varchar(120) not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint paint_part_types_code_unique unique (code),
  constraint paint_part_types_code_format check (code ~ '^[A-Z0-9_-]{1,40}$'),
  constraint paint_part_types_name_not_blank check (length(btrim(name)) > 0)
);

create table if not exists paint_colours (
  id uuid primary key default gen_random_uuid(),
  code varchar(40) not null,
  name varchar(120) not null,
  description text,
  hex_code varchar(7),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint paint_colours_code_unique unique (code),
  constraint paint_colours_code_format check (code ~ '^[A-Z0-9_-]{1,40}$'),
  constraint paint_colours_name_not_blank check (length(btrim(name)) > 0),
  constraint paint_colours_hex_format check (hex_code is null or hex_code ~ '^#[0-9A-Fa-f]{6}$')
);

create sequence if not exists paint_run_number_seq start with 1 increment by 1;

create table if not exists paint_runs (
  id uuid primary key default gen_random_uuid(),
  run_number varchar(20) not null,
  status varchar(20) not null default 'DRAFT',
  planned_date date,
  notes text,
  loaded_at timestamptz,
  sprayed_at timestamptz,
  unloaded_at timestamptz,
  loaded_by uuid,
  sprayed_by uuid,
  unloaded_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint paint_runs_run_number_unique unique (run_number),
  constraint paint_runs_status_check check (status in ('DRAFT','LOADED','SPRAYED','UNLOADED','CANCELLED'))
);

create table if not exists paint_run_lines (
  id uuid primary key default gen_random_uuid(),
  paint_run_id uuid not null references paint_runs(id) on delete cascade,
  part_type_id uuid not null references paint_part_types(id),
  colour_id uuid not null references paint_colours(id),
  planned_qty integer not null,
  loaded_qty integer,
  sprayed_qty integer,
  unloaded_qty integer,
  rft_ok_qty integer,
  reject_qty integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint paint_run_lines_unique_part_colour unique (paint_run_id, part_type_id, colour_id),
  constraint paint_run_lines_planned_qty_positive check (planned_qty > 0),
  constraint paint_run_lines_loaded_qty_positive check (loaded_qty is null or loaded_qty > 0),
  constraint paint_run_lines_sprayed_qty_positive check (sprayed_qty is null or sprayed_qty > 0),
  constraint paint_run_lines_unloaded_qty_non_negative check (unloaded_qty is null or unloaded_qty >= 0),
  constraint paint_run_lines_rft_ok_qty_non_negative check (rft_ok_qty is null or rft_ok_qty >= 0),
  constraint paint_run_lines_reject_qty_non_negative check (reject_qty is null or reject_qty >= 0),
  constraint paint_run_lines_unloaded_matches_quality check (unloaded_qty is null or (rft_ok_qty is not null and reject_qty is not null and unloaded_qty = rft_ok_qty + reject_qty))
);

create table if not exists paint_run_stage_events (
  id uuid primary key default gen_random_uuid(),
  paint_run_id uuid not null references paint_runs(id) on delete cascade,
  stage varchar(20) not null,
  event_at timestamptz not null default now(),
  operator_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  constraint paint_run_stage_events_stage_check check (stage in ('LOADING','SPRAYING','UNLOADING','CANCELLED'))
);

create index if not exists paint_part_types_active_idx on paint_part_types(is_active, name);
create index if not exists paint_colours_active_idx on paint_colours(is_active, name);
create index if not exists paint_runs_status_idx on paint_runs(status);
create index if not exists paint_runs_planned_date_idx on paint_runs(planned_date);
create index if not exists paint_run_lines_part_type_idx on paint_run_lines(part_type_id);
create index if not exists paint_run_lines_colour_idx on paint_run_lines(colour_id);
create index if not exists paint_run_stage_events_run_idx on paint_run_stage_events(paint_run_id, event_at desc);

drop trigger if exists paint_part_types_set_updated_at on paint_part_types;
create trigger paint_part_types_set_updated_at before update on paint_part_types for each row execute function paint_set_updated_at();

drop trigger if exists paint_colours_set_updated_at on paint_colours;
create trigger paint_colours_set_updated_at before update on paint_colours for each row execute function paint_set_updated_at();

drop trigger if exists paint_runs_set_updated_at on paint_runs;
create trigger paint_runs_set_updated_at before update on paint_runs for each row execute function paint_set_updated_at();

drop trigger if exists paint_run_lines_set_updated_at on paint_run_lines;
create trigger paint_run_lines_set_updated_at before update on paint_run_lines for each row execute function paint_set_updated_at();

insert into paint_part_types (code, name, description) values
  ('MAIN_FRAME', 'Main Frame', 'Seed part type for initial paint tracking.'),
  ('REAR_FRAME', 'Rear Frame', 'Seed part type for initial paint tracking.'),
  ('FORK', 'Fork', 'Seed part type for initial paint tracking.')
on conflict (code) do nothing;

insert into paint_colours (code, name, description, hex_code) values
  ('RED', 'Red', 'Seed colour for initial paint tracking.', '#FF0000'),
  ('BLUE', 'Blue', 'Seed colour for initial paint tracking.', '#0000FF'),
  ('BLACK', 'Black', 'Seed colour for initial paint tracking.', '#000000')
on conflict (code) do nothing;
