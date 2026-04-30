-- ============================================================
-- ERSTE VERSION — Replace German seed data with English
-- ============================================================

-- Clear existing seed data
DELETE FROM public.ev_discussion_nodes;
DELETE FROM public.ev_statement_ratings;
DELETE FROM public.ev_statements;
DELETE FROM public.ev_topic_meta;

-- ============================================================
-- 1. TOPIC META (English)
-- ============================================================
INSERT INTO public.ev_topic_meta (issue_id, about, scope) VALUES
  ('e0e0e0e0-0000-0000-0000-000000000001',
   'How can Auroville power itself entirely with renewable solar energy?',
   'Covers solar panels, energy storage, grid infrastructure and financing. Excludes: wind energy, fossil fuels.'),
  ('e0e0e0e0-0000-0000-0000-000000000002',
   'Sustainable water management for Auroville''s growing community.',
   'Rainwater harvesting, groundwater, treatment and distribution. Excludes: sewage/wastewater (separate topic).'),
  ('e0e0e0e0-0000-0000-0000-000000000003',
   'Designing a holistic curriculum for Auroville''s schools.',
   'Subjects, teaching methods, languages and teacher training. Excludes: higher education.'),
  ('e0e0e0e0-0000-0000-0000-000000000011',
   'Improving mobility within Auroville through sustainable transport.',
   'E-bikes, buses, walkways, cycling infrastructure. Excludes: long-distance travel outside Auroville.')
ON CONFLICT (issue_id) DO UPDATE SET about = EXCLUDED.about, scope = EXCLUDED.scope;

-- ============================================================
-- 2. STATEMENTS — Solar Energy
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id, source_links) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Install 500 solar panels on community rooftops — start immediately.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY['https://irena.org/solar']),
  ('b1000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Battery storage matters more than more panels — we need power at night.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]),
  ('b1000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Community solar sharing: households buy shares in a joint power plant.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY['https://en.wikipedia.org/wiki/Community_solar']),
  ('b1000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Without subsidies, solar is still unaffordable for lower-income families.',
   'a0a0a0a0-0000-0000-0000-000000000004', ARRAY[]::TEXT[]);

-- ============================================================
-- 3. STATEMENTS — Water Management
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id, source_links) VALUES
  ('b2000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Rainwater harvesting must be mandatory for every building — no exceptions.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY[]::TEXT[]),
  ('b2000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Groundwater levels drop every year — we need an emergency action plan.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY['https://cgwb.gov.in']),
  ('b2000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Smart water meters for every household — make consumption visible.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]);

-- ============================================================
-- 4. STATEMENTS — Education
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id, source_links) VALUES
  ('b3000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Children should choose their own subjects from age 8 onwards.',
   'a0a0a0a0-0000-0000-0000-000000000006', ARRAY[]::TEXT[]),
  ('b3000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Tamil and English as mandatory languages, Sanskrit as optional.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY[]::TEXT[]),
  ('b3000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000003',
   'At least 3 hours of outdoor learning daily — nature as the classroom.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY['https://www.naturebased.org']),
  ('b3000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Teachers need 20% of their time protected for professional development.',
   'a0a0a0a0-0000-0000-0000-000000000004', ARRAY[]::TEXT[]);

-- ============================================================
-- 5. STATEMENTS — Mobility / Transport (Topic 11)
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id, source_links) VALUES
  ('b4000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Ban all petrol vehicles inside Auroville''s township by 2028.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY[]::TEXT[]),
  ('b4000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Build a dedicated cycling path connecting all major zones.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]),
  ('b4000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000011',
   'A free community e-bike fleet is more practical than private ownership.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY[]::TEXT[]);

-- ============================================================
-- 6. PRO / CONTRA DISCUSSION NODES
-- ============================================================

-- Solar: Statement 1 — "Install 500 solar panels..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Reduces dependency on the grid — community gains energy independence.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1010001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Creates local jobs for installation and maintenance teams.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1010001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Upfront cost requires approval from community fund — may take months.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d1010001-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Structural roof assessments needed first — not all roofs are suitable.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Solar: Statement 2 — "Battery storage matters more..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1020001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000002', NULL, 'pro',
   'Solar without storage wastes energy during off-peak hours.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1020001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000002', NULL, 'pro',
   'Batteries protect the community during grid outages.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1020001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000002', NULL, 'contra',
   'Battery systems are still expensive and need replacement every 10 years.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- Solar: Statement 3 — "Community solar sharing..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1030001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Fair access for families without suitable rooftops.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1030001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Economies of scale lower the cost per kWh significantly.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1030001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000003', NULL, 'contra',
   'Shared ownership governance can be slow and contentious.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Solar: Statement 4 — "Without subsidies..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1040001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000004', NULL, 'pro',
   'Equity must be central — the transition can''t leave anyone behind.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1040001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000004', NULL, 'contra',
   'Solar costs dropped 90% in a decade — it''s becoming broadly accessible.',
   'a0a0a0a0-0000-0000-0000-000000000002');

-- Water: Statement 1 — "Rainwater harvesting mandatory..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Could meet up to 30% of household water needs during monsoon season.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2010001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Directly reduces pressure on the declining groundwater table.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d2010001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Retrofitting older buildings is structurally complex and costly.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- Water: Statement 2 — "Groundwater emergency..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2020001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000002', NULL, 'pro',
   'CGWB data confirms a 1.5m groundwater decline over the last 5 years.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d2020001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002', NULL, 'pro',
   'Acting now is far cheaper than managing a full water crisis later.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d2020001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000002', NULL, 'contra',
   'Borewell restrictions may face resistance from farms in the surrounding area.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Water: Statement 3 — "Smart water meters..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2030001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Studies show meters reduce household water usage by up to 15%.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2030001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000003', NULL, 'contra',
   'Real-time monitoring raises privacy concerns for some residents.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- Education: Statement 1 — "Children choose subjects..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Aligns with Auroville''s integral education philosophy.',
   'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3010001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Increases intrinsic motivation and self-directed learning.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3010001-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Core skills like math and literacy still need structured teaching.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- Education: Statement 2 — "Tamil and English mandatory..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3020001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000002', NULL, 'pro',
   'Tamil connects children to the local culture and neighboring communities.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3020001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000002', NULL, 'pro',
   'English enables global collaboration and knowledge access.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d3020001-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000002', NULL, 'contra',
   'Adding Sanskrit even as optional may still overload the weekly schedule.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Education: Statement 3 — "Outdoor learning 3h daily..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3030001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Research shows nature-based learning improves focus and emotional wellbeing.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3030001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Auroville''s natural environment is a unique and irreplaceable resource.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3030001-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000003', NULL, 'contra',
   'Monsoon season makes daily outdoor sessions practically impossible.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- Mobility: Statement 1 — "Ban petrol vehicles..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Eliminates noise and air pollution in the township core.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4010001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000001', NULL, 'pro',
   'Signals a clear commitment to Auroville''s sustainability values.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4010001-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Electric alternatives must be affordable and available before any ban.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d4010001-0000-0000-0000-000000000004', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra',
   'Visitors and delivery vehicles are hard to regulate under a full ban.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Mobility: Statement 2 — "Dedicated cycling path..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4020001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000002', NULL, 'pro',
   'Safe cycling infrastructure is the single biggest barrier to adoption.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d4020001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000002', NULL, 'contra',
   'Land acquisition for dedicated paths conflicts with existing green zones.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Mobility: Statement 3 — "Community e-bike fleet..."
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4030001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Shared fleet reduces total vehicles needed — less parking, less space.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4030001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000003', NULL, 'pro',
   'Lowers barrier for new residents and visitors without their own transport.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4030001-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000003', NULL, 'contra',
   'Maintenance and theft prevention require dedicated staff and budget.',
   'a0a0a0a0-0000-0000-0000-000000000004');
