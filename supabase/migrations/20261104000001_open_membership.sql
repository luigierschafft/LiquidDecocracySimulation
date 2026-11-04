-- Open membership: everyone who signs in can participate immediately.
--
-- Many write policies (statements, arguments, proposals, tasks, …) require
-- member.is_approved = true. Until admin approval is introduced, new members
-- are approved automatically.
--
-- To require admin approval again later:
--   ALTER TABLE public.member ALTER COLUMN is_approved SET DEFAULT false;
-- and set REQUIRE_MEMBER_APPROVAL = true in lib/config/membership.ts.

ALTER TABLE public.member ALTER COLUMN is_approved SET DEFAULT true;

-- Approve everyone who signed up so far
UPDATE public.member SET is_approved = true WHERE is_approved = false;
