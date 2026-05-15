-- AI duplicate detection module (added by task 7 agent, kept here)
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable) VALUES
('ai_duplicate_detection', 103, 'AI Duplicate Detection', 'AI checks if a new statement is logically equivalent to an existing one before posting', 'F', 'AI Features', false, false);

-- Section owners
CREATE TABLE public.ev_section_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.ev_execution_sections(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(section_id, user_id)
);

ALTER TABLE public.ev_section_owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "section_owners_read" ON public.ev_section_owners FOR SELECT USING (true);
CREATE POLICY "section_owners_insert" ON public.ev_section_owners FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "section_owners_delete" ON public.ev_section_owners FOR DELETE USING (auth.uid() = user_id);
GRANT SELECT, INSERT, DELETE ON public.ev_section_owners TO authenticated;

-- Section ownership module
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable) VALUES
('section_ownership', 104, 'Section Ownership', 'Team members can claim ownership of specific plan sections with "I''ll take care of this"', 'H', 'Process & Lifecycle', false, false);
