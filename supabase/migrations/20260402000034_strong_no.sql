-- Add 'strong_no' vote option (Module 25)
ALTER TYPE vote_value ADD VALUE IF NOT EXISTS 'strong_no';
