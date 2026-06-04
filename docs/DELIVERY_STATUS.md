# Delivery Status

Last updated: June 4, 2026

This checklist is the source of truth for the remaining assessment delivery work. Update it whenever implementation, verification, deployment, or submission status changes.

## Completed

- Next.js application scaffolded with TypeScript and App Router
- Rich-text document creation, editing, rename, autosave, reopen, and deletion
- `.txt` and `.md` import with 1 MB validation
- Seeded demo-user switching
- Owner/shared document views
- Share and revoke access flows
- Server-side authorization and HTML sanitization
- Supabase schema applied to the hosted project
- Three seeded users verified through Supabase REST
- Assessment README, architecture note, AI workflow note, and submission checklist
- Lint and TypeScript checks passing
- 7 automated tests passing
- Production build passing
- Persistent navigation progress and route-level loading feedback
- Optimized document opening and clearer database connectivity errors
- Imported Markdown document read endpoint verified against hosted Supabase with HTTP 200
- Added an explicit document-title label and rename hint in the editor

## Pending Before Submission

- Run the full manual acceptance walkthrough:
  - Create and format a document
  - Refresh and confirm persistence
  - Import one `.txt` and one `.md` file
  - Share a document and verify it as another user
  - Confirm an unrelated user is denied direct access
  - Confirm delete and revoke behavior
- Deploy the application to Vercel
- Verify the complete workflow against the live deployment
- Add the live URL to `README.md` and `SUBMISSION.md`
- Record the 3-5 minute walkthrough video
- Add the video URL to `SUBMISSION.md` and `walkthrough-video-url.txt`
- Capture screenshots or a short demo GIF

## Documentation Flow

Whenever implementation or delivery status changes:

1. Update this checklist.
2. Update behavior and setup details in `README.md`.
3. Update architecture or tradeoff decisions in `docs/ARCHITECTURE.md`.
4. Update AI-assisted decisions and verification evidence in `docs/AI_WORKFLOW.md`.
5. Keep `SUBMISSION.md` aligned with what reviewers can actually access and test.
