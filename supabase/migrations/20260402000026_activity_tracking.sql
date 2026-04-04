CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'activity_log_own') THEN
    CREATE POLICY "activity_log_own" ON public.activity_log FOR SELECT USING (member_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'activity_log_admin') THEN
    CREATE POLICY "activity_log_admin" ON public.activity_log FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = TRUE)
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_log' AND policyname = 'activity_log_insert') THEN
    CREATE POLICY "activity_log_insert" ON public.activity_log FOR INSERT WITH CHECK (member_id = auth.uid());
  END IF;
END $$;
