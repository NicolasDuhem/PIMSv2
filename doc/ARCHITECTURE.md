# Architecture

[Back to README](../README.md)

## Purpose

Documents application structure, key modules, data flow, server/client boundaries, external integrations, and technical decisions.

## Application structure

- `src/app` contains the Next.js App Router pages.
- `src/app/paint` contains Paint Production Tracking - Phase 1 pages.
- `src/lib/paint-db.ts` contains server-side read helpers and shared paint production types.
- `src/lib/paint-actions.ts` contains server actions for mutations and server-side validation.
- `sql/001_create_paint_production_tracking.sql` contains the Neon Postgres schema migration.

## Paint Production Tracking - Phase 1

The feature is implemented as a server-rendered Next.js flow for Vercel. Pages read from Neon Postgres through `@neondatabase/serverless`; forms call server actions that validate input, update Postgres, revalidate paint routes, and redirect to the next page.

## Data flow

1. Operators manage dynamic part types and colours in master-data pages.
2. Operators create a paint run from active master data.
3. The loading action creates the run and line records.
4. Spraying and unloading actions update line quantities and move the run through the controlled status lifecycle.
5. The dashboard aggregates line quantities and calculates RFT percentage from database values.

## Server/client boundaries

All database access is server-side. The current UI uses server components and HTML forms with server actions; no browser-side database calls are made.

## External integrations

- Vercel hosts the Next.js app.
- Neon Postgres is the production database accessed through `DATABASE_URL`.

## Technical decisions

- New database objects use the `paint_` prefix to isolate the feature.
- Master data is dynamic and is not hardcoded into the UI.
- Operator fields are nullable until authentication is added.
- Server-side validation is the source of truth; HTML input constraints provide additional guidance.

## Known limitations

- Authentication and operator identity are not implemented in Phase 1.
- Draft runs cannot currently be edited or confirmed later; the simple Phase 1 flow supports creating a loaded run directly and storing drafts for future workflow extension.
