-- Allow team leads to add other members
-- Old policy only allowed inserting yourself (user_id = auth.uid())

DROP POLICY IF EXISTS "ev_pub_write" ON public.ev_execution_team;

CREATE POLICY "ev_team_insert" ON public.ev_execution_team FOR INSERT
  WITH CHECK (
    -- Can always add yourself
    user_id = auth.uid()
    OR
    -- Or you are already a lead on this plan
    EXISTS (
      SELECT 1 FROM public.ev_execution_team
      WHERE plan_id = ev_execution_team.plan_id
        AND user_id = auth.uid()
        AND is_lead = true
    )
  );

-- Also allow leads to update team members (approve requests, toggle lead)
DROP POLICY IF EXISTS "ev_pub_update" ON public.ev_execution_team;

CREATE POLICY "ev_team_update" ON public.ev_execution_team FOR UPDATE
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.ev_execution_team AS t2
      WHERE t2.plan_id = ev_execution_team.plan_id
        AND t2.user_id = auth.uid()
        AND t2.is_lead = true
    )
  );

-- Allow leads to remove members (deny requests)
CREATE POLICY "ev_team_delete" ON public.ev_execution_team FOR DELETE
  USING (
    user_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM public.ev_execution_team AS t2
      WHERE t2.plan_id = ev_execution_team.plan_id
        AND t2.user_id = auth.uid()
        AND t2.is_lead = true
    )
  );
