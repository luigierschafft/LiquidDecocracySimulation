-- Improvement comments per section, writable by team members
CREATE TABLE IF NOT EXISTS public.ev_section_improvements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.ev_execution_sections(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ev_section_improvements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ev_improvements_read" ON public.ev_section_improvements FOR SELECT USING (true);
CREATE POLICY "ev_improvements_write" ON public.ev_section_improvements FOR INSERT
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "ev_improvements_delete" ON public.ev_section_improvements FOR DELETE
  USING (author_id = auth.uid());

GRANT ALL ON public.ev_section_improvements TO anon, authenticated;
