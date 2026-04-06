-- Module 11: Questions Tagging + Module 15: Intention Display
-- Adds intent/tag to opinions

ALTER TABLE public.opinion
  ADD COLUMN intent TEXT CHECK (intent IN ('support', 'concern', 'question', 'info')) DEFAULT NULL;
