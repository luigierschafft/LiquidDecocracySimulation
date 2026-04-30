-- Increase ev_statements text limit from 100 to 400 characters
ALTER TABLE public.ev_statements ALTER COLUMN text TYPE VARCHAR(400);
