-- Fix grants and RLS for ev_execution_sections / ev_section_proposals
-- Section rows are system-managed, so any authenticated user can insert/update

-- Explicit grants (in case supabase db push didn't auto-grant)
GRANT ALL ON public.ev_execution_sections TO anon, authenticated;
GRANT ALL ON public.ev_section_proposals TO anon, authenticated;

-- Drop overly restrictive INSERT policy and replace with auth-only check
DROP POLICY IF EXISTS "ev_sections_write" ON public.ev_execution_sections;
CREATE POLICY "ev_sections_write" ON public.ev_execution_sections FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "ev_sections_update" ON public.ev_execution_sections;
CREATE POLICY "ev_sections_update" ON public.ev_execution_sections FOR UPDATE
  USING (auth.uid() IS NOT NULL);
