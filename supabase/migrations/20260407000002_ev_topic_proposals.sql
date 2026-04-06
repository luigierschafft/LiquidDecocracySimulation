-- ============================================================
-- ERSTE VERSION — Teil 2: Topic Proposals
-- Schema: ev (erste version)
-- ============================================================

-- Proposals innerhalb eines Topics
CREATE TABLE IF NOT EXISTS ev.topic_proposals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id        UUID NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abstimmungen auf Proposals
DO $$ BEGIN
  CREATE TYPE ev.proposal_vote_value AS ENUM ('approve', 'abstain', 'disapprove', 'strong_disapproval');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ev.proposal_votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID NOT NULL REFERENCES ev.topic_proposals(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  vote            ev.proposal_vote_value NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (proposal_id, user_id)
);

-- Pro/Contra-Argumente zu einem Proposal
DO $$ BEGIN
  CREATE TYPE ev.proposal_arg_type AS ENUM ('pro', 'contra');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS ev.proposal_arguments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID NOT NULL REFERENCES ev.topic_proposals(id) ON DELETE CASCADE,
  type            ev.proposal_arg_type NOT NULL,
  text            TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Verbesserungsvorschläge zu einem Proposal
CREATE TABLE IF NOT EXISTS ev.proposed_improvements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id     UUID NOT NULL REFERENCES ev.topic_proposals(id) ON DELETE CASCADE,
  text            TEXT NOT NULL,
  author_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indizes
CREATE INDEX IF NOT EXISTS idx_topic_proposals_issue ON ev.topic_proposals(issue_id);
CREATE INDEX IF NOT EXISTS idx_proposal_votes_proposal ON ev.proposal_votes(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_arguments_proposal ON ev.proposal_arguments(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposed_improvements_proposal ON ev.proposed_improvements(proposal_id);

-- RLS
ALTER TABLE ev.topic_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.proposal_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.proposal_arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ev.proposed_improvements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ev_topic_proposals_read" ON ev.topic_proposals
  FOR SELECT USING (true);

CREATE POLICY "ev_topic_proposals_insert" ON ev.topic_proposals
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_proposal_votes_read" ON ev.proposal_votes
  FOR SELECT USING (true);

CREATE POLICY "ev_proposal_votes_upsert" ON ev.proposal_votes
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "ev_proposal_arguments_read" ON ev.proposal_arguments
  FOR SELECT USING (true);

CREATE POLICY "ev_proposal_arguments_insert" ON ev.proposal_arguments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );

CREATE POLICY "ev_proposed_improvements_read" ON ev.proposed_improvements
  FOR SELECT USING (true);

CREATE POLICY "ev_proposed_improvements_insert" ON ev.proposed_improvements
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
  );
