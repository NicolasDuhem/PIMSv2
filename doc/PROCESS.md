# Process and Runbooks

[Back to README](../README.md)

## Purpose

Documents manual admin steps, operational runbooks, imports/exports, cron jobs, backfills, troubleshooting, known limitations, and follow-up work.

## Manual setup for Paint Production Tracking - Phase 1

1. Create or select a Neon Postgres database.
2. Set `DATABASE_URL` locally and in Vercel.
3. Apply `sql/001_create_paint_production_tracking.sql` to the target Neon database.
4. Start the app and open `/paint`.
5. Review seeded part types and colours, then edit/deactivate/add records as needed.

## Troubleshooting

- If paint pages fail with a database URL error, verify `DATABASE_URL` is set for the running environment.
- If a table does not exist, re-run the SQL migration against the correct Neon database.
- If unloading fails, verify each line has `RFT OK + Reject = Sprayed`.

## Known limitations

- No operator authentication yet.
- No rework, defect reason, downtime, barcode, export, or ERP/MES processes yet.
