# AI Blog v1 Plan

## Summary
Build a Next.js 14 (App Router) full-stack app with a public blog and authenticated admin area. Admin can draft posts from bullet points, generate content via configurable AI providers (OpenAI/Azure/Claude), edit, and publish. Use Postgres on Neon with Prisma. CI via GitHub Actions; Vercel handles deploys. Codex handles commits, pushes, and PR creation.

## Key Changes
1. App structure
   - Public site routes for blog index and post detail.
   - Admin routes with protected layout and CRUD for posts.
2. Data model (Prisma + Postgres)
   - User (admin), Session for NextAuth.
   - Post with title, slug, status, summary, body, cover image URL, tags, timestamps.
   - IdeaDraft with bullet points + notes used for generation (linked to Post).
   - AIProviderConfig for provider type + encrypted API key + optional Azure deployment settings.
3. Auth
   - NextAuth.js Credentials provider with admin users stored in DB.
   - Admin-only access middleware for /admin/*.
4. AI generation
   - Provider abstraction with adapters for OpenAI, Azure OpenAI, Claude.
   - Admin selects provider per draft and generates a blog post from bullet points.
5. Admin UX
   - Draft form: bullet points + core thinking.
   - Generate action writes AI output into editable editor.
   - Publish toggle sets post status to published.
6. CI/CD
   - GitHub Actions workflow for lint, typecheck, and tests.
   - Vercel deployment via GitHub integration (no CLI deploy in CI).
7. Git workflow automation
   - Codex creates feature branches per task, commits with conventional commits, pushes to GitHub.
   - Codex installs GitHub CLI (gh) via apt and uses it to open PRs to main.

## Test Plan
1. Auth: admin login success/failure, protected route redirect.
2. CRUD: create/edit/publish posts; slug uniqueness; draft -> publish flow.
3. AI generation: happy path for each provider adapter with mocked API.
4. Public site: published posts visible, drafts hidden.

## Assumptions
1. Use Postgres on Neon and Prisma as ORM.
2. UI stack: Next.js + shadcn/ui + Tailwind.
3. Linear integration is manual for v1 (no API automation).
4. Provider API keys stored encrypted in DB (encryption strategy decided during implementation).
5. gh will be installed locally and authenticated for PR creation.
