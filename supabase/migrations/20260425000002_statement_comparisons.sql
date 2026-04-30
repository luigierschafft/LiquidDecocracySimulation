-- ============================================================
-- Hybrid ranking: pairwise comparisons (Schulze-compatible)
-- + ELO score cache on ev_statements
-- ============================================================

ALTER TABLE public.ev_statements
  ADD COLUMN IF NOT EXISTS elo_score INTEGER DEFAULT 1000;

CREATE TABLE IF NOT EXISTS public.ev_statement_comparisons (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id   UUID        NOT NULL REFERENCES public.issue(id) ON DELETE CASCADE,
  winner_id  UUID        NOT NULL REFERENCES public.ev_statements(id) ON DELETE CASCADE,
  loser_id   UUID        NOT NULL REFERENCES public.ev_statements(id) ON DELETE CASCADE,
  user_id    UUID        REFERENCES public.member(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ev_statement_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_ev_statement_comparisons"
  ON public.ev_statement_comparisons FOR SELECT USING (true);

CREATE POLICY "insert_ev_statement_comparisons"
  ON public.ev_statement_comparisons FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
