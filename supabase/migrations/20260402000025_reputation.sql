ALTER TABLE public.member
  ADD COLUMN IF NOT EXISTS reputation_score INTEGER NOT NULL DEFAULT 0;

-- Function to recalculate reputation for a member
-- Reputation = (votes cast * 1) + (opinions written * 2) + (arguments written * 3) + (initiatives created * 5)
CREATE OR REPLACE FUNCTION public.recalculate_reputation(member_uuid UUID)
RETURNS void AS $$
DECLARE
  v_score INTEGER;
BEGIN
  SELECT
    COALESCE((SELECT COUNT(*) FROM public.vote WHERE member_id = member_uuid), 0) * 1 +
    COALESCE((SELECT COUNT(*) FROM public.opinion WHERE author_id = member_uuid), 0) * 2 +
    COALESCE((SELECT COUNT(*) FROM public.argument WHERE author_id = member_uuid), 0) * 3 +
    COALESCE((SELECT COUNT(*) FROM public.initiative WHERE author_id = member_uuid AND is_draft = FALSE), 0) * 5
  INTO v_score;

  UPDATE public.member SET reputation_score = v_score WHERE id = member_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
