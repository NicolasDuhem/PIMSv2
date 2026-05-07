# Paint Production API / Server Actions

[Back to README](../README.md)

See also [`API.md`](API.md).

## Summary

The feature uses server actions in `src/lib/paint-actions.ts` and read helpers in `src/lib/paint-db.ts` instead of public REST endpoints.

## Capabilities

- CRUD-like create/update/toggle for part types.
- CRUD-like create/update/toggle for colours.
- Create draft or loaded paint runs.
- Confirm spraying.
- Confirm unloading with RFT validation.
- List paint runs with filters.
- Get paint run details.

## Error behaviour

Validation errors are thrown by server actions and backed by database constraints. Users should correct input and resubmit.
