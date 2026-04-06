CREATE TABLE IF NOT EXISTS public.notification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification' AND policyname = 'notification_own') THEN
    CREATE POLICY "notification_own" ON public.notification FOR ALL USING (member_id = auth.uid());
  END IF;
END $$;

ALTER TABLE public.member
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"new_opinion": true, "phase_change": true, "reply": true, "mention": true}'::jsonb;
