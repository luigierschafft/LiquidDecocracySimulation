-- Add short description field to issue table
ALTER TABLE public.issue ADD COLUMN IF NOT EXISTS description TEXT;
