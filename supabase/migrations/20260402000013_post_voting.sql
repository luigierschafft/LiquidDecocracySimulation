-- Post Voting: upvotes on opinions and arguments
CREATE TABLE public.post_vote (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id  UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  opinion_id UUID REFERENCES public.opinion(id) ON DELETE CASCADE,
  argument_id UUID REFERENCES public.argument(id) ON DELETE CASCADE,
  value      SMALLINT NOT NULL DEFAULT 1 CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- exactly one target
  CONSTRAINT post_vote_one_target CHECK (
    (opinion_id IS NOT NULL)::int + (argument_id IS NOT NULL)::int = 1
  ),
  -- one vote per member per target
  UNIQUE (member_id, opinion_id),
  UNIQUE (member_id, argument_id)
);

ALTER TABLE public.post_vote ENABLE ROW LEVEL SECURITY;

CREATE POLICY "post_vote_read_all"   ON public.post_vote FOR SELECT USING (true);
CREATE POLICY "post_vote_own_insert" ON public.post_vote FOR INSERT WITH CHECK (member_id = auth.uid());
CREATE POLICY "post_vote_own_delete" ON public.post_vote FOR DELETE USING (member_id = auth.uid());
