# Module Plan — Liquid Democracy Auroville

> Last updated: 2026-04-01
> Source: modular_platform_modules.pdf (96 modules)
> Branch: modulare-version

---

## Legend

| Symbol | Bedeutung |
|--------|-----------|
| ✅ | Bereits implementiert |
| 🔄 | Teilweise vorhanden, braucht Erweiterung |
| ⏳ | Geplant, noch nicht gebaut |
| 🔬 | Komplex / Research required |
| ❌ | Bewusst ausgeschlossen / out of scope |

---

## Modul-Gruppen

### A — User & Identity

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 1 | User Accounts | Create, authenticate and manage user accounts | ✅ | `app/auth/`, Supabase Auth, `member` table |
| 2 | User Profiles | Store bio, interests and personal metadata | 🔄 | `app/profile/`, `member.display_name` — bio/interests fehlen |
| 3 | Verification | Optional identity verification system | ⏳ | — |
| 4 | Reputation System | Trust score based on activity and participation | ⏳ | — |
| 5 | Activity Tracking | Track user interactions and contributions | ⏳ | — |
| 6 | Roles & Permissions | Admin, moderator, and user role management | 🔄 | `member.is_admin`, `member.is_approved` — Moderator-Rolle fehlt |

---

### B — Discussion

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 7 | Thread System | Create structured discussions around topics | 🔄 | `issue` + `initiative` bilden Threads — kein echtes Thread-Nesting |
| 8 | Comments & Replies | Allow nested replies within discussions | 🔄 | `opinion` table vorhanden — kein Nesting (kein `parent_id`) |
| 9 | Nested Discussions | Hierarchical conversation structure | ⏳ | `opinion` braucht `parent_id` |
| 10 | Pro/Contra Arguments | Structure arguments into support/opposition | ⏳ | — |
| 11 | Questions Tagging | Mark uncertainties or open questions | ⏳ | — |
| 12 | Argument Map | Visual mapping of arguments (Kialo-style) | 🔬 | — |
| 13 | Post Voting | Upvote/downvote contributions | ⏳ | — |
| 14 | Referencing | Quote and link arguments | ⏳ | — |
| 15 | Intention Display | Show intent behind comments | ⏳ | — |

---

### C — Proposals

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 16 | Proposal Creation | Create structured proposals | ✅ | `app/proposals/new/`, `initiative` table |
| 17 | Proposal Editing | Edit proposals collaboratively | ⏳ | Kein Edit-Flow vorhanden |
| 18 | Versioning | Track proposal history | ⏳ | — |
| 19 | Proposal Feedback | Comment and give structured feedback | 🔄 | `opinion` table — nicht strukturiert |
| 20 | Forking | Duplicate and modify proposals | ⏳ | — |
| 21 | Merging | Combine proposals | ⏳ | — |
| 22 | Diff View | Compare changes | ⏳ | — |
| 23 | Proposal Status | Draft, active, voted states | 🔄 | `issue.status` enum (admission/discussion/verification/voting/closed) — kein "draft" |
| 24 | Structured Proposals | Include costs, subtopics, sub-discussions | ⏳ | Nur freier `content` Text |

---

### D — Voting

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 25 | Basic Voting | Yes/No/Abstain/Strong No | 🔄 | `vote_value` enum: approve/oppose/abstain — kein "Strong No" |
| 26 | Multiple Choice Voting | Select multiple options | 🔄 | Approval Voting bereits implementiert (`lib/voting/approval.ts`) |
| 27 | Ranking Voting | Rank preferences | 🔄 | Schulze-Methode implementiert aber ungenutzt (`lib/voting/schulze.ts`) |
| 28 | Quorum System | Minimum participation thresholds | 🔄 | `policy.quorum` vorhanden — Enforcement unklar |
| 29 | Timed Voting | Voting deadlines | ✅ | `policy.voting_days`, `issue.voting_at` |
| 30 | Results Display | Show voting results | ✅ | `VoteBar.tsx`, `countVotes()` in `approval.ts` |
| 31 | Continuous Voting | Vote during discussion | ⏳ | Aktuell nur in Voting-Phase |
| 32 | Scale Voting | 1–10 scoring system | ⏳ | — |
| 33 | Alignment Meter | Visual consensus indicator | ⏳ | — |
| 34 | Low Resistance Indicator | Highlight minimal opposition solutions | ⏳ | — |

---

### E — Delegation

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 35 | Delegation | Transfer voting power | ✅ | `delegation` table, `app/delegation/`, `lib/delegation/resolve.ts` |
| 36 | Thematic Delegation | Delegate by topic | ✅ | `delegation.unit_id`, `delegation.area_id`, `delegation.issue_id` |
| 37 | Delegation Network | Visualize delegation relationships | ⏳ | Keine Visualisierung vorhanden |
| 38 | Revoke Delegation | Withdraw delegation | ✅ | `DELETE /api/delegate` |
| 39 | Delegation Limits | Restrict delegation chains | ⏳ | Cycle detection vorhanden, aber keine Chain-Limits |
| 40 | Network Views | Upward/downward delegation views | ⏳ | — |
| 41 | Vote Weighting | Weight votes via reputation or delegation | 🔄 | Delegation-Weight in `resolve.ts` — Reputation-Weight fehlt |
| 42 | Argument Weighting | Weight arguments, not just votes | ⏳ | — |

---

### F — AI Features

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 43 | AI Summaries | Summarize discussions | ⏳ | — |
| 44 | Argument Extraction | Identify key points | ⏳ | — |
| 45 | Pro/Con Detection | Classify arguments | ⏳ | — |
| 46 | Gap Detection | Identify missing perspectives | ⏳ | — |
| 47 | AI Proposal Improvement | Suggest improvements | ⏳ | — |
| 48 | AI Moderation | Auto-moderate content | ⏳ | — |
| 49 | Opinion Clustering | Group similar views | 🔬 | — |
| 50 | Consensus Suggestions | Generate compromise proposals | 🔬 | — |
| 51 | Argument Journey Mode | Guide users through discussion | 🔬 | — |
| 52 | Consensus Heatmap | Visualize agreement | ⏳ | — |
| 53 | Perspective Switch | Show alternative viewpoints | ⏳ | — |
| 54 | Auto Debater | AI generates counterarguments | 🔬 | — |
| 55 | Truth Layer | Fact validation layer | 🔬 | — |
| 56 | Argument Merger | Merge similar arguments | ⏳ | — |
| 57 | Bias Breaker Mode | Challenge user bias | 🔬 | — |
| 58 | Decision Readiness | Show readiness level | ⏳ | — |
| 59 | Guided Exploration | Assist user navigation | ⏳ | — |
| 60 | Fact Checking | Validate claims | 🔬 | — |

---

### G — Organization & Governance

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 61 | Categories | Organize topics into spaces | ✅ | `unit` + `area` tables |
| 62 | Tagging System | Flexible labeling | ⏳ | — |
| 63 | Governance Rules | Define system rules | 🔄 | `policy` table (Zeitregeln) — keine allgemeinen Governance-Regeln |
| 64 | Voting Rules per Group | Custom voting settings | 🔄 | `policy` pro Issue — nicht per Group |
| 65 | Access Control | Permissions system | 🔄 | RLS-Policies + is_admin/is_approved — kein granulares ACL |
| 66 | Posting Rights | Control who can create topics | 🔄 | Nur approved Members — keine differenzierte Steuerung |
| 67 | Custom Governance | Flexible governance configurations | ⏳ | Ziel der Governance-Mode-Configs (V1/V2/V3) |

---

### H — Process & Lifecycle

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 68 | Phase System | Discussion → voting flow | ✅ | `issue_status` enum, `api/admin/transition/` |
| 69 | Iteration Loops | Feedback cycles | ⏳ | — |
| 70 | Deadlines | Time constraints | ✅ | `policy.*_days` Felder |
| 71 | Voting Cycles | Scheduled votes | 🔄 | Cron-Trigger vorhanden, kein UI |
| 72 | Review Phase | Final review before voting | 🔄 | `verification` Phase existiert |
| 73 | Revision Rounds | Iterative improvements | ⏳ | — |

---

### I — Moderation

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 74 | Community Moderation | User-driven moderation | ⏳ | — |
| 75 | Reporting System | Report inappropriate content | ⏳ | — |
| 76 | Content Flagging | Mark problematic content | ⏳ | — |
| 77 | Moderation Tools | Edit/delete tools | 🔄 | Admin kann Users verwalten — kein Content-Moderation-Tool |
| 78 | AI Moderation (Advanced) | Automated moderation layer | ⏳ | — |

---

### J — Analytics & Transparency

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 79 | Participation Analytics | Track engagement | ⏳ | — |
| 80 | Voting Analytics | Analyze results | 🔄 | `VoteBar.tsx` zeigt Basis-Ergebnisse |
| 81 | Argument Quality Score | Evaluate contributions | ⏳ | — |
| 82 | User Activity Metrics | Track behavior | ⏳ | — |
| 83 | Transparency Dashboard | Public system insights | ⏳ | — |

---

### K — Notifications

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 84 | Notifications | Alerts system | ⏳ | — |
| 85 | User Notification Settings | Control notifications | ⏳ | — |
| 86 | Admin Notifications | Admin alerts | ⏳ | — |
| 87 | Mentions | @user tagging | ⏳ | — |
| 88 | Reminders | Deadline reminders | ⏳ | — |

---

### L — Infrastructure & Platform

| # | Modul | Beschreibung | Status | Codebase-Mapping |
|---|-------|-------------|--------|-----------------|
| 89 | Time Module | Automated scheduling | 🔄 | Cron via `/api/admin/transition` — kein vollständiger Scheduler |
| 90 | Authentication | Secure login | ✅ | Supabase Auth, Email OTP + Google OAuth |
| 91 | Privacy Settings | User data control | ⏳ | — |
| 92 | Anonymity | Optional anonymity | ⏳ | — |
| 93 | Anti-Bot System | Prevent abuse | ⏳ | — |
| 94 | Plugin System | Enable/disable modules | ⏳ | Ziel der modularen Architektur |
| 95 | Auto Translation | Translate content | ⏳ | — |
| 96 | External Integration | Import topics from other platforms | ⏳ | — |

---

## Zusammenfassung

| Status | Anzahl |
|--------|--------|
| ✅ Vollständig implementiert | 10 |
| 🔄 Teilweise vorhanden | 20 |
| ⏳ Noch zu bauen | 57 |
| 🔬 Komplex / Research needed | 9 |
| **Total** | **96** |

---

## Prioritäten für modulare Refaktorierung

### Priorität 1 — Fundament (jetzt, Refactoring-Steps 2–5)
Diese Module existieren bereits, müssen aber in saubere Modul-Grenzen gebracht werden:

- **M-user-accounts** (1) — `lib/modules/auth/`
- **M-proposal** (16, 23) — `lib/modules/proposal/`
- **M-voting-basic** (25, 28, 29, 30) — `lib/modules/voting/`
- **M-delegation** (35, 36, 38, 41) — `lib/modules/delegation/`
- **M-discussion** (7, 8) — `lib/modules/discussion/`
- **M-phase-system** (68, 70, 72) — `lib/process/`

### Priorität 2 — Erweiterungen (nach Refactoring)
Vorhandene Module ausbauen:

- **M-user-profiles** (2) — bio, interests zu `member` hinzufügen
- **M-roles** (6) — Moderator-Rolle
- **M-nested-discussions** (9) — `parent_id` zu `opinion`
- **M-ranking-voting** (27) — Schulze aktivieren
- **M-delegation-network** (37) — Visualisierung

### Priorität 3 — Neue Features (Version 2/3)
Komplett neue Module:

- **M-ai** (43–60) — AI-Feature-Block
- **M-analytics** (79–83)
- **M-notifications** (84–88)
- **M-pro-contra** (10, 12) — Argument Map
- **M-versioning** (18, 22) — Proposal History

---

## Modul-Interface Standard

Jedes Modul in `lib/modules/<name>/` soll folgende Struktur haben:

```
lib/modules/<name>/
├── index.ts        — public interface (was exportiert wird)
├── types.ts        — module-spezifische Types
├── actions.ts      — server actions / mutations
├── queries.ts      — Datenbankabfragen
└── README.md       — kurze Beschreibung
```

Modul ist aktivierbar/deaktivierbar via `lib/config/modules.ts`:

```typescript
export const ENABLED_MODULES = {
  voting: true,
  delegation: true,
  ai_summaries: false,
  argument_map: false,
  // ...
}
```
