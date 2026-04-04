ALTER TABLE public.initiative
  ADD COLUMN IF NOT EXISTS estimated_cost TEXT,
  ADD COLUMN IF NOT EXISTS implementation_timeline TEXT,
  ADD COLUMN IF NOT EXISTS affected_areas TEXT[];
