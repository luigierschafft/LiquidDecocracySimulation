-- Council message table
CREATE TABLE IF NOT EXISTS public.ev_council_message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES public.issue(id) ON DELETE CASCADE, -- null = global default
  message text NOT NULL DEFAULT 'Here a statement of 12 community-collected opinions from the 12 Elders is described as a joint statement.',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_council_message ENABLE ROW LEVEL SECURITY;
CREATE POLICY "council_message_read" ON public.ev_council_message FOR SELECT USING (true);
CREATE POLICY "council_message_admin" ON public.ev_council_message FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);
GRANT SELECT ON public.ev_council_message TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ev_council_message TO authenticated;

-- Insert global default message
INSERT INTO public.ev_council_message (issue_id, message)
VALUES (null, 'Here a statement of 12 community-collected opinions from the 12 Elders is described as a joint statement.')
ON CONFLICT DO NOTHING;

-- Register module (enabled by default)
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES ('council_of_elders', 107, 'Council of Elders', 'Shows a collapsible Council of Elders message at the bottom of each discussion', 'C', 'Discussion', true, false)
ON CONFLICT (key) DO UPDATE SET admin_enabled = true;
