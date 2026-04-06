-- ============================================================
-- Verschiebe ev Schema → public Schema mit ev_ Prefix
-- Grund: Supabase exponiert nur public Schema via API
-- ============================================================

-- 1. Neue Tabellen in public erstellen

CREATE TABLE IF NOT EXISTS public.ev_topic_meta (
  issue_id   UUID PRIMARY KEY REFERENCES public.issue(id) ON DELETE CASCADE,
  about      TEXT NOT NULL,
  scope      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_statements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id     UUID NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  text         VARCHAR(100) NOT NULL,
  author_id    UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  source_links TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_statement_ratings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id UUID NOT NULL REFERENCES public.ev_statements(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  rating       SMALLINT NOT NULL CHECK (rating >= 0 AND rating <= 10),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (statement_id, user_id)
);

DO $$ BEGIN
  CREATE TYPE public.ev_node_type AS ENUM ('pro', 'contra', 'question', 'statement');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ev_discussion_nodes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id UUID NOT NULL REFERENCES public.ev_statements(id) ON DELETE CASCADE,
  parent_id    UUID REFERENCES public.ev_discussion_nodes(id) ON DELETE CASCADE,
  type         public.ev_node_type NOT NULL,
  text         TEXT NOT NULL,
  source_links TEXT[] DEFAULT '{}',
  author_id    UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_topic_proposals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id   UUID NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  author_id  UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE public.ev_proposal_vote_value AS ENUM ('approve', 'abstain', 'disapprove', 'strong_disapproval');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ev_proposal_votes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.ev_topic_proposals(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  vote        public.ev_proposal_vote_value NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (proposal_id, user_id)
);

DO $$ BEGIN
  CREATE TYPE public.ev_proposal_arg_type AS ENUM ('pro', 'contra');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ev_proposal_arguments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.ev_topic_proposals(id) ON DELETE CASCADE,
  type        public.ev_proposal_arg_type NOT NULL,
  text        TEXT NOT NULL,
  author_id   UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_proposed_improvements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID NOT NULL REFERENCES public.ev_topic_proposals(id) ON DELETE CASCADE,
  text        TEXT NOT NULL,
  author_id   UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_execution_plans (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id UUID NOT NULL UNIQUE REFERENCES public.issue(id) ON DELETE CASCADE,
  goal     TEXT,
  costs    TEXT,
  duration TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE public.ev_task_status AS ENUM ('todo', 'in_progress', 'done');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ev_execution_tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      public.ev_task_status NOT NULL DEFAULT 'todo',
  assignee_id UUID REFERENCES public.member(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_task_comments (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id   UUID NOT NULL REFERENCES public.ev_execution_tasks(id) ON DELETE CASCADE,
  text      TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ev_execution_milestones (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  title   TEXT NOT NULL,
  date    DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  CREATE TYPE public.ev_team_status AS ENUM ('active', 'interested');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.ev_execution_team (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  role    TEXT,
  status  public.ev_team_status NOT NULL DEFAULT 'interested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (plan_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.ev_execution_suggestions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id        UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  section        TEXT NOT NULL CHECK (section IN ('goal', 'costs', 'duration', 'milestone')),
  proposed_value TEXT NOT NULL,
  author_id      UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  upvotes        INTEGER NOT NULL DEFAULT 0,
  adopted        BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Daten kopieren (aus ev Schema)
INSERT INTO public.ev_topic_meta SELECT * FROM ev.topic_meta ON CONFLICT DO NOTHING;
INSERT INTO public.ev_statements SELECT * FROM ev.statements ON CONFLICT DO NOTHING;
INSERT INTO public.ev_statement_ratings
  SELECT id, statement_id, user_id, rating, created_at FROM ev.statement_ratings ON CONFLICT DO NOTHING;
INSERT INTO public.ev_discussion_nodes
  SELECT id, statement_id, parent_id, type::text::public.ev_node_type, text, source_links, author_id, created_at
  FROM ev.discussion_nodes ON CONFLICT DO NOTHING;
INSERT INTO public.ev_topic_proposals SELECT * FROM ev.topic_proposals ON CONFLICT DO NOTHING;
INSERT INTO public.ev_proposal_votes
  SELECT id, proposal_id, user_id, vote::text::public.ev_proposal_vote_value, created_at
  FROM ev.proposal_votes ON CONFLICT DO NOTHING;
INSERT INTO public.ev_proposal_arguments
  SELECT id, proposal_id, type::text::public.ev_proposal_arg_type, text, author_id, created_at
  FROM ev.proposal_arguments ON CONFLICT DO NOTHING;
INSERT INTO public.ev_proposed_improvements SELECT * FROM ev.proposed_improvements ON CONFLICT DO NOTHING;
INSERT INTO public.ev_execution_plans SELECT * FROM ev.execution_plans ON CONFLICT DO NOTHING;
INSERT INTO public.ev_execution_tasks
  SELECT id, plan_id, title, description, status::text::public.ev_task_status, assignee_id, created_at
  FROM ev.execution_tasks ON CONFLICT DO NOTHING;
INSERT INTO public.ev_task_comments SELECT * FROM ev.task_comments ON CONFLICT DO NOTHING;
INSERT INTO public.ev_execution_milestones SELECT * FROM ev.execution_milestones ON CONFLICT DO NOTHING;
INSERT INTO public.ev_execution_team
  SELECT id, plan_id, user_id, role, status::text::public.ev_team_status, created_at
  FROM ev.execution_team ON CONFLICT DO NOTHING;

-- 3. RLS
ALTER TABLE public.ev_topic_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_statement_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_discussion_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_topic_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_proposal_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_proposed_improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_execution_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_execution_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_execution_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_execution_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_execution_suggestions ENABLE ROW LEVEL SECURITY;

-- Alle lesen erlaubt
CREATE POLICY "ev_pub_read" ON public.ev_topic_meta FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_statements FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_statement_ratings FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_discussion_nodes FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_topic_proposals FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_proposal_votes FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_proposal_arguments FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_proposed_improvements FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_execution_plans FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_execution_tasks FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_task_comments FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_execution_milestones FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_execution_team FOR SELECT USING (true);
CREATE POLICY "ev_pub_read" ON public.ev_execution_suggestions FOR SELECT USING (true);

-- Schreiben für approved members
CREATE POLICY "ev_pub_write" ON public.ev_statements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_statement_ratings FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "ev_pub_write" ON public.ev_discussion_nodes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_topic_proposals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_proposal_votes FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "ev_pub_write" ON public.ev_proposal_arguments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_proposed_improvements FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_execution_tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_update" ON public.ev_execution_tasks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_task_comments FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "ev_pub_write" ON public.ev_execution_milestones FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_pub_write" ON public.ev_execution_team FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "ev_pub_write" ON public.ev_execution_suggestions FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "ev_pub_admin" ON public.ev_execution_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "ev_pub_write" ON public.ev_topic_meta FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
