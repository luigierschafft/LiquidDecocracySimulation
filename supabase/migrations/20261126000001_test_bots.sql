-- ============================================================
-- TEST BOTS: AI personas that discuss on the Test Platform only
-- Personas are described in vault/40 Plattform/Test-Personas/
-- Bots cannot log in (empty password). They only write through
-- /api/bots/respond, which refuses any topic outside the 'test' platform.
-- ============================================================

ALTER TABLE public.member ADD COLUMN IF NOT EXISTS is_bot BOOLEAN NOT NULL DEFAULT false;

INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user
) VALUES
  ('b0b0b0b0-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','mira.bot@test-personas.invalid',    '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','karthik.bot@test-personas.invalid', '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','selvi.bot@test-personas.invalid',   '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','jonas.bot@test-personas.invalid',   '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','anjali.bot@test-personas.invalid',  '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','robert.bot@test-personas.invalid',  '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','lea.bot@test-personas.invalid',     '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('b0b0b0b0-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','viktor.bot@test-personas.invalid',  '', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}','{}',false,false)
ON CONFLICT (id) DO NOTHING;

-- The on_auth_user_created trigger may already have created member rows; overwrite them.
INSERT INTO public.member (id, email, display_name, is_admin, is_approved, is_bot) VALUES
  ('b0b0b0b0-0000-0000-0000-000000000001','mira.bot@test-personas.invalid',    '🤖 Mira',    false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000002','karthik.bot@test-personas.invalid', '🤖 Karthik', false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000003','selvi.bot@test-personas.invalid',   '🤖 Selvi',   false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000004','jonas.bot@test-personas.invalid',   '🤖 Jonas',   false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000005','anjali.bot@test-personas.invalid',  '🤖 Anjali',  false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000006','robert.bot@test-personas.invalid',  '🤖 Robert',  false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000007','lea.bot@test-personas.invalid',     '🤖 Lea',     false, true, true),
  ('b0b0b0b0-0000-0000-0000-000000000008','viktor.bot@test-personas.invalid',  '🤖 Viktor',  false, true, true)
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  is_admin     = false,
  is_approved  = true,
  is_bot       = true;

-- Bots are members of the Test Platform only.
INSERT INTO public.platform_member (platform_id, user_id, role, status)
SELECT p.id, m.id, 'member', 'approved'
FROM public.platform p
CROSS JOIN public.member m
WHERE p.slug = 'test' AND m.is_bot = true
ON CONFLICT (platform_id, user_id) DO NOTHING;

-- Remove bots from any other platform (e.g. if an earlier migration auto-added all members).
DELETE FROM public.platform_member pm
USING public.platform p, public.member m
WHERE pm.platform_id = p.id AND pm.user_id = m.id
  AND m.is_bot = true AND p.slug <> 'test';
