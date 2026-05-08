# Changelog

[Back to README](../README.md)

## 2026-05-08

- Fixed the Paint server action Neon client type alias so `assertActive` accepts the concrete `NeonQueryFunction<false, false>` client returned by the Paint database helper, and adjusted Paint query result assertions to satisfy the current Neon promise types without runtime logic changes.

## 2026-05-07

- Fixed Paint feature internal navigation to use Next.js `Link` components for Vercel lint/build compatibility, and normalized the flex alignment keyword in global CSS.
- Added Paint Production Tracking - Phase 1, including dynamic part/colour master data, paint run loading, spraying, unloading/RFT flows, dashboard filtering, server actions, Neon Postgres SQL migration, and documentation.
- Replaced the initial README prompt text with repository documentation standards and the required completion checklist.
