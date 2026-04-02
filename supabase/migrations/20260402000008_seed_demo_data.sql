-- ============================================================
-- SEED: Auroville Demo Data (modular-version/filled branch)
-- ============================================================

-- ============================================================
-- 1. AUTH USERS  (no login — empty encrypted_password)
-- ============================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, is_sso_user
) VALUES
  ('a0a0a0a0-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated','priya.aurosmith@auroville.org',  '', NOW(), NOW() - INTERVAL '3 years', NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ravi.sundaram@auroville.org',     '', NOW(), NOW() - INTERVAL '2 years', NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated','lakshmi.devi@auroville.org',      '', NOW(), NOW() - INTERVAL '2 years', NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated','thomas.weber@auroville.org',      '', NOW(), NOW() - INTERVAL '1 year',  NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated','ananda.krishna@auroville.org',    '', NOW(), NOW() - INTERVAL '4 years', NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated','sofia.bernhardt@auroville.org',   '', NOW(), NOW() - INTERVAL '1 year',  NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated','arjun.mehta@auroville.org',       '', NOW(), NOW() - INTERVAL '6 months',NOW(), '{"provider":"email","providers":["email"]}','{}',false,false),
  ('a0a0a0a0-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated','meera.patel@auroville.org',       '', NOW(), NOW() - INTERVAL '8 months',NOW(), '{"provider":"email","providers":["email"]}','{}',false,false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. MEMBERS
-- ============================================================
INSERT INTO member (id, email, display_name, is_admin, is_approved, created_at) VALUES
  ('a0a0a0a0-0000-0000-0000-000000000001','priya.aurosmith@auroville.org', 'Priya Aurosmith',        true,  true, NOW() - INTERVAL '3 years'),
  ('a0a0a0a0-0000-0000-0000-000000000002','ravi.sundaram@auroville.org',   'Ravi Sundaram',          false, true, NOW() - INTERVAL '2 years'),
  ('a0a0a0a0-0000-0000-0000-000000000003','lakshmi.devi@auroville.org',    'Lakshmi Devi',           false, true, NOW() - INTERVAL '2 years'),
  ('a0a0a0a0-0000-0000-0000-000000000004','thomas.weber@auroville.org',    'Thomas Weber',           false, true, NOW() - INTERVAL '1 year'),
  ('a0a0a0a0-0000-0000-0000-000000000005','ananda.krishna@auroville.org',  'Ananda Krishnamurthy',   false, true, NOW() - INTERVAL '4 years'),
  ('a0a0a0a0-0000-0000-0000-000000000006','sofia.bernhardt@auroville.org', 'Sofia Bernhardt',        false, true, NOW() - INTERVAL '1 year'),
  ('a0a0a0a0-0000-0000-0000-000000000007','arjun.mehta@auroville.org',     'Arjun Mehta',            false, true, NOW() - INTERVAL '6 months'),
  ('a0a0a0a0-0000-0000-0000-000000000008','meera.patel@auroville.org',     'Meera Patel',            false, true, NOW() - INTERVAL '8 months')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. UNITS
-- ============================================================
INSERT INTO unit (id, name, description, created_at) VALUES
  ('b0b0b0b0-0000-0000-0000-000000000001','Governance & Community',    'Community decision-making, legal structures and collective agreements', NOW() - INTERVAL '3 years'),
  ('b0b0b0b0-0000-0000-0000-000000000002','Economy & Sustainability',  'Financial systems, sustainable enterprises and resource sharing',       NOW() - INTERVAL '3 years'),
  ('b0b0b0b0-0000-0000-0000-000000000003','Environment & Land',        'Forest conservation, agriculture, water and ecological stewardship',     NOW() - INTERVAL '3 years'),
  ('b0b0b0b0-0000-0000-0000-000000000004','Education & Culture',       'Schools, lifelong learning, arts and cultural exchange',                 NOW() - INTERVAL '3 years'),
  ('b0b0b0b0-0000-0000-0000-000000000005','Infrastructure & Technology','Roads, energy grid, digital tools and physical infrastructure',          NOW() - INTERVAL '3 years')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. AREAS
-- ============================================================
INSERT INTO area (id, unit_id, name, description, created_at) VALUES
  ('c0c0c0c0-0000-0000-0000-000000000001','b0b0b0b0-0000-0000-0000-000000000001','Community Assembly',    'Plenary decisions, resident meetings and collective governance',          NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000002','b0b0b0b0-0000-0000-0000-000000000001','Legal & Compliance',    'Charters, bylaws, legal obligations and conflict resolution',            NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000003','b0b0b0b0-0000-0000-0000-000000000002','Auroville Foundation',  'Foundation funding, grants and financial oversight',                     NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000004','b0b0b0b0-0000-0000-0000-000000000002','Sustainable Enterprises','Community businesses, para-economy and self-sufficiency projects',       NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000005','b0b0b0b0-0000-0000-0000-000000000003','Forest & Agriculture',  'Greenbelt, organic farms, reforestation and food sovereignty',           NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000006','b0b0b0b0-0000-0000-0000-000000000003','Water Management',      'Rainwater harvesting, water tables, irrigation and conservation',        NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000007','b0b0b0b0-0000-0000-0000-000000000004','Auroville Schools',     'Future School, AWARE, and educational programmes for all ages',          NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000008','b0b0b0b0-0000-0000-0000-000000000004','Cultural Programmes',   'Performing arts, festivals, cultural exchange and creative spaces',      NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000009','b0b0b0b0-0000-0000-0000-000000000005','Energy & Power',        'Solar, wind, biogas and smart grid infrastructure',                      NOW() - INTERVAL '3 years'),
  ('c0c0c0c0-0000-0000-0000-000000000010','b0b0b0b0-0000-0000-0000-000000000005','Roads & Transport',     'Road maintenance, pedestrian paths, cycling and shared mobility',        NOW() - INTERVAL '3 years')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. POLICIES
-- ============================================================
INSERT INTO policy (id, name, admission_days, discussion_days, verification_days, voting_days, quorum, voting_method, close_by_quorum, close_by_consensus, consensus_threshold, created_at) VALUES
  ('d0d0d0d0-0000-0000-0000-000000000001','Standard Process',      7, 14, 7, 7,  5, 'approval', false, false, 80, NOW() - INTERVAL '3 years'),
  ('d0d0d0d0-0000-0000-0000-000000000002','Fast Track',            3,  7, 3, 3,  3, 'approval', true,  false, 75, NOW() - INTERVAL '3 years'),
  ('d0d0d0d0-0000-0000-0000-000000000003','Ranked Choice (Schulze)',7, 14, 7, 7,  5, 'schulze',  false, false, 80, NOW() - INTERVAL '3 years'),
  ('d0d0d0d0-0000-0000-0000-000000000004','Consensus-Based',       7, 21, 7, 10, 4, 'approval', false, true,  80, NOW() - INTERVAL '3 years')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. ISSUES
-- ============================================================
-- Convention for timestamps:
--   VOTING  issues: voting_at  = NOW() - 1 day
--   DISCUSSION:     discussion_at = NOW() - 8 days
--   VERIFICATION:   verification_at = NOW() - 3 days
--   ADMISSION:      admission_at  = NOW() - 2 days
--   CLOSED:         closed_at set

INSERT INTO issue (id, title, status, area_id, policy_id, author_id,
  admission_at, discussion_at, verification_at, voting_at, closed_at, accepted_initiative_id, created_at) VALUES

  -- VOTING — Schulze
  ('e0e0e0e0-0000-0000-0000-000000000001',
   'Solar Energy Expansion Plan 2026',
   'voting',
   'c0c0c0c0-0000-0000-0000-000000000009',
   'd0d0d0d0-0000-0000-0000-000000000003',
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '36 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day',
   NULL, NULL, NOW() - INTERVAL '37 days'),

  -- VOTING — Standard / Approval
  ('e0e0e0e0-0000-0000-0000-000000000002',
   'Main Road Rehabilitation — Auroville Ring Road',
   'voting',
   'c0c0c0c0-0000-0000-0000-000000000010',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002',
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '23 days', NOW() - INTERVAL '9 days', NOW() - INTERVAL '2 days',
   NULL, NULL, NOW() - INTERVAL '31 days'),

  -- DISCUSSION
  ('e0e0e0e0-0000-0000-0000-000000000003',
   'Future School Curriculum Reform',
   'discussion',
   'c0c0c0c0-0000-0000-0000-000000000007',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003',
   NOW() - INTERVAL '18 days', NOW() - INTERVAL '11 days',
   NULL, NULL, NULL, NULL, NOW() - INTERVAL '19 days'),

  -- VERIFICATION
  ('e0e0e0e0-0000-0000-0000-000000000004',
   'Mandatory Rainwater Harvesting Policy',
   'verification',
   'c0c0c0c0-0000-0000-0000-000000000006',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '25 days', NOW() - INTERVAL '18 days', NOW() - INTERVAL '3 days',
   NULL, NULL, NULL, NOW() - INTERVAL '26 days'),

  -- CLOSED (accepted)
  ('e0e0e0e0-0000-0000-0000-000000000005',
   'Organic Farm Expansion Programme',
   'closed',
   'c0c0c0c0-0000-0000-0000-000000000005',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '60 days', NOW() - INTERVAL '53 days', NOW() - INTERVAL '39 days', NOW() - INTERVAL '32 days',
   NOW() - INTERVAL '25 days',
   'f0f0f0f0-0000-0000-0000-000000000010',
   NOW() - INTERVAL '61 days'),

  -- ADMISSION
  ('e0e0e0e0-0000-0000-0000-000000000006',
   'New Eco-Village Housing Cluster — Sector 7',
   'admission',
   'c0c0c0c0-0000-0000-0000-000000000001',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '2 days',
   NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '3 days'),

  -- DISCUSSION — Consensus policy
  ('e0e0e0e0-0000-0000-0000-000000000007',
   'Auroville Greenbelt Protection & Restoration',
   'discussion',
   'c0c0c0c0-0000-0000-0000-000000000005',
   'd0d0d0d0-0000-0000-0000-000000000004',
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '15 days', NOW() - INTERVAL '8 days',
   NULL, NULL, NULL, NULL, NOW() - INTERVAL '16 days'),

  -- VOTING — Fast Track / Approval
  ('e0e0e0e0-0000-0000-0000-000000000008',
   'International Cultural Exchange Programme 2026',
   'voting',
   'c0c0c0c0-0000-0000-0000-000000000008',
   'd0d0d0d0-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000006',
   NOW() - INTERVAL '10 days', NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day',
   NULL, NULL, NOW() - INTERVAL '11 days'),

  -- CLOSED (accepted)
  ('e0e0e0e0-0000-0000-0000-000000000009',
   'Zero-Waste Community Initiative',
   'closed',
   'c0c0c0c0-0000-0000-0000-000000000001',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '75 days', NOW() - INTERVAL '68 days', NOW() - INTERVAL '54 days', NOW() - INTERVAL '47 days',
   NOW() - INTERVAL '40 days',
   'f0f0f0f0-0000-0000-0000-000000000018',
   NOW() - INTERVAL '76 days'),

  -- DISCUSSION
  ('e0e0e0e0-0000-0000-0000-000000000010',
   'Open-Source Digital Governance Platform',
   'discussion',
   'c0c0c0c0-0000-0000-0000-000000000001',
   'd0d0d0d0-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000007',
   NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days',
   NULL, NULL, NULL, NULL, NOW() - INTERVAL '11 days'),

  -- ADMISSION
  ('e0e0e0e0-0000-0000-0000-000000000011',
   'Community Medicinal Herb & Wellness Garden',
   'admission',
   'c0c0c0c0-0000-0000-0000-000000000005',
   'd0d0d0d0-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000008',
   NOW() - INTERVAL '1 day',
   NULL, NULL, NULL, NULL, NULL, NOW() - INTERVAL '2 days'),

  -- VOTING — Schulze
  ('e0e0e0e0-0000-0000-0000-000000000012',
   'Smart Grid & Renewable Energy Modernisation',
   'voting',
   'c0c0c0c0-0000-0000-0000-000000000009',
   'd0d0d0d0-0000-0000-0000-000000000003',
   'a0a0a0a0-0000-0000-0000-000000000004',
   NOW() - INTERVAL '36 days', NOW() - INTERVAL '29 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day',
   NULL, NULL, NOW() - INTERVAL '37 days')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. INITIATIVES
-- ============================================================
INSERT INTO initiative (id, issue_id, title, content, author_id, created_at) VALUES

  -- Issue 1: Solar Energy (3 proposals, Schulze)
  ('f0f0f0f0-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000001',
   'Large-Scale Solar Farm — 2 MW South Field',
   E'## Overview\nConstruct a centralized 2 MW photovoltaic solar farm on the 40-acre south field, providing clean energy for approximately 70% of Auroville''s daily needs.\n\n## Key Features\n- 6,000 bifacial solar panels\n- Battery storage: 4 MWh capacity\n- Grid integration with existing infrastructure\n- Estimated payback period: 6 years\n\n## Environmental Impact\nMinimal land disruption; field is currently unused scrubland. Carbon offset equivalent to removing 800 cars annually.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '33 days'),

  ('f0f0f0f0-0000-0000-0000-000000000002',
   'e0e0e0e0-0000-0000-0000-000000000001',
   'Distributed Rooftop Solar Programme',
   E'## Overview\nMandatory rooftop solar installation on all community buildings and homes over 80 sqm, targeting 800 kW total distributed capacity.\n\n## Key Features\n- Subsidised panel procurement through bulk purchasing\n- Community installation crews (creates 12 local jobs)\n- Peer-to-peer energy sharing via smart meters\n- Payback: 8–10 years per household\n\n## Why Distributed?\nResilient, democratized energy. No single point of failure. Every household becomes a producer.',
   'a0a0a0a0-0000-0000-0000-000000000004', NOW() - INTERVAL '32 days'),

  ('f0f0f0f0-0000-0000-0000-000000000003',
   'e0e0e0e0-0000-0000-0000-000000000001',
   'Hybrid Approach: Solar Farm + Community Rooftops',
   E'## Overview\nCombine a smaller 1 MW central farm with a voluntary rooftop programme targeting 400 kW, reaching 1.4 MW total within 18 months.\n\n## Key Features\n- Phase 1: 1 MW farm (12 months)\n- Phase 2: Rooftop incentive grants (6 months)\n- Shared monitoring dashboard for all residents\n\n## Rationale\nBalances economies of scale with community participation. Flexibility if one component faces delays.',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '30 days'),

  -- Issue 2: Road Rehabilitation (2 proposals, Approval)
  ('f0f0f0f0-0000-0000-0000-000000000004',
   'e0e0e0e0-0000-0000-0000-000000000002',
   'Full Asphalt Reconstruction with Cycle Lanes',
   E'## Proposal\nComplete resurfacing of the 12 km ring road with high-quality asphalt, integrated 2-metre cycle lanes on both sides and LED street lighting.\n\n## Budget\nEstimated ₹2.4 Cr, funded jointly by Auroville Foundation and Tamil Nadu government grant.\n\n## Timeline\nPhased construction over 8 months; one section at a time to minimise disruption.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '27 days'),

  ('f0f0f0f0-0000-0000-0000-000000000005',
   'e0e0e0e0-0000-0000-0000-000000000002',
   'Eco-Compacted Gravel Path with Drainage',
   E'## Proposal\nRehabilitate the ring road using compacted laterite gravel with improved stormwater drainage channels — preserving the natural, low-speed character of Auroville''s roads.\n\n## Budget\nEstimated ₹60 L — four times cheaper than asphalt.\n\n## Environmental Case\nZero tar; permeable surface recharges groundwater. Lower carbon footprint. Maintenance can be done locally.',
   'a0a0a0a0-0000-0000-0000-000000000005', NOW() - INTERVAL '26 days'),

  -- Issue 3: Curriculum Reform (2 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000006',
   'e0e0e0e0-0000-0000-0000-000000000003',
   'STEAM-Centred Curriculum with Global Accreditation',
   E'## Overview\nReorient the Future School curriculum around Science, Technology, Engineering, Arts and Mathematics, aligned with IB (International Baccalaureate) standards.\n\n## Benefits\n- Students gain globally recognised qualifications\n- Strong coding, robotics and environmental science tracks\n- Partnerships with Chennai and Bangalore universities\n\n## Concerns Addressed\nSpiritual and inner development sessions maintained as daily practice.',
   'a0a0a0a0-0000-0000-0000-000000000003', NOW() - INTERVAL '9 days'),

  ('f0f0f0f0-0000-0000-0000-000000000007',
   'e0e0e0e0-0000-0000-0000-000000000003',
   'Integral Holistic Education — Sri Aurobindo Model',
   E'## Overview\nDeepen the existing holistic approach rooted in Sri Aurobindo''s philosophy of integral education — body, mind, vital and spirit as one.\n\n## Features\n- No formal exams; portfolio-based assessment\n- Nature immersion, meditation and yoga daily\n- Project-based collaborative learning\n- Free progression at individual pace\n\n## Why This Matters\nAuroville''s education is a gift to the world. Standardizing it loses the very uniqueness that draws families here.',
   'a0a0a0a0-0000-0000-0000-000000000003', NOW() - INTERVAL '8 days'),

  -- Issue 4: Water (2 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000008',
   'e0e0e0e0-0000-0000-0000-000000000004',
   'Mandatory Rainwater Harvesting for All Structures',
   E'## Policy Proposal\nRequire all structures above 50 sqm to install and maintain functional rainwater harvesting systems by December 2026.\n\n## Enforcement\n- Inspection by Water Management team\n- Non-compliance: suspension of community water allocation\n- Financial assistance fund for low-income residents\n\n## Impact\nCould recharge groundwater by an estimated 40 million litres annually.',
   'a0a0a0a0-0000-0000-0000-000000000005', NOW() - INTERVAL '22 days'),

  ('f0f0f0f0-0000-0000-0000-000000000009',
   'e0e0e0e0-0000-0000-0000-000000000004',
   'Voluntary Incentive Programme with Water Credits',
   E'## Policy Proposal\nCreate a "Water Credit" system rewarding residents and units who install harvesting systems and demonstrate reduced consumption.\n\n## How It Works\n- Credits redeemable against community maintenance fees\n- Annual Water Stewardship Awards\n- Free training workshops\n\n## Philosophy\nCoercion builds resentment. Incentives build culture. Let Auroville lead through inspiration, not regulation.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '21 days'),

  -- Issue 5: Farming CLOSED — accepted initiative
  ('f0f0f0f0-0000-0000-0000-000000000010',
   'e0e0e0e0-0000-0000-0000-000000000005',
   'Expand Certified Organic Farmland by 50 Acres',
   E'## Proposal\nAcquire and convert 50 additional acres of degraded land south of the greenbelt into certified organic farmland managed collectively.\n\n## Outcome\nThis initiative was **accepted** and implementation has begun. First harvest expected December 2026.\n\n## Impact\n- 60% of community vegetables to be grown locally by 2027\n- 15 full-time farming positions created\n- Soil restoration through biodynamic methods',
   'a0a0a0a0-0000-0000-0000-000000000005', NOW() - INTERVAL '58 days'),

  ('f0f0f0f0-0000-0000-0000-000000000011',
   'e0e0e0e0-0000-0000-0000-000000000005',
   'Train Farmers First — Capacity Before Land',
   E'## Proposal\nBefore expanding land, invest in a 6-month farmer training programme for 30 community members, then expand organically.\n\n## Rationale\nPast expansions failed due to lack of skilled farmers. Build human capacity first.\n\n## Status\nThis proposal was not selected. Feedback was incorporated into the accepted initiative''s implementation plan.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '57 days'),

  -- Issue 6: Housing ADMISSION (2 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000012',
   'e0e0e0e0-0000-0000-0000-000000000006',
   'Earthen Architecture Eco-Village Cluster (12 homes)',
   E'## Concept\nBuild 12 rammed-earth and bamboo homes in a clustered village layout at Sector 7, designed by Auroville''s architecture group.\n\n## Features\n- Passive cooling; no air-conditioning needed\n- Shared central courtyard and community kitchen\n- Rainwater harvesting and composting integrated\n- Priority allocation for long-standing Aurovilians',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),

  ('f0f0f0f0-0000-0000-0000-000000000013',
   'e0e0e0e0-0000-0000-0000-000000000006',
   'Mixed-Use Housing with New Resident Integration',
   E'## Concept\nDevelop 20 mixed-typology units (studios, family homes) at Sector 7, prioritizing new residents and families with children.\n\n## Features\n- 40% allocation for families with school-age children\n- Affordable rental model via Auroville Foundation\n- Co-working and childcare spaces on ground floor',
   'a0a0a0a0-0000-0000-0000-000000000007', NOW() - INTERVAL '1 day'),

  -- Issue 7: Greenbelt DISCUSSION (2 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000014',
   'e0e0e0e0-0000-0000-0000-000000000007',
   'Full Protection Zone — Zero Human Activity Buffer',
   E'## Proposal\nDesignate the inner 500m of the greenbelt as a strict no-intervention conservation zone. No farming, no paths, no construction.\n\n## Rationale\nThe greenbelt is the lungs of Auroville. Current pressures from encroachment and agriculture are fragmenting wildlife corridors. A hard boundary is the only credible protection.',
   'a0a0a0a0-0000-0000-0000-000000000005', NOW() - INTERVAL '7 days'),

  ('f0f0f0f0-0000-0000-0000-000000000015',
   'e0e0e0e0-0000-0000-0000-000000000007',
   'Sustainable Use Zone with Community Stewardship',
   E'## Proposal\nManage the greenbelt as a community-stewarded sustainable use zone: regenerative agroforestry, medicinal gardens, and guided nature trails permitted.\n\n## Rationale\nAbsolute exclusion disconnects people from nature. Sustainable use deepens the relationship. Indigenous land wisdom should guide, not prohibit.',
   'a0a0a0a0-0000-0000-0000-000000000008', NOW() - INTERVAL '6 days'),

  -- Issue 8: Cultural Exchange VOTING (2 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000016',
   'e0e0e0e0-0000-0000-0000-000000000008',
   'Annual Auroville World Arts Festival (3 weeks)',
   E'## Proposal\nHost a three-week annual World Arts Festival in February, inviting 80+ artists from 30 countries for residencies, performances and collaborative creation.\n\n## Budget\n₹45 L; 60% recovered through ticketed evening performances and international grants.\n\n## Legacy\nA permanent cultural exchange programme that positions Auroville as a global centre for conscious art.',
   'a0a0a0a0-0000-0000-0000-000000000006', NOW() - INTERVAL '8 days'),

  ('f0f0f0f0-0000-0000-0000-000000000017',
   'e0e0e0e0-0000-0000-0000-000000000008',
   'Rolling Residency Programme — 12 Artists Per Year',
   E'## Proposal\nInstead of a festival, run a continuous year-round residency: 12 international artists per year, 1 month each, fully embedded in community life.\n\n## Benefits\n- Deeper cultural integration than festival model\n- Artists contribute to community projects\n- Lower organisational burden\n- Budget: ₹18 L per year',
   'a0a0a0a0-0000-0000-0000-000000000003', NOW() - INTERVAL '7 days'),

  -- Issue 9: Waste CLOSED — accepted
  ('f0f0f0f0-0000-0000-0000-000000000018',
   'e0e0e0e0-0000-0000-0000-000000000009',
   'Integrated Zero-Waste System with Biogas Plant',
   E'## Accepted Initiative\nThis proposal was accepted and the biogas plant is now operational at the community''s eastern compost yard.\n\n## System Components\n- Source segregation at 100% of households\n- Community biogas plant converting organic waste to cooking gas\n- Upcycling workshop for dry waste\n- Weekly bulk waste drives\n\n## Results (6 months post-implementation)\nLandfill diversion: 78% · Biogas production: 300 m³/month',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '73 days'),

  ('f0f0f0f0-0000-0000-0000-000000000019',
   'e0e0e0e0-0000-0000-0000-000000000009',
   'Decentralised Composting Network',
   E'## Proposal\nEstablish 20 neighbourhood composting stations managed by volunteer coordinators rather than a central plant.\n\n## Status\nNot selected. Key learnings were incorporated into the accepted initiative''s decentralised distribution strategy.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '72 days'),

  -- Issue 10: Digital Platform DISCUSSION (1 proposal)
  ('f0f0f0f0-0000-0000-0000-000000000020',
   'e0e0e0e0-0000-0000-0000-000000000010',
   'Auroville Liquid Democracy Platform — Open Source Fork',
   E'## Proposal\nAdopt and customise an open-source liquid democracy platform for all community decisions, replacing ad-hoc email threads and informal polls.\n\n## Features\n- Proposal lifecycle: Admission → Discussion → Voting → Implementation\n- Delegate your vote to trusted community members per topic\n- Full transparency: all decisions publicly accessible\n- Mobile-first design for field access\n\n## Tech Stack\nNext.js + Supabase, self-hosted on community servers. This very platform is the prototype.',
   'a0a0a0a0-0000-0000-0000-000000000007', NOW() - INTERVAL '2 days'),

  -- Issue 11: Herb Garden ADMISSION (1 proposal)
  ('f0f0f0f0-0000-0000-0000-000000000021',
   'e0e0e0e0-0000-0000-0000-000000000011',
   'Healing Garden — 2-Acre Medicinal Herb Sanctuary',
   E'## Vision\nCreate a 2-acre medicinal herb garden adjacent to Auroville''s health centre, combining traditional Siddha and Ayurvedic plant knowledge with community wellness.\n\n## Plants\n120 species including Tulsi, Ashwagandha, Brahmi, Neem, and rare medicinal trees.\n\n## Uses\n- Free herb dispensary for residents\n- Educational tours for schools\n- Research collaboration with JIPMER Pondicherry',
   'a0a0a0a0-0000-0000-0000-000000000008', NOW() - INTERVAL '1 day'),

  -- Issue 12: Grid Modernisation VOTING Schulze (3 proposals)
  ('f0f0f0f0-0000-0000-0000-000000000022',
   'e0e0e0e0-0000-0000-0000-000000000012',
   'AI-Optimised Smart Grid with Demand Forecasting',
   E'## Proposal\nUpgrade Auroville''s energy grid with smart meters, real-time demand forecasting AI and automatic load balancing.\n\n## Components\n- 500 smart meters across all units\n- Central AI dashboard with 15-minute resolution data\n- Automatic shedding during peak loads\n- Integration with existing solar and biogas sources\n\n## Investment\n₹1.2 Cr over 2 years. ROI through 25% reduction in energy waste.',
   'a0a0a0a0-0000-0000-0000-000000000004', NOW() - INTERVAL '33 days'),

  ('f0f0f0f0-0000-0000-0000-000000000023',
   'e0e0e0e0-0000-0000-0000-000000000012',
   'Incremental Grid Upgrade — Replace Ageing Infrastructure',
   E'## Proposal\nFocus resources on replacing the 15-year-old transformer infrastructure and underground cabling before adding smart features.\n\n## Rationale\nSmart software on failing hardware is wasted investment. Fix the foundation first.\n\n## Scope\n- 3 new transformer stations\n- 8 km of underground cable replacement\n- Budget: ₹80 L\n- Timeline: 14 months',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '32 days'),

  ('f0f0f0f0-0000-0000-0000-000000000024',
   'e0e0e0e0-0000-0000-0000-000000000012',
   'Fully Decentralised Microgrid — Each Zone Independent',
   E'## Proposal\nRearchitect the grid into 6 autonomous microgrids — one per zone — each self-sufficient with local generation and storage.\n\n## Vision\nTrue energy democracy. No zone depends on another. Failure in one zone does not cascade.\n\n## Requirements\n- 6 × 200 kWh battery banks\n- 6 local solar/biogas generation nodes\n- Inter-grid trading protocol for surplus\n- Budget: ₹2.1 Cr over 3 years',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '31 days')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. APPROVAL VOTES (Issues 2 and 8)
-- ============================================================
-- Issue 2 — Road: i04 vs i05
INSERT INTO vote (id, initiative_id, member_id, value, created_at) VALUES
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000001','approve', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000002','approve', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000004','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000007','oppose',  NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000008','abstain', NOW() - INTERVAL '1 day'),

  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000003','approve', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000005','approve', NOW() - INTERVAL '2 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000006','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000001','oppose',  NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000002','oppose',  NOW() - INTERVAL '1 day')
ON CONFLICT (initiative_id, member_id) DO NOTHING;

-- Issue 8 — Culture: i16 vs i17
INSERT INTO vote (id, initiative_id, member_id, value, created_at) VALUES
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000001','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000002','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000003','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000004','oppose',  NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000006','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000007','approve', NOW() - INTERVAL '1 day'),

  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000003','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000004','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000005','approve', NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000001','oppose',  NOW() - INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000008','abstain', NOW() - INTERVAL '1 day')
ON CONFLICT (initiative_id, member_id) DO NOTHING;

-- ============================================================
-- 9. RANKED VOTES (Issues 1 and 12 — Schulze)
-- ============================================================
-- Issue 1 Solar: i01=Solar Farm, i02=Rooftop, i03=Hybrid
INSERT INTO ranked_vote (issue_id, initiative_id, member_id, rank, created_at) VALUES
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000001',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000001',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000002',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000002',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000003',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000003',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000004',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000005',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000005',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000005',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000006',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000007',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000007',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000001','f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000007',3,NOW()-INTERVAL '1 day')
ON CONFLICT (issue_id, initiative_id, member_id) DO NOTHING;

-- Issue 12 Grid: i22=Smart Grid, i23=Incremental, i24=Decentralised
INSERT INTO ranked_vote (issue_id, initiative_id, member_id, rank, created_at) VALUES
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000022','a0a0a0a0-0000-0000-0000-000000000001',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000024','a0a0a0a0-0000-0000-0000-000000000001',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000023','a0a0a0a0-0000-0000-0000-000000000001',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000024','a0a0a0a0-0000-0000-0000-000000000002',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000022','a0a0a0a0-0000-0000-0000-000000000002',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000023','a0a0a0a0-0000-0000-0000-000000000002',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000022','a0a0a0a0-0000-0000-0000-000000000003',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000023','a0a0a0a0-0000-0000-0000-000000000003',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000024','a0a0a0a0-0000-0000-0000-000000000003',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000024','a0a0a0a0-0000-0000-0000-000000000004',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000023','a0a0a0a0-0000-0000-0000-000000000004',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000022','a0a0a0a0-0000-0000-0000-000000000004',3,NOW()-INTERVAL '1 day'),

  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000022','a0a0a0a0-0000-0000-0000-000000000005',1,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000024','a0a0a0a0-0000-0000-0000-000000000005',2,NOW()-INTERVAL '1 day'),
  ('e0e0e0e0-0000-0000-0000-000000000012','f0f0f0f0-0000-0000-0000-000000000023','a0a0a0a0-0000-0000-0000-000000000005',3,NOW()-INTERVAL '1 day')
ON CONFLICT (issue_id, initiative_id, member_id) DO NOTHING;

-- ============================================================
-- 10. PRO / CONTRA ARGUMENTS
-- ============================================================
INSERT INTO argument (id, initiative_id, author_id, stance, content, created_at) VALUES
  -- Solar Farm (i01)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002','pro',    'At 2 MW capacity this single installation meets 70% of our energy needs — the most efficient use of capital and land we can make right now.', NOW()-INTERVAL '28 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004','pro',    'Centralised generation means professional maintenance and better uptime. Less dependency on individual households to manage their own systems.', NOW()-INTERVAL '27 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000005','contra', 'Converting 40 acres of scrubland removes an important wildlife corridor and microhabitat. We should look at degraded land only.', NOW()-INTERVAL '26 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000008','contra', 'A single centralised system is a single point of failure. One storm or grid fault blacks out the whole community.', NOW()-INTERVAL '25 days'),

  -- Rooftop Solar (i02)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000003','pro',    'Every household becomes an energy producer. This is true energy democracy and aligns perfectly with Auroville''s decentralisation values.', NOW()-INTERVAL '28 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006','pro',    'Distributed panels are more resilient — a fault in one area doesn''t affect others. This is the architecture the future needs.', NOW()-INTERVAL '27 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000002','contra', '800 kW across hundreds of rooftops will never match the output of a properly engineered farm. We need scale to decarbonise fast.', NOW()-INTERVAL '25 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004','contra', 'Mandatory installation will be deeply resented. Some households lack the roof structure, orientation or resources to participate equally.', NOW()-INTERVAL '24 days'),

  -- Hybrid (i03)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000001','pro',    'The hybrid approach avoids betting everything on one model. If the farm faces planning delays, rooftops keep progress moving.', NOW()-INTERVAL '26 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000007','pro',    'Combining both generates community buy-in from both camps. Implementation will face less resistance.', NOW()-INTERVAL '25 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000004','contra', 'Two systems means two maintenance teams, two budgets, two sets of problems. We will end up doing both poorly instead of one brilliantly.', NOW()-INTERVAL '23 days'),

  -- Road Full Reconstruction (i04)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000002','pro',    'A properly constructed asphalt road with cycle lanes will last 20 years. The gravel alternative requires costly re-grading every monsoon.', NOW()-INTERVAL '24 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000007','pro',    'Cycle lanes are essential for safety. We have had three cycling accidents this year on the current road.', NOW()-INTERVAL '23 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000005','contra', 'An asphalt ring road will increase vehicle speeds and invite more car traffic. It contradicts our pedestrian-first charter.', NOW()-INTERVAL '22 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000003','contra', 'The carbon footprint of asphalt production is significant. Laterite gravel is local, natural and zero-carbon.', NOW()-INTERVAL '21 days'),

  -- Eco Gravel Road (i05)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000005','pro',    'Permeable gravel roads recharge groundwater. Every litre that soaks in instead of running off reduces our dependency on the reservoir.', NOW()-INTERVAL '23 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000008','pro',    'At ₹60 L vs ₹2.4 Cr, the savings fund our entire solar programme. This is the fiscally responsible choice.', NOW()-INTERVAL '22 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000002','contra', 'Gravel roads are impassable for people with mobility challenges, elderly residents and emergency vehicles during monsoon.', NOW()-INTERVAL '20 days'),

  -- Curriculum STEAM (i06)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000006','a0a0a0a0-0000-0000-0000-000000000004','pro',    'IB accreditation gives our students options. Without recognised qualifications, they face barriers when engaging with the wider world.', NOW()-INTERVAL '9 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000006','a0a0a0a0-0000-0000-0000-000000000007','pro',    'STEAM skills are the language of our century. We owe it to our children to equip them for the world they will inhabit.', NOW()-INTERVAL '8 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000006','a0a0a0a0-0000-0000-0000-000000000003','contra', 'IB standardisation will kill the experimental spirit that makes Future School special. We will become just another international school.', NOW()-INTERVAL '8 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000006','a0a0a0a0-0000-0000-0000-000000000008','contra', 'Overemphasis on measurable STEAM outcomes leaves no space for art, inner development and the cultivation of consciousness.', NOW()-INTERVAL '7 days'),

  -- Curriculum Holistic (i07)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000007','a0a0a0a0-0000-0000-0000-000000000003','pro',    'Sri Aurobindo''s integral education is not a relic — it is ahead of its time. The world is only now discovering what Auroville has practiced for 50 years.', NOW()-INTERVAL '9 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000007','a0a0a0a0-0000-0000-0000-000000000008','pro',    'Children who grow up with meditation, nature immersion and portfolio-based learning become far more adaptable than exam-trained peers.', NOW()-INTERVAL '8 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000007','a0a0a0a0-0000-0000-0000-000000000004','contra', 'Without measurable learning outcomes, how do we know children are actually learning? Good intentions are not enough.', NOW()-INTERVAL '7 days'),

  -- Cultural Festival (i16)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000006','pro',    'A three-week festival creates an unmissable moment — media coverage, global attention, and a cultural landmark in our calendar.', NOW()-INTERVAL '7 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000001','pro',    'The revenue potential from ticketed performances could make this largely self-financing after year 2.', NOW()-INTERVAL '6 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000016','a0a0a0a0-0000-0000-0000-000000000005','contra', 'A large festival disrupts community life significantly. Noise, tourism pressure, and logistical stress fall on residents who did not sign up for this.', NOW()-INTERVAL '5 days'),

  -- Rolling Residency (i17)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000003','pro',    'Deep cultural exchange happens over weeks, not weekend shows. Embedded residencies create real relationships and lasting artistic collaborations.', NOW()-INTERVAL '7 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000008','pro',    'Year-round programme is far easier to manage operationally than a condensed three-week event with 80 artists simultaneously.', NOW()-INTERVAL '6 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000017','a0a0a0a0-0000-0000-0000-000000000006','contra', 'The residency model lacks the visibility and momentum of a festival. 12 artists per year will not put Auroville on the cultural map.', NOW()-INTERVAL '5 days')
;

-- ============================================================
-- 11. OPINIONS / DISCUSSION COMMENTS
-- ============================================================
INSERT INTO opinion (id, initiative_id, issue_id, parent_id, author_id, content, created_at) VALUES
  -- Issue 3 (Curriculum) — topic-level discussion
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000001',
   'This is one of the most important decisions we face as a community. Whatever we choose will shape the next generation of Aurovilians. I urge everyone to participate in this discussion.', NOW()-INTERVAL '10 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000004',
   'Having spoken to parents from both schools, the main concern is: will our children be able to pursue higher education? That practical question deserves a clear answer from both proposals.', NOW()-INTERVAL '9 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000003',NULL,'a0a0a0a0-0000-0000-0000-000000000008',
   'Why is this framed as either/or? The best education systems in the world combine rigorous academics with deep personal development. Can we not design something hybrid?', NOW()-INTERVAL '8 days'),

  -- Issue 7 (Greenbelt) — topic-level
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000005',
   'I have been monitoring the greenbelt for 15 years. The encroachment is real and accelerating. We need to act decisively before the next dry season.', NOW()-INTERVAL '7 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000002',
   'Full exclusion zones have a poor track record globally — communities excluded from land they have stewarded for generations tend to resent and subvert the policy. Engagement works better than prohibition.', NOW()-INTERVAL '6 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000007',NULL,'a0a0a0a0-0000-0000-0000-000000000005',
   'Ravi, the evidence from the Nilgiris Biosphere shows that buffer zones with community stewardship only work when enforcement capacity is very high. We do not have that capacity.', NOW()-INTERVAL '5 days'),

  -- Issue 10 (Digital Platform) — topic-level
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000001',
   'We have been talking about digital governance tools for eight years. The fact that this platform exists and is already being used is remarkable. Let''s build on this momentum.', NOW()-INTERVAL '2 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000006',
   'My concern is digital exclusion. Not everyone in Auroville is comfortable with platforms like this. We must guarantee that non-digital participation remains equally valid.', NOW()-INTERVAL '2 days'),
  (gen_random_uuid(),NULL,'e0e0e0e0-0000-0000-0000-000000000010',NULL,'a0a0a0a0-0000-0000-0000-000000000007',
   'Agreed on inclusivity. We can run parallel processes: digital platform for those who prefer it, and traditional assembly voting for those who don''t. The results feed into the same tally.', NOW()-INTERVAL '1 day'),

  -- Initiative-level comments on i20 (Digital Platform proposal)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000020',NULL,NULL,'a0a0a0a0-0000-0000-0000-000000000003',
   'The liquid democracy feature — delegating your vote — is genuinely novel for Auroville. I''m curious how we prevent power concentration in a small group of trusted delegates.', NOW()-INTERVAL '1 day'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000020',NULL,NULL,'a0a0a0a0-0000-0000-0000-000000000007',
   'Delegation cycles and transitive delegation are already handled in the algorithm. Anyone can revoke at any time and vote directly. The system is designed to prevent lock-in.', NOW()-INTERVAL '1 day'),

  -- Initiative comments on i01 (Solar Farm)
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001',NULL,NULL,'a0a0a0a0-0000-0000-0000-000000000006',
   'Has an environmental impact assessment been done for the south field site? I ask because seasonal migratory birds nest there in October–December.', NOW()-INTERVAL '20 days'),
  (gen_random_uuid(),'f0f0f0f0-0000-0000-0000-000000000001',NULL,NULL,'a0a0a0a0-0000-0000-0000-000000000002',
   'Good point Sofia. The EIA is underway and will be published before the voting deadline. The current plan avoids the central nesting area.', NOW()-INTERVAL '19 days')
;

-- ============================================================
-- 12. DELEGATIONS
-- ============================================================
INSERT INTO delegation (id, from_member_id, to_member_id, unit_id, area_id, issue_id, created_at) VALUES
  -- Ravi delegates globally to Priya
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000001',NULL,NULL,NULL, NOW()-INTERVAL '2 years'),
  -- Thomas delegates globally to Priya
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000001',NULL,NULL,NULL, NOW()-INTERVAL '1 year'),
  -- Lakshmi delegates Environment unit to Ananda
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000005','b0b0b0b0-0000-0000-0000-000000000003',NULL,NULL, NOW()-INTERVAL '1 year'),
  -- Sofia delegates Education unit to Lakshmi
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000006','a0a0a0a0-0000-0000-0000-000000000003','b0b0b0b0-0000-0000-0000-000000000004',NULL,NULL, NOW()-INTERVAL '6 months'),
  -- Arjun delegates issue-specific (Solar Energy) to Thomas
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000007','a0a0a0a0-0000-0000-0000-000000000004',NULL,NULL,'e0e0e0e0-0000-0000-0000-000000000001', NOW()-INTERVAL '3 days'),
  -- Meera delegates Energy area to Priya
  (gen_random_uuid(),'a0a0a0a0-0000-0000-0000-000000000008','a0a0a0a0-0000-0000-0000-000000000001',NULL,'c0c0c0c0-0000-0000-0000-000000000009',NULL, NOW()-INTERVAL '1 month')
;
