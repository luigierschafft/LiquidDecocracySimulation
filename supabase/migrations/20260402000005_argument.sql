CREATE TABLE argument (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES initiative(id) ON DELETE CASCADE,
  author_id     UUID NOT NULL REFERENCES member(id),
  stance        TEXT NOT NULL CHECK (stance IN ('pro', 'contra')),
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE argument ENABLE ROW LEVEL SECURITY;
CREATE POLICY "args_public_read" ON argument FOR SELECT USING (true);
CREATE POLICY "args_auth_write"  ON argument FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
