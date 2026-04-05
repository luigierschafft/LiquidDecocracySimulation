-- Add 'draft' status to issue_status enum
-- Draft issues are only visible to their author (and admins)
ALTER TYPE issue_status ADD VALUE IF NOT EXISTS 'draft' BEFORE 'admission';
