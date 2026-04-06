-- App-wide settings table for configurable platform behaviour
CREATE TABLE IF NOT EXISTS public.app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read" ON public.app_settings
  FOR SELECT USING (true);

CREATE POLICY "settings_admin_write" ON public.app_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );

-- Defaults
INSERT INTO public.app_settings (key, value) VALUES ('topic_creation', 'all_members')
ON CONFLICT DO NOTHING;
