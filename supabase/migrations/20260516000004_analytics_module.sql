INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES ('analytics_page', 106, 'Analytics Page', 'Platform-wide activity dashboard: most discussed topics, statement/proposal/argument counts', 'A', 'Core', true, false)
ON CONFLICT (key) DO UPDATE SET admin_enabled = true;
