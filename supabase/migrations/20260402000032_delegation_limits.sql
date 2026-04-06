ALTER TABLE public.member
  ADD COLUMN IF NOT EXISTS max_incoming_delegations INTEGER;
