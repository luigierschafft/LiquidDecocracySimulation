-- ============================================================
-- Liquid Democracy Auroville — Database Schema
-- ============================================================

-- Enums
CREATE TYPE issue_status AS ENUM (
  'admission',
  'discussion',
  'verification',
  'voting',
  'closed'
);

CREATE TYPE vote_value AS ENUM ('approve', 'oppose', 'abstain');

-- ============================================================
-- PHASE 1 TABLES
-- ============================================================

-- Member profile (extends auth.users)
CREATE TABLE IF NOT EXISTS public.member (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  is_approved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unit (top-level group, e.g. "Environment", "Culture")
CREATE TABLE IF NOT EXISTS public.unit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Area (subtopic within a unit)
CREATE TABLE IF NOT EXISTS public.area (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES public.unit(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Policy (time configuration for issue lifecycle)
CREATE TABLE IF NOT EXISTS public.policy (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  admission_days      INTEGER NOT NULL DEFAULT 7,
  discussion_days     INTEGER NOT NULL DEFAULT 14,
  verification_days   INTEGER NOT NULL DEFAULT 7,
  voting_days         INTEGER NOT NULL DEFAULT 7,
  quorum              INTEGER NOT NULL DEFAULT 1,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Issue (a voting question / topic)
CREATE TABLE IF NOT EXISTS public.issue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  status          issue_status NOT NULL DEFAULT 'admission',
  area_id         UUID REFERENCES public.area(id) ON DELETE SET NULL,
  policy_id       UUID REFERENCES public.policy(id) ON DELETE SET NULL,
  author_id       UUID NOT NULL REFERENCES public.member(id),
  admission_at    TIMESTAMPTZ,
  discussion_at   TIMESTAMPTZ,
  verification_at TIMESTAMPTZ,
  voting_at       TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Initiative (a proposal within an issue)
CREATE TABLE IF NOT EXISTS public.initiative (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id    UUID NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  author_id   UUID NOT NULL REFERENCES public.member(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vote (approval voting: approve / oppose / abstain)
CREATE TABLE IF NOT EXISTS public.vote (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id  UUID NOT NULL REFERENCES public.initiative(id) ON DELETE CASCADE,
  member_id      UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  value          vote_value NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (initiative_id, member_id)
);

-- Opinion (comment / feedback on an initiative)
CREATE TABLE IF NOT EXISTS public.opinion (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id  UUID NOT NULL REFERENCES public.initiative(id) ON DELETE CASCADE,
  author_id      UUID NOT NULL REFERENCES public.member(id),
  content        TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Supporter (member supports initiative for quorum check)
CREATE TABLE IF NOT EXISTS public.supporter (
  initiative_id  UUID NOT NULL REFERENCES public.initiative(id) ON DELETE CASCADE,
  member_id      UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (initiative_id, member_id)
);

-- ============================================================
-- PHASE 2 TABLES
-- ============================================================

-- Delegation (liquid democracy core)
CREATE TABLE IF NOT EXISTS public.delegation (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_member_id UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  to_member_id   UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  unit_id        UUID REFERENCES public.unit(id) ON DELETE CASCADE,
  area_id        UUID REFERENCES public.area(id) ON DELETE CASCADE,
  issue_id       UUID REFERENCES public.issue(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Only one active delegation per member per scope
  CONSTRAINT one_scope CHECK (
    (unit_id IS NOT NULL)::int + (area_id IS NOT NULL)::int + (issue_id IS NOT NULL)::int <= 1
  )
);

-- Unique: one delegation per member per scope
CREATE UNIQUE INDEX IF NOT EXISTS delegation_unique_unit
  ON public.delegation (from_member_id, unit_id)
  WHERE unit_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS delegation_unique_area
  ON public.delegation (from_member_id, area_id)
  WHERE area_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS delegation_unique_issue
  ON public.delegation (from_member_id, issue_id)
  WHERE issue_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS delegation_unique_global
  ON public.delegation (from_member_id)
  WHERE unit_id IS NULL AND area_id IS NULL AND issue_id IS NULL;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-create member row on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.member (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.member     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unit       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiative ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opinion    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supporter  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delegation ENABLE ROW LEVEL SECURITY;

-- Member: public read, self update
CREATE POLICY "members_public_read" ON public.member FOR SELECT USING (true);
CREATE POLICY "members_self_update" ON public.member FOR UPDATE USING (auth.uid() = id);

-- Unit, Area, Policy: public read, admin write
CREATE POLICY "units_public_read" ON public.unit FOR SELECT USING (true);
CREATE POLICY "units_admin_write" ON public.unit FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "areas_public_read" ON public.area FOR SELECT USING (true);
CREATE POLICY "areas_admin_write" ON public.area FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "policies_public_read" ON public.policy FOR SELECT USING (true);
CREATE POLICY "policies_admin_write" ON public.policy FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

-- Issue: public read, approved members write
CREATE POLICY "issues_public_read" ON public.issue FOR SELECT USING (true);
CREATE POLICY "issues_approved_write" ON public.issue FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "issues_admin_update" ON public.issue FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

-- Initiative: public read, approved members write
CREATE POLICY "initiatives_public_read" ON public.initiative FOR SELECT USING (true);
CREATE POLICY "initiatives_approved_write" ON public.initiative FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);

-- Vote: read own votes, approved members write
CREATE POLICY "votes_public_read" ON public.vote FOR SELECT USING (true);
CREATE POLICY "votes_approved_write" ON public.vote FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "votes_self_update" ON public.vote FOR UPDATE USING (
  member_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "votes_self_delete" ON public.vote FOR DELETE USING (member_id = auth.uid());

-- Opinion: public read, approved members write
CREATE POLICY "opinions_public_read" ON public.opinion FOR SELECT USING (true);
CREATE POLICY "opinions_approved_write" ON public.opinion FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);

-- Supporter: public read, approved members write
CREATE POLICY "supporters_public_read" ON public.supporter FOR SELECT USING (true);
CREATE POLICY "supporters_approved_write" ON public.supporter FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "supporters_self_delete" ON public.supporter FOR DELETE USING (member_id = auth.uid());

-- Delegation: own delegations
CREATE POLICY "delegations_public_read" ON public.delegation FOR SELECT USING (true);
CREATE POLICY "delegations_self_write" ON public.delegation FOR INSERT WITH CHECK (
  from_member_id = auth.uid() AND
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_approved = true)
);
CREATE POLICY "delegations_self_delete" ON public.delegation FOR DELETE USING (from_member_id = auth.uid());

-- ============================================================
-- SEED DATA (defaults)
-- ============================================================

-- Default policy
INSERT INTO public.policy (name, admission_days, discussion_days, verification_days, voting_days, quorum)
VALUES ('Standard', 7, 14, 7, 7, 3)
ON CONFLICT DO NOTHING;

-- Default unit
INSERT INTO public.unit (name, description)
VALUES ('General', 'General community proposals')
ON CONFLICT DO NOTHING;
