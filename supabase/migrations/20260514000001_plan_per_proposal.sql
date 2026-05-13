-- Add proposal_id to ev_execution_plans so each proposal can have its own plan
ALTER TABLE public.ev_execution_plans
  ADD COLUMN IF NOT EXISTS proposal_id UUID REFERENCES public.ev_topic_proposals(id) ON DELETE CASCADE;

-- Drop the old unique constraint (one plan per topic) to allow multiple plans per topic
ALTER TABLE public.ev_execution_plans
  DROP CONSTRAINT IF EXISTS ev_execution_plans_issue_id_key;

-- One plan per proposal
ALTER TABLE public.ev_execution_plans
  ADD CONSTRAINT ev_execution_plans_proposal_id_key UNIQUE (proposal_id);
