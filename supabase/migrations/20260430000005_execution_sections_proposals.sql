-- Structured document sections for execution plans
-- Each plan gets a set of template sections that can be collaboratively edited via proposals

-- Add team lead flag
ALTER TABLE public.ev_execution_team ADD COLUMN IF NOT EXISTS is_lead boolean NOT NULL DEFAULT false;

-- Document sections
CREATE TABLE IF NOT EXISTS public.ev_execution_sections (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  key        TEXT NOT NULL,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.member(id) ON DELETE SET NULL,
  UNIQUE(plan_id, key)
);

-- Change proposals (git-style suggest & merge)
CREATE TABLE IF NOT EXISTS public.ev_section_proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES public.ev_execution_sections(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  old_content TEXT NOT NULL,
  new_content TEXT NOT NULL,
  comment     TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  reviewed_by UUID REFERENCES public.member(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create sections when an execution plan exists but has no sections yet
-- (will be triggered from the app, not a DB trigger)
