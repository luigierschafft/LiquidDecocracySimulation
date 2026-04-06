-- Extend opinion table for topic-level discussion and reply nesting
ALTER TABLE public.opinion
  ALTER COLUMN initiative_id DROP NOT NULL,
  ADD COLUMN issue_id  UUID REFERENCES public.issue(id)   ON DELETE CASCADE,
  ADD COLUMN parent_id UUID REFERENCES public.opinion(id) ON DELETE CASCADE;

-- Ensure at least one of initiative_id or issue_id is set
ALTER TABLE public.opinion
  ADD CONSTRAINT opinion_requires_context
  CHECK (initiative_id IS NOT NULL OR issue_id IS NOT NULL);
