-- Add description field to policy table
ALTER TABLE public.policy
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Descriptions for seeded policies
UPDATE public.policy SET description = 'The default deliberative process. All members can participate through admission, discussion, verification, and voting phases. A proposal passes when it reaches quorum and the required approval threshold.'
  WHERE name = 'Standard Process';

UPDATE public.policy SET description = 'Accelerated process for urgent or time-sensitive decisions. Shorter phase durations and closes automatically as soon as quorum and approval threshold are met — no need to wait for the deadline.'
  WHERE name = 'Fast Track';

UPDATE public.policy SET description = 'Emphasises broad community agreement over speed. An extended discussion phase allows deeper deliberation. A proposal passes only when active opposition stays below the consensus threshold, ensuring wide buy-in.'
  WHERE name = 'Consensus-Based';

UPDATE public.policy SET description = 'Uses ranked voting to find the most broadly accepted proposal when several compete. Voters rank proposals by preference; the Schulze method determines the Condorcet winner — the option that beats all others head-to-head.'
  WHERE name ILIKE '%schulze%' OR name ILIKE '%ranked%';
