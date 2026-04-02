-- ============================================================
-- SEED PART 2: Elaborations + Nested Replies
-- ============================================================

-- ============================================================
-- 1. ELABORATION — Issue 5: Organic Farm Expansion
-- ============================================================
INSERT INTO elaboration (id, issue_id, created_by, created_at) VALUES
  ('e1ab0000-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000005',
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '24 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO elaboration_section (id, elaboration_id, title, content, sort_order, updated_by, updated_at, created_at) VALUES

  ('e1500000-0000-0000-0000-000000000001',
   'e1ab0000-0000-0000-0000-000000000001',
   'Executive Summary',
   E'The Organic Farm Expansion Programme was accepted by the community on 8 March 2026. This elaboration document defines the implementation plan, responsibilities, budget and milestones for converting 50 acres of degraded land south of the greenbelt into certified organic farmland.\n\nThe programme is managed by the Agriculture Working Group under oversight of the Environment & Land unit. Implementation began on 15 March 2026 and the first certified harvest is expected in December 2026.',
   1,
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '20 days',
   NOW() - INTERVAL '24 days'),

  ('e1500000-0000-0000-0000-000000000002',
   'e1ab0000-0000-0000-0000-000000000001',
   'Land Identification & Soil Assessment',
   E'## Selected Parcels\nFollowing survey by the Land Board, three contiguous parcels totalling 51.4 acres have been identified south of the greenbelt boundary near Kuilapalayam:\n\n- **Parcel A** — 22 acres, formerly quarried, currently degraded scrub\n- **Parcel B** — 18 acres, abandoned cashew plantation\n- **Parcel C** — 11.4 acres, marginal grassland with existing irrigation access\n\n## Soil Assessment Results\n| Parcel | pH | Organic Matter | Recommendation |\n|--------|-----|----------------|----------------|\n| A      | 6.1 | 0.8%           | Deep compost application + green manure cover crop for 6 months |\n| B      | 6.4 | 1.4%           | Light amendment, ready for planting in 3 months |\n| C      | 5.9 | 1.1%           | Lime application + biodynamic preparation |\n\n## Certification Timeline\nOrganic certification via NPOP (National Programme for Organic Production) requires 24 months conversion period. Application submitted 20 March 2026. Full certification expected March 2028.',
   2,
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '18 days',
   NOW() - INTERVAL '23 days'),

  ('e1500000-0000-0000-0000-000000000003',
   'e1ab0000-0000-0000-0000-000000000001',
   'Crop Plan & Food Sovereignty Goals',
   E'## Year 1 Crop Plan (Parcels B & C — 29 acres)\n\n### Vegetables (12 acres)\n- Tomato, Brinjal, Okra, Bitter Gourd, Drumstick\n- Leafy greens: Amaranth, Spinach, Methi\n- Root vegetables: Carrot, Radish, Beetroot\n\n### Legumes (8 acres)\n- Cowpea, Black-eyed pea, Groundnut\n- Nitrogen-fixing green manure intercropping\n\n### Orchard Establishment (9 acres)\n- Mango, Jackfruit, Moringa, Banana, Papaya\n- Long-term food forest design with native species\n\n## Food Sovereignty Targets\n| Year | Community Vegetable Supply | Residents Fed Locally |\n|------|--------------------------|----------------------|\n| 2026 | 25%                      | ~1,200                |\n| 2027 | 45%                      | ~2,200                |\n| 2028 | 60%                      | ~2,900                |\n\n## Seed Sovereignty\nAll seeds sourced from Navdanya and community seed banks. No hybrid or GMO varieties.',
   3,
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '15 days',
   NOW() - INTERVAL '22 days'),

  ('e1500000-0000-0000-0000-000000000004',
   'e1ab0000-0000-0000-0000-000000000001',
   'Employment & Training',
   E'## Full-Time Positions Created\n15 full-time farming positions will be created over the first 18 months:\n\n- 3 × Farm Coordinators (experienced farmers)\n- 8 × Field Workers (trained via the programme)\n- 2 × Irrigation & Maintenance Technicians\n- 1 × Certification & Documentation Manager\n- 1 × Market & Distribution Coordinator\n\n## Training Programme\nA 3-month training programme for community members with no farming background runs in parallel. First cohort of 12 trainees started 1 April 2026. Curriculum includes:\n\n- Soil science and biodynamic principles\n- Organic pest management\n- Composting and vermiculture\n- Water management and drip irrigation\n- Record-keeping for organic certification\n\n## Priority\nAurovilian residents are given first priority for positions, followed by long-term volunteers, then local Tamil Nadu residents from neighbouring villages.',
   4,
   'a0a0a0a0-0000-0000-0000-000000000005',
   NOW() - INTERVAL '12 days',
   NOW() - INTERVAL '21 days'),

  ('e1500000-0000-0000-0000-000000000005',
   'e1ab0000-0000-0000-0000-000000000001',
   'Budget & Funding',
   E'## Total Programme Budget: ₹68,40,000\n\n| Item | Amount (₹) |\n|------|-----------|\n| Land preparation & soil amendment | 8,20,000 |\n| Irrigation infrastructure (drip + overhead) | 14,50,000 |\n| Seeds, saplings & planting material | 3,80,000 |\n| Tools, equipment & storage | 6,40,000 |\n| Staff salaries (Year 1) | 24,00,000 |\n| Training programme | 2,80,000 |\n| Organic certification fees | 1,20,000 |\n| Contingency (10%) | 6,00,000 |\n| Administration | 1,50,000 |\n\n## Funding Sources\n- Auroville Foundation Grant: ₹30,00,000\n- Auroville Economy contribution: ₹20,00,000\n- External donors (confirmed): ₹12,00,000\n- Produce revenue (projected Year 1): ₹6,40,000\n\n## Revenue Model\nAll produce distributed first to community members at subsidised rates via the existing Foodlink system. Surplus sold at Auroville outlets and local markets. Target: programme self-financing by Year 3.',
   5,
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '10 days',
   NOW() - INTERVAL '20 days')

ON CONFLICT (id) DO NOTHING;

-- Editors for Issue 5 elaboration
INSERT INTO elaboration_editor (elaboration_id, member_id, created_at) VALUES
  ('e1ab0000-0000-0000-0000-000000000001', 'a0a0a0a0-0000-0000-0000-000000000005', NOW() - INTERVAL '24 days'),
  ('e1ab0000-0000-0000-0000-000000000001', 'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '24 days')
ON CONFLICT (elaboration_id, member_id) DO NOTHING;

-- Section comments on Issue 5
INSERT INTO elaboration_comment (id, section_id, author_id, content, created_at) VALUES
  (gen_random_uuid(), 'e1500000-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000002',
   'The pH reading for Parcel A concerns me — 6.1 is on the acidic side for most vegetables. Has the soil team specified the lime quantity for amendment?',
   NOW() - INTERVAL '17 days'),
  (gen_random_uuid(), 'e1500000-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000005',
   'Yes — 2 tonnes of agricultural lime per acre is budgeted for Parcel A. Application scheduled for the pre-monsoon window in May.',
   NOW() - INTERVAL '16 days'),
  (gen_random_uuid(), 'e1500000-0000-0000-0000-000000000003',
   'a0a0a0a0-0000-0000-0000-000000000003',
   'Can we add turmeric and ginger to the root vegetable section? Both are high-value, easy to grow here and much needed by the community kitchen.',
   NOW() - INTERVAL '14 days'),
  (gen_random_uuid(), 'e1500000-0000-0000-0000-000000000004',
   'a0a0a0a0-0000-0000-0000-000000000007',
   'The training programme looks excellent. Could we open 2–3 spots to youth from Kuilapalayam village as part of our community outreach commitment?',
   NOW() - INTERVAL '11 days')
;

-- ============================================================
-- 2. ELABORATION — Issue 9: Zero-Waste Community Initiative
-- ============================================================
INSERT INTO elaboration (id, issue_id, created_by, created_at) VALUES
  ('e2ab0000-0000-0000-0000-000000000001',
   'e0e0e0e0-0000-0000-0000-000000000009',
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '38 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO elaboration_section (id, elaboration_id, title, content, sort_order, updated_by, updated_at, created_at) VALUES

  ('e2500000-0000-0000-0000-000000000001',
   'e2ab0000-0000-0000-0000-000000000001',
   'Programme Overview',
   E'The Zero-Waste Community Initiative was accepted on 23 January 2026. The core of the programme is an Integrated Waste Management System centred on a community biogas plant, source segregation at household level and a dry-waste upcycling workshop.\n\n## Current Status (April 2026 — 6 months post-launch)\n\n| Metric | Target | Achieved |\n|--------|--------|----------|\n| Household segregation compliance | 90% | 83% |\n| Landfill diversion rate | 70% | 78% ✓ |\n| Biogas production | 250 m³/month | 307 m³/month ✓ |\n| Households connected to biogas | 200 | 187 |\n| Upcycling workshop batches | 2/month | 3/month ✓ |\n\nThe programme has exceeded its 6-month landfill diversion target and biogas production goals. Household compliance is still improving.',
   1,
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '5 days',
   NOW() - INTERVAL '38 days'),

  ('e2500000-0000-0000-0000-000000000002',
   'e2ab0000-0000-0000-0000-000000000001',
   'Biogas Plant Operations',
   E'## Plant Specifications\n- Location: Eastern Compost Yard, near Aurogreen\n- Daily organic input capacity: 2.5 tonnes\n- Biogas output: 300–320 m³/month\n- Digester type: Fixed-dome, 45 m³\n- By-products: Bioslurry (liquid fertiliser distributed to farms)\n\n## Input Streams\n1. **Kitchen waste** from 187 connected households (80 kg/day avg)\n2. **Canteen & café waste** from 12 community kitchens (40 kg/day)\n3. **Agricultural residues** from Aurogreen farm (30 kg/day)\n\n## Biogas Distribution\nBiogas is piped to 4 community canteens replacing LPG. Estimated LPG savings: 8 cylinders/month = ₹12,000/month.\n\n## Bioslurry Programme\n420 litres of liquid biofertiliser produced monthly. Distributed free to community farms and gardens. Early results show 15–20% yield improvement in vegetable plots.',
   2,
   'a0a0a0a0-0000-0000-0000-000000000002',
   NOW() - INTERVAL '8 days',
   NOW() - INTERVAL '37 days'),

  ('e2500000-0000-0000-0000-000000000003',
   'e2ab0000-0000-0000-0000-000000000001',
   'Dry Waste Upcycling Workshop',
   E'## Workshop Overview\nThe Upcycling Workshop operates 6 days/week at the old carpentry shed near the Solar Kitchen. 4 full-time staff + rotating volunteers.\n\n## Materials Processed Monthly\n| Material | Quantity | End Product |\n|----------|----------|-------------|\n| Plastic (HDPE/PET) | 180 kg | Shredded for construction bricks |\n| Paper & cardboard | 320 kg | Handmade paper, sold at visitor centre |\n| Glass | 95 kg | Crushed aggregate for construction |\n| Metal | 60 kg | Sent to Puducherry recycler |\n| Textiles | 45 kg | Repaired or cut into rags |\n\n## Revenue\nHandmade paper products and upcycled crafts generate ₹18,000/month — covering 40% of workshop operating costs.\n\n## Compliance Challenges\nPlastic segregation remains imperfect. Of 10 households visited randomly in March, 3 were mixing non-recyclables with plastic. Corrective measure: neighbourhood waste champions programme launched in April 2026.',
   3,
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '6 days',
   NOW() - INTERVAL '36 days'),

  ('e2500000-0000-0000-0000-000000000004',
   'e2ab0000-0000-0000-0000-000000000001',
   'Phase 2 Expansion Plan',
   E'## Proposed Phase 2 (July–December 2026)\n\nBased on 6-month results, the working group proposes the following expansions:\n\n### 1. Biogas Plant Capacity Increase\n- Add second 30 m³ digester to handle increased input\n- Target: 500 m³/month output by December 2026\n- Cost: ₹8,50,000 (partially funded by biogas savings)\n\n### 2. Neighbourhood Composting Network\nThe rejected alternative proposal had a good idea — decentralised compost stations. We recommend adding 8 neighbourhood stations for garden waste that cannot go into the biogas plant.\n\n### 3. Repair Café\nMonthly repair café for electronics, furniture and clothing. Reduces purchase of new goods. Pilot event in May 2026 repaired 34 items.\n\n### 4. School Education Programme\nZero-waste curriculum module for Future School and other Auroville schools. Draft ready; awaiting Education unit approval.\n\n## Phase 2 Vote\nA new issue will be submitted to the community assembly for Phase 2 funding approval.',
   4,
   'a0a0a0a0-0000-0000-0000-000000000001',
   NOW() - INTERVAL '3 days',
   NOW() - INTERVAL '35 days')

ON CONFLICT (id) DO NOTHING;

-- Editors for Issue 9 elaboration
INSERT INTO elaboration_editor (elaboration_id, member_id, created_at) VALUES
  ('e2ab0000-0000-0000-0000-000000000001', 'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '38 days'),
  ('e2ab0000-0000-0000-0000-000000000001', 'a0a0a0a0-0000-0000-0000-000000000008', NOW() - INTERVAL '38 days')
ON CONFLICT (elaboration_id, member_id) DO NOTHING;

-- Section comments on Issue 9
INSERT INTO elaboration_comment (id, section_id, author_id, content, created_at) VALUES
  (gen_random_uuid(), 'e2500000-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000003',
   'Great to see the bioslurry programme working so well. Can we prioritise distribution to the new organic farm parcels? The soil amendment there could really benefit.',
   NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), 'e2500000-0000-0000-0000-000000000003',
   'a0a0a0a0-0000-0000-0000-000000000006',
   'The handmade paper products are beautiful — they sell out at the visitor centre every week. Can we expand the paper workshop to 2 full-time staff?',
   NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), 'e2500000-0000-0000-0000-000000000004',
   'a0a0a0a0-0000-0000-0000-000000000007',
   'I love that the neighbourhood composting idea from the losing proposal is being incorporated into Phase 2. This is exactly how liquid democracy should work — good ideas survive even if the original proposal doesn''t win.',
   NOW() - INTERVAL '2 days'),
  (gen_random_uuid(), 'e2500000-0000-0000-0000-000000000004',
   'a0a0a0a0-0000-0000-0000-000000000001',
   'Agreed Arjun. We deliberately reached out to Ravi after the vote to include his composting station design in Phase 2. The Repair Café idea also came from community members who voted for the alternative.',
   NOW() - INTERVAL '1 day')
;

-- ============================================================
-- 3. NESTED REPLIES (opinions with parent_id)
-- ============================================================
-- Strategy: insert new top-level comments with fixed UUIDs,
-- then add replies referencing those UUIDs.

-- ---- Issue 3: Curriculum Reform (topic-level thread) ----
INSERT INTO opinion (id, initiative_id, issue_id, parent_id, author_id, content, created_at) VALUES

  -- New top-level: Ananda asks about assessment
  ('0aaaaaaa-0000-0000-0000-000000000001',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000003', NULL,
   'a0a0a0a0-0000-0000-0000-000000000005',
   'Before we vote on curriculum I would like to hear from students and recent graduates. What do they actually want? We are deciding for them without their voice.',
   NOW() - INTERVAL '7 days'),

  -- Reply from Thomas
  ('0aaaaaaa-0000-0000-0000-000000000002',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000003', '0aaaaaaa-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000004',
   'We held a student forum last week — 24 students aged 14–18 participated. The split was roughly 60/40 in favour of keeping the holistic approach but with some STEAM enrichment. Notes will be shared on the community intranet.',
   NOW() - INTERVAL '6 days'),

  -- Reply from Priya
  ('0aaaaaaa-0000-0000-0000-000000000003',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000003', '0aaaaaaa-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001',
   'This is exactly the right question Ananda. I am proposing we extend the discussion phase by one week specifically to gather more youth input before moving to voting.',
   NOW() - INTERVAL '6 days'),

  -- Reply from Meera to Thomas
  ('0aaaaaaa-0000-0000-0000-000000000004',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000003', '0aaaaaaa-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000008',
   'Thomas, can you also share what students said about stress and wellbeing? In my experience working with children here, exam pressure is one of the biggest concerns parents bring to me.',
   NOW() - INTERVAL '5 days'),

  -- ---- Issue 7: Greenbelt (topic-level thread with replies) ----
  -- New top-level: Arjun
  ('0bbbbbbb-0000-0000-0000-000000000001',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000007', NULL,
   'a0a0a0a0-0000-0000-0000-000000000007',
   'Has anyone mapped which areas of the greenbelt are most at risk right now? I think a visual map would help this discussion enormously — hard to debate zones without knowing what we are protecting.',
   NOW() - INTERVAL '5 days'),

  -- Reply from Ananda
  ('0bbbbbbb-0000-0000-0000-000000000002',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000007', '0bbbbbbb-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005',
   'I have a GIS map from our 2025 survey. There are three active encroachment hotspots on the northern and eastern edges. Will upload to the community drive and share the link here.',
   NOW() - INTERVAL '4 days'),

  -- Reply from Ravi
  ('0bbbbbbb-0000-0000-0000-000000000003',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000007', '0bbbbbbb-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002',
   'Good idea. The map will also help evaluate both proposals — the full protection zone and the sustainable use zone have very different implications depending on which areas we are actually talking about.',
   NOW() - INTERVAL '4 days'),

  -- Reply from Lakshmi to Ananda
  ('0bbbbbbb-0000-0000-0000-000000000004',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000007', '0bbbbbbb-0000-0000-0000-000000000002',
   'a0a0a0a0-0000-0000-0000-000000000003',
   'Thank you Ananda. Once the map is available can we schedule a community walk-through of the hotspot areas? Seeing the land in person changes the conversation.',
   NOW() - INTERVAL '3 days'),

  -- ---- Issue 10: Digital Platform (topic-level thread) ----
  ('0ccccccc-0000-0000-0000-000000000001',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000010', NULL,
   'a0a0a0a0-0000-0000-0000-000000000004',
   'I want to raise data sovereignty. If we adopt this platform, where is our data stored? Who controls the server? What happens if the foundation that maintains the software dissolves?',
   NOW() - INTERVAL '1 day'),

  -- Reply from Arjun
  ('0ccccccc-0000-0000-0000-000000000002',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000010', '0ccccccc-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000007',
   'The proposal specifically calls for self-hosting on Auroville''s own servers. The database and all data stays inside Auroville''s infrastructure. The code is open source — even if the original developers disappear, anyone can maintain it.',
   NOW() - INTERVAL '22 hours'),

  -- Reply from Sofia
  ('0ccccccc-0000-0000-0000-000000000003',
   NULL, 'e0e0e0e0-0000-0000-0000-000000000010', '0ccccccc-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000006',
   'This is a very valid concern Thomas. I would also want a clear data deletion policy — the right to be forgotten — written into the platform governance charter before adoption.',
   NOW() - INTERVAL '20 hours'),

  -- ---- Solar Farm proposal (initiative-level thread with reply) ----
  ('0ddddddd-0000-0000-0000-000000000001',
   'f0f0f0f0-0000-0000-0000-000000000001', NULL, NULL,
   'a0a0a0a0-0000-0000-0000-000000000003',
   'What is the expected lifespan of the panels and what is the decommissioning plan? Solar panels contain heavy metals — we need a recycling commitment before we approve large-scale installation.',
   NOW() - INTERVAL '15 days'),

  -- Reply from Ravi (the author)
  ('0ddddddd-0000-0000-0000-000000000002',
   'f0f0f0f0-0000-0000-0000-000000000001', NULL, '0ddddddd-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002',
   'Panel lifespan is 25–30 years with 80% efficiency guarantee. We have a written commitment from the supplier to take back all panels for recycling at end of life. This will be included in the procurement contract.',
   NOW() - INTERVAL '14 days'),

  -- Reply from Thomas
  ('0ddddddd-0000-0000-0000-000000000003',
   'f0f0f0f0-0000-0000-0000-000000000001', NULL, '0ddddddd-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000004',
   'The IEC 62635 standard for PV recycling should be a contractual requirement, not just a commitment. Can we add this to the procurement specifications?',
   NOW() - INTERVAL '13 days')

ON CONFLICT (id) DO NOTHING;
