# API and Server Actions

[Back to README](../README.md)

## Purpose

Documents server-side actions, payloads, validation behaviour, error handling, and environment requirements.

## Implementation pattern

Paint Production Tracking - Phase 1 uses Next.js server actions rather than public REST route handlers. Forms submit `FormData` to actions in `src/lib/paint-actions.ts`; read operations are server-side helpers in `src/lib/paint-db.ts`.

## Server actions

### `savePartType(formData)`

Creates or updates a part type.

Example fields:

```txt
id=<uuid, optional>
code=MAIN_FRAME
name=Main Frame
description=Main frame painted part
```

Validation: code format, required name, unique code enforced by database.

### `togglePartType(formData)`

Toggles `is_active` for a part type by `id`.

### `saveColour(formData)`

Creates or updates a colour.

Example fields:

```txt
id=<uuid, optional>
code=RED
name=Red
hex_code=#FF0000
description=Standard red paint
```

Validation: code format, required name, optional hex code must be `#RRGGBB`.

### `toggleColour(formData)`

Toggles `is_active` for a colour by `id`.

### `createPaintRun(formData)`

Creates a run as `DRAFT` or confirms loading immediately as `LOADED`.

Example fields:

```txt
planned_date=2026-05-07
notes=Morning run
action=confirm
part_type_id=<uuid>
colour_id=<uuid>
qty=100
part_type_id=<uuid>
colour_id=<uuid>
qty=20
```

Validation: at least one line, positive integer quantity, active part type, active colour, and no duplicate part/colour lines.

### `confirmSpraying(formData)`

Confirms spraying for a `LOADED` run.

Example fields:

```txt
run_id=<uuid>
line_id=<uuid>
sprayed_qty=100
```

Validation: run must be `LOADED`; sprayed quantities must be positive integers.

### `confirmUnloading(formData)`

Confirms unloading and RFT for a `SPRAYED` run.

Example fields:

```txt
run_id=<uuid>
line_id=<uuid>
rft_ok_qty=96
reject_qty=4
```

Validation: run must be `SPRAYED`; RFT OK and reject quantities must be zero or positive integers; `rft_ok_qty + reject_qty` must equal `sprayed_qty` for every line.

## Read helpers

- `listPartTypes(includeInactive)` lists active/inactive part types.
- `listColours(includeInactive)` lists active/inactive colours.
- `listPaintRuns(filters)` lists dashboard rows with status, planned date, part type, and colour filters.
- `getPaintRun(id)` returns a run header with line detail.

## Error handling

Server actions throw validation errors. Next.js renders the action error in the nearest error boundary/default development or production error handling. Database constraints provide a second layer of protection.

## Environment variables

- `DATABASE_URL` is required for all database-backed reads and writes.
