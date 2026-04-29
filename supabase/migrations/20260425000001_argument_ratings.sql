-- Ratings for pro/contra discussion nodes (KialoTreeView)
CREATE TABLE IF NOT EXISTS public.ev_argument_ratings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id       UUID NOT NULL REFERENCES public.ev_discussion_nodes(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating >= 0 AND rating <= 10),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (node_id, user_id)
);

ALTER TABLE public.ev_argument_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ev_argument_ratings_read" ON public.ev_argument_ratings
  FOR SELECT USING (true);

CREATE POLICY "ev_argument_ratings_upsert" ON public.ev_argument_ratings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Ratings for pro/contra opinions (ProContraSection)
CREATE TABLE IF NOT EXISTS public.opinion_ratings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opinion_id    UUID NOT NULL REFERENCES public.opinion(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  rating        SMALLINT NOT NULL CHECK (rating >= 0 AND rating <= 10),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (opinion_id, user_id)
);

ALTER TABLE public.opinion_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "opinion_ratings_read" ON public.opinion_ratings
  FOR SELECT USING (true);

CREATE POLICY "opinion_ratings_upsert" ON public.opinion_ratings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
