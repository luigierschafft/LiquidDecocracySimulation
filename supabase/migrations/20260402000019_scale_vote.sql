CREATE TABLE IF NOT EXISTS scale_vote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiative(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES member(id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(initiative_id, member_id)
);
ALTER TABLE scale_vote ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scale_vote_read" ON scale_vote FOR SELECT USING (true);
CREATE POLICY "scale_vote_own" ON scale_vote FOR ALL USING (member_id = auth.uid()) WITH CHECK (member_id = auth.uid());
