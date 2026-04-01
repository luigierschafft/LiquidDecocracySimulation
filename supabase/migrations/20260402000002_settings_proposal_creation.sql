INSERT INTO public.app_settings (key, value) VALUES ('proposal_creation', 'all_members')
ON CONFLICT DO NOTHING;
