# Ajaia Docs

Ajaia Docs is a lightweight collaborative document editor built for the Ajaia AI-Native Full Stack Developer assessment. It provides a focused end-to-end workflow for creating, formatting, importing, persisting, and sharing documents.

## Reviewer Quick Start

1. Open the deployed application: **Add Vercel URL before submission**
2. Use the **Viewing as** selector to act as Maya, Noah, or Priya.
3. Create and format a document.
4. Share it with another demo user.
5. Switch users and open it under **Shared with me**.

Authentication is intentionally simulated with seeded users to keep the assessment focused on product workflow and access-control behavior.

## Features

- Create, clearly discover, rename, edit, autosave, reopen, and delete owned documents
- Rich text: bold, italic, underline, headings, bullets, and numbered lists
- Import `.txt` and `.md` files up to 1 MB
- Share and revoke edit access
- Separate **Owned by me** and **Shared with me** views
- Server-side authorization on every protected document operation
- Sanitized persisted HTML and clear loading, validation, and error states
- Persistent navigation progress and route-level loading feedback

## Local Setup

Requirements: Node.js 20+ and a Supabase project.

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Copy `.env.example` to `.env.local`.
3. Add the Supabase project URL and service-role key. Never expose the service-role key through a `NEXT_PUBLIC_` variable.
4. Install and start:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deployment

Import this directory into Vercel, add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and deploy. The database schema must be applied before reviewers use the application.

## Current Delivery Status

- Supabase schema applied and verified against the configured hosted project
- Three seeded demo users verified through the Supabase REST API
- Lint, typecheck, 7 automated tests, and production build passing
- Remaining: manual browser acceptance walkthrough, Vercel deployment, and walkthrough video

See [docs/DELIVERY_STATUS.md](docs/DELIVERY_STATUS.md) for the maintained verification checklist.

## Scope Decisions

Real-time co-editing, comments, version history, `.docx` import, and production authentication are intentionally excluded. The implemented slice prioritizes a reliable document workflow, working sharing rules, good usability, and fast reviewer evaluation.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/AI_WORKFLOW.md](docs/AI_WORKFLOW.md) for the engineering decisions behind the implementation.
