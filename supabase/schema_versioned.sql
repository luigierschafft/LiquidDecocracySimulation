-- ============================================================
-- Liquid Democracy Auroville — Versioned Schemas (v1, v2, v3)
-- Run this ONCE in the main Supabase project SQL editor
-- ============================================================

-- ============================================================
-- SCHEMA V1
-- ============================================================
CREATE SCHEMA IF NOT EXISTS v1;

DO $$ BEGIN
  CREATE TYPE v1.issue_status AS ENUM ('admission','discussion','verification','voting','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE v1.vote_value AS ENUM ('approve','oppose','abstain');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS v1.member (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  is_approved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.unit (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.area (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES v1.unit(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.policy (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  admission_days    INTEGER NOT NULL DEFAULT 7,
  discussion_days   INTEGER NOT NULL DEFAULT 14,
  verification_days INTEGER NOT NULL DEFAULT 7,
  voting_days       INTEGER NOT NULL DEFAULT 7,
  quorum            INTEGER NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.issue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  status          v1.issue_status NOT NULL DEFAULT 'admission',
  area_id         UUID REFERENCES v1.area(id) ON DELETE SET NULL,
  policy_id       UUID REFERENCES v1.policy(id) ON DELETE SET NULL,
  author_id       UUID NOT NULL REFERENCES v1.member(id),
  admission_at    TIMESTAMPTZ,
  discussion_at   TIMESTAMPTZ,
  verification_at TIMESTAMPTZ,
  voting_at       TIMESTAMPTZ,
  closed_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.initiative (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id   UUID NOT NULL REFERENCES v1.issue(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  author_id  UUID NOT NULL REFERENCES v1.member(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.vote (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES v1.initiative(id) ON DELETE CASCADE,
  member_id     UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  value         v1.vote_value NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v1.opinion (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiative_id UUID NOT NULL REFERENCES v1.initiative(id) ON DELETE CASCADE,
  author_id     UUID NOT NULL REFERENCES v1.member(id),
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v1.supporter (
  initiative_id UUID NOT NULL REFERENCES v1.initiative(id) ON DELETE CASCADE,
  member_id     UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v1.delegation (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_member_id UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  to_member_id   UUID NOT NULL REFERENCES v1.member(id) ON DELETE CASCADE,
  unit_id        UUID REFERENCES v1.unit(id) ON DELETE CASCADE,
  area_id        UUID REFERENCES v1.area(id) ON DELETE CASCADE,
  issue_id       UUID REFERENCES v1.issue(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT one_scope CHECK (
    (unit_id IS NOT NULL)::int + (area_id IS NOT NULL)::int + (issue_id IS NOT NULL)::int <= 1
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS v1_delegation_unique_unit   ON v1.delegation (from_member_id, unit_id)  WHERE unit_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v1_delegation_unique_area   ON v1.delegation (from_member_id, area_id)  WHERE area_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v1_delegation_unique_issue  ON v1.delegation (from_member_id, issue_id) WHERE issue_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v1_delegation_unique_global ON v1.delegation (from_member_id)           WHERE unit_id IS NULL AND area_id IS NULL AND issue_id IS NULL;

-- Trigger: auto-create member on signup
CREATE OR REPLACE FUNCTION v1.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = v1
AS $$
BEGIN
  INSERT INTO v1.member (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- RLS
ALTER TABLE v1.member     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.unit       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.area       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.policy     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.issue      ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.initiative ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.vote       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.opinion    ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.supporter  ENABLE ROW LEVEL SECURITY;
ALTER TABLE v1.delegation ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "v1_members_public_read"  ON v1.member FOR SELECT USING (true);
  CREATE POLICY "v1_members_self_update"  ON v1.member FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "v1_units_public_read"    ON v1.unit   FOR SELECT USING (true);
  CREATE POLICY "v1_units_admin_write"    ON v1.unit   FOR ALL    USING (EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v1_areas_public_read"    ON v1.area   FOR SELECT USING (true);
  CREATE POLICY "v1_areas_admin_write"    ON v1.area   FOR ALL    USING (EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v1_policies_public_read" ON v1.policy FOR SELECT USING (true);
  CREATE POLICY "v1_policies_admin_write" ON v1.policy FOR ALL    USING (EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v1_issues_public_read"   ON v1.issue  FOR SELECT USING (true);
  CREATE POLICY "v1_issues_auth_write"    ON v1.issue  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v1_issues_admin_update"  ON v1.issue  FOR UPDATE USING (EXISTS (SELECT 1 FROM v1.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v1_initiatives_public_read"  ON v1.initiative FOR SELECT USING (true);
  CREATE POLICY "v1_initiatives_auth_write"   ON v1.initiative FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v1_votes_public_read"    ON v1.vote FOR SELECT USING (true);
  CREATE POLICY "v1_votes_auth_write"     ON v1.vote FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v1_votes_self_update"    ON v1.vote FOR UPDATE USING (member_id = auth.uid());
  CREATE POLICY "v1_votes_self_delete"    ON v1.vote FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v1_opinions_public_read" ON v1.opinion FOR SELECT USING (true);
  CREATE POLICY "v1_opinions_auth_write"  ON v1.opinion FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v1_supporters_public_read"  ON v1.supporter FOR SELECT USING (true);
  CREATE POLICY "v1_supporters_auth_write"   ON v1.supporter FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v1_supporters_self_delete"  ON v1.supporter FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v1_delegations_public_read" ON v1.delegation FOR SELECT USING (true);
  CREATE POLICY "v1_delegations_self_write"  ON v1.delegation FOR INSERT WITH CHECK (from_member_id = auth.uid());
  CREATE POLICY "v1_delegations_self_delete" ON v1.delegation FOR DELETE USING (from_member_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Seed
INSERT INTO v1.policy (name, admission_days, discussion_days, verification_days, voting_days, quorum)
VALUES ('Standard', 7, 14, 7, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO v1.unit (name, description)
VALUES ('General', 'General community proposals') ON CONFLICT DO NOTHING;


-- ============================================================
-- SCHEMA V2
-- ============================================================
CREATE SCHEMA IF NOT EXISTS v2;

DO $$ BEGIN
  CREATE TYPE v2.issue_status AS ENUM ('admission','discussion','verification','voting','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE v2.vote_value AS ENUM ('approve','oppose','abstain');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS v2.member (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  is_approved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.unit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.area (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), unit_id UUID NOT NULL REFERENCES v2.unit(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.policy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, admission_days INTEGER NOT NULL DEFAULT 7, discussion_days INTEGER NOT NULL DEFAULT 14, verification_days INTEGER NOT NULL DEFAULT 7, voting_days INTEGER NOT NULL DEFAULT 7, quorum INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.issue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, status v2.issue_status NOT NULL DEFAULT 'admission', area_id UUID REFERENCES v2.area(id) ON DELETE SET NULL, policy_id UUID REFERENCES v2.policy(id) ON DELETE SET NULL, author_id UUID NOT NULL REFERENCES v2.member(id), admission_at TIMESTAMPTZ, discussion_at TIMESTAMPTZ, verification_at TIMESTAMPTZ, voting_at TIMESTAMPTZ, closed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.initiative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), issue_id UUID NOT NULL REFERENCES v2.issue(id) ON DELETE CASCADE, title TEXT NOT NULL, content TEXT NOT NULL, author_id UUID NOT NULL REFERENCES v2.member(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.vote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), initiative_id UUID NOT NULL REFERENCES v2.initiative(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES v2.member(id) ON DELETE CASCADE, value v2.vote_value NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v2.opinion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), initiative_id UUID NOT NULL REFERENCES v2.initiative(id) ON DELETE CASCADE, author_id UUID NOT NULL REFERENCES v2.member(id), content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v2.supporter (
  initiative_id UUID NOT NULL REFERENCES v2.initiative(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES v2.member(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v2.delegation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), from_member_id UUID NOT NULL REFERENCES v2.member(id) ON DELETE CASCADE, to_member_id UUID NOT NULL REFERENCES v2.member(id) ON DELETE CASCADE, unit_id UUID REFERENCES v2.unit(id) ON DELETE CASCADE, area_id UUID REFERENCES v2.area(id) ON DELETE CASCADE, issue_id UUID REFERENCES v2.issue(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT v2_one_scope CHECK ((unit_id IS NOT NULL)::int + (area_id IS NOT NULL)::int + (issue_id IS NOT NULL)::int <= 1)
);
CREATE UNIQUE INDEX IF NOT EXISTS v2_delegation_unique_unit   ON v2.delegation (from_member_id, unit_id)  WHERE unit_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v2_delegation_unique_area   ON v2.delegation (from_member_id, area_id)  WHERE area_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v2_delegation_unique_issue  ON v2.delegation (from_member_id, issue_id) WHERE issue_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v2_delegation_unique_global ON v2.delegation (from_member_id)           WHERE unit_id IS NULL AND area_id IS NULL AND issue_id IS NULL;

CREATE OR REPLACE FUNCTION v2.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = v2
AS $$
BEGIN
  INSERT INTO v2.member (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

ALTER TABLE v2.member     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.unit       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.area       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.policy     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.issue      ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.initiative ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.vote       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.opinion    ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.supporter  ENABLE ROW LEVEL SECURITY;
ALTER TABLE v2.delegation ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "v2_members_public_read"     ON v2.member     FOR SELECT USING (true);
  CREATE POLICY "v2_members_self_update"     ON v2.member     FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "v2_units_public_read"       ON v2.unit       FOR SELECT USING (true);
  CREATE POLICY "v2_units_admin_write"       ON v2.unit       FOR ALL    USING (EXISTS (SELECT 1 FROM v2.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v2_areas_public_read"       ON v2.area       FOR SELECT USING (true);
  CREATE POLICY "v2_areas_admin_write"       ON v2.area       FOR ALL    USING (EXISTS (SELECT 1 FROM v2.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v2_policies_public_read"    ON v2.policy     FOR SELECT USING (true);
  CREATE POLICY "v2_policies_admin_write"    ON v2.policy     FOR ALL    USING (EXISTS (SELECT 1 FROM v2.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v2_issues_public_read"      ON v2.issue      FOR SELECT USING (true);
  CREATE POLICY "v2_issues_auth_write"       ON v2.issue      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v2_issues_admin_update"     ON v2.issue      FOR UPDATE USING (EXISTS (SELECT 1 FROM v2.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v2_initiatives_public_read" ON v2.initiative FOR SELECT USING (true);
  CREATE POLICY "v2_initiatives_auth_write"  ON v2.initiative FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v2_votes_public_read"       ON v2.vote       FOR SELECT USING (true);
  CREATE POLICY "v2_votes_auth_write"        ON v2.vote       FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v2_votes_self_update"       ON v2.vote       FOR UPDATE USING (member_id = auth.uid());
  CREATE POLICY "v2_votes_self_delete"       ON v2.vote       FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v2_opinions_public_read"    ON v2.opinion    FOR SELECT USING (true);
  CREATE POLICY "v2_opinions_auth_write"     ON v2.opinion    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v2_supporters_public_read"  ON v2.supporter  FOR SELECT USING (true);
  CREATE POLICY "v2_supporters_auth_write"   ON v2.supporter  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v2_supporters_self_delete"  ON v2.supporter  FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v2_delegations_public_read" ON v2.delegation FOR SELECT USING (true);
  CREATE POLICY "v2_delegations_self_write"  ON v2.delegation FOR INSERT WITH CHECK (from_member_id = auth.uid());
  CREATE POLICY "v2_delegations_self_delete" ON v2.delegation FOR DELETE USING (from_member_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO v2.policy (name, admission_days, discussion_days, verification_days, voting_days, quorum)
VALUES ('Standard', 7, 14, 7, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO v2.unit (name, description)
VALUES ('General', 'General community proposals') ON CONFLICT DO NOTHING;


-- ============================================================
-- SCHEMA V3
-- ============================================================
CREATE SCHEMA IF NOT EXISTS v3;

DO $$ BEGIN
  CREATE TYPE v3.issue_status AS ENUM ('admission','discussion','verification','voting','closed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE v3.vote_value AS ENUM ('approve','oppose','abstain');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS v3.member (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  display_name TEXT,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  is_approved  BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.unit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.area (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), unit_id UUID NOT NULL REFERENCES v3.unit(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.policy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, admission_days INTEGER NOT NULL DEFAULT 7, discussion_days INTEGER NOT NULL DEFAULT 14, verification_days INTEGER NOT NULL DEFAULT 7, voting_days INTEGER NOT NULL DEFAULT 7, quorum INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.issue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, status v3.issue_status NOT NULL DEFAULT 'admission', area_id UUID REFERENCES v3.area(id) ON DELETE SET NULL, policy_id UUID REFERENCES v3.policy(id) ON DELETE SET NULL, author_id UUID NOT NULL REFERENCES v3.member(id), admission_at TIMESTAMPTZ, discussion_at TIMESTAMPTZ, verification_at TIMESTAMPTZ, voting_at TIMESTAMPTZ, closed_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.initiative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), issue_id UUID NOT NULL REFERENCES v3.issue(id) ON DELETE CASCADE, title TEXT NOT NULL, content TEXT NOT NULL, author_id UUID NOT NULL REFERENCES v3.member(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.vote (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), initiative_id UUID NOT NULL REFERENCES v3.initiative(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES v3.member(id) ON DELETE CASCADE, value v3.vote_value NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v3.opinion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), initiative_id UUID NOT NULL REFERENCES v3.initiative(id) ON DELETE CASCADE, author_id UUID NOT NULL REFERENCES v3.member(id), content TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS v3.supporter (
  initiative_id UUID NOT NULL REFERENCES v3.initiative(id) ON DELETE CASCADE, member_id UUID NOT NULL REFERENCES v3.member(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (initiative_id, member_id)
);
CREATE TABLE IF NOT EXISTS v3.delegation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), from_member_id UUID NOT NULL REFERENCES v3.member(id) ON DELETE CASCADE, to_member_id UUID NOT NULL REFERENCES v3.member(id) ON DELETE CASCADE, unit_id UUID REFERENCES v3.unit(id) ON DELETE CASCADE, area_id UUID REFERENCES v3.area(id) ON DELETE CASCADE, issue_id UUID REFERENCES v3.issue(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT v3_one_scope CHECK ((unit_id IS NOT NULL)::int + (area_id IS NOT NULL)::int + (issue_id IS NOT NULL)::int <= 1)
);
CREATE UNIQUE INDEX IF NOT EXISTS v3_delegation_unique_unit   ON v3.delegation (from_member_id, unit_id)  WHERE unit_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v3_delegation_unique_area   ON v3.delegation (from_member_id, area_id)  WHERE area_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v3_delegation_unique_issue  ON v3.delegation (from_member_id, issue_id) WHERE issue_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS v3_delegation_unique_global ON v3.delegation (from_member_id)           WHERE unit_id IS NULL AND area_id IS NULL AND issue_id IS NULL;

CREATE OR REPLACE FUNCTION v3.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = v3
AS $$
BEGIN
  INSERT INTO v3.member (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

ALTER TABLE v3.member     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.unit       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.area       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.policy     ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.issue      ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.initiative ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.vote       ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.opinion    ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.supporter  ENABLE ROW LEVEL SECURITY;
ALTER TABLE v3.delegation ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "v3_members_public_read"     ON v3.member     FOR SELECT USING (true);
  CREATE POLICY "v3_members_self_update"     ON v3.member     FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "v3_units_public_read"       ON v3.unit       FOR SELECT USING (true);
  CREATE POLICY "v3_units_admin_write"       ON v3.unit       FOR ALL    USING (EXISTS (SELECT 1 FROM v3.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v3_areas_public_read"       ON v3.area       FOR SELECT USING (true);
  CREATE POLICY "v3_areas_admin_write"       ON v3.area       FOR ALL    USING (EXISTS (SELECT 1 FROM v3.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v3_policies_public_read"    ON v3.policy     FOR SELECT USING (true);
  CREATE POLICY "v3_policies_admin_write"    ON v3.policy     FOR ALL    USING (EXISTS (SELECT 1 FROM v3.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v3_issues_public_read"      ON v3.issue      FOR SELECT USING (true);
  CREATE POLICY "v3_issues_auth_write"       ON v3.issue      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v3_issues_admin_update"     ON v3.issue      FOR UPDATE USING (EXISTS (SELECT 1 FROM v3.member WHERE id = auth.uid() AND is_admin = true));
  CREATE POLICY "v3_initiatives_public_read" ON v3.initiative FOR SELECT USING (true);
  CREATE POLICY "v3_initiatives_auth_write"  ON v3.initiative FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v3_votes_public_read"       ON v3.vote       FOR SELECT USING (true);
  CREATE POLICY "v3_votes_auth_write"        ON v3.vote       FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v3_votes_self_update"       ON v3.vote       FOR UPDATE USING (member_id = auth.uid());
  CREATE POLICY "v3_votes_self_delete"       ON v3.vote       FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v3_opinions_public_read"    ON v3.opinion    FOR SELECT USING (true);
  CREATE POLICY "v3_opinions_auth_write"     ON v3.opinion    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v3_supporters_public_read"  ON v3.supporter  FOR SELECT USING (true);
  CREATE POLICY "v3_supporters_auth_write"   ON v3.supporter  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "v3_supporters_self_delete"  ON v3.supporter  FOR DELETE USING (member_id = auth.uid());
  CREATE POLICY "v3_delegations_public_read" ON v3.delegation FOR SELECT USING (true);
  CREATE POLICY "v3_delegations_self_write"  ON v3.delegation FOR INSERT WITH CHECK (from_member_id = auth.uid());
  CREATE POLICY "v3_delegations_self_delete" ON v3.delegation FOR DELETE USING (from_member_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

INSERT INTO v3.policy (name, admission_days, discussion_days, verification_days, voting_days, quorum)
VALUES ('Standard', 7, 14, 7, 7, 3) ON CONFLICT DO NOTHING;
INSERT INTO v3.unit (name, description)
VALUES ('General', 'General community proposals') ON CONFLICT DO NOTHING;
