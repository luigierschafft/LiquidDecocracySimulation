-- Add separate vote column to ev_statement_ratings
-- This decouples agree/pass/disagree from the 0-10 importance rating

ALTER TABLE public.ev_statement_ratings
  ADD COLUMN IF NOT EXISTS vote text CHECK (vote IN ('agree', 'pass', 'disagree'));
