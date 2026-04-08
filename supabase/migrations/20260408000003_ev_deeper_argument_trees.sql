-- ============================================================
-- Deeper argument trees: more pro/contra + questions with nested nodes
-- 5 statements get full trees
-- ============================================================

-- ============================================================
-- 1. Wellness Garden — "open 7 days a week" (b5000001-...-001)
--    Already has: pro d5010001-001, contra d5010001-002
-- ============================================================

-- Extra pro/contra
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010001-0000-0000-0000-000000000003', 'b5000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Regular opening builds a daily wellness habit for the whole community.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d5010001-0000-0000-0000-000000000004', 'b5000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Seven-day operation significantly raises annual maintenance costs.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- 3 Questions
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010002-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000001', NULL, 'question',
   'What would the actual opening hours look like in practice?', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d5010002-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000001', NULL, 'question',
   'Who is responsible for maintaining the garden on weekends?', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d5010002-0000-0000-0000-000000000003', 'b5000001-0000-0000-0000-000000000001', NULL, 'question',
   'Should non-Auroville visitors also have access on all 7 days?', 'a0a0a0a0-0000-0000-0000-000000000006');

-- Pro/Contra nested under Question 1
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010003-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000001', 'pro',
   'Staggered hours (7am–7pm) balance open access with plant security.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d5010003-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000001', 'contra',
   'Without evening closure, theft of medicinal plants is likely.', 'a0a0a0a0-0000-0000-0000-000000000003');

-- Pro/Contra nested under Question 2
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010003-0000-0000-0000-000000000003', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000002', 'pro',
   'A volunteer rota could cover weekend maintenance sustainably.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d5010003-0000-0000-0000-000000000004', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000002', 'contra',
   'Volunteer fatigue is real — paid weekend staff will likely be needed.', 'a0a0a0a0-0000-0000-0000-000000000004');

-- Pro/Contra nested under Question 3
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010003-0000-0000-0000-000000000005', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000003', 'pro',
   'Open access to visitors spreads Auroville''s wellness knowledge widely.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d5010003-0000-0000-0000-000000000006', 'b5000001-0000-0000-0000-000000000001', 'd5010002-0000-0000-0000-000000000003', 'contra',
   'Unguided visitor traffic can damage sensitive and rare plant beds.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- ============================================================
-- 2. Solar — "Install 500 panels immediately" (b1000001-...-001)
--    Already has: pro d1010001-001, contra d1010001-002
-- ============================================================

INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Visible solar infrastructure inspires residents across the community.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1010001-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Bulk procurement without planning risks buying wrong panel specs.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- Questions
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010002-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', NULL, 'question',
   'Who owns the panels — community collectively or individual households?', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1010002-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', NULL, 'question',
   'How do we fund ongoing maintenance and eventual panel replacement?', 'a0a0a0a0-0000-0000-0000-000000000004');

-- Nested under Q1
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010003-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', 'd1010002-0000-0000-0000-000000000001', 'pro',
   'Community ownership ensures equitable energy access for all.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1010003-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', 'd1010002-0000-0000-0000-000000000001', 'contra',
   'Individual ownership creates stronger personal incentive to maintain panels.', 'a0a0a0a0-0000-0000-0000-000000000003');

-- Nested under Q2
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010003-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000001', 'd1010002-0000-0000-0000-000000000002', 'pro',
   'A small monthly energy levy could fund a maintenance reserve.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1010003-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000001', 'd1010002-0000-0000-0000-000000000002', 'contra',
   'Without clear governance, maintenance funds often go unspent or misused.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- 3. Ring Road — "full resurfacing is overdue" (b2000001-...-001)
--    Already has: pro d2010001-001, contra d2010001-002
-- ============================================================

INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Better roads reduce vehicle wear and fuel costs for all residents.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d2010001-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Construction disruption to Ring Road traffic could last several months.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- Questions
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010002-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', NULL, 'question',
   'Should we prioritize the most dangerous sections before full resurfacing?', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2010002-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000001', NULL, 'question',
   'What is a realistic timeline and who oversees the project?', 'a0a0a0a0-0000-0000-0000-000000000004');

-- Nested under Q1
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010003-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', 'd2010002-0000-0000-0000-000000000001', 'pro',
   'Targeted repairs near schools and clinics prevent urgent safety risks.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d2010003-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000001', 'd2010002-0000-0000-0000-000000000001', 'contra',
   'Phased approach risks leaving the full project incomplete for years.', 'a0a0a0a0-0000-0000-0000-000000000003');

-- Nested under Q2
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010003-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000001', 'd2010002-0000-0000-0000-000000000002', 'pro',
   'An independent working group with quarterly reporting ensures accountability.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2010003-0000-0000-0000-000000000004', 'b2000001-0000-0000-0000-000000000001', 'd2010002-0000-0000-0000-000000000002', 'contra',
   'Past Auroville infrastructure projects show timelines often triple in reality.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- ============================================================
-- 4. Rainwater — "mandatory for every building" (b4000001-...-001)
--    Already has: pro d4010001-001, contra d4010001-002
-- ============================================================

INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010001-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Monsoon rainfall in this region is sufficient to make harvesting highly effective.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d4010001-0000-0000-0000-000000000004', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra',
   'A mandatory policy without financial support punishes poorer households.', 'a0a0a0a0-0000-0000-0000-000000000002');

-- Questions
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010002-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000001', NULL, 'question',
   'What happens to buildings that don''t comply with the mandate?', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4010002-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000001', NULL, 'question',
   'Should older buildings receive a grace period or installation subsidy?', 'a0a0a0a0-0000-0000-0000-000000000001');

-- Nested under Q1
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010003-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000001', 'd4010002-0000-0000-0000-000000000001', 'pro',
   'A tiered fine system gives buildings time to comply without harsh penalties.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d4010003-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000001', 'd4010002-0000-0000-0000-000000000001', 'contra',
   'Fines without enforcement capacity are meaningless and breed resentment.', 'a0a0a0a0-0000-0000-0000-000000000002');

-- Nested under Q2
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010003-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000001', 'd4010002-0000-0000-0000-000000000002', 'pro',
   'A 3-year grace period with 50% subsidy makes compliance achievable for all.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d4010003-0000-0000-0000-000000000004', 'b4000001-0000-0000-0000-000000000001', 'd4010002-0000-0000-0000-000000000002', 'contra',
   'Subsidies may not reach the most vulnerable if administration is complex.', 'a0a0a0a0-0000-0000-0000-000000000003');

-- ============================================================
-- 5. Education — "children choose learning path from age 8" (b3000001-...-001)
--    Already has: pro d3010001-001, contra d3010001-002
-- ============================================================

INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010001-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Children who own their learning show higher long-term retention.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3010001-0000-0000-0000-000000000004', 'b3000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Age 8 may be too young — children often lack the context to choose wisely.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- Questions
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010002-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000001', NULL, 'question',
   'How do we ensure no child falls behind in fundamental skills?', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d3010002-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000001', NULL, 'question',
   'Who assesses whether a child''s chosen learning path is working?', 'a0a0a0a0-0000-0000-0000-000000000006');

-- Nested under Q1
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010003-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000001', 'd3010002-0000-0000-0000-000000000001', 'pro',
   'A minimal core curriculum (reading, math, wellbeing) ensures no gaps form.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3010003-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000001', 'd3010002-0000-0000-0000-000000000001', 'contra',
   'Defining a "core" inevitably reintroduces the rigid structure we want to leave.', 'a0a0a0a0-0000-0000-0000-000000000002');

-- Nested under Q2
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010003-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000001', 'd3010002-0000-0000-0000-000000000002', 'pro',
   'A mentor-teacher relationship provides ongoing personalised assessment.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3010003-0000-0000-0000-000000000004', 'b3000001-0000-0000-0000-000000000001', 'd3010002-0000-0000-0000-000000000002', 'contra',
   'Subjective assessment risks inconsistency and favouritism between mentors.', 'a0a0a0a0-0000-0000-0000-000000000004');
