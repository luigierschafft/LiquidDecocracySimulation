-- ============================================================
-- ERSTE VERSION — Teil 1: Diskussionsforum
-- Schema: ev (erste version)
-- Keine bestehenden Tabellen werden verändert
-- ============================================================

CREATE SCHEMA IF NOT EXISTS ev;

-- Topic-Erweiterung: Beschreibung + Abgrenzung
-- (erweitert public.issue um zwei Pflichtfelder)
CREATE TABLE IF NOT EXISTS ev.topic_meta (
  issue_id        UUID PRIMARY KEY REFERENCES public.issue(id) ON DELETE CASCADE,
  about           TEXT NOT NULL, -- "Worüber wird hier geredet"
  scope           TEXT NOT NULL, -- "Was ist Teil dieses Topics"
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Statements (max 100 Zeichen)
CREATE TABLE IF NOT EXISTS ev.statements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id        UUID NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  text            VARCHAR(100) NOT NULL,
  author_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  source_links    TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bewertungen pro User (0–10, Durchschnitt wird in der App berechnet)
CREATE TABLE IF NOT EXISTS ev.statement_ratings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id    UUID NOT NULL REFERENCES ev.statements(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  rating          SMALLINT NOT NULL CHECK (rating >= 0 AND rating <= 10),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (statement_id, user_id)
);

-- Diskussions-Baum: Pro / Contra / Fragen / Sub-Statements (Kialo-Stil, rekursiv)
DO $$ BEGIN
  CREATE TYPE ev.node_type AS ENUM ('pro', 'contra', 'question', 'statement');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ev.discussion_nodes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_id    UUID NOT NULL REFERENCES ev.statements(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES ev.discussion_nodes(id) ON DELETE CASCADE, -- NULL = direkt unter Statement
  type            ev.node_type NOT NULL,
  text            TEXT NOT NULL,
  source_links    TEXT[] DEFAULT '{}',
  author_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_statements_issue ON ev.statements(issue_id);
CREATE INDEX IF NOT EXISTS idx_statement_ratings_statement ON ev.statement_ratings(statement_id);
CREATE INDEX IF NOT EXISTS idx_discussion_nodes_statement ON ev.discussion_nodes(statement_id);
CREATE INDEX IF NOT EXISTS idx_discussion_nodes_parent ON ev.discussion_nodes(parent_id);

-- RLS aktivieren
ALTER TABLE ev.topic_meta ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.statement_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.discussion_nodes ENABLE ROW LEVEL SECURITY;

-- Policies: alle approved members können lesen und schreiben
CREATE POLICY "ev_topic_meta_read" ON ev.topic_meta
  FOR SELECT USING (true);

CREATE POLICY "ev_topic_meta_insert" ON ev.topic_meta
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_statements_read" ON ev.statements
  FOR SELECT USING (true);

CREATE POLICY "ev_statements_insert" ON ev.statements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_statement_ratings_read" ON ev.statement_ratings
  FOR SELECT USING (true);

CREATE POLICY "ev_statement_ratings_upsert" ON ev.statement_ratings
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ev_discussion_nodes_read" ON ev.discussion_nodes
  FOR SELECT USING (true);

CREATE POLICY "ev_discussion_nodes_insert" ON ev.discussion_nodes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );
