-- /api/platform/join inserts members with status 'approved', but the insert
-- policy only allowed self-inserts with status 'pending', so joining a
-- platform failed silently. Allow direct joins for public platforms only.

DROP POLICY IF EXISTS "platform_member_insert" ON public.platform_member;

CREATE POLICY "platform_member_insert" ON public.platform_member
  FOR INSERT WITH CHECK (
    -- request to join any platform
    (user_id = auth.uid() AND status = 'pending')
    -- join public platforms directly
    OR (
      user_id = auth.uid() AND status = 'approved' AND role = 'member'
      AND EXISTS (SELECT 1 FROM public.platform p WHERE p.id = platform_id AND NOT p.is_invite_only)
    )
    -- global admins can add anyone
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );
