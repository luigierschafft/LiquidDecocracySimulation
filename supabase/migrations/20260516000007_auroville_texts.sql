INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES ('auroville_texts', 109, 'Auroville Texts Banner', 'Displays one of the three founding Auroville texts (The Charter, The Dream, How to be a true Aurovillian) when users scroll to the bottom of any page.', 'C', 'Community', true, true)
ON CONFLICT (key) DO NOTHING;
