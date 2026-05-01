-- Add photos column to ev_execution_sections
ALTER TABLE public.ev_execution_sections ADD COLUMN IF NOT EXISTS photos TEXT DEFAULT '[]';
