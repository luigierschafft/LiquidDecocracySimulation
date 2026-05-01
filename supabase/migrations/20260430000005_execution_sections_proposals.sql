-- Structured document sections for execution plans
-- Each plan gets a set of template sections that can be collaboratively edited via proposals

-- Add team lead flag
ALTER TABLE public.ev_execution_team ADD COLUMN IF NOT EXISTS is_lead boolean NOT NULL DEFAULT false;

-- Document sections
CREATE TABLE IF NOT EXISTS public.ev_execution_sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  key        TEXT NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.member(id) ON DELETE SET NULL,
  UNIQUE(plan_id, key)
);

-- Change proposals (git-style suggest & merge)
CREATE TABLE IF NOT EXISTS public.ev_section_proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES public.ev_execution_sections(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  old_content TEXT NOT NULL,
  new_content TEXT NOT NULL,
  comment     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  reviewed_by UUID REFERENCES public.member(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ev_execution_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_section_proposals ENABLE ROW LEVEL SECURITY;

-- Lesen für alle
CREATE POLICY "ev_sections_read" ON public.ev_execution_sections FOR SELECT USING (true);
CREATE POLICY "ev_proposals_read" ON public.ev_section_proposals FOR SELECT USING (true);

-- Sections: insert/update für approved members
CREATE POLICY "ev_sections_write" ON public.ev_execution_sections FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
CREATE POLICY "ev_sections_update" ON public.ev_execution_sections FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));

-- Section proposals: insert für approved members, update für eigene
CREATE POLICY "ev_proposals_write" ON public.ev_section_proposals FOR INSERT
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "ev_proposals_update" ON public.ev_section_proposals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
