CREATE TABLE IF NOT EXISTS tag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#6366f1',
  created_by UUID REFERENCES member(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS issue_tag (
  issue_id UUID REFERENCES issue(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY(issue_id, tag_id)
);
ALTER TABLE tag ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_tag ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tag_read" ON tag FOR SELECT USING (true);
CREATE POLICY "tag_write" ON tag FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "issue_tag_read" ON issue_tag FOR SELECT USING (true);
CREATE POLICY "issue_tag_write" ON issue_tag FOR ALL USING (
  EXISTS (SELECT 1 FROM member WHERE id = auth.uid() AND is_admin = true)
    OR EXISTS (SELECT 1 FROM issue WHERE id = issue_id AND author_id = auth.uid())
);
