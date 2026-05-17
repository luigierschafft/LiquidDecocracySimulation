-- Add moderation_status column to ev_statements
ALTER TABLE public.ev_statements ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'approved';

-- Index for fast filtering by status
CREATE INDEX IF NOT EXISTS ev_statements_moderation_status_idx ON public.ev_statements (moderation_status);

-- Drop existing select policy if any, then recreate with moderation awareness
-- (safe to run multiple times)
DROP POLICY IF EXISTS "ev_statements_select" ON public.ev_statements;
DROP POLICY IF EXISTS "ev_statements_insert" ON public.ev_statements;
DROP POLICY IF EXISTS "ev_statements_update" ON public.ev_statements;
DROP POLICY IF EXISTS "ev_statements_delete" ON public.ev_statements;

-- Enable RLS if not already enabled (idempotent)
ALTER TABLE public.ev_statements ENABLE ROW LEVEL SECURITY;

-- SELECT: anon and authenticated users see approved statements + their own pending ones
CREATE POLICY "ev_statements_select" ON public.ev_statements
  FOR SELECT
  USING (
    moderation_status = 'approved'
    OR author_id = auth.uid()
  );

-- INSERT: authenticated users can insert (moderation_status defaults to 'approved')
CREATE POLICY "ev_statements_insert" ON public.ev_statements
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: admins only (used by moderation approve route)
CREATE POLICY "ev_statements_update" ON public.ev_statements
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );

-- DELETE: admins only (used by moderation reject route)
CREATE POLICY "ev_statements_delete" ON public.ev_statements
  FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );

GRANT SELECT, INSERT ON public.ev_statements TO anon, authenticated;
GRANT UPDATE, DELETE ON public.ev_statements TO authenticated;

-- Register module
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES (
  'hate_speech_filter',
  108,
  'Hate Speech Filter',
  'AI screens new statements for hate speech and personal insults before posting. Flagged content is held for admin review.',
  'M',
  'Mindful Participation',
  false,
  false
)
ON CONFLICT (key) DO NOTHING;
