-- ============================================================
-- ERSTE VERSION — Teil 3: Execution Workspace
-- Schema: ev (erste version)
-- Wird aktiv sobald eine Initiative angenommen wurde
-- ============================================================

-- Hauptplan (ein Plan pro Issue)
CREATE TABLE IF NOT EXISTS ev.execution_plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id        UUID NOT NULL UNIQUE REFERENCES v1.issue(id) ON DELETE CASCADE,
  goal            TEXT,             -- Projektziel (kurze Beschreibung)
  costs           TEXT,             -- Geschätzte Kosten
  duration        TEXT,             -- Geschätzte Dauer
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tasks (Kanban: todo / in_progress / done)
DO $$ BEGIN
  CREATE TYPE ev.task_status AS ENUM ('todo', 'in_progress', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ev.execution_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         UUID NOT NULL REFERENCES ev.execution_plans(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  status          ev.task_status NOT NULL DEFAULT 'todo',
  assignee_id     UUID REFERENCES v1.member(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Kommentare zu einzelnen Tasks (kein globaler Chat)
CREATE TABLE IF NOT EXISTS ev.task_comments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id         UUID NOT NULL REFERENCES ev.execution_tasks(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meilensteine / Timeline
CREATE TABLE IF NOT EXISTS ev.execution_milestones (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         UUID NOT NULL REFERENCES ev.execution_plans(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  date            DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team
DO $$ BEGIN
  CREATE TYPE ev.team_status AS ENUM ('active', 'interested');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ev.execution_team (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         UUID NOT NULL REFERENCES ev.execution_plans(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  role            TEXT,
  status          ev.team_status NOT NULL DEFAULT 'interested',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (plan_id, user_id)
);

-- Vorschläge für editierbare Felder (goal, costs, duration)
-- Andere User können mit 👍 abstimmen
CREATE TABLE IF NOT EXISTS ev.execution_suggestions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id         UUID NOT NULL REFERENCES ev.execution_plans(id) ON DELETE CASCADE,
  section         TEXT NOT NULL CHECK (section IN ('goal', 'costs', 'duration', 'milestone')),
  proposed_value  TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  upvotes         INTEGER NOT NULL DEFAULT 0,
  adopted         BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_execution_plans_issue ON ev.execution_plans(issue_id);
CREATE INDEX IF NOT EXISTS idx_execution_tasks_plan ON ev.execution_tasks(plan_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON ev.task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_execution_milestones_plan ON ev.execution_milestones(plan_id);
CREATE INDEX IF NOT EXISTS idx_execution_team_plan ON ev.execution_team(plan_id);
CREATE INDEX IF NOT EXISTS idx_execution_suggestions_plan ON ev.execution_suggestions(plan_id);

-- RLS
ALTER TABLE ev.execution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.execution_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.execution_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.execution_suggestions ENABLE ROW LEVEL SECURITY;

-- Lesen: alle
CREATE POLICY "ev_exec_plans_read" ON ev.execution_plans FOR SELECT USING (true);
CREATE POLICY "ev_exec_tasks_read" ON ev.execution_tasks FOR SELECT USING (true);
CREATE POLICY "ev_task_comments_read" ON ev.task_comments FOR SELECT USING (true);
CREATE POLICY "ev_exec_milestones_read" ON ev.execution_milestones FOR SELECT USING (true);
CREATE POLICY "ev_exec_team_read" ON ev.execution_team FOR SELECT USING (true);
CREATE POLICY "ev_exec_suggestions_read" ON ev.execution_suggestions FOR SELECT USING (true);

-- Schreiben: nur approved members
CREATE POLICY "ev_exec_tasks_insert" ON ev.execution_tasks
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_exec_tasks_update" ON ev.execution_tasks
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_task_comments_insert" ON ev.task_comments
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "ev_exec_milestones_insert" ON ev.execution_milestones
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_exec_team_insert" ON ev.execution_team
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "ev_exec_suggestions_insert" ON ev.execution_suggestions
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Admins können Plans erstellen
CREATE POLICY "ev_exec_plans_admin_insert" ON ev.execution_plans
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "ev_exec_plans_admin_update" ON ev.execution_plans
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true)
  );
