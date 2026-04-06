ALTER TABLE public.unit
  ADD COLUMN IF NOT EXISTS default_policy_id UUID REFERENCES public.policy(id) ON DELETE SET NULL;
ALTER TABLE public.area
  ADD COLUMN IF NOT EXISTS default_policy_id UUID REFERENCES public.policy(id) ON DELETE SET NULL;
