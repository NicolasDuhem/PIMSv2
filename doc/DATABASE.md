# Database

[Back to README](../README.md)

## Purpose

Documents schema, columns, constraints, indexes, migrations, source-of-truth rules, and operational database notes.

## Migration files

- `sql/001_create_paint_production_tracking.sql` creates Paint Production Tracking - Phase 1 objects and seed master data.

## Tables

### `paint_part_types`

Dynamic part type master data.

| Column | Description |
| --- | --- |
| `id` | UUID primary key. |
| `code` | Unique human/business code. Uppercase letters, numbers, underscores, and hyphens. |
| `name` | Display name. |
| `description` | Optional description. |
| `is_active` | Controls whether the part type can be selected for new runs. |
| `created_at`, `updated_at` | Audit timestamps maintained by defaults/triggers. |

### `paint_colours`

Dynamic colour master data.

| Column | Description |
| --- | --- |
| `id` | UUID primary key. |
| `code` | Unique human/business code. |
| `name` | Display name. |
| `description` | Optional description. |
| `hex_code` | Optional `#RRGGBB` value for display. |
| `is_active` | Controls whether the colour can be selected for new runs. |
| `created_at`, `updated_at` | Audit timestamps maintained by defaults/triggers. |

### `paint_runs`

Paint production run header.

| Column | Description |
| --- | --- |
| `id` | UUID primary key. |
| `run_number` | Unique human-readable reference such as `PR-000001`. |
| `status` | Controlled lifecycle value: `DRAFT`, `LOADED`, `SPRAYED`, `UNLOADED`, or `CANCELLED`. |
| `planned_date` | Optional planned production date. |
| `notes` | Optional run notes. |
| `loaded_at`, `sprayed_at`, `unloaded_at` | Stage confirmation timestamps. |
| `loaded_by`, `sprayed_by`, `unloaded_by` | Nullable future operator UUID fields. |
| `created_at`, `updated_at` | Audit timestamps maintained by defaults/triggers. |

### `paint_run_lines`

Part/colour quantities for each run.

| Column | Description |
| --- | --- |
| `id` | UUID primary key. |
| `paint_run_id` | Parent run foreign key. |
| `part_type_id` | Part type foreign key. |
| `colour_id` | Colour foreign key. |
| `planned_qty` | Positive planned quantity. |
| `loaded_qty` | Positive loaded quantity once loading is confirmed. |
| `sprayed_qty` | Positive sprayed quantity once spraying is confirmed. |
| `unloaded_qty` | Non-negative calculated unloaded quantity. |
| `rft_ok_qty` | Non-negative Right First Time OK quantity. |
| `reject_qty` | Non-negative reject quantity. |
| `created_at`, `updated_at` | Audit timestamps maintained by defaults/triggers. |

### `paint_run_stage_events`

Simple audit/history table for stage confirmations.

## Relationships and constraints

- `paint_run_lines.paint_run_id` references `paint_runs.id` with cascade delete.
- `paint_run_lines.part_type_id` references `paint_part_types.id`.
- `paint_run_lines.colour_id` references `paint_colours.id`.
- `paint_run_lines` prevents duplicate part type + colour combinations per run.
- Quantity checks enforce positive planned/loaded/sprayed quantities and non-negative RFT/reject/unloaded quantities.
- `paint_run_lines_unloaded_matches_quality` ensures stored unloaded quantity equals `rft_ok_qty + reject_qty` when unloaded values are present.

## Indexes

The migration adds indexes for active master data lookups, run status filtering, planned-date filtering, part/colour filtering, and stage event history by run.

## Seed data

The migration seeds initial part types (`MAIN_FRAME`, `REAR_FRAME`, `FORK`) and colours (`RED`, `BLUE`, `BLACK`) using `on conflict do nothing`. Users can deactivate or edit these records from the app.

## Assumptions

- Neon Postgres supports `pgcrypto` for `gen_random_uuid()`.
- Operator/user IDs will reference an authentication-owned user table in a future phase; they are nullable and unconstrained in Phase 1.
