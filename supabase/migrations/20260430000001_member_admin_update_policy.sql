-- Allow admins to update any member row (needed for approve/revoke, make admin, etc.)
CREATE POLICY "members_admin_update"
  ON public.member
  FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  );
