# Erste Version — Plattform-Plan

## Überblick

Die Plattform bleibt in ihrer Grundstruktur erhalten (Landing Page, Propositions, Delegation), bekommt aber eine neue Kernfunktion: Jedes Topic öffnet eine eigene Unterseite mit drei klar getrennten Bereichen.

---

## Bestehende Seiten (unverändert)

- **Landing Page** — bleibt exakt so wie sie ist
- **Propositions-Seite** — bleibt exakt so wie sie ist
- **Delegation-Seite** — bleibt exakt so wie sie ist

---

## Neue Struktur: Topic-Unterseite

Jedes Topic hat eine eigene Seite mit einem **Dropdown-Menü** oben, über das zwischen den drei Teilen gewechselt wird. Unter dem Dropdown stehen immer **2–3 Sätze**, die erklären wie der aktuell ausgewählte Teil funktioniert.

### Routing

```
app/topics/[topicId]/              ← Topic-Hauptseite mit Dropdown
app/topics/[topicId]/discussion/   ← Teil 1: Diskussionsforum
app/topics/[topicId]/proposals/    ← Teil 2: Proposals
app/topics/[topicId]/execution/    ← Teil 3: Execution Workspace
```

---

## Teil 1: Diskussionsforum

### Aufbau der Seite

- **Oben:** Titel des Topics (Überschrift)
- **Darunter:** Kurze Beschreibung worüber geredet wird + was Teil dieses Topics ist (beide Felder sind Pflichtfelder beim Erstellen eines Topics)
- **Darunter:** Liste von Statements

### Statements

- Maximal **100 Zeichen** lang
- Können mit **Quellenlinks** versehen werden (kleine Links unter dem Statement)
- Können **bewertet** werden: Farbspektrum von **weiß (0)** bis **lila (10)** — User klickt auf einen Wert, dieser wird gespeichert
- Angezeigt wird der **Durchschnitt** aller Bewertungen als Zahl neben dem Statement
- Vor dem ersten Klick eines Users: **keine Zahl** sichtbar (neutral)

### Unter jedem Statement: Pro/Contra-Baum (Kialo-Stil)

- User kann auf **„Pro"** oder **„Contra"** klicken und ein Argument hinzufügen
- User kann eine **Frage** stellen
- Jedes Pro/Contra/Frage-Argument kann selbst wieder:
  - Pro/Contra-Argumente haben
  - Fragen haben
  - Neue Statements darunter haben (gleiche Logik, rekursiv)
- **Ansicht wechselbar:** Normale Listenansicht oder **Baumdiagramm** (wie Kialo)

### Topic erstellen

Pflichtfelder:
- Titel
- Beschreibung (worum geht es)
- Was ist Teil dieses Topics (Abgrenzung)

---

## Teil 2: Proposals

### Aufbau

- **„Submit Proposal"**-Button oben
- Liste von Proposals mit Text
- Jedes Proposal zeigt:
  - Den Proposal-Text
  - **Abstimmungs-Buttons** (links neben dem Verbesserungsfeld):
    - Approve
    - Abstain
    - Disapprove
    - Strong Disapproval
  - **Pro/Contra-Argumente** (wie aktuell)
  - **Feld für vorgeschlagene Verbesserungen** (Proposed Improvements)
  - **AI-Panel rechts:** Zeigt die Unterschiede zwischen diesem Proposal und dem nächsten (Diff-Ansicht, KI-generiert)

---

## Teil 3: Execution Workspace

Wird aktiviert sobald eine Initiative angenommen wurde.

**Zweck:** Einen strukturierten **Projektplan mit Details** schreiben — kein Diskussionsraum.

### Aufbau

| Element | Inhalt |
|---|---|
| **Header** | Projektname, Status, Progress-Bar |
| **Projektziel** | Kurze Beschreibung (editierbar per Vorschlag) |
| **Key Infos** | Geschätzte Kosten + Dauer (Cards) |
| **Tasks** | Kanban-Board: To Do / In Progress / Done |
| **Team** | Liste mit Name, Rolle, Status |
| **Timeline** | Meilensteine mit Datum |

### Prinzip

- User können **nicht direkt editieren**, sondern **Vorschläge machen**
- Andere User stimmen per 👍/👎 ab
- Bei genügend Zustimmung wird der Vorschlag übernommen
- Kommentare nur **kontextuell** (an Tasks, Ziel, Timeline-Elementen) — kein globaler Chat

### Mobile UX

- Alles in Cards
- Große Tap-Flächen
- Bottom Sheets statt neue Seiten
- Vertikale Timeline auf Mobile

---

## Datenbankstruktur (neue Tabellen)

### Diskussionsforum

```sql
-- Statements
statements (
  id, topic_id, text VARCHAR(100), author_id,
  source_links TEXT[], created_at
)

-- Bewertungen (0–10, pro User)
statement_ratings (
  id, statement_id, user_id, rating INT (0–10), created_at
)

-- Pro/Contra/Fragen/Sub-Statements (rekursiver Baum)
discussion_nodes (
  id, parent_id (NULL = root), statement_id,
  type ENUM(pro, contra, question, statement),
  text TEXT, author_id, created_at
)
```

### Proposals

```sql
-- Topic-gebundene Proposals
topic_proposals (
  id, topic_id, text TEXT, author_id, created_at
)

-- Abstimmungen
proposal_votes (
  id, proposal_id, user_id,
  vote ENUM(approve, abstain, disapprove, strong_disapproval),
  created_at
)

-- Verbesserungsvorschläge
proposed_improvements (
  id, proposal_id, user_id, text TEXT, created_at
)
```

### Execution Workspace

```sql
-- Hauptplan
execution_plans (
  id, topic_id, goal TEXT, costs TEXT,
  duration TEXT, created_at
)

-- Tasks (Kanban)
execution_tasks (
  id, plan_id, title TEXT, description TEXT,
  status ENUM(todo, in_progress, done),
  assignee_id, created_at
)

-- Meilensteine
execution_milestones (
  id, plan_id, title TEXT, date DATE, created_at
)

-- Team
execution_team (
  id, plan_id, user_id, role TEXT,
  status ENUM(active, interested), created_at
)

-- Vorschläge für editierbare Bereiche
execution_proposals (
  id, plan_id, section TEXT, proposed_value TEXT,
  author_id, upvotes INT DEFAULT 0, adopted BOOLEAN DEFAULT false,
  created_at
)
```

---

## Komponenten-Struktur

```
components/topics/
  TopicHeader.tsx          ← Dropdown-Menü + Erklärungstext

components/discussion/
  StatementList.tsx
  StatementCard.tsx        ← Text + Rating + Links
  StatementRating.tsx      ← Farbspektrum weiß→lila (0–10)
  DiscussionNode.tsx       ← rekursiv (pro/contra/frage/statement)
  KialoTreeView.tsx        ← Baumdiagramm-Ansicht
  AddStatementForm.tsx

components/proposals/
  TopicProposalCard.tsx
  ProposalVoteButtons.tsx  ← approve / abstain / disapprove / strong
  AiDiffPanel.tsx          ← KI-Diff zum nächsten Proposal
  ProposedImprovements.tsx

components/execution/
  ProjectHeader.tsx
  EditableSection.tsx      ← Vorschlag-Mechanismus
  TaskBoard.tsx            ← Kanban
  TaskCard.tsx
  TeamList.tsx
  MilestoneTimeline.tsx
  BottomActionSheet.tsx
```

---

## Reihenfolge der Implementierung

1. Datenbank-Migrations (separate Dateien, nur für diese Version)
2. Topic-Header mit Dropdown-Navigation
3. Teil 1: Diskussionsforum
4. Teil 2: Proposals
5. Teil 3: Execution Workspace
