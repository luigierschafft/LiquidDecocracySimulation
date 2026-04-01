ALTER TABLE public.issue
  ADD COLUMN accepted_initiative_id UUID REFERENCES public.initiative(id) ON DELETE SET NULL;
