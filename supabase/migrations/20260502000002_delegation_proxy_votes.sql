-- Add is_proxy flag to all vote tables.
-- is_proxy = false → direct vote (always takes precedence)
-- is_proxy = true  → automatically cast via delegation

ALTER TABLE public.vote
  ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.ev_statement_ratings
  ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.ev_proposal_votes
  ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.ev_argument_ratings
  ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN NOT NULL DEFAULT FALSE;
