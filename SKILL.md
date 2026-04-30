# AI Blog Pipeline Skill

This document describes the end-to-end pipeline to create, configure, deploy, and operate an AI-powered blog system. It is designed for other AI agents to reproduce the setup with minimal human input.

## Scope

- Next.js (App Router) app
- Prisma + Neon Postgres
- NextAuth v5 (Credentials) with JWT + refresh rotation
- Admin UI for drafts, posts, providers
- AI generation (OpenAI / Azure OpenAI / Anthropic)
- CI with GitHub Actions
- Deploy with Vercel

## Required Inputs

- GitHub repo name and owner
- Vercel team slug and project name
- Neon Postgres connection string
- Admin user credentials (email + password + optional name)
- AUTH_URL (Vercel domain)
- Secrets (AUTH_SECRET, ENCRYPTION_KEY)

## Human vs AI Responsibilities

### Human-required (detailed)

These steps involve account permissions and token creation.

#### 1) GitHub PAT (Personal Access Token)

A PAT is a token that allows API access to GitHub.

**Steps:**

1. Open GitHub → `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`.
2. Click `Generate new token (classic)`.
3. Name it (e.g., `ai-blog-automation`) and set an expiration (7–30 days).
4. Scopes to check:
   - `repo`
   - `workflow` (optional but recommended if CI needs reruns)
   - `read:org` (only if the repo is in an org)
5. Click `Generate token` and copy it.

Send this PAT to the AI. Revoke it after setup.

#### 2) Vercel API token

**Steps:**

1. Open `https://vercel.com/account/tokens`.
2. Click `Create Token`.
3. Name it (e.g., `ai-blog-automation`) and set an expiration.
4. Copy the token.

Send this token to the AI. Revoke it after setup.

#### 3) Neon Postgres database

**Option A: Neon via Vercel integration**

1. In Vercel, open your project.
2. Go to `Integrations` → `Neon Postgres`.
3. Install and follow the prompts.
4. Copy the `DATABASE_URL` from Vercel environment settings.

**Option B: Neon direct**

1. Create a Neon project in Neon console.
2. Copy connection string from `Connect`.
3. Provide the connection string as `DATABASE_URL` to the AI.

#### 4) Admin credentials

Provide admin email, password, and optional name to the AI.

#### 5) Provider API keys (optional)

Provide one or more:

- OpenAI API key
- Azure OpenAI API key + endpoint + deployment + version
- Anthropic API key

### AI-capable (preferred)

With GitHub + Vercel tokens, AI can:

- Create the repo, push code
- Configure Vercel project settings
- Set env vars in Vercel
- Trigger deploys
- Diagnose CI failures and fix
- Run migrations (via Vercel build)
- Validate public and admin endpoints via HTTP

## Pipeline Steps

### 1) Repository bootstrap (AI)

- Initialize repo with:
  - Next.js app
  - Prisma schema
  - Auth and admin UI
  - CI workflow
  - .env.example
- Commit and push to GitHub `main`.

### 2) Secrets and local .env (AI)

Generate:

- `AUTH_SECRET` (32 bytes base64)
- `ENCRYPTION_KEY` (32 bytes base64)

Write to `.env` locally and to `.env.example`:

```
DATABASE_URL=...
AUTH_URL=https://<project>.vercel.app
AUTH_SECRET=...
AUTH_TRUST_HOST=true
ENCRYPTION_KEY=...
```

### 3) Database (Human/AI)

- Human provides Neon URL or lets AI request it.
- AI runs Prisma migration locally (optional) and relies on Vercel build to run `prisma migrate deploy`.

### 4) GitHub Actions CI (AI)

Workflow must include:

- `npm ci`
- `npm run prisma:generate`
- `npm run lint`
- `npm run typecheck`
- `npm run test`

Set `test` to pass when no tests:

```
vitest run --passWithNoTests
```

### 5) Vercel configuration (AI)

Using Vercel token:

- Set env vars for production/preview/development
- Project settings:
  - Framework: `nextjs`
  - Build: `npm run vercel-build`
  - Output: `.next`

### 6) Deploy (AI)

Trigger Vercel deployment via API:

- `target: production`
- `gitSource` with repo + repoId + ref

### 7) Post-deploy validation (AI)

- Confirm:
  - `/` and `/blog` return 200
  - `/sign-in` returns 200
  - `/admin` redirects when unauthenticated
  - Auth flow works with credentials
  - Admin routes return 200 when authenticated
  - `/api/generate` returns 401 without auth

### 8) Provider setup (Human or AI if keys provided)

- Add provider in `/admin/providers`
- Use conditional Azure fields only when Azure is chosen

### 9) Content flow (AI if provider key present)

- Create draft
- Generate content
- Publish
- Verify `/blog` and `/blog/[slug]`

## Operational Notes

- NextAuth v5 uses JWT sessions; refresh tokens stored in DB with rotation.
- Encryption uses AES-256-GCM with `ENCRYPTION_KEY`.
- Sign-in route is `/sign-in` to avoid admin middleware loops.
- Admin routes protected by middleware.

## Recommended Automation

If AI has tokens, it should:

1. Create repo and push code.
2. Set Vercel env vars and project settings.
3. Trigger deploy.
4. Verify endpoints.
5. Report status with URLs and steps left for human.

## Token Safety

- Tokens should be short-lived.
- Revoke after setup.
