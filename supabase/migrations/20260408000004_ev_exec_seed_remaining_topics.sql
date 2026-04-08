-- ============================================================
-- Execution workspaces for topics 003, 004, 011
-- Framed as proposal elaboration workspaces
-- ============================================================

-- ============================================================
-- Topic 003 — Future School Curriculum Reform
-- ============================================================

INSERT INTO public.ev_execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('f3000001-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000003',
   'Draft a comprehensive curriculum reform proposal for Auroville''s Future School, integrating sustainability, arts, and self-directed learning — ready for community vote by Q4 2026.',
   '₹3.5 Lakh (workshops, expert consultants, materials)',
   '8 months')
ON CONFLICT (issue_id) DO NOTHING;

INSERT INTO public.ev_execution_tasks (id, plan_id, title, description, status) VALUES
  ('f3000002-0000-0000-0000-000000000001', 'f3000001-0000-0000-0000-000000000001',
   'Review existing curriculum', 'Document current subject structure, teaching hours, and gaps identified by teachers', 'done'),
  ('f3000002-0000-0000-0000-000000000002', 'f3000001-0000-0000-0000-000000000001',
   'Benchmark 5 alternative schools', 'Research Waldorf, Sudbury, and other progressive models for reference', 'done'),
  ('f3000002-0000-0000-0000-000000000003', 'f3000001-0000-0000-0000-000000000001',
   'Student & parent interviews', 'Conduct 30 structured interviews to capture learning needs and values', 'in_progress'),
  ('f3000002-0000-0000-0000-000000000004', 'f3000001-0000-0000-0000-000000000001',
   'Draft new curriculum framework', 'Write the core framework: subjects, hours, pedagogy principles', 'in_progress'),
  ('f3000002-0000-0000-0000-000000000005', 'f3000001-0000-0000-0000-000000000001',
   'Teacher workshop & feedback round', 'Present draft to all teachers for input and revision', 'todo'),
  ('f3000002-0000-0000-0000-000000000006', 'f3000001-0000-0000-0000-000000000001',
   'Legal & accreditation check', 'Verify proposal meets Indian national board requirements', 'todo'),
  ('f3000002-0000-0000-0000-000000000007', 'f3000001-0000-0000-0000-000000000001',
   'Write budget & resource plan', 'Define costs for training, materials, facility changes', 'todo'),
  ('f3000002-0000-0000-0000-000000000008', 'f3000001-0000-0000-0000-000000000001',
   'Community open review (2 weeks)', 'Publish draft proposal for community comment before final vote', 'todo'),
  ('f3000002-0000-0000-0000-000000000009', 'f3000001-0000-0000-0000-000000000001',
   'Final proposal document ready', 'Incorporate all feedback and publish final version for vote', 'todo')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_milestones (id, plan_id, title, date) VALUES
  ('f3000003-0000-0000-0000-000000000001', 'f3000001-0000-0000-0000-000000000001',
   'Research phase complete', '2026-05-15'),
  ('f3000003-0000-0000-0000-000000000002', 'f3000001-0000-0000-0000-000000000001',
   'First draft shared with teachers', '2026-07-01'),
  ('f3000003-0000-0000-0000-000000000003', 'f3000001-0000-0000-0000-000000000001',
   'Community review period open', '2026-09-01'),
  ('f3000003-0000-0000-0000-000000000004', 'f3000001-0000-0000-0000-000000000001',
   'Final proposal submitted for vote', '2026-10-15')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_team (id, plan_id, user_id, role, status) VALUES
  ('f3000004-0000-0000-0000-000000000001', 'f3000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003', 'Proposal Lead', 'active'),
  ('f3000004-0000-0000-0000-000000000002', 'f3000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005', 'Teacher Representative', 'active'),
  ('f3000004-0000-0000-0000-000000000003', 'f3000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000006', 'Parent Liaison', 'interested')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Topic 004 — Mandatory Rainwater Harvesting Policy
-- ============================================================

INSERT INTO public.ev_execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('f4000001-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000004',
   'Develop a binding rainwater harvesting policy for all new and existing Auroville buildings, including technical standards, compliance timeline, and support fund for low-income units.',
   '₹1.8 Lakh (research, legal drafting, public consultations)',
   '6 months')
ON CONFLICT (issue_id) DO NOTHING;

INSERT INTO public.ev_execution_tasks (id, plan_id, title, description, status) VALUES
  ('f4000002-0000-0000-0000-000000000001', 'f4000001-0000-0000-0000-000000000001',
   'Assess current harvesting coverage', 'Survey which buildings already have systems, map by zone', 'done'),
  ('f4000002-0000-0000-0000-000000000002', 'f4000001-0000-0000-0000-000000000001',
   'Define technical minimum standard', 'Set minimum tank size, roof catchment area, filter specs per building type', 'done'),
  ('f4000002-0000-0000-0000-000000000003', 'f4000001-0000-0000-0000-000000000001',
   'Cost modelling per building type', 'Estimate installation cost for each category of building', 'in_progress'),
  ('f4000002-0000-0000-0000-000000000004', 'f4000001-0000-0000-0000-000000000001',
   'Draft policy text', 'Write binding policy including scope, deadlines, enforcement mechanism', 'in_progress'),
  ('f4000002-0000-0000-0000-000000000005', 'f4000001-0000-0000-0000-000000000001',
   'Design community support fund', 'Define subsidy structure for units unable to self-fund installation', 'todo'),
  ('f4000002-0000-0000-0000-000000000006', 'f4000001-0000-0000-0000-000000000001',
   'Legal review with AV legal team', 'Ensure enforceability within Auroville''s governance framework', 'todo'),
  ('f4000002-0000-0000-0000-000000000007', 'f4000001-0000-0000-0000-000000000001',
   'Community consultation open', 'Two-week open comment period before final vote', 'todo'),
  ('f4000002-0000-0000-0000-000000000008', 'f4000001-0000-0000-0000-000000000001',
   'Final policy document ready', 'Integrate all feedback, publish for community approval', 'todo')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_milestones (id, plan_id, title, date) VALUES
  ('f4000003-0000-0000-0000-000000000001', 'f4000001-0000-0000-0000-000000000001',
   'Coverage survey published', '2026-05-01'),
  ('f4000003-0000-0000-0000-000000000002', 'f4000001-0000-0000-0000-000000000001',
   'Technical standard defined', '2026-06-01'),
  ('f4000003-0000-0000-0000-000000000003', 'f4000001-0000-0000-0000-000000000001',
   'Policy draft open for community review', '2026-08-15'),
  ('f4000003-0000-0000-0000-000000000004', 'f4000001-0000-0000-0000-000000000001',
   'Final policy submitted for vote', '2026-10-01')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_team (id, plan_id, user_id, role, status) VALUES
  ('f4000004-0000-0000-0000-000000000001', 'f4000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000004', 'Policy Lead', 'active'),
  ('f4000004-0000-0000-0000-000000000002', 'f4000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002', 'Technical Advisor', 'active'),
  ('f4000004-0000-0000-0000-000000000003', 'f4000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001', 'Legal Reviewer', 'interested')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Topic 011 — Community Medicinal Herb & Wellness Garden
-- ============================================================

INSERT INTO public.ev_execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('f1100001-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000011',
   'Create a detailed project proposal for a 2-acre community medicinal herb garden in Auroville, covering land allocation, plant selection, maintenance structure, public access policy, and funding plan.',
   '₹4.2 Lakh (land prep, seeds, tools, signage, first-year maintenance)',
   '5 months to proposal ready — 12 months to first harvest')
ON CONFLICT (issue_id) DO NOTHING;

INSERT INTO public.ev_execution_tasks (id, plan_id, title, description, status) VALUES
  ('f1100002-0000-0000-0000-000000000001', 'f1100001-0000-0000-0000-000000000001',
   'Identify suitable land parcels', 'Assess 3–4 candidate plots for soil quality, water access, and sunlight', 'done'),
  ('f1100002-0000-0000-0000-000000000002', 'f1100001-0000-0000-0000-000000000001',
   'Compile medicinal plant list', 'Work with Ayurvedic practitioners to select 40–60 priority species', 'done'),
  ('f1100002-0000-0000-0000-000000000003', 'f1100001-0000-0000-0000-000000000001',
   'Design garden layout', 'Create zoned layout: healing herbs, common kitchen herbs, rare species section', 'in_progress'),
  ('f1100002-0000-0000-0000-000000000004', 'f1100001-0000-0000-0000-000000000001',
   'Draft access & maintenance policy', 'Define opening hours, harvesting rules, volunteer structure', 'in_progress'),
  ('f1100002-0000-0000-0000-000000000005', 'f1100001-0000-0000-0000-000000000001',
   'Estimate full project budget', 'Itemize all costs: land prep, water systems, plants, tools, signage', 'todo'),
  ('f1100002-0000-0000-0000-000000000006', 'f1100001-0000-0000-0000-000000000001',
   'Explore grant & partnership options', 'Contact SAIIER, Auroville Foundation, and NGOs for co-funding', 'todo'),
  ('f1100002-0000-0000-0000-000000000007', 'f1100001-0000-0000-0000-000000000001',
   'Community open house presentation', 'Present garden concept and proposal draft to the broader community', 'todo'),
  ('f1100002-0000-0000-0000-000000000008', 'f1100001-0000-0000-0000-000000000001',
   'Finalize proposal document', 'Incorporate all feedback and publish complete proposal for vote', 'todo')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_milestones (id, plan_id, title, date) VALUES
  ('f1100003-0000-0000-0000-000000000001', 'f1100001-0000-0000-0000-000000000001',
   'Land selected & plant list finalized', '2026-05-01'),
  ('f1100003-0000-0000-0000-000000000002', 'f1100001-0000-0000-0000-000000000001',
   'Garden layout design complete', '2026-06-15'),
  ('f1100003-0000-0000-0000-000000000003', 'f1100001-0000-0000-0000-000000000001',
   'Community open house held', '2026-08-01'),
  ('f1100003-0000-0000-0000-000000000004', 'f1100001-0000-0000-0000-000000000001',
   'Final proposal ready for community vote', '2026-09-15')
ON CONFLICT DO NOTHING;

INSERT INTO public.ev_execution_team (id, plan_id, user_id, role, status) VALUES
  ('f1100004-0000-0000-0000-000000000001', 'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005', 'Garden Project Lead', 'active'),
  ('f1100004-0000-0000-0000-000000000002', 'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003', 'Botanist & Plant Advisor', 'active'),
  ('f1100004-0000-0000-0000-000000000003', 'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000006', 'Community Liaison', 'interested'),
  ('f1100004-0000-0000-0000-000000000004', 'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001', 'Funding & Grants', 'interested')
ON CONFLICT DO NOTHING;
