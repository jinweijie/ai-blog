# Generic Software Delivery Pipeline Skill

This document describes a reusable end-to-end pipeline to create, configure, deploy, and operate a modern web application with maximum AI involvement. It is intended for other AI agents to reproduce the setup with minimal human input.

## Scope (generic)

- Web app (e.g., Next.js, React, or similar)
- Database with migrations (e.g., Postgres + ORM)
- Authentication (credentials or OAuth)
- Admin UI or internal tooling
- CI with GitHub Actions
- Deploy with Vercel (or similar)

## Required Inputs

- GitHub repo name and owner
- Hosting provider team/organization and project name
- Database connection string
- Base URL for production
- Secrets (auth secret, encryption key)
- Admin user credentials (if applicable)

## Human vs AI Responsibilities

### Human-required (detailed)

These steps involve account permissions and token creation.

#### 1) GitHub PAT (Personal Access Token)

A PAT allows API access to GitHub.

**Steps:**

1. Open GitHub → `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`.
2. Click `Generate new token (classic)`.
3. Name it (e.g., `automation-pipeline`) and set an expiration (7–30 days).
4. Scopes to check:
   - `repo`
   - `workflow` (optional but recommended for CI reruns)
   - `read:org` (only if the repo is in an org)
5. Click `Generate token` and copy it.

Send this PAT to the AI. Revoke it after setup.

#### 2) Hosting provider API token (Vercel example)

**Steps:**

1. Open `https://vercel.com/account/tokens`.
2. Click `Create Token`.
3. Name it (e.g., `automation-pipeline`) and set an expiration.
4. Copy the token.

Send this token to the AI. Revoke it after setup.

#### 3) Database

**Managed via hosting provider integration (preferred)**

1. In your hosting provider UI, open your project.
2. Install the database integration (e.g., Neon, Supabase, PlanetScale).
3. Copy the `DATABASE_URL` from environment settings.

**Direct provider setup**

1. Create a database project in the provider console.
2. Copy the connection string.
3. Provide the connection string as `DATABASE_URL` to the AI.

#### 4) Admin credentials (if applicable)

Provide admin email, password, and optional name to the AI.

#### 5) External API keys (optional)

Provide any API keys required for features (LLM providers, payment, email, etc.).

### AI-capable (preferred)

With GitHub + hosting tokens, AI can:

- Create the repo, push code
- Configure hosting project settings
- Set env vars in hosting
- Trigger deploys
- Diagnose CI failures and fix
- Run migrations during build/deploy
- Validate public and admin endpoints via HTTP

## Pipeline Steps

### 1) Repository bootstrap (AI)

- Initialize repo with:
  - App framework
  - Database schema + migrations
  - Auth + admin UI if needed
  - CI workflow
  - `.env.example`
- Commit and push to GitHub `main`.

### 2) Secrets and local `.env` (AI)

Generate:

- `AUTH_SECRET` (32 bytes base64)
- `ENCRYPTION_KEY` (32 bytes base64)

Write to `.env` locally and `.env.example`:

```
DATABASE_URL=...
AUTH_URL=https://<project>.hosted.app
AUTH_SECRET=...
AUTH_TRUST_HOST=true
ENCRYPTION_KEY=...
```

### 3) Database (Human/AI)

- Human provides database URL or lets AI request it.
- AI runs migrations locally (optional) and relies on build/deploy to run `migrate deploy`.

### 4) GitHub Actions CI (AI)

Workflow should include:

- `npm ci`
- `npm run generate` (ORM client)
- `npm run lint`
- `npm run typecheck`
- `npm run test`

If no tests exist yet, allow pass:

```
vitest run --passWithNoTests
```

### 5) Hosting configuration (AI)

Using hosting token:

- Set env vars for production/preview/development
- Project settings:
  - Framework preset
  - Build command
  - Output directory

### 6) Deploy (AI)

Trigger deployment via provider API:

- `target: production`
- `gitSource` with repo + repoId + ref

### 7) Post-deploy validation (AI)

- Confirm:
  - `/` and primary pages return 200
  - Auth pages return 200
  - Protected routes redirect when unauthenticated
  - Auth flow works with credentials
  - Admin routes return 200 when authenticated

### 8) Feature setup (Human or AI if keys provided)

- Add required API keys or provider configs
- Validate feature-specific flows

## Operational Notes

- Use JWT sessions or DB sessions depending on the app.
- Encrypt secrets at rest using a server-side key.
- Protect admin routes with middleware.

## Recommended Automation

If AI has tokens, it should:

1. Create repo and push code.
2. Set hosting env vars and project settings.
3. Trigger deploy.
4. Verify endpoints.
5. Report status with URLs and steps left for human.

## Token Safety

- Tokens should be short-lived.
- Revoke after setup.
