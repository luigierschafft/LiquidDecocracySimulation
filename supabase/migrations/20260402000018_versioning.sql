CREATE TABLE IF NOT EXISTS initiative_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiative(id) ON DELETE CASCADE,
  version_num SMALLINT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  edited_by UUID REFERENCES member(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE initiative_version ENABLE ROW LEVEL SECURITY;
CREATE POLICY "initiative_version_read" ON initiative_version FOR SELECT USING (true);
CREATE POLICY "initiative_version_insert" ON initiative_version FOR INSERT WITH CHECK (edited_by = auth.uid());
