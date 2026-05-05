I want you to update the repository documentation standards.

Goal:
Add clear instructions in the root README.md explaining how every future code change must be documented in this GitHub repo.

Context:
From now on, every Codex prompt I send will start with:

"Read the README to document any change you will do in the request"

So the README must become the central instruction point for documentation expectations.

Required change:
Update the root README.md with a new section called something like:

"Documentation standards for every change"

The section must explain that for every meaningful code, schema, API, UI, integration, configuration, or process change, the developer/Codex must also update or create the relevant Markdown documentation files under a `/doc` folder.

Create the `/doc` folder if it does not already exist.

Documentation requirements:
For each change, Codex must decide which documentation files are required and keep them updated.

At minimum, documentation should cover:

1. Architecture
- Application structure
- Key modules/components affected
- Data flow
- Server/client boundaries
- External integrations
- Important technical decisions

Suggested file:
`/doc/ARCHITECTURE.md`

2. Database
- Tables added or changed
- Columns added or changed
- Constraints, indexes, uniqueness rules
- Migration SQL
- Data ownership/source of truth
- Any expected backfill or cleanup scripts

Suggested file:
`/doc/DATABASE.md`

3. API
- Internal API routes
- Request and response payloads
- Query parameters
- Authentication/authorization assumptions
- Error handling
- Environment variables required by APIs

Suggested file:
`/doc/API.md`

4. Environment and deployment
- Required environment variables
- Vercel configuration
- Neon database targeting
- Branch/environment assumptions
- Deployment notes
- Feature flags

Suggested file:
`/doc/ENVIRONMENT.md`

5. UI and user flows
- Pages changed
- User journey
- Filters, buttons, tables, forms, and interactions
- Loading/error/empty states
- Permissions or role restrictions

Suggested file:
`/doc/UI_FLOWS.md`

6. Integrations
- External systems involved, such as BigCommerce, Infor CPQ, CSI, NetSuite, Azure, Vercel Blob, or other services
- Endpoint details
- Payload shape
- Retry/error handling
- Rate limit or batching assumptions
- Mapping rules

Suggested file:
`/doc/INTEGRATIONS.md`

7. Processes and operational runbooks
- Manual admin steps
- Import/export processes
- Cron jobs
- Backfills
- Troubleshooting
- Known limitations

Suggested file:
`/doc/PROCESS.md`

8. Changelog
- Every meaningful change must add a short dated entry
- Include what changed, why it changed, and what files/features were affected

Suggested file:
`/doc/CHANGELOG.md`

Important documentation rules:
- Do not create useless documentation. Only create/update files that are relevant to the change.
- However, never skip documentation for a meaningful functional, data, integration, API, UI, or deployment change.
- Documentation must be accurate to the code actually implemented. Do not invent behaviour.
- If existing documentation contradicts the code, update the documentation to match the code.
- If a change introduces uncertainty or a follow-up task, document it clearly under a "Known limitations" or "Follow-up required" section.
- Keep documentation concise but complete.
- Prefer practical examples, SQL snippets, payload examples, and file paths where useful.
- Use relative links between README.md and `/doc/*.md` files.
- Keep README.md as the entry point and `/doc` as the detailed documentation area.

README.md requirements:
In README.md, add:
1. A clear documentation policy section.
2. A table listing the documentation files under `/doc`, their purpose, and when to update them.
3. A mandatory checklist that Codex/developers must follow before finishing any change.

The checklist should include:
- I read README.md before making the change.
- I identified whether the change affects architecture, database, API, UI, integration, environment, deployment, or process documentation.
- I updated or created the relevant `/doc/*.md` files.
- I added or updated examples where needed.
- I added a dated changelog entry if the change is meaningful.
- I verified the documentation matches the implemented code.
- I listed any known limitations or follow-up work.

Also add a short instruction for future Codex prompts:
When a prompt starts with "Read the README to document any change you will do in the request", Codex must treat the README documentation standards as mandatory acceptance criteria for the task.

Files to create or update:
- `README.md`
- `/doc/ARCHITECTURE.md`
- `/doc/DATABASE.md`
- `/doc/API.md`
- `/doc/ENVIRONMENT.md`
- `/doc/UI_FLOWS.md`
- `/doc/INTEGRATIONS.md`
- `/doc/PROCESS.md`
- `/doc/CHANGELOG.md`

For the initial `/doc/*.md` files:
- Create them if they do not already exist.
- Add a clear title, purpose, and placeholder sections.
- Do not invent detailed content that is not known yet.
- Where content is unknown, write "To be documented when this area is changed."
- Add links back to the README.md.

Acceptance criteria:
- README.md clearly explains the documentation policy.
- `/doc` folder exists.
- The documentation file structure is created.
- Each documentation file has a clear purpose and useful starter structure.
- Future Codex work has an explicit checklist to follow.
- No existing documentation is deleted unless it is duplicated and safely merged.
- The final response must include a concise summary of changed files and any assumptions made.
