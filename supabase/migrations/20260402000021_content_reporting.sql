CREATE TYPE IF NOT EXISTS report_reason AS ENUM ('spam', 'harassment', 'misinformation', 'off_topic', 'other');
CREATE TABLE IF NOT EXISTS content_report (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES member(id) ON DELETE CASCADE,
  opinion_id UUID REFERENCES opinion(id) ON DELETE CASCADE,
  argument_id UUID REFERENCES argument(id) ON DELETE CASCADE,
  initiative_id UUID REFERENCES initiative(id) ON DELETE CASCADE,
  reason report_reason NOT NULL,
  notes TEXT,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT report_one_target CHECK (
    (opinion_id IS NOT NULL)::int + (argument_id IS NOT NULL)::int + (initiative_id IS NOT NULL)::int = 1
  )
);
ALTER TABLE content_report ENABLE ROW LEVEL SECURITY;
CREATE POLICY "report_own_insert" ON content_report FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "report_admin_read" ON content_report FOR SELECT USING (
  EXISTS (SELECT 1 FROM member WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "report_admin_update" ON content_report FOR UPDATE USING (
  EXISTS (SELECT 1 FROM member WHERE id = auth.uid() AND is_admin = true)
);
