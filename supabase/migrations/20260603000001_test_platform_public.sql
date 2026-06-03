-- Make the Test Platform publicly joinable (not invite-only)
UPDATE public.platform
SET is_invite_only = false
WHERE slug = 'test';
