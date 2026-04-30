-- ============================================================
-- ERSTE VERSION — Improvement votes + Execution seed data
-- ============================================================

-- 1. Votes on improvement suggestions
CREATE TABLE IF NOT EXISTS public.ev_improvement_votes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  improvement_id  UUID NOT NULL REFERENCES public.ev_proposed_improvements(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  vote            TEXT NOT NULL CHECK (vote IN ('approve', 'abstain', 'disapprove', 'strong_disapproval')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (improvement_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_improvement_votes_improvement ON public.ev_improvement_votes(improvement_id);

ALTER TABLE public.ev_improvement_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read improvement votes" ON public.ev_improvement_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote on improvements" ON public.ev_improvement_votes
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 2. Execution seed data — Solar Energy (Topic 001)
-- ============================================================

-- Replace German execution seed with English
DELETE FROM public.ev_execution_plans
  WHERE issue_id IN (
    'e0e0e0e0-0000-0000-0000-000000000001',
    'e0e0e0e0-0000-0000-0000-000000000002'
  );

INSERT INTO public.ev_execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('f1000001-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000001',
   'Install a community solar infrastructure covering 80% of Auroville''s daytime energy needs by end of 2027.',
   '₹1.2 Crore (community fund + external grants)',
   '18 months')
ON CONFLICT (issue_id) DO NOTHING;

-- Tasks for Solar plan
INSERT INTO public.ev_execution_tasks (id, plan_id, title, description, status) VALUES
  ('f1000002-0000-0000-0000-000000000001', 'f1000001-0000-0000-0000-000000000001',
   'Roof structural assessment', 'Assess all community buildings for solar suitability', 'done'),
  ('f1000002-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001',
   'Source panel suppliers', 'Get quotes from 3+ certified suppliers', 'done'),
  ('f1000002-0000-0000-0000-000000000003', 'f1000001-0000-0000-0000-000000000001',
   'Apply for MNRE subsidy', 'Submit subsidy application to Ministry of New & Renewable Energy', 'in_progress'),
  ('f1000002-0000-0000-0000-000000000004', 'f1000001-0000-0000-0000-000000000001',
   'Install pilot batch (50 panels)', 'Phase 1 installation on Solar Kitchen + Visitor Centre roofs', 'in_progress'),
  ('f1000002-0000-0000-0000-000000000005', 'f1000001-0000-0000-0000-000000000001',
   'Community training on maintenance', 'Train 5 local technicians for ongoing upkeep', 'todo'),
  ('f1000002-0000-0000-0000-000000000006', 'f1000001-0000-0000-0000-000000000001',
   'Install battery storage units', 'Phase 2: 3 battery storage hubs across zones', 'todo'),
  ('f1000002-0000-0000-0000-000000000007', 'f1000001-0000-0000-0000-000000000001',
   'Full rollout (450 panels)', 'Phase 3: remaining community buildings', 'todo')
ON CONFLICT DO NOTHING;

-- Milestones for Solar plan
INSERT INTO public.ev_execution_milestones (id, plan_id, title, date) VALUES
  ('f1000003-0000-0000-0000-000000000001', 'f1000001-0000-0000-0000-000000000001',
   'Pilot installation complete', '2026-06-01'),
  ('f1000003-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001',
   'Subsidy approved & funds released', '2026-08-01'),
  ('f1000003-0000-0000-0000-000000000003', 'f1000001-0000-0000-0000-000000000001',
   'Battery storage operational', '2026-12-01'),
  ('f1000003-0000-0000-0000-000000000004', 'f1000001-0000-0000-0000-000000000001',
   'Full rollout complete', '2027-03-01')
ON CONFLICT DO NOTHING;

-- Team for Solar plan
INSERT INTO public.ev_execution_team (id, plan_id, user_id, role, status) VALUES
  ('f1000004-0000-0000-0000-000000000001', 'f1000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001', 'Project Lead', 'active'),
  ('f1000004-0000-0000-0000-000000000002', 'f1000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002', 'Technical Advisor', 'active'),
  ('f1000004-0000-0000-0000-000000000003', 'f1000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000004', 'Finance Coordinator', 'interested')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 3. Execution seed data — Water Management (Topic 002)
-- ============================================================

INSERT INTO public.ev_execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('f2000001-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000002',
   'Implement mandatory rainwater harvesting and smart metering across Auroville''s 400+ residential units by 2027.',
   '₹60 Lakh (phased — community fund + State Water Board grant)',
   '24 months')
ON CONFLICT (issue_id) DO NOTHING;

INSERT INTO public.ev_execution_tasks (id, plan_id, title, description, status) VALUES
  ('f2000002-0000-0000-0000-000000000001', 'f2000001-0000-0000-0000-000000000001',
   'Groundwater audit', 'Commission independent groundwater level study', 'done'),
  ('f2000002-0000-0000-0000-000000000002', 'f2000001-0000-0000-0000-000000000001',
   'Design harvesting standard', 'Define minimum specs for harvesting systems per building type', 'in_progress'),
  ('f2000002-0000-0000-0000-000000000003', 'f2000001-0000-0000-0000-000000000001',
   'Pilot smart meters (20 units)', 'Install and test meters in one residential zone', 'in_progress'),
  ('f2000002-0000-0000-0000-000000000004', 'f2000001-0000-0000-0000-000000000001',
   'Community water usage dashboard', 'Build public dashboard showing collective water usage', 'todo'),
  ('f2000002-0000-0000-0000-000000000005', 'f2000001-0000-0000-0000-000000000001',
   'Full meter rollout', 'Roll out smart meters to all residential units', 'todo'),
  ('f2000002-0000-0000-0000-000000000006', 'f2000001-0000-0000-0000-000000000001',
   'Harvesting system installations', 'Support installations across all applicable buildings', 'todo')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_milestones (id, plan_id, title, date) VALUES
  ('f2000003-0000-0000-0000-000000000001', 'f2000001-0000-0000-0000-000000000001',
   'Groundwater audit published', '2026-05-01'),
  ('f2000003-0000-0000-0000-000000000002', 'f2000001-0000-0000-0000-000000000001',
   'Pilot meters live', '2026-07-01'),
  ('f2000003-0000-0000-0000-000000000003', 'f2000001-0000-0000-0000-000000000001',
   'Usage dashboard launched', '2026-10-01'),
  ('f2000003-0000-0000-0000-000000000004', 'f2000001-0000-0000-0000-000000000001',
   'All units metered + harvesting complete', '2027-06-01')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_team (id, plan_id, user_id, role, status) VALUES
  ('f2000004-0000-0000-0000-000000000001', 'f2000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003', 'Water Systems Lead', 'active'),
  ('f2000004-0000-0000-0000-000000000002', 'f2000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002', 'Tech & Metering', 'active'),
  ('f2000004-0000-0000-0000-000000000003', 'f2000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000006', 'Community Liaison', 'interested')
ON CONFLICT DO NOTHING;
