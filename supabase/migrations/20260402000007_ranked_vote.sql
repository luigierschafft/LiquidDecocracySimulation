ALTER TABLE policy
  ADD COLUMN voting_method TEXT NOT NULL DEFAULT 'approval';

CREATE TABLE ranked_vote (
  issue_id      UUID NOT NULL REFERENCES issue(id) ON DELETE CASCADE,
  initiative_id UUID NOT NULL REFERENCES initiative(id) ON DELETE CASCADE,
  member_id     UUID NOT NULL REFERENCES member(id) ON DELETE CASCADE,
  rank          INTEGER NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (issue_id, initiative_id, member_id)
);

ALTER TABLE ranked_vote ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ranked_vote_public_read"  ON ranked_vote FOR SELECT USING (true);
CREATE POLICY "ranked_vote_auth_write"   ON ranked_vote FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "ranked_vote_self_update"  ON ranked_vote FOR UPDATE USING (member_id = auth.uid());
CREATE POLICY "ranked_vote_self_delete"  ON ranked_vote FOR DELETE USING (member_id = auth.uid());
