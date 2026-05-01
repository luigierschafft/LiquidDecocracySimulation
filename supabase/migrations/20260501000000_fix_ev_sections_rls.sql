-- Add RLS policies for ev_execution_sections and ev_section_proposals
-- (tables were created without RLS in previous migration)

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

-- Section proposals: insert für logged-in users, update für approved members
CREATE POLICY "ev_proposals_write" ON public.ev_section_proposals FOR INSERT
  WITH CHECK (author_id = auth.uid());
CREATE POLICY "ev_proposals_update" ON public.ev_section_proposals FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true));
