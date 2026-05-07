# Paint Production Database Model

[Back to README](../README.md)

See also [`DATABASE.md`](DATABASE.md).

## Overview

Paint Production Tracking - Phase 1 adds isolated `paint_` prefixed tables for master data, run headers, run lines, and stage events.

## Source of truth

Neon Postgres is the source of truth for all paint production data. UI summaries are calculated from `paint_run_lines` quantities.

## Important assumptions

- One run can contain multiple unique part type + colour combinations.
- Current operator fields are nullable because authentication is not yet available.
- Seed part types and colours are starter records only; users manage master data dynamically after migration.
