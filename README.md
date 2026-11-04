# Liquid Democracy Auroville

Participatory governance platform for the Auroville community. Members discuss
topics, write and vote on proposals, delegate their vote (liquid democracy) and
plan the implementation of accepted proposals.

Live: https://liquid-decocracy-simulation-495h.vercel.app

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres, Auth, RLS)
· Groq (LLM) · Vercel (hosting + cron)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Groq keys
npm run dev                  # http://localhost:3000
```

| Script              | What it does                    |
|---------------------|---------------------------------|
| `npm run dev`       | Dev server                      |
| `npm run build`     | Production build                |
| `npm run typecheck` | TypeScript check                |
| `npm run lint`      | ESLint                          |
| `npm run check`     | Typecheck + lint (run before pushing) |

## Two UIs, one backend

- **Classic** (`/topics/...`): full-featured desktop UI.
- **Playful** (`/playful/...`): simplified, mobile-first UI.

Both read and write the same tables and API routes.

## Project structure

```
app/                  Routes (pages + API)
  api/                Route handlers, grouped by domain:
    ai/               AI features (summaries, analysis, story mode, …)
    vote/             All voting endpoints (use lib/voting/castVote)
    admin/ cron/      Scheduled + admin-only jobs (Vercel Cron, see vercel.json)
    play/             AI chat / data endpoints for the playful UI
  topics/             Classic topic pages (discussion → proposals → plan)
  playful/            Playful topic pages
  admin/              Admin console
components/           React components, grouped by feature
  ui/                 Generic, feature-independent building blocks
lib/                  Shared logic ("tools") — no React here
  api/handler.ts      apiRoute(), requireUser(), requireAdmin(), requireCronSecret(), HttpError
  ai/                 generateText() (single AI entry point), JSON parsing, shared prompt context
  voting/             castVote() with delegation, approval + Schulze counting
  delegation/         Transitive proxy-vote resolution
  platform/           Active platform (single-platform mode: Auroville)
  modules/            Feature-module flags (admin + per-user)
  process/            Phase engine for the issue lifecycle
  supabase/           Supabase clients: server (RLS), browser, admin (service role)
  types/              Shared TypeScript types
supabase/migrations/  Database schema history (apply in order)
docs/                 Planning documents
```

## Conventions

- **API routes** are thin: wrap them in `apiRoute`, authenticate with
  `requireUser()`/`requireAdmin()`, throw `badRequest()`/`forbidden()` etc. for
  errors, and return a plain object (sent as JSON).
- **AI calls** always go through `generateText()` in `lib/ai/client.ts` — never
  import the provider SDK directly. Use `parseJsonObject()` for JSON answers.
- **Votes** always go through `castVote()` so delegated (proxy) votes stay in sync.
- **Service-role client** (`lib/supabase/admin.ts`) only where there is no user
  session (cron, webhooks) or after an explicit admin check.
- Run `npm run check` before pushing.

## Feature modules

Most features can be switched on/off in **Admin → Modules** (table `module`).
Some modules can additionally be toggled per user. Check flags server-side with
`getEffectiveModules(userId)`.
