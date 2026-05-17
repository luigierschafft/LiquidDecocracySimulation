-- Table for empathy responses
CREATE TABLE IF NOT EXISTS public.ev_empathy_responses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id   uuid NOT NULL,
  user_id       uuid NOT NULL,
  vote_value    text NOT NULL,
  response      text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_empathy_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own empathy responses"
  ON public.ev_empathy_responses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can select empathy responses"
  ON public.ev_empathy_responses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true));

GRANT INSERT, SELECT ON public.ev_empathy_responses TO authenticated;

-- Module row
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable)
VALUES ('empathy_tool', 110, 'Empathy Tool', 'After casting a vote, users are invited to reflect on and write what they think are the core values of people who voted differently. Responses are saved anonymously.', 'M', 'Mindful Participation', false, false)
ON CONFLICT (key) DO NOTHING;
