# System Architecture — Liquid Democracy Auroville

> Last updated: 2026-04-01
> Branch: modulare-version
> Status: STEP 1 complete (Analysis)

---

## 1. Current System Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, RSC) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (Email OTP + Google OAuth) |
| Styling | Tailwind CSS + Radix UI |
| Hosting | Vercel |
| Forms | React Hook Form (partially used) |
| Validation | Zod (available, partially used) |

### What Exists

#### Database Entities
| Entity | Table | Status |
|--------|-------|--------|
| User | `member` | ✅ Complete |
| Unit | `unit` | ✅ Complete |
| Area | `area` | ✅ Complete |
| Policy | `policy` | ✅ Complete (phase durations, quorum) |
| Topic/Issue | `issue` | ✅ Complete |
| Proposal | `initiative` | ✅ Complete |
| Vote | `vote` | ✅ Complete |
| Comment | `opinion` | ✅ Complete |
| Supporter | `supporter` | ✅ Complete |
| Delegation | `delegation` | ✅ Complete (4-scope: global/unit/area/issue) |

#### Features
| Feature | Location | Status |
|---------|----------|--------|
| Auth (email OTP + Google) | `app/auth/` | ✅ Working |
| Proposal creation | `app/proposals/new/` | ✅ Working |
| Proposal lifecycle phases | `issue.status` enum | ✅ DB-level |
| Phase auto-transition | `app/api/admin/transition/` | ✅ Cron-triggered |
| Approval voting | `lib/voting/approval.ts` | ✅ Working |
| Schulze method | `lib/voting/schulze.ts` | ⚠️ Implemented, unused |
| Delegation (4-scope) | `lib/delegation/resolve.ts` | ✅ Working |
| Admin CRUD | `app/admin/` | ✅ Working |
| User approval workflow | `app/admin/users/` | ✅ Working |

#### Lib Abstractions
```
lib/
├── types.ts          — all TypeScript interfaces (centralized)
├── utils.ts          — formatting helpers (statusLabel, statusColor, cn)
├── supabase/
│   ├── server.ts     — SSR Supabase client
│   ├── browser.ts    — browser Supabase client
│   └── admin.ts      — service role client
├── voting/
│   ├── approval.ts   — countVotes()
│   └── schulze.ts    — Schulze method (unused)
└── delegation/
    └── resolve.ts    — resolveVote(), cycle detection
```

### What Is Missing

| Gap | Impact |
|-----|--------|
| No Process Engine | Phase lifecycle is hardcoded in transition API + DB enum |
| No Module System | Features cannot be toggled on/off |
| No governance mode config | Versions 1/2/3 require code changes |
| No query abstraction layer | Table names & FK paths scattered across components |
| No centralized route/auth config | Protected routes hardcoded in middleware |
| No form abstraction | Auth-check + loading + error state repeated in every form |
| No configurable flow | Phase order, durations, quorum all require DB/code changes |

### Tight Coupling Map

```
middleware.ts
  └── hardcodes: ['/proposals/new', '/profile', '/delegation']

api/admin/transition/route.ts
  └── hardcodes: PHASE_ORDER = ['admission','discussion','verification','voting','closed']
  └── hardcodes: phase → policy field mapping

DelegationManager.tsx + delegation/resolve.ts
  └── both manually map: scope → { unit_id | area_id | issue_id }

ProposalCard.tsx + proposals/[id]/page.tsx
  └── duplicate: statusVariants object

multiple components
  └── duplicate: member?.display_name ?? member?.email
  └── duplicate: createClient() + getUser() + loading/error pattern
```

---

## 2. Target Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Next.js)                    │
│         pages / components / forms / layout             │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Module Layer                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Discussion│ │ Proposal │ │  Voting  │ │Delegation│  │
│  │  Module  │ │  Module  │ │  Module  │ │  Module  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Process Engine                         │
│         phases / transitions / allowed actions          │
│              configurable per governance mode           │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Core Data Layer                        │
│   User · Issue · Initiative · Vote · Delegation · …    │
│        (clean, no feature-specific logic)              │
└─────────────────────────────────────────────────────────┘
```

### Core Data Layer (target)
- Entities remain in Supabase (already clean)
- `lib/types.ts` as canonical type registry
- Add: thin repository functions per entity (`lib/data/issues.ts`, etc.)
- Remove: feature logic from types

### Module Layer (target)
Each module lives in `lib/modules/<name>/`:
```
lib/modules/
├── voting/
│   ├── index.ts       — public interface
│   ├── approval.ts    — (move from lib/voting/)
│   └── schulze.ts     — (move from lib/voting/)
├── delegation/
│   ├── index.ts
│   └── resolve.ts     — (move from lib/delegation/)
├── discussion/
│   └── index.ts       — opinion/comment logic
└── proposal/
    └── index.ts       — initiative creation logic
```

### Process Engine (target)
```typescript
// lib/process/types.ts
type Phase = 'admission' | 'discussion' | 'verification' | 'voting' | 'closed'

type ProcessConfig = {
  phases: Phase[]
  transitions: Record<Phase, TransitionRule>
  allowedActions: Record<Phase, Action[]>
}

type GovernanceMode = 'v1' | 'v2' | 'v3'

const GOVERNANCE_CONFIGS: Record<GovernanceMode, ProcessConfig> = { ... }
```

---

## 3. Refactoring Plan

### Step 1 — Analysis ✅
- Scan full codebase
- Document entities, features, coupling, gaps
- Create this document

### Step 2 — Fix DRY Violations (Safe)
**Goal:** Eliminate duplicate code without changing behavior.

Changes:
1. Extract `getMemberDisplayName(member)` helper → `lib/utils.ts`
2. Remove duplicate `statusVariants` from `ProposalCard.tsx` + `proposals/[id]/page.tsx` → use only `lib/utils.ts`
3. Centralize protected routes config → `lib/config/routes.ts`

Risk: Very low. Pure refactoring, no logic changes.

### Step 3 — Introduce Process Engine (Minimal)
**Goal:** Replace hardcoded `PHASE_ORDER` with a configurable `ProcessConfig`.

Changes:
1. Create `lib/process/config.ts` with `ProcessConfig` type + `V1_CONFIG`
2. Refactor `api/admin/transition/route.ts` to read from `V1_CONFIG`
3. Add `lib/process/engine.ts` with `getNextPhase()`, `getAllowedActions()`

Risk: Low. Only touches transition API logic, not DB schema.

### Step 4 — Module Boundaries (Soft Separation)
**Goal:** Move `lib/voting/` and `lib/delegation/` under `lib/modules/`.

Changes:
1. Create `lib/modules/voting/index.ts` — re-export from existing files
2. Create `lib/modules/delegation/index.ts` — re-export from existing files
3. Update imports across codebase

Risk: Very low. Structural change only, re-exports preserve all interfaces.

### Step 5 — Data Layer (Repository Pattern)
**Goal:** Extract Supabase queries into dedicated files.

Changes:
1. Create `lib/data/issues.ts` — `getIssues()`, `getIssueById()`, etc.
2. Create `lib/data/initiatives.ts`
3. Move inline Supabase queries from pages into these files
4. Pages become thin wrappers

Risk: Medium. Requires careful import updates in all page files.

### Step 6 — Governance Mode Config
**Goal:** Enable Version 1 as first working configurable mode.

Changes:
1. Create `lib/process/modes/v1.ts` — V1 process config
2. `GOVERNANCE_MODE` env variable → selects active config
3. Process Engine reads from selected config
4. Test: switch mode without code changes

Risk: Low if Steps 3–5 are complete.

---

## 4. Progress Tracking

| Step | Description | Status |
|------|-------------|--------|
| 1 | Full codebase analysis | ✅ Complete |
| 2 | Fix DRY violations | ⏳ Next |
| 3 | Process Engine (minimal) | ⏳ Pending |
| 4 | Module boundaries (soft) | ⏳ Pending |
| 5 | Data layer / repository pattern | ⏳ Pending |
| 6 | Governance mode config (V1) | ⏳ Pending |
| 7 | Governance mode V2 | ⏳ Pending |
| 8 | Governance mode V3 | ⏳ Pending |

---

## 5. Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `lib/types.ts` as single type registry | Already clean, no benefit in splitting |
| Start Process Engine before Module split | Transition logic is highest coupling risk |
| Re-export pattern for module boundaries | Zero-risk structural refactoring |
| Repository pattern for data layer | Decouples pages from Supabase query details |
| `GOVERNANCE_MODE` env var | Simple, deploy-time config without code changes |
