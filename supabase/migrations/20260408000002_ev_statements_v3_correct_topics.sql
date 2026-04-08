-- ============================================================
-- Fix statements to match actual topic IDs and titles
--
-- 001 = Solar Energy Expansion Plan 2026
-- 002 = Main Road Rehabilitation — Auroville Ring Road
-- 003 = Future School Curriculum Reform
-- 004 = Mandatory Rainwater Harvesting Policy
-- 011 = Community Medicinal Herb & Wellness Garden
-- ============================================================

DELETE FROM public.ev_discussion_nodes;
DELETE FROM public.ev_statement_ratings;
DELETE FROM public.ev_statements;

-- ============================================================
-- 001 — Solar Energy Expansion Plan 2026
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001', 'Install 500 solar panels on community rooftops — start immediately.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b1000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000001', 'Battery storage is more critical than more panels — power the night.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b1000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000001', 'Community solar fund: every resident buys shares, profits go back to all.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b1000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000001', 'Without subsidies, solar is still unaffordable for lower-income families.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b1000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000001', 'Every new building in Auroville must be solar-ready by design.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- 002 — Main Road Rehabilitation — Auroville Ring Road
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b2000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000002', 'The Ring Road surface is dangerous — full resurfacing is overdue.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b2000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000002', 'Dedicated cycling lanes must be part of any Ring Road rehabilitation.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b2000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000002', 'Speed limits on the Ring Road should be reduced to 30 km/h.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b2000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000002', 'Rehabilitation should use local materials and minimize carbon footprint.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b2000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000002', 'Pedestrian walkways alongside the Ring Road are a safety necessity.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- 003 — Future School Curriculum Reform
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b3000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000003', 'Children should choose their own learning path from age 8 onwards.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('b3000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000003', 'Tamil and English are mandatory — Sanskrit and French as electives.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b3000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000003', 'At least 3 hours of outdoor and nature-based learning every day.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b3000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000003', 'Teachers need 20% protected time each week for their own development.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b3000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000003', 'Replace age-based grades with mixed-age classrooms across all schools.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- ============================================================
-- 004 — Mandatory Rainwater Harvesting Policy
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b4000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000004', 'Rainwater harvesting must be mandatory for every building — no exceptions.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b4000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000004', 'Groundwater drops 1.5m per year — declare a water emergency now.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b4000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000004', 'Smart meters for every household — make water consumption visible.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b4000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000004', 'Greywater recycling systems should be standard in all Auroville homes.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b4000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000004', 'A community water dashboard should show live collective consumption.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- 011 — Community Medicinal Herb & Wellness Garden
-- ============================================================
INSERT INTO public.ev_statements (id, issue_id, text, author_id) VALUES
  ('b5000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000011', 'The wellness garden should be open to all residents 7 days a week.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('b5000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000011', 'At least 50 medicinal species should be cultivated and labeled.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('b5000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000011', 'A resident herbalist should be available on-site twice a week.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('b5000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000011', 'The garden should double as an outdoor classroom for Auroville schools.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('b5000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000011', 'Seed saving and plant swapping programs should be community-run.', 'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- PRO/CONTRA — Solar (001)
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d1010001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', NULL, 'pro', 'Immediate action reduces grid dependency and energy bills.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1010001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', NULL, 'contra', 'Roof structural assessments needed first — delays are likely.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d1020001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000002', NULL, 'pro', 'Solar without storage wastes up to 40% of peak generation.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1020001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000002', NULL, 'contra', 'Battery replacement every 10 years adds significant long-term cost.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d1030001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000003', NULL, 'pro', 'Fair access for households without suitable rooftops.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1030001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000003', NULL, 'contra', 'Shared ownership governance can be slow and contentious.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d1040001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000004', NULL, 'pro', 'Energy transition must be equitable — no one left behind.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1040001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000004', NULL, 'contra', 'Solar costs dropped 90% in a decade — affordability is improving.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1050001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000005', NULL, 'pro', 'Building-in solar at design stage is far cheaper than retrofitting.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1050001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000005', NULL, 'contra', 'Mandatory requirements may slow down affordable housing projects.', 'a0a0a0a0-0000-0000-0000-000000000004');

-- ============================================================
-- PRO/CONTRA — Ring Road (002)
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d2010001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000001', NULL, 'pro', 'Pothole-ridden roads cause accidents and damage vehicles daily.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2010001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000001', NULL, 'contra', 'Full resurfacing cost is high — phased repair may suffice.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d2020001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000002', NULL, 'pro', 'Cycling infrastructure would reduce car use on the Ring Road.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d2020001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000002', NULL, 'contra', 'Adding lanes requires widening, which conflicts with green buffers.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d2030001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000003', NULL, 'pro', 'Lower speeds dramatically reduce accident severity and noise.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d2030001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000003', NULL, 'contra', 'Slower traffic may push vehicles onto smaller internal roads.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d2040001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000004', NULL, 'pro', 'Local materials reduce transport emissions and support local economy.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d2040001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000004', NULL, 'contra', 'Local materials may not meet durability standards for heavy use.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d2050001-0000-0000-0000-000000000001', 'b2000001-0000-0000-0000-000000000005', NULL, 'pro', 'Pedestrians currently risk their lives with no separation from traffic.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d2050001-0000-0000-0000-000000000002', 'b2000001-0000-0000-0000-000000000005', NULL, 'contra', 'Walkway construction adds significant cost and time to the project.', 'a0a0a0a0-0000-0000-0000-000000000001');

-- ============================================================
-- PRO/CONTRA — Education (003)
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d3010001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000001', NULL, 'pro', 'Aligns with Auroville integral education philosophy.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3010001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000001', NULL, 'contra', 'Core literacy and numeracy still need structured teaching.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d3020001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000002', NULL, 'pro', 'Tamil connects children to local culture and neighboring communities.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3020001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000002', NULL, 'contra', 'Four language options may overwhelm the weekly schedule.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d3030001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000003', NULL, 'pro', 'Nature-based learning improves focus, wellbeing and creativity.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d3030001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000003', NULL, 'contra', 'Monsoon season makes 3 hours outdoors per day impractical.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d3040001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000004', NULL, 'pro', 'Continuous learning keeps teachers motivated and effective.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d3040001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000004', NULL, 'contra', '20% time means fewer teaching hours for already stretched schools.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d3050001-0000-0000-0000-000000000001', 'b3000001-0000-0000-0000-000000000005', NULL, 'pro', 'Mixed-age models foster peer learning and reduce competition.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d3050001-0000-0000-0000-000000000002', 'b3000001-0000-0000-0000-000000000005', NULL, 'contra', 'Requires significant teacher retraining and curriculum redesign.', 'a0a0a0a0-0000-0000-0000-000000000004');

-- ============================================================
-- PRO/CONTRA — Rainwater Harvesting (004)
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d4010001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000001', NULL, 'pro', 'Could meet 30% of household water needs during monsoon season.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d4010001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000001', NULL, 'contra', 'Retrofitting older buildings is structurally complex and costly.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d4020001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000002', NULL, 'pro', 'CGWB data confirms 1.5m annual decline — inaction is not an option.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4020001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000002', NULL, 'contra', 'Emergency framing may cause panic before solutions are ready.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d4030001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000003', NULL, 'pro', 'Studies show metering reduces household usage by up to 15%.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d4030001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000003', NULL, 'contra', 'Real-time monitoring raises privacy concerns for some residents.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d4040001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000004', NULL, 'pro', 'Greywater reuse can cut household demand by up to 30%.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4040001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000004', NULL, 'contra', 'Installation cost is high and requires trained maintenance staff.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4050001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000005', NULL, 'pro', 'Transparency builds collective accountability for shared resources.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d4050001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000005', NULL, 'contra', 'Public shaming of high-use households could create social tension.', 'a0a0a0a0-0000-0000-0000-000000000002');

-- ============================================================
-- PRO/CONTRA — Wellness Garden (011)
-- ============================================================
INSERT INTO public.ev_discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('d5010001-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000001', NULL, 'pro', 'Open access ensures the garden benefits the whole community equally.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d5010001-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000001', NULL, 'contra', 'Daily open access requires staffing and security for plant protection.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d5020001-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000002', NULL, 'pro', 'Diverse species provide broader healing options for residents.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d5020001-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000002', NULL, 'contra', '50 species requires significant space, knowledge and ongoing care.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d5030001-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000003', NULL, 'pro', 'Expert guidance helps residents use medicinal plants safely.', 'a0a0a0a0-0000-0000-0000-000000000006'),
  ('d5030001-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000003', NULL, 'contra', 'Hiring a specialist herbalist is a recurring cost that needs funding.', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d5040001-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000004', NULL, 'pro', 'Living classroom connects students directly to Auroville''s ecology.', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d5040001-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000004', NULL, 'contra', 'School visits need scheduling to avoid disturbing regular visitors.', 'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d5050001-0000-0000-0000-000000000001', 'b5000001-0000-0000-0000-000000000005', NULL, 'pro', 'Community-run programs build ownership and long-term stewardship.', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d5050001-0000-0000-0000-000000000002', 'b5000001-0000-0000-0000-000000000005', NULL, 'contra', 'Without coordination, seed saving can lead to garden fragmentation.', 'a0a0a0a0-0000-0000-0000-000000000006');
