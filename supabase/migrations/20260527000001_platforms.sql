-- ============================================================
-- MULTI-TENANCY: Platform Layer
-- Adds platform and platform_member tables.
-- All existing issues are assigned to the 'auroville' platform.
-- Existing approved members are auto-added to 'auroville'.
-- ============================================================

-- Platform table
CREATE TABLE IF NOT EXISTS public.platform (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  is_invite_only BOOLEAN NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Platform membership
CREATE TABLE IF NOT EXISTS public.platform_member (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_id UUID NOT NULL REFERENCES public.platform(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  invited_by  UUID REFERENCES public.member(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(platform_id, user_id)
);

-- Add platform_id to issue table
ALTER TABLE public.issue ADD COLUMN IF NOT EXISTS platform_id UUID REFERENCES public.platform(id);

-- Seed the 3 platforms
INSERT INTO public.platform (slug, name, description, is_invite_only) VALUES
  ('auroville', 'Auroville Community', 'The main platform for all Auroville residents and community members.', false),
  ('test', 'Test Platform', 'For testing new features and workflows.', true),
  ('private', 'Lukas & Ana', 'Private platform for Lukas and Ana.', true)
ON CONFLICT (slug) DO NOTHING;

-- Assign all existing issues to the auroville platform
UPDATE public.issue
SET platform_id = (SELECT id FROM public.platform WHERE slug = 'auroville')
WHERE platform_id IS NULL;

-- Auto-add existing members to the auroville platform with their current approval status
INSERT INTO public.platform_member (platform_id, user_id, role, status)
SELECT
  (SELECT id FROM public.platform WHERE slug = 'auroville'),
  m.id,
  CASE WHEN m.is_admin THEN 'admin' ELSE 'member' END,
  CASE WHEN m.is_approved THEN 'approved' ELSE 'pending' END
FROM public.member m
ON CONFLICT (platform_id, user_id) DO NOTHING;

-- RLS
ALTER TABLE public.platform ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_member ENABLE ROW LEVEL SECURITY;

-- Anyone can read platforms
CREATE POLICY "platform_select_all" ON public.platform
  FOR SELECT USING (true);

-- platform_member: read own membership, or if admin of that platform, or global admin
CREATE POLICY "platform_member_select" ON public.platform_member
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.platform_member pm
      WHERE pm.platform_id = platform_member.platform_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'admin'
        AND pm.status = 'approved'
    )
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );

-- Insert: self-join as pending, OR admin can add anyone
CREATE POLICY "platform_member_insert" ON public.platform_member
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND status = 'pending')
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR EXISTS (
      SELECT 1 FROM public.platform_member pm
      WHERE pm.platform_id = platform_member.platform_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'admin'
        AND pm.status = 'approved'
    )
  );

-- Update: platform admin or global admin can update
CREATE POLICY "platform_member_update" ON public.platform_member
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR EXISTS (
      SELECT 1 FROM public.platform_member pm
      WHERE pm.platform_id = platform_member.platform_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'admin'
        AND pm.status = 'approved'
    )
  );

-- Delete: own membership, or admins
CREATE POLICY "platform_member_delete" ON public.platform_member
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR EXISTS (
      SELECT 1 FROM public.platform_member pm
      WHERE pm.platform_id = platform_member.platform_id
        AND pm.user_id = auth.uid()
        AND pm.role = 'admin'
        AND pm.status = 'approved'
    )
  );

-- Grants
GRANT SELECT ON public.platform TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_member TO authenticated;
