-- Remove the "Lukas & Ana" (private) and "Test Platform" (test) platforms,
-- including their topics. Statements, arguments, votes etc. cascade from
-- issue; memberships cascade from platform. Only "auroville" remains.

BEGIN;

DELETE FROM public.issue
WHERE platform_id IN (SELECT id FROM public.platform WHERE slug IN ('private', 'test'));

DELETE FROM public.platform WHERE slug IN ('private', 'test');

COMMIT;
