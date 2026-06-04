# Ajaia Docs Submission

## Included

- Source code for the Next.js application
- Reproducible Supabase schema and seeded demo users
- Local setup and deployment instructions in `README.md`
- Architecture note in `docs/ARCHITECTURE.md`
- AI workflow note in `docs/AI_WORKFLOW.md`
- Automated access-control and file-import tests
- Walkthrough video URL in `walkthrough-video-url.txt`

## Review Links

- Google Drive link: https://drive.google.com/drive/folders/1OifPFL04NYFbxsVRt84_XoIDHgiDCtXJ?usp=sharing
- Source repository: https://github.com/danilomabulac/ajaia-docs-assessment
- Live product: https://ajaia-docs-assessment.vercel.app/
- Walkthrough video: https://www.loom.com/share/19bf7e1232e64c2296363cc7686e171d

## Demo Users

Use the in-product **Viewing as** selector:

- Maya Chen - `maya@ajaia.demo`
- Noah Williams - `noah@ajaia.demo`
- Priya Shah - `priya@ajaia.demo`

## Working End to End

- Document creation, rename, rich-text editing, autosave, persistence, and deletion
- `.txt` and `.md` import up to 1 MB
- Owner-managed sharing and revocation
- Shared-user editing and clear owned/shared dashboard views
- Server-side access validation, input validation, HTML sanitization, and error states
- Hosted Supabase schema and seeded users verified

## Verification Completed

- `npm run lint`
- `npm run typecheck`
- `npm test` - 7 tests passed
- `npm run build`
- Hosted database schema applied
- Supabase REST API returned the three seeded users
- Public Vercel deployment returned HTTP 200
- Production users API returned all three seeded users
- Full manual acceptance walkthrough completed
- Complete workflow verified against the live deployment
- Public Loom walkthrough video recorded and linked

## Required Before Submission

- No required deliverables remain. Screenshots or a short demo GIF may still be added as optional presentation material.

## Intentionally Deprioritized

- Real-time simultaneous collaboration
- Production authentication
- Comments, version history, `.docx` import, and export

## Next 2-4 Hours

Add optimistic concurrency and version history, replace the demo identity header with Supabase Auth, and add route-level integration tests against an isolated Supabase project.
