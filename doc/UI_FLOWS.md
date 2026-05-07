# UI Flows

[Back to README](../README.md)

## Purpose

Documents pages, journeys, forms, filters, tables, interactions, states, and role assumptions.

## Paint pages

| Page | Purpose |
| --- | --- |
| `/paint` | Dashboard/list with filters and RFT summary. |
| `/paint/runs/new` | Create a draft run or confirm loading for a new run. |
| `/paint/runs/[id]` | Run detail, totals, status, and next action. |
| `/paint/runs/[id]/spraying` | Confirm sprayed quantities for loaded runs. |
| `/paint/runs/[id]/unloading` | Confirm unloading and RFT for sprayed runs. |
| `/paint/master-data/parts` | Create, edit, deactivate, and reactivate part types. |
| `/paint/master-data/colours` | Create, edit, deactivate, and reactivate colours. |

## Main workflow

1. Create or verify active part types and colours.
2. Open `/paint/runs/new`.
3. Enter planned date/notes and one or more part/colour quantity lines.
4. Save as `DRAFT` or confirm loading as `LOADED`.
5. Open the spraying page for a loaded run and confirm sprayed quantities.
6. Open the unloading page for a sprayed run and enter RFT OK/reject quantities.
7. Review final totals and RFT percentage on the dashboard or detail page.

## Validation states

- Quantity inputs use numeric constraints in the UI.
- Spraying page shows a warning when sprayed quantities may differ from loaded quantities.
- Unloading page warns that confirmation is blocked unless RFT OK + reject equals sprayed quantity.
- Server-side validation is authoritative.

## Empty states

The dashboard displays a no-results message when no paint runs match filters. The new run page warns if no active part types or colours exist.

## Permissions

No roles or permissions are implemented in Phase 1.
