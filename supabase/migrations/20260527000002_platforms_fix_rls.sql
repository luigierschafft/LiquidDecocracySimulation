-- Fix infinite recursion in platform_member RLS policies
-- Replace self-referencing subqueries with a SECURITY DEFINER function

DROP POLICY IF EXISTS "platform_member_select" ON public.platform_member;
DROP POLICY IF EXISTS "platform_member_insert" ON public.platform_member;
DROP POLICY IF EXISTS "platform_member_update" ON public.platform_member;
DROP POLICY IF EXISTS "platform_member_delete" ON public.platform_member;

CREATE OR REPLACE FUNCTION public.is_platform_admin(p_platform_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_member
    WHERE platform_id = p_platform_id
      AND user_id = auth.uid()
      AND role = 'admin'
      AND status = 'approved'
  );
$$;

CREATE POLICY "platform_member_select" ON public.platform_member
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_platform_admin(platform_id)
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "platform_member_insert" ON public.platform_member
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND status = 'pending')
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR is_platform_admin(platform_id)
  );

CREATE POLICY "platform_member_update" ON public.platform_member
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR is_platform_admin(platform_id)
  );

CREATE POLICY "platform_member_delete" ON public.platform_member
  FOR DELETE USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
    OR is_platform_admin(platform_id)
  );
