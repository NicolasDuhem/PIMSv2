# PIMS v2

PIMS v2 is a Vercel-ready Next.js application for production information management. Detailed project documentation lives in [`/doc`](doc/).

## Documentation standards for every change

Every meaningful code, schema, API, UI, integration, configuration, deployment, or process change must include matching Markdown documentation under [`/doc`](doc/). The README is the entry point; `/doc` contains the implementation details.

When a prompt starts with "Read the README to document any change you will do in the request" or equivalent wording, Codex/developers must treat this section as mandatory acceptance criteria.

### Documentation files

| File | Purpose | Update when |
| --- | --- | --- |
| [`doc/ARCHITECTURE.md`](doc/ARCHITECTURE.md) | Application structure, key modules, data flow, server/client boundaries, integrations, and technical decisions. | Code structure, feature modules, data flow, or server/client boundaries change. |
| [`doc/DATABASE.md`](doc/DATABASE.md) | Tables, columns, constraints, indexes, migrations, source-of-truth rules, and data cleanup/backfill notes. | Database schema, SQL migrations, indexes, constraints, or data ownership changes. |
| [`doc/API.md`](doc/API.md) | API routes or server actions, payloads, query parameters, auth assumptions, error handling, and API environment variables. | Server actions, route handlers, request/response contracts, validation, or API errors change. |
| [`doc/ENVIRONMENT.md`](doc/ENVIRONMENT.md) | Required environment variables, Vercel/Neon targeting, deployment notes, and feature flags. | Environment variables, deployment assumptions, hosting, or external service configuration changes. |
| [`doc/UI_FLOWS.md`](doc/UI_FLOWS.md) | Pages, user journeys, forms, filters, tables, interactions, loading/error/empty states, and role assumptions. | UI pages, workflows, forms, navigation, or user-visible behaviour changes. |
| [`doc/INTEGRATIONS.md`](doc/INTEGRATIONS.md) | External systems, endpoint details, payloads, retry/error handling, rate limits, batching, and mappings. | External services or integrations are added or changed. |
| [`doc/PROCESS.md`](doc/PROCESS.md) | Manual admin steps, runbooks, imports/exports, cron jobs, backfills, troubleshooting, and known limitations. | Operational processes, manual deployment steps, runbooks, or troubleshooting guidance changes. |
| [`doc/CHANGELOG.md`](doc/CHANGELOG.md) | Dated summary of meaningful changes, why they changed, and affected files/features. | Every meaningful functional, data, API, UI, integration, configuration, or process change. |

Feature-specific documentation may be added when it makes the change clearer. Link feature-specific documents from the general documentation where relevant.

### Mandatory completion checklist

Before finishing any meaningful change, confirm that:

- [ ] README.md was read before making the change.
- [ ] The change was assessed for architecture, database, API, UI, integration, environment, deployment, and process documentation impact.
- [ ] Relevant `/doc/*.md` files were created or updated.
- [ ] Practical examples, SQL snippets, payload examples, or file paths were added where useful.
- [ ] A dated changelog entry was added for meaningful changes.
- [ ] Documentation matches the implemented code and does not invent behaviour.
- [ ] Known limitations or follow-up work are listed where applicable.

## Local development

```bash
npm install
npm run dev
```

Set `DATABASE_URL` to a Neon Postgres connection string before using database-backed pages.
