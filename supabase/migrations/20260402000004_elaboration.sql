-- Elaboration document for an accepted proposal
CREATE TABLE public.elaboration (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id    UUID NOT NULL UNIQUE REFERENCES public.issue(id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES public.member(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sections within the elaboration document
CREATE TABLE public.elaboration_section (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  elaboration_id  UUID NOT NULL REFERENCES public.elaboration(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  content         TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  updated_by      UUID REFERENCES public.member(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Members who can edit sections
CREATE TABLE public.elaboration_editor (
  elaboration_id  UUID NOT NULL REFERENCES public.elaboration(id) ON DELETE CASCADE,
  member_id       UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (elaboration_id, member_id)
);

-- Comments on individual sections
CREATE TABLE public.elaboration_comment (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES public.elaboration_section(id) ON DELETE CASCADE,
  author_id   UUID NOT NULL REFERENCES public.member(id),
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.elaboration         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaboration_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaboration_editor  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elaboration_comment ENABLE ROW LEVEL SECURITY;

-- elaboration: public read, admin create
CREATE POLICY "elaboration_public_read"  ON public.elaboration FOR SELECT USING (true);
CREATE POLICY "elaboration_admin_insert" ON public.elaboration FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

-- sections: public read, admin insert/delete, editors + admins update
CREATE POLICY "elab_section_public_read" ON public.elaboration_section FOR SELECT USING (true);
CREATE POLICY "elab_section_admin_insert" ON public.elaboration_section FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "elab_section_admin_delete" ON public.elaboration_section FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "elab_section_editor_update" ON public.elaboration_section FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
  OR EXISTS (
    SELECT 1 FROM public.elaboration_editor
    WHERE elaboration_id = elaboration_section.elaboration_id AND member_id = auth.uid()
  )
);

-- editors: public read, admin manage
CREATE POLICY "elab_editor_public_read"  ON public.elaboration_editor FOR SELECT USING (true);
CREATE POLICY "elab_editor_admin_write"  ON public.elaboration_editor FOR ALL USING (
  EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true)
);

-- comments: public read, authenticated write
CREATE POLICY "elab_comment_public_read" ON public.elaboration_comment FOR SELECT USING (true);
CREATE POLICY "elab_comment_auth_write"  ON public.elaboration_comment FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
