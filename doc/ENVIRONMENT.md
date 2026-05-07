# Environment and Deployment

[Back to README](../README.md)

## Purpose

Documents required environment variables, Vercel configuration, Neon targeting, deployment notes, and feature flags.

## Required environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Neon Postgres connection string used by `@neondatabase/serverless`. |

## Vercel

Deploy the Next.js application to Vercel. Add `DATABASE_URL` to the appropriate Vercel project environments before using paint production pages.

## Neon deployment step

Before using the feature against a Neon database, apply:

```bash
psql "$DATABASE_URL" -f sql/001_create_paint_production_tracking.sql
```

Alternatively, paste the same SQL file into the Neon SQL Editor and run it once per target database.

## Feature flags

No feature flags are implemented in Phase 1.

## Known limitations

Builds do not require `DATABASE_URL`, but runtime access to `/paint` pages does.
