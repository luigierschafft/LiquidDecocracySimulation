-- Module 14: Referencing — opinions can quote another opinion
-- referenced_opinion_id: the opinion being quoted
ALTER TABLE public.opinion
  ADD COLUMN referenced_opinion_id UUID REFERENCES public.opinion(id) ON DELETE SET NULL;
