# Paint Production Tracking - Phase 1

[Back to README](../README.md)

## Business purpose

Track painted part production through loading, spraying, and unloading while recording Right First Time quality at unload.

## Process flow

```txt
DRAFT -> LOADED -> SPRAYED -> UNLOADED
                 \-> CANCELLED (manual/future administrative path)
```

## User workflows

### Master data

Users manage part types and colours dynamically from the app. Active records are selectable for new runs; inactive records remain visible for history but cannot be selected for new runs.

### Loading

Users create a run with one or more part/colour lines and positive quantities. Confirming loading sets the run to `LOADED`, stores `loaded_qty`, and records `loaded_at`.

### Spraying

Users open a `LOADED` run, review loaded quantities, and confirm sprayed quantities. Sprayed quantities default to loaded quantities in the form. Confirming sets the run to `SPRAYED` and records `sprayed_at`.

### Unloading and RFT

Users open a `SPRAYED` run and enter RFT OK and reject quantities. The app stores `unloaded_qty = rft_ok_qty + reject_qty`, blocks confirmation when that total differs from sprayed quantity, sets the run to `UNLOADED`, and records `unloaded_at`.

## Page list

- `/paint` dashboard and filters.
- `/paint/runs/new` create/load run.
- `/paint/runs/[id]` run details.
- `/paint/runs/[id]/spraying` spraying confirmation.
- `/paint/runs/[id]/unloading` unloading and RFT confirmation.
- `/paint/master-data/parts` part type management.
- `/paint/master-data/colours` colour management.

## Validation rules

- Quantities for planned, loaded, and sprayed stages must be positive integers.
- RFT OK and reject quantities must be zero or positive integers.
- A confirmed load requires at least one line.
- Part type and colour must be active when creating a run.
- Duplicate part/colour lines in the same run are blocked.
- Spraying is allowed only for `LOADED` runs.
- Unloading is allowed only for `SPRAYED` runs.
- Unloading is blocked unless `rft_ok_qty + reject_qty = sprayed_qty` for every line.

## RFT logic

Dashboard RFT percentage is calculated as:

```txt
RFT % = total_rft_ok_qty / total_unloaded_qty * 100
```

When total unloaded quantity is zero, RFT percentage is shown as blank to avoid divide-by-zero errors.

## Example run

Run `PR-000001`:

- Main Frame / Red / loaded 100.
- Rear Frame / Red / loaded 20.

Spraying confirms 100 and 20. Unloading records each line's RFT OK and reject quantities, for example 96 OK + 4 rejects for Main Frame and 20 OK + 0 rejects for Rear Frame.

## Future improvements

- Operator authentication.
- Machine management.
- Paint booth / line tracking.
- Batch traceability.
- Rework tracking.
- Defect reason codes.
- Downtime tracking.
- Barcode scanning.
- Reporting by shift/day/week.
- Export to CSV.
- Integration with ERP/MES.
