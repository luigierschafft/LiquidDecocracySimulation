-- ============================================================
-- Replace all statements with better, topic-relevant English content
-- ============================================================

DELETE FROM public.ev_discussion_nodes;
DELETE FROM public.ev_statement_ratings;
DELETE FROM public.ev_statements;

-- ============================================================
-- SOLAR ENERGY (001)
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Install 500 solar panels on community rooftops — start immediately.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b1000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Battery storage is more critical than more panels — power the night.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b1000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Community solar fund: every resident buys shares, profits go back to all.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b1000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Without subsidies, solar is still unaffordable for lower-income families.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b1000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Every new building in Auroville must be solar-ready by design.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- WATER MANAGEMENT (002)
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b2000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Rainwater harvesting must be mandatory for every building — no exceptions.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b2000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Groundwater drops 1.5m per year — declare a water emergency now.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b2000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Smart meters for every household — make water consumption visible.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b2000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Greywater recycling systems should be standard in all Auroville homes.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b2000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000002',
   'A community water usage dashboard should be publicly visible at all times.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- EDUCATION (003)
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b3000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Children should choose their own learning path from age 8 onwards.',
   'a0a0a0a0-0000-0000-0000-000000000006'),
  ('b3000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Tamil and English are mandatory — Sanskrit and French as electives.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b3000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000003',
   'At least 3 hours of outdoor and nature-based learning every day.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b3000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Teachers need 20% protected time each week for their own development.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b3000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000003',
   'All schools should offer a mixed-age classroom model, not age-based grades.',
   'a0a0a0a0-0000-0000-0000-000000000001');

-- ============================================================
-- MOBILITY / TRANSPORT (011)
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b4000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000011',
   'All petrol vehicles should be banned inside Auroville township by 2028.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b4000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000011',
   'A dedicated cycling network connecting all zones is the top priority.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b4000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000011',
   'A free shared e-bike fleet is more practical than private ownership.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b4000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Wider footpaths and pedestrian zones before any new roads.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b4000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000011',
   'One car-free day per week as a first step — test and learn.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- PRO/CONTRA NODES — Solar
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro', 'Immediate action reduces grid dependency and energy bills.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1010001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro', 'Creates local jobs for installation and maintenance.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1010001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra', 'Community fund approval process could delay start by months.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d1010001-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra', 'Structural roof assessment needed first — not all roofs qualify.', 'a0a0a0a0-0000-0000-0000-000000000006'),

  ('d1020001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000002', NULL, 'pro', 'Solar without storage wastes up to 40% of peak generation.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1020001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000002', NULL, 'pro', 'Batteries protect the community during grid outages.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1020001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000002', NULL, 'contra', 'Battery replacement every 10 years adds significant long-term cost.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d1030001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000003', NULL, 'pro', 'Fair access for households without suitable rooftops.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1030001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000003', NULL, 'contra', 'Shared ownership governance can be slow and contentious.', 'a0a0a0a0-0000-0000-0000-000000000006'),

  ('d1040001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000004', NULL, 'pro', 'Energy transition must be equitable — no one should be left behind.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1040001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000004', NULL, 'contra', 'Solar costs dropped 90% in a decade — affordability is improving fast.', 'a0a0a0a0-0000-0000-0000-000000000002'),

  ('d1050001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000005', NULL, 'pro', 'Embedding solar at design stage is far cheaper than retrofitting.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1050001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000005', NULL, 'contra', 'Mandatory requirements may slow down affordable housing projects.', 'a0a0a0a0-0000-0000-0000-000000000004');

-- ============================================================
-- PRO/CONTRA NODES — Water
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro', 'Could meet 30% of household water needs in monsoon season.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2010001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro', 'Directly reduces pressure on the declining groundwater table.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d2010001-0000-0000-0000-000000000003', 'b2000001-0000-0000-0000-000000000001', NULL, 'contra', 'Retrofitting older buildings is structurally complex and costly.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d2020001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000002', NULL, 'pro', 'CGWB data confirms 1.5m annual decline — inaction is not an option.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d2020001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002', NULL, 'contra', 'Emergency framing may cause panic before solutions are ready.', 'a0a0a0a0-0000-0000-0000-000000000006'),

  ('d2030001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000003', NULL, 'pro', 'Studies show metering reduces household usage by up to 15%.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2030001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000003', NULL, 'contra', 'Real-time monitoring raises privacy concerns for some residents.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d2040001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000004', NULL, 'pro', 'Greywater reuse can cut household water demand by up to 30%.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d2040001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000004', NULL, 'contra', 'Installation cost is high and maintenance requires trained staff.', 'a0a0a0a0-0000-0000-0000-000000000003'),

  ('d2050001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000005', NULL, 'pro', 'Transparency builds collective accountability for shared resources.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d2050001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000005', NULL, 'contra', 'Public shaming of high-use households could create social tension.', 'a0a0a0a0-0000-0000-0000-000000000002');

-- ============================================================
-- PRO/CONTRA NODES — Education
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro', 'Aligns with Auroville integral education philosophy.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3010001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro', 'Increases intrinsic motivation and self-directed learning.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3010001-0000-0000-0000-000000000003', 'b3000001-0000-0000-0000-000000000001', NULL, 'contra', 'Core literacy and numeracy still need structured teaching.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d3020001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000002', NULL, 'pro', 'Tamil connects children to local culture and neighboring communities.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3020001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000002', NULL, 'contra', 'Four language options may overwhelm the weekly schedule.', 'a0a0a0a0-0000-0000-0000-000000000001'),

  ('d3030001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000003', NULL, 'pro', 'Nature-based learning improves focus, wellbeing and creativity.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3030001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000003', NULL, 'contra', 'Monsoon season makes 3 hours outdoors per day impractical.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d3040001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000004', NULL, 'pro', 'Continuous learning keeps teachers motivated and effective.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3040001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000004', NULL, 'contra', '20% time means fewer teaching hours for already stretched schools.', 'a0a0a0a0-0000-0000-0000-000000000003'),

  ('d3050001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000005', NULL, 'pro', 'Mixed-age models foster peer learning and reduce age-based competition.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d3050001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000005', NULL, 'contra', 'Requires significant teacher retraining and curriculum redesign.', 'a0a0a0a0-0000-0000-0000-000000000004');

-- ============================================================
-- PRO/CONTRA NODES — Mobility
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000001', NULL, 'pro', 'Eliminates noise and air pollution in the township core.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4010001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra', 'Electric alternatives must be affordable and available before a ban.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d4010001-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra', 'Delivery vehicles and visitors are hard to regulate under a full ban.', 'a0a0a0a0-0000-0000-0000-000000000006'),

  ('d4020001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000002', NULL, 'pro', 'Safe cycling infrastructure is the biggest barrier to adoption today.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d4020001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000002', NULL, 'contra', 'Dedicated paths conflict with existing green zones and land use.', 'a0a0a0a0-0000-0000-0000-000000000003'),

  ('d4030001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000003', NULL, 'pro', 'Shared fleet reduces total vehicles — less space, less parking needed.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4030001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000003', NULL, 'contra', 'Maintenance and theft prevention require dedicated staff and budget.', 'a0a0a0a0-0000-0000-0000-000000000004'),

  ('d4040001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000004', NULL, 'pro', 'Walking infrastructure benefits elderly and mobility-impaired residents.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d4040001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000004', NULL, 'contra', 'Widening paths requires land that is currently green or cultivated.', 'a0a0a0a0-0000-0000-0000-000000000002'),

  ('d4050001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000005', NULL, 'pro', 'Low-risk first step — gathers data before committing to larger changes.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4050001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000005', NULL, 'contra', 'One day per week is too small to change habits or measure real impact.', 'a0a0a0a0-0000-0000-0000-000000000001');
