-- Module rows for voting modals
INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable) VALUES
('disapprove_reason', 99,  'Disapprove Reason',  'When a user clicks Disapprove, a modal asks for the reason. Saved to DB. User can skip.', 'M', 'Mindful Participation', false, false),
('strong_no_needs',   100, 'Strong No — Needs',  'When a user clicks Strong No, a modal asks what would need to change. Saved to DB. User can skip.', 'M', 'Mindful Participation', false, false),
('position_paper',    101, 'Position Paper',     'After any vote, an optional modal invites the user to share core values and key pro/contra arguments.', 'M', 'Mindful Participation', false, false),
('impact_level',      102, 'Impact Level',       'Before a user casts their first vote on a proposal, a modal asks how directly the proposal affects them.', 'M', 'Mindful Participation', false, false);

-- Table: ev_disapprove_reasons
CREATE TABLE IF NOT EXISTS public.ev_disapprove_reasons (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL,
  user_id     uuid NOT NULL,
  reason      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_disapprove_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own disapprove reasons"
  ON public.ev_disapprove_reasons FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select own disapprove reasons"
  ON public.ev_disapprove_reasons FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

GRANT INSERT, SELECT ON public.ev_disapprove_reasons TO authenticated;

-- Table: ev_strong_no_needs
CREATE TABLE IF NOT EXISTS public.ev_strong_no_needs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL,
  user_id     uuid NOT NULL,
  need        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_strong_no_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own strong no needs"
  ON public.ev_strong_no_needs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select own strong no needs"
  ON public.ev_strong_no_needs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

GRANT INSERT, SELECT ON public.ev_strong_no_needs TO authenticated;

-- Table: ev_position_papers
CREATE TABLE IF NOT EXISTS public.ev_position_papers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id    uuid NOT NULL,
  user_id        uuid NOT NULL,
  vote_value     text NOT NULL,
  core_values    text,
  pro_arguments  text,
  contra_arguments text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_position_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own position papers"
  ON public.ev_position_papers FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select own position papers"
  ON public.ev_position_papers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

GRANT INSERT, SELECT ON public.ev_position_papers TO authenticated;

-- Table: ev_vote_impact
CREATE TABLE IF NOT EXISTS public.ev_vote_impact (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id          uuid NOT NULL,
  user_id              uuid NOT NULL,
  impact_level         text NOT NULL,
  wants_participation  boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ev_vote_impact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own vote impact"
  ON public.ev_vote_impact FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select own vote impact"
  ON public.ev_vote_impact FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

GRANT INSERT, SELECT ON public.ev_vote_impact TO authenticated;
