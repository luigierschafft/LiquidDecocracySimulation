# System Architecture — Liquid Democracy Auroville

> Last updated: 2026-04-02
> Branch: modulare-version
> Status: STEP 1 complete (Analysis) — Plan reoriented to Core Flow

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

---

## 2. Core Platform Flow

Die Plattform folgt diesem Kernprozess (Schritte laufen teilweise parallel):

```
┌─────────────────────────────────────────────────────────────┐
│  1. THEMA ERSTELLEN                                         │
│     Admin (oder Members, konfigurierbar) erstellt ein       │
│     Diskussionsthema mit Titel, Beschreibung, Bereich       │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────▼───────────────┐
         │                               │
┌────────▼──────────┐       ┌────────────▼──────────┐
│  2. DISKUSSION    │       │  3. VORSCHLÄGE         │
│  Members          │       │  Members reichen       │
│  diskutieren das  │◄─────►│  konkrete Vorschläge   │
│  Thema            │       │  zum Thema ein         │
│  (parallel)       │       │  (parallel)            │
└───────────────────┘       └────────────┬──────────┘
                                         │
                             ┌───────────▼──────────┐
                             │  4. VOTING            │
                             │  Members stimmen      │
                             │  über Vorschläge ab   │
                             │  (mit Delegation)     │
                             │                       │
                             │  Abschluss durch:     │
                             │  - Zeit               │
                             │  - Genug Unterstützung│
                             │  - Kein Widerstand    │
                             └───────────┬──────────┘
                                         │
                             ┌───────────▼──────────┐
                             │  5. ANNAHME           │
                             │  Gewählter Vorschlag  │
                             │  wird angenommen und  │
                             │  als Ergebnis         │
                             │  angezeigt            │
                             └───────────┬──────────┘
                                         │
                             ┌───────────▼──────────┐
                             │  6. AUSARBEITUNG      │
                             │  Selektierte Members  │
                             │  erarbeiten Dokument  │
                             │  (Budget, Zeitplan,   │
                             │  Legales, etc.)       │
                             │  Andere können        │
                             │  kommentieren         │
                             └──────────────────────┘
```

---

## 3. Target Architecture

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
│  ┌──────────────────────────────────────────────────┐  │
│  │          Elaboration Module (neu)                │  │
│  └──────────────────────────────────────────────────┘  │
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

---

## 4. Implementierungsplan

### Phase 0 — Fundament-Cleanup (Voraussetzung)
Kleine, risikoarme Refactorings die alle anderen Schritte vereinfachen.

**Änderungen:**
1. `getMemberDisplayName(member)` → `lib/utils.ts` zentralisieren
2. Duplizierte `statusVariants` in `ProposalCard.tsx` + `proposals/[id]/page.tsx` zusammenführen
3. Geschützte Routen → `lib/config/routes.ts` zentralisieren

**Risiko:** Sehr niedrig — nur Code-Duplikate entfernen, keine Logikänderung.

---

### Phase 1 — Core Flow (Priorität 1)

#### Schritt 1.1 — Thema erstellen (Topic Creation)
**Ziel:** Konfigurierbare Berechtigungen wer Themen erstellen kann.

**Was fehlt:**
- Admin-Setting: "Wer darf Themen erstellen?" (nur Admin / Admin + Members)
- Members-facing UI für Topic-Erstellung (falls aktiviert)
- Klares Topic-Detail-Page Layout als Einstiegspunkt für den Flow

**Betroffene Dateien:** `app/admin/`, `app/issues/new/`, `lib/config/`

---

#### Schritt 1.2 — Diskussionsplattform
**Ziel:** Funktionsfähige Diskussion zu einem Thema.

**Was fehlt:**
- Kommentar-Funktion auf Topic-Seite (opinion-Tabelle ist vorhanden, fehlt UI)
- Kommentare anzeigen, schreiben, antworten (einfaches Nesting via `parent_id`)
- Klare Trennung: Topic-Diskussion vs. Proposal-spezifische Diskussion

**Betroffene Dateien:** `app/issues/[id]/`, `components/discussion/`, `opinion` table (`+ parent_id`)

---

#### Schritt 1.3 — Vorschläge
**Ziel:** Mehrere Vorschläge pro Thema, übersichtlich dargestellt.

**Was vorhanden:** `initiative` table, Proposal-Creation-Flow (`app/proposals/new/`)

**Was fehlt:**
- Alle Vorschläge zu einem Thema auf der Topic-Seite anzeigen
- Vorschlag-Status klar kommunizieren (draft / aktiv / gewählt)
- Berechtigungs-Setting: wer darf Vorschläge einreichen?

**Betroffene Dateien:** `app/issues/[id]/`, `app/proposals/`, `app/admin/`

---

#### Schritt 1.4 — Voting (mit Delegation)
**Ziel:** Members stimmen über Vorschläge ab; Delegation funktioniert transparent.

**Was vorhanden:** `vote` table, `approval.ts`, `delegation/resolve.ts`, Delegation-UI

**Was fehlt:**
- Voting-UI auf Topic/Proposal-Seite (nicht nur in separatem Admin-Flow)
- Voting-Abschluss-Mechanismen: nach Zeit ✅ / nach Quorum 🔄 / nach fehlendem Widerstand ⏳
- Ergebnis klar anzeigen: welcher Vorschlag hat gewonnen?
- Delegation transparent machen: "Deine Stimme wurde von [Person] delegiert"

**Betroffene Dateien:** `app/issues/[id]/`, `lib/voting/`, `lib/delegation/`, `api/admin/transition/`

---

#### Schritt 1.5 — Annahme
**Ziel:** Angenommener Vorschlag wird klar als Ergebnis kommuniziert.

**Was fehlt:**
- "Gewählt"-Status für einen Vorschlag setzen
- Ergebnis-Seite / -Banner auf der Topic-Seite
- Automatische Überleitung in Phase 6 (Ausarbeitung)

**Betroffene Dateien:** `app/issues/[id]/`, `issue_status` enum (+ `accepted` Status?), `api/admin/transition/`

---

#### Schritt 1.6 — Ausarbeitung (Elaboration)
**Ziel:** Kollaboratives Dokument zum angenommenen Vorschlag.

**Was komplett fehlt** (neues Feature):
- Ausarbeitungs-Dokument Tabelle in DB (`elaboration` mit Sections: Budget, Zeitplan, Legales, etc.)
- Ausgewählte Members können Sections bearbeiten (Admin wählt Members aus)
- Alle anderen Members können kommentieren
- Einfache Version 1: strukturiertes Text-Dokument mit Sektionen

**Neue DB-Tabellen:** `elaboration`, `elaboration_section`, `elaboration_editor`

**Betroffene Dateien:** `app/issues/[id]/elaboration/`, `lib/modules/elaboration/`

---

### Phase 2 — Erweiterungen (nach Core Flow)

| Feature | Beschreibung | Abhängig von |
|---------|-------------|-------------|
| Nested Comments | `parent_id` Nesting in `opinion` | Schritt 1.2 |
| Pro/Contra Arguments | Strukturierte Argumente | Schritt 1.2 |
| Ranking Voting (Schulze) | Schulze-Methode aktivieren | Schritt 1.4 |
| Delegation Network View | Visualisierung der Delegationen | Schritt 1.4 |
| Configurable Voting Rules | Verschiedene Abschluss-Mechanismen | Schritt 1.4 |
| Process Engine | Hardcoded PHASE_ORDER ersetzen | Schritt 1.5 |
| Governance Mode Config | V1/V2/V3 ohne Code-Änderungen | Process Engine |
| AI Topic Import | Webseiten auslesen → Thema erstellen | Phase 2 |
| Notifications | Alerts, Deadlines, Mentions | Phase 2 |

---

### Phase 3 — Advanced Features

- AI Summaries, Argument Extraction, Consensus Detection
- Analytics Dashboard
- Reputation System
- Versioning / Proposal History
- External Integrations

---

## 5. Progress Tracking

| Phase | Schritt | Beschreibung | Status |
|-------|---------|-------------|--------|
| 0 | — | Fundament-Cleanup (DRY, Routes) | ⏳ Next |
| 1 | 1.1 | Thema erstellen (konfig. Berechtigungen) | ⏳ |
| 1 | 1.2 | Diskussionsplattform (Comments UI) | ⏳ |
| 1 | 1.3 | Vorschläge (Multi-Proposal UI) | ⏳ |
| 1 | 1.4 | Voting + Delegation | ⏳ |
| 1 | 1.5 | Annahme + Ergebnis-Anzeige | ⏳ |
| 1 | 1.6 | Ausarbeitung (Elaboration) | ⏳ |
| 2 | — | Erweiterungen | ⏳ |
| 3 | — | Advanced Features / AI | ⏳ |

---

## 6. Key Decisions

| Decision | Rationale |
|----------|-----------|
| Core Flow vor Refactoring | User-facing Funktionen haben Priorität |
| Phase 0 trotzdem zuerst | Spart Aufwand bei allen weiteren Schritten |
| Elaboration als separates Modul | Klar abgegrenzt, neues Feature |
| Voting-Abschluss konfigurierbar | Zeit / Quorum / kein Widerstand als Optionen |
| Berechtigungen via Admin-Setting | Kein Code-Change nötig für verschiedene Governance-Modi |
| Version 1 Ausarbeitung = Dokument | Einfachste sinnvolle Implementierung zuerst |
