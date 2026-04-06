-- ============================================================
-- SEED: Topic-level discussion opinions (20+ per seed topic)
-- ============================================================

-- Shorthand member IDs
-- m1 = Priya Aurosmith (admin)
-- m2 = Ravi Sundaram
-- m3 = Lakshmi Devi
-- m4 = Thomas Weber
-- m5 = Ananda Krishnamurthy
-- m6 = Sofia Bernhardt
-- m7 = Arjun Mehta
-- m8 = Meera Patel

-- ============================================================
-- Issue 1 — Solar Energy Expansion Plan 2026 (closed)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The current solar capacity covers only about 40% of Auroville''s peak demand. This expansion is long overdue.',NULL, NOW() - INTERVAL '60 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000003','We should prioritise rooftop installations over ground-mounted arrays to preserve land for agriculture and green cover.',NULL, NOW() - INTERVAL '59 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Battery storage must be part of the plan from day one. Solar without storage just shifts the problem to night hours.',NULL, NOW() - INTERVAL '58 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000005','I''d like to see a community skill-building component — training local residents in solar installation and maintenance.',NULL, NOW() - INTERVAL '57 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000006','What is the estimated payback period? We should be transparent about the financial model before voting.',NULL, NOW() - INTERVAL '56 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000007','The Foundation grid connection fee structure needs to be renegotiated first, otherwise expanded capacity won''t reduce bills.',NULL, NOW() - INTERVAL '55 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Are there any environmental impact assessments planned for the proposed southern farm area installations?',NULL, NOW() - INTERVAL '54 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000001','We have a strong precedent with the SCEOR project. Let''s build on those learnings and avoid repeating past procurement mistakes.',NULL, NOW() - INTERVAL '53 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Peer-to-peer energy sharing between households could reduce the need for centralised infrastructure.',NULL, NOW() - INTERVAL '52 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000003','I support this fully. Reducing diesel generator dependency is critical for both cost and air quality.',NULL, NOW() - INTERVAL '51 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000004','We should explore bifacial panels for higher yield — particularly given our high-albedo sandy soil.',NULL, NOW() - INTERVAL '50 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000005','How will this interact with the upcoming Smart Grid proposal? These should be planned together.',NULL, NOW() - INTERVAL '49 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Maintenance contracts should be awarded locally. We have several Aurovilians with the relevant expertise.',NULL, NOW() - INTERVAL '48 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Will guest houses and commercial units be included in the expansion? They tend to have the highest consumption.',NULL, NOW() - INTERVAL '47 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000008','The proposal should include a clear decommissioning plan for the old diesel sets once solar targets are met.',NULL, NOW() - INTERVAL '46 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Real-time energy dashboards in public spaces would help build community awareness and accountability.',NULL, NOW() - INTERVAL '45 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Subsidy or loan mechanisms should be available for units that cannot afford upfront installation costs.',NULL, NOW() - INTERVAL '44 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The aesthetic impact on heritage buildings in the old township needs sensitivity — not every roof is suitable.',NULL, NOW() - INTERVAL '43 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Strong support from me. The sooner we are energy-independent, the more resilient the community becomes.',NULL, NOW() - INTERVAL '42 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000001',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Let''s ensure the procurement process is open, with at least three competing bids and community oversight.',NULL, NOW() - INTERVAL '41 days');

-- ============================================================
-- Issue 2 — Main Road Rehabilitation (voting)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The current road surface is dangerous during monsoon. Standing water causes accidents every year.',NULL, NOW() - INTERVAL '45 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Before we resurface, we need to fix the underground water pipes. Digging up a new road six months later is wasteful.',NULL, NOW() - INTERVAL '44 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000005','I suggest we pilot a section with compressed stabilised earth blocks — far more sustainable than tarmac.',NULL, NOW() - INTERVAL '43 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The speed limit along the ring road must be enforced simultaneously. New surface alone won''t improve safety.',NULL, NOW() - INTERVAL '42 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000007','We should include dedicated cycle lanes in the redesign. Auroville should model sustainable mobility.',NULL, NOW() - INTERVAL '41 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Please prioritise the stretch near the school zones — children walk those routes daily.',NULL, NOW() - INTERVAL '40 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Coordination with Tamil Nadu Highways is essential for the segments that pass through the greenbelt boundary.',NULL, NOW() - INTERVAL '39 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Is there a plan for dust control during construction? The last road work created terrible conditions for nearby residences.',NULL, NOW() - INTERVAL '38 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Shade trees along the road edges should be part of the rehabilitation — not an afterthought.',NULL, NOW() - INTERVAL '37 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000004','We should engage the nearby villagers in the planning — the road serves their community too.',NULL, NOW() - INTERVAL '36 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Traffic calming measures like raised crossings near Matrimandir would greatly improve pedestrian safety.',NULL, NOW() - INTERVAL '35 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The budget estimate seems low given the length involved. Has soil testing been done?',NULL, NOW() - INTERVAL '34 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000007','I support phasing the project — doing the worst stretches first and evaluating before committing the full budget.',NULL, NOW() - INTERVAL '33 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Rainwater harvesting channels integrated into the road design could significantly reduce runoff.',NULL, NOW() - INTERVAL '32 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Noise and vibration during construction is a concern for meditation spaces nearby. Works should be time-restricted.',NULL, NOW() - INTERVAL '31 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The project should document and protect all heritage trees along the route.',NULL, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000003','A public update meeting every two months during construction would keep the community informed.',NULL, NOW() - INTERVAL '29 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Good roads directly support the local economy — deliveries and services will become more reliable.',NULL, NOW() - INTERVAL '28 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Let''s insist on a 10-year maintenance warranty from any contractor — not just a completion certificate.',NULL, NOW() - INTERVAL '27 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000002',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The proposed timeline clashes with the harvest season. Can we shift it by two months?',NULL, NOW() - INTERVAL '26 days');

-- ============================================================
-- Issue 3 — Future School Curriculum Reform (discussion) — already has 7, add 15
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Project-based learning should form the backbone — children learn best when they solve real community problems.',NULL, NOW() - INTERVAL '38 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Tamil language and local cultural knowledge must remain central — not sidelined by international curricula.',NULL, NOW() - INTERVAL '37 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Integrating meditation and mindfulness from early childhood is one of Auroville''s unique educational gifts.',NULL, NOW() - INTERVAL '36 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000007','The current maths and science curriculum is too weak. We are doing children a disservice if we don''t address this.',NULL, NOW() - INTERVAL '35 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Parent involvement in curriculum design should be structured and regular — not just an annual consultation.',NULL, NOW() - INTERVAL '34 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Teacher training and wellbeing must be funded as part of any reform — otherwise changes won''t stick.',NULL, NOW() - INTERVAL '33 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Ecological literacy — understanding local ecosystems, soil, water — should be embedded across all subjects.',NULL, NOW() - INTERVAL '32 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000003','I''d love to see an apprenticeship stream where older students work with community artisans and farmers.',NULL, NOW() - INTERVAL '31 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Assessment should move away from grades toward portfolios of demonstrated skills and projects.',NULL, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000005','We should invite CBSE and IB schools to collaborate on a hybrid model — international credibility with Auroville values.',NULL, NOW() - INTERVAL '29 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Digital literacy is non-negotiable today. Every child should leave school confident with technology and critical media skills.',NULL, NOW() - INTERVAL '28 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Conflict resolution and community participation skills should be explicitly taught — we need future governance contributors.',NULL, NOW() - INTERVAL '27 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000008','The mother tongue issue is complex given our multilingual community. We need a careful, inclusive language policy.',NULL, NOW() - INTERVAL '26 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Physical infrastructure upgrades at the school are urgently needed alongside any curriculum reform.',NULL, NOW() - INTERVAL '25 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Let''s pilot changes in one year group first and measure outcomes before rolling out community-wide.',NULL, NOW() - INTERVAL '24 days');

-- ============================================================
-- Issue 4 — Mandatory Rainwater Harvesting Policy (verification)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000005','The groundwater table has dropped by over two metres in the last decade. This policy is urgent.',NULL, NOW() - INTERVAL '35 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Mandatory retrofitting will be a financial burden for smaller households. A subsidy scheme is essential.',NULL, NOW() - INTERVAL '34 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000007','New constructions should be held to a higher standard than retrofits — this should be in the building code.',NULL, NOW() - INTERVAL '33 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Training workshops for residents on DIY tank maintenance would increase compliance and reduce costs.',NULL, NOW() - INTERVAL '32 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The policy should include greywater recycling systems as well — not just rooftop collection.',NULL, NOW() - INTERVAL '31 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Who enforces compliance? We need a clear audit mechanism or this will remain aspirational.',NULL, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Community-level tanks for clusters of households would be more cost-effective than individual systems.',NULL, NOW() - INTERVAL '29 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000004','The monsoon catchment data for different zones of Auroville should be published so residents can size their systems properly.',NULL, NOW() - INTERVAL '28 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Linking water harvesting targets to building permits would be a powerful incentive.',NULL, NOW() - INTERVAL '27 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000006','We should study what Pondicherry municipality has done — they mandated RWH and saw measurable groundwater recovery.',NULL, NOW() - INTERVAL '26 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Overflow from tanks should feed into recharge pits, not the road — this needs to be specified in the policy.',NULL, NOW() - INTERVAL '25 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000008','A public water table monitoring dashboard would make the impact of this policy visible to everyone.',NULL, NOW() - INTERVAL '24 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Grace period of 18 months for existing structures before enforcement would be fair and workable.',NULL, NOW() - INTERVAL '23 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The policy should explicitly exclude areas with high clay content where recharge pits are ineffective.',NULL, NOW() - INTERVAL '22 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Celebrate early adopters publicly — positive recognition drives community-wide behaviour change.',NULL, NOW() - INTERVAL '21 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Auroville''s annual rainfall average is sufficient for full water independence if harvested properly.',NULL, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Schools and community buildings should be required to lead by example with showcase installations.',NULL, NOW() - INTERVAL '19 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000006','I fully support this. Water scarcity is the single biggest long-term threat to Auroville''s sustainability.',NULL, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000007','The policy draft should go through the Environmental Service and be informed by current hydrogeological surveys.',NULL, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000004',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Connecting this with the greenbelt restoration effort would create a holistic watershed management approach.',NULL, NOW() - INTERVAL '16 days');

-- ============================================================
-- Issue 5 — Organic Farm Expansion (closed) — elaboration exists, add rich discussion
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Auroville''s food self-sufficiency is currently below 15%. Expanding the farm is a strategic necessity.',NULL, NOW() - INTERVAL '90 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000007','We should integrate traditional Tamil dry-land farming techniques alongside modern organic methods.',NULL, NOW() - INTERVAL '89 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000008','The composting system needs to be scaled before we expand crop area — otherwise soil quality will suffer.',NULL, NOW() - INTERVAL '88 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Community supported agriculture (CSA) shares would give residents a direct stake in the farm''s success.',NULL, NOW() - INTERVAL '87 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Water availability is the limiting factor. Any expansion must come with a corresponding water plan.',NULL, NOW() - INTERVAL '86 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Seed sovereignty — maintaining our own seed bank of local varieties — should be an explicit goal.',NULL, NOW() - INTERVAL '85 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000004','The expansion area should include a dedicated research and demonstration plot open to visiting farmers.',NULL, NOW() - INTERVAL '84 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Food forests and agroforestry should be integrated — not just annual crops.',NULL, NOW() - INTERVAL '83 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Worker conditions and fair pay for the farm team must be a non-negotiable baseline in this expansion.',NULL, NOW() - INTERVAL '82 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000007','I''d like to see a youth agriculture programme — engaging teenagers in farming before they leave for college.',NULL, NOW() - INTERVAL '81 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Processing and storage facilities are as important as the growing area — let''s not forget post-harvest infrastructure.',NULL, NOW() - INTERVAL '80 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The surplus produce could supply the nearby villages at subsidised prices, strengthening our relationships.',NULL, NOW() - INTERVAL '79 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Certified organic status would open export and premium market opportunities to fund further expansion.',NULL, NOW() - INTERVAL '78 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Bees and pollinators — we need a dedicated apiary programme as part of the expansion.',NULL, NOW() - INTERVAL '77 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000004','What is the plan for the rainy season when large parts of the low-lying expansion area flood?',NULL, NOW() - INTERVAL '76 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Solar-powered drip irrigation could dramatically reduce water use while expanding productive area.',NULL, NOW() - INTERVAL '75 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000006','A quarterly farm open day would keep the community connected to where their food comes from.',NULL, NOW() - INTERVAL '74 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Biochar production from farm waste would improve soil structure and sequester carbon simultaneously.',NULL, NOW() - INTERVAL '73 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Let''s document the traditional knowledge of the older Tamil farmers who have worked this land for decades.',NULL, NOW() - INTERVAL '72 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000005',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The land identified for expansion is currently semi-degraded. Restoration should begin immediately.',NULL, NOW() - INTERVAL '71 days');

-- ============================================================
-- Issue 6 — New Eco-Village Housing Cluster (admission)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The housing waitlist has over 80 Aurovilians. This cluster is urgently needed.',NULL, NOW() - INTERVAL '15 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Earth architecture — rammed earth, compressed stabilised soil blocks — should be the default building method.',NULL, NOW() - INTERVAL '14 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000004','The cluster design must prioritise shared common spaces over maximising individual unit size.',NULL, NOW() - INTERVAL '13 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000005','We should not build more than we can ecologically support — carrying capacity analysis must come first.',NULL, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Including a mix of family units, single occupancy and communal living arrangements would serve diverse needs.',NULL, NOW() - INTERVAL '11 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Every unit should be net-zero energy from the start — solar, passive ventilation, no fossil fuels.',NULL, NOW() - INTERVAL '10 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Access to the cluster by bicycle and on foot should be prioritised over car access in the layout.',NULL, NOW() - INTERVAL '9 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The allocation process must be fair and transparent. A lottery system overseen by the community would be appropriate.',NULL, NOW() - INTERVAL '8 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Sector 7 was chosen for proximity to the forest zone — the design should integrate with rather than intrude upon it.',NULL, NOW() - INTERVAL '7 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Grey water recycling and composting toilets should be standard, not optional.',NULL, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Will there be a workshop and makerspace in the cluster? Residents working from home need shared tools and space.',NULL, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000005','The cluster should have its own small food garden — even if just herbs and vegetables for communal cooking.',NULL, NOW() - INTERVAL '4 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Construction timeline matters — residents have waited long enough. Let''s commit to a firm completion date.',NULL, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Design competitions involving architecture students from AUROVILLE and beyond could bring creative solutions.',NULL, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Heritage and cultural spaces within the cluster would help build a strong community identity from day one.',NULL, NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The cluster should have a formal governance structure — a residents'' council — written into the design from the start.',NULL, NOW() - INTERVAL '18 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Stormwater management and flood resilience must be central given our monsoon conditions.',NULL, NOW() - INTERVAL '12 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The cluster could serve as a demonstration model for sustainable housing across India — let''s be ambitious.',NULL, NOW() - INTERVAL '8 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Internet connectivity and work-from-home infrastructure must be treated as basic utility, not luxury.',NULL, NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000006',NULL,'a0a0a0a0-0000-0000-0000-000000000005','I strongly support this. The community needs more housing options to retain the Aurovilians who are currently living outside.',NULL, NOW() - INTERVAL '4 hours');

-- ============================================================
-- Issue 7 — Greenbelt Protection (discussion) — already has 7, add 15
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000005','The encroachment rate has accelerated — we''ve lost nearly 12 hectares in the last three years alone.',NULL, NOW() - INTERVAL '42 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Legal boundaries need to be clearly demarcated with physical markers and regular community inspections.',NULL, NOW() - INTERVAL '41 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000007','We should invest in drone-based monitoring — annual satellite surveys are not frequent enough.',NULL, NOW() - INTERVAL '40 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Any restoration plan must work with, not against, the adjoining villages. Relationships matter more than fences.',NULL, NOW() - INTERVAL '39 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Native species reforestation should focus on drought-resistant trees suited to red laterite soil.',NULL, NOW() - INTERVAL '38 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Engaging school children in planting and monitoring programs builds stewardship for the next generation.',NULL, NOW() - INTERVAL '37 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The Auroville Foundation''s legal mandate to protect the greenbelt must be leveraged — we need formal complaints filed.',NULL, NOW() - INTERVAL '36 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Creating sustainable livelihood opportunities for adjacent village residents reduces pressure on the forest.',NULL, NOW() - INTERVAL '35 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Wildlife corridors connecting our greenbelt to the larger Kaluveli wetland ecosystem are strategically important.',NULL, NOW() - INTERVAL '34 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The water catchment function of the greenbelt is critical — every tree we lose increases flooding downstream.',NULL, NOW() - INTERVAL '33 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Carbon credit schemes could generate revenue to fund restoration while contributing to climate goals.',NULL, NOW() - INTERVAL '32 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000008','A volunteer ranger programme with trained community members doing monthly patrols would strengthen enforcement.',NULL, NOW() - INTERVAL '31 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The biodiversity inventory is incomplete. We should commission a proper ecological survey before setting targets.',NULL, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Invasive species — especially Prosopis juliflora — are a bigger immediate threat than encroachment in some zones.',NULL, NOW() - INTERVAL '29 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The greenbelt is Auroville''s lungs. Protecting it is not optional — it is the foundation of everything we are.',NULL, NOW() - INTERVAL '28 days');

-- ============================================================
-- Issue 8 — International Cultural Exchange (voting)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Cultural exchange is at the heart of Auroville''s original vision. This programme renews that commitment.',NULL, NOW() - INTERVAL '30 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000008','We should ensure exchanges are reciprocal — Aurovilians going abroad as much as guests coming here.',NULL, NOW() - INTERVAL '29 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The programme should prioritise the Global South — connections with Africa, Latin America, Southeast Asia.',NULL, NOW() - INTERVAL '28 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000002','What is the ecological footprint of long-haul flights? We should set a carbon offset requirement for the programme.',NULL, NOW() - INTERVAL '27 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The exchange should include working placements in Auroville''s sustainable development projects, not only arts.',NULL, NOW() - INTERVAL '26 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Language diversity is a beautiful challenge — include translation and language learning as part of the programme.',NULL, NOW() - INTERVAL '25 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Local Tamil artists and performers should be central partners — this is their home too.',NULL, NOW() - INTERVAL '24 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000006','A documentation and archiving component would preserve knowledge and make exchanges accessible beyond participants.',NULL, NOW() - INTERVAL '23 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Virtual exchange components can complement in-person visits and dramatically expand reach at low cost.',NULL, NOW() - INTERVAL '22 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Clear community guidelines for hosting guests — around shared spaces, quiet hours, cultural sensitivity — are essential.',NULL, NOW() - INTERVAL '21 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The programme should be self-funding within three years through participant contributions and grants.',NULL, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Alumni networks from past exchanges are an underutilised resource — let''s build on those relationships.',NULL, NOW() - INTERVAL '19 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Children and young adults should have dedicated tracks — they are the future bridge-builders.',NULL, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000004','How will we evaluate the programme''s impact? We need clear success metrics agreed from the start.',NULL, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000005','The programme should explicitly connect with UNESCO''s global citizenship education framework.',NULL, NOW() - INTERVAL '16 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Food as culture — cooking workshops and community meals should be a core activity for every exchange cohort.',NULL, NOW() - INTERVAL '15 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Safety protocols and a support person for all incoming guests is non-negotiable.',NULL, NOW() - INTERVAL '14 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Connecting this to the upcoming performing arts centre project would create a natural home for exchange activities.',NULL, NOW() - INTERVAL '13 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000001','I am deeply moved by this proposal. Cultural exchange is how we grow beyond our own limited perspectives.',NULL, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000008',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The programme should produce open-access publications and films — sharing Auroville''s learnings with the world.',NULL, NOW() - INTERVAL '11 days');

-- ============================================================
-- Issue 9 — Zero-Waste Community Initiative (closed)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Auroville generates roughly 4.5 tonnes of waste per day. We must drastically reduce this at source.',NULL, NOW() - INTERVAL '80 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000004','A mandatory waste audit for all community units would establish the baseline we need to measure progress.',NULL, NOW() - INTERVAL '79 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000005','The current waste collection system is inconsistent across zones. Standardisation must come first.',NULL, NOW() - INTERVAL '78 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Banning single-use plastics in all community spaces should be the immediate first step.',NULL, NOW() - INTERVAL '77 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000007','A community repair café would extend the life of products and reduce the need for replacement.',NULL, NOW() - INTERVAL '76 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Zero waste starts with procurement — we should establish a community purchasing cooperative to reduce packaging.',NULL, NOW() - INTERVAL '75 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The construction and demolition waste stream is huge and largely unaddressed. It deserves a dedicated workstream.',NULL, NOW() - INTERVAL '74 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Composting infrastructure needs to be decentralised — one central facility is a bottleneck and creates transport waste.',NULL, NOW() - INTERVAL '73 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Gamification and visible community progress trackers would keep residents motivated throughout the transition.',NULL, NOW() - INTERVAL '72 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Schools and children are the most powerful change agents — the waste education programme must start there.',NULL, NOW() - INTERVAL '71 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000005','E-waste is a growing and toxic problem. We need formal e-waste collection points and certified recyclers.',NULL, NOW() - INTERVAL '70 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The transition must include the ragpickers who currently work at the waste site — their livelihoods must be protected.',NULL, NOW() - INTERVAL '69 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000007','A buy-nothing network and community library of things would dramatically reduce consumption.',NULL, NOW() - INTERVAL '68 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Auroville''s restaurants and guest houses produce enormous food waste. Mandatory composting must apply to them.',NULL, NOW() - INTERVAL '67 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000001','I support setting a bold target: 90% waste diversion from landfill within five years.',NULL, NOW() - INTERVAL '66 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The initiative should be tied to Auroville''s entry in the National Clean India Mission for additional funding.',NULL, NOW() - INTERVAL '65 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Waste mapping — knowing what is generated where — is the foundation. Can we do this in the next month?',NULL, NOW() - INTERVAL '64 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000004','A positive reputation as a zero-waste community will attract like-minded residents and visitors globally.',NULL, NOW() - INTERVAL '63 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Upcycling workshops — turning waste into useful objects — can also generate income for participants.',NULL, NOW() - INTERVAL '62 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000009',NULL,'a0a0a0a0-0000-0000-0000-000000000006','This is the kind of initiative that truly reflects Auroville''s values. Full support.',NULL, NOW() - INTERVAL '61 days');

-- ============================================================
-- Issue 10 — Digital Governance Platform (discussion) — already has 6, add 15
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000007','A truly open platform must use open-source software — no vendor lock-in for community governance tools.',NULL, NOW() - INTERVAL '25 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Digital inclusion is the key challenge — a significant portion of older residents are not digitally confident.',NULL, NOW() - INTERVAL '24 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The platform must comply with India''s data protection regulations. Where will data be hosted?',NULL, NOW() - INTERVAL '23 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Liquid democracy — where you can delegate your vote to a trusted person — is exactly the right model for Auroville.',NULL, NOW() - INTERVAL '22 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The platform should integrate with existing Auroville systems — the residents'' database, the working groups.',NULL, NOW() - INTERVAL '21 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Multi-language support is essential — English, French, Tamil, and German at minimum given our community makeup.',NULL, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000005','We should pilot with one working group before rolling out community-wide. Choose a willing and tech-savvy group.',NULL, NOW() - INTERVAL '19 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Transparency of the codebase is non-negotiable — any community member should be able to audit how votes are counted.',NULL, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000007','A paper-based fallback for all digital decisions should always be available for those who cannot access technology.',NULL, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000008','The platform should archive all historical decisions with their rationale — institutional memory is precious.',NULL, NOW() - INTERVAL '16 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Community ownership of the platform — not a third-party SaaS — is the only acceptable long-term model.',NULL, NOW() - INTERVAL '15 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Training sessions and ongoing helpdesk support are as important as the software itself.',NULL, NOW() - INTERVAL '14 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000003','The governance of the platform itself should model the principles it enables — participatory and transparent.',NULL, NOW() - INTERVAL '13 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Mobile-first design is essential — many residents access the internet only through smartphones.',NULL, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000005','This is exactly what the digital age requires of democracy — this project is important beyond Auroville.',NULL, NOW() - INTERVAL '11 days');

-- ============================================================
-- Issue 11 — Medicinal Herb & Wellness Garden (admission)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000008','This aligns perfectly with Auroville''s traditional healing practices and Ayurvedic heritage.',NULL, NOW() - INTERVAL '10 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Involving local Tamil healers and knowledge holders in the design is essential for authenticity.',NULL, NOW() - INTERVAL '9 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000002','The garden should be accessible to all — including children, elderly, and people with limited mobility.',NULL, NOW() - INTERVAL '8 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Documentation of traditional plant uses — ethobotanical knowledge — should be a formal output of the project.',NULL, NOW() - INTERVAL '7 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Growing rare and endangered medicinal species would contribute to biodiversity conservation.',NULL, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000005','A wellness programme integrated with the garden — yoga, meditation, herb walks — would be deeply valuable.',NULL, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The garden could supply the Auroville health centre and reduce dependence on imported supplements.',NULL, NOW() - INTERVAL '4 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000007','School groups visiting and learning plant identification would create a wonderful nature connection.',NULL, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000008','Water requirements for medicinal herbs are modest — this project would be sustainable even in dry years.',NULL, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000001','Workshops on making herbal preparations — tinctures, teas, poultices — would make the garden come alive.',NULL, NOW() - INTERVAL '36 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000002','A small nursery component could propagate plants for Aurovilians to grow at home — scaling the impact.',NULL, NOW() - INTERVAL '30 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Research partnerships with Pondicherry University''s botany department would add scientific credibility.',NULL, NOW() - INTERVAL '24 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000004','The siting matters — ideally near a water body and with partial shade for the more sensitive species.',NULL, NOW() - INTERVAL '20 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Could this connect with the Organic Farm expansion? Integrating medicinal plants into the farm design makes sense.',NULL, NOW() - INTERVAL '16 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000006','I would love to volunteer as a garden guide once this is established. Count me in for the working group.',NULL, NOW() - INTERVAL '12 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Clear signage in Tamil, English and French for every plant would make this accessible to everyone.',NULL, NOW() - INTERVAL '8 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000008','A digital plant catalogue with photographs and uses — accessible via QR code in the garden — would be wonderful.',NULL, NOW() - INTERVAL '6 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The garden should have a dedicated caretaker — not rely only on volunteers for core maintenance.',NULL, NOW() - INTERVAL '4 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Seasonal festivals around planting and harvest in the garden could become beautiful community traditions.',NULL, NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000011',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Beautiful, healing, educational and ecological — this proposal embodies everything Auroville stands for.',NULL, NOW() - INTERVAL '1 hour');

-- ============================================================
-- Issue 12 — Smart Grid & Renewable Energy Modernisation (voting)
-- ============================================================
INSERT INTO opinion (id, issue_id, initiative_id, author_id, content, parent_id, created_at) VALUES
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000004','The current grid cannot handle bidirectional flow — prosumers with solar cannot feed back. This must change.',NULL, NOW() - INTERVAL '20 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000005','A smart grid is useless without smart metering. Every unit must have real-time consumption visibility.',NULL, NOW() - INTERVAL '19 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000006','Energy storage at the community level — large-scale batteries — is the key enabling technology here.',NULL, NOW() - INTERVAL '18 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000007','Demand response programmes — incentivising consumption during peak solar hours — can defer expensive infrastructure.',NULL, NOW() - INTERVAL '17 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000008','The system must be cyber-secure from day one. Critical infrastructure attacks are a real and growing threat.',NULL, NOW() - INTERVAL '16 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000001','This project should be coordinated with the Solar Expansion plan — they are two sides of the same coin.',NULL, NOW() - INTERVAL '15 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Community ownership of the grid infrastructure is paramount — no private monopoly over Auroville''s energy system.',NULL, NOW() - INTERVAL '14 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Electric vehicle charging infrastructure should be integrated into the grid design from the start.',NULL, NOW() - INTERVAL '13 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Open-source grid management software would allow community technicians to maintain and evolve the system.',NULL, NOW() - INTERVAL '12 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000005','Time-of-use pricing — cheaper electricity when supply is abundant — would naturally shift consumption patterns.',NULL, NOW() - INTERVAL '11 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000006','We should apply for MNRE and IREDA funding — this project qualifies under multiple national scheme categories.',NULL, NOW() - INTERVAL '10 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000007','The project needs a dedicated energy manager role — not just engineers but someone who understands community dynamics.',NULL, NOW() - INTERVAL '9 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000008','A phased rollout — starting with the most energy-intensive zones — makes the project manageable and measurable.',NULL, NOW() - INTERVAL '8 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000001','The project could put Auroville on the global map as a model for community-scale smart grid implementation.',NULL, NOW() - INTERVAL '7 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000002','Can we partner with IIT Madras for research support? They have an excellent energy systems group.',NULL, NOW() - INTERVAL '6 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000003','Grid resilience during cyclone season is a critical design requirement for this coastal location.',NULL, NOW() - INTERVAL '5 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000004','Waste-to-energy from the zero-waste initiative could be a complementary input to the modernised grid.',NULL, NOW() - INTERVAL '4 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000005','A community energy literacy programme should accompany the technical rollout — people must understand their system.',NULL, NOW() - INTERVAL '3 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000006','The modernisation must be backwards compatible — we cannot strand the investments households have already made.',NULL, NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'e0e0e0e0-0000-0000-0000-000000000012',NULL,'a0a0a0a0-0000-0000-0000-000000000007','I fully support this vision. A resilient, community-owned renewable grid is Auroville''s energy future.',NULL, NOW() - INTERVAL '1 day');
