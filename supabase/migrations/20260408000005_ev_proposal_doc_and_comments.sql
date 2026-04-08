-- ============================================================
-- Add proposal document + plan-level comments to execution
-- ============================================================

-- 1. Add proposal_text column to execution plans
ALTER TABLE public.ev_execution_plans
  ADD COLUMN IF NOT EXISTS proposal_text TEXT;

-- 2. Plan-level comments
CREATE TABLE IF NOT EXISTS public.ev_execution_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id    UUID NOT NULL REFERENCES public.ev_execution_plans(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES public.member(id) ON DELETE CASCADE,
  text       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exec_comments_plan ON public.ev_execution_comments(plan_id);

ALTER TABLE public.ev_execution_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read execution comments" ON public.ev_execution_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post execution comments" ON public.ev_execution_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ============================================================
-- 3. Seed proposal documents
-- ============================================================

UPDATE public.ev_execution_plans SET proposal_text =
'# Solar Energy Expansion Plan 2026 — Project Proposal

## Background
Auroville currently relies on a mix of grid power and small-scale solar installations across individual units. Energy consumption has grown 12% year-on-year, while grid reliability remains inconsistent. A coordinated community-wide solar infrastructure would reduce dependency, lower collective costs, and align with Auroville''s founding environmental principles.

## Objective
Install a community solar infrastructure covering 80% of Auroville''s daytime energy needs by end of 2027, with battery storage enabling 40% overnight coverage by 2028.

## Scope
- Phase 1: Pilot installation of 50 panels on Solar Kitchen and Visitor Centre rooftops
- Phase 2: Three battery storage hubs distributed across the northern, central, and southern zones
- Phase 3: Full rollout to all eligible community buildings (est. 450 panels total)

## Technical Approach
Panels: Mono-crystalline, 400W, Tier-1 certified suppliers
Mounting: Ballasted flat-roof systems where possible; minimal structural modification
Grid interface: Net metering agreement with TANGEDCO pending; backup UPS systems in place

## Budget
Total estimated cost: ₹1.2 Crore
- Panels & hardware: ₹72 Lakh
- Installation labour: ₹18 Lakh
- Battery storage units: ₹24 Lakh
- Training & contingency: ₹6 Lakh

Funding sources: Community infrastructure fund (40%) + MNRE subsidy (40%) + external grants (20%)

## Timeline
18 months from approval to full Phase 3 completion.
Key milestones: Pilot complete (Month 3) → Subsidy approved (Month 5) → Battery hubs live (Month 10) → Full rollout complete (Month 18)

## Community Impact
Estimated annual saving: ₹14 Lakh in grid electricity costs
CO₂ reduction: ~180 tonnes/year
Local jobs created: 5 permanent technician roles

## Open Questions
- Should battery hubs be zoned or centralised?
- How should surplus energy be distributed or credited?
- What maintenance responsibility model works best for the community?'
WHERE issue_id = 'e0e0e0e0-0000-0000-0000-000000000001';

-- ----

UPDATE public.ev_execution_plans SET proposal_text =
'# Main Road Rehabilitation — Auroville Ring Road: Project Proposal

## Background
The Auroville Ring Road (approx. 8 km circumference) serves as the primary arterial route connecting all residential and working communities. Current surface conditions have deteriorated significantly due to monsoon erosion, increased vehicle load, and deferred maintenance. Road safety incidents have increased 30% over the past two years.

## Objective
Rehabilitate the full Ring Road surface, improve drainage infrastructure, and add dedicated pedestrian and cyclist paths — creating a safer, lower-maintenance road for the next 15 years.

## Scope
- Full resurfacing: 8 km of road using low-maintenance tar macadam
- Drainage: Install or replace culverts and side drainage channels at 14 critical points
- Pedestrian/cycle path: 4 km of dedicated path along the inner ring (highest-use segments)
- Signage & speed calming: Install 30 traffic signs and 8 speed humps at community entry points

## Technical Approach
Surface: 40mm tar macadam overlay on prepared base course
Drainage: Pre-cast concrete culverts, connected to existing storm drain network
Cycle path: Compacted gravel with kerb separation (cost-effective and permeable)

## Budget
Total estimated cost: ₹38 Lakh
- Resurfacing (materials + labour): ₹24 Lakh
- Drainage works: ₹8 Lakh
- Cycle/pedestrian path: ₹4 Lakh
- Signage & traffic calming: ₹2 Lakh

Funding: AV Infrastructure Fund (60%) + Tamil Nadu State Highway maintenance grant (40%)

## Timeline
12 months. Works phased in 4 segments to keep the road functional throughout.

## Community Impact
- Reduced vehicle maintenance costs for all residents
- Safer conditions for cyclists and pedestrians
- Improved ambulance and emergency access

## Open Questions
- Which segments should be prioritised first (highest traffic vs worst condition)?
- Should electric vehicle charging points be integrated along the route?
- How should construction dust and noise be managed near residential areas?'
WHERE issue_id = 'e0e0e0e0-0000-0000-0000-000000000002';

-- ----

UPDATE public.ev_execution_plans SET proposal_text =
'# Future School Curriculum Reform — Project Proposal

## Background
Auroville''s Future School was founded on the principles of integral education — nurturing physical, vital, mental, psychic, and spiritual development equally. Over time, external accreditation pressures have pushed the curriculum toward a more conventional academic model. This proposal seeks to rebalance, integrating Sri Aurobindo''s and The Mother''s educational vision with modern pedagogical research.

## Objective
Develop and adopt a new curriculum framework for ages 6–18 that centres self-directed learning, ecological literacy, arts integration, and community service — while maintaining pathways for students who wish to pursue national board qualifications.

## Scope
- Full curriculum redesign for all age groups
- New teacher training programme (internal + external facilitators)
- Revised assessment approach: portfolio-based, no graded exams below age 14
- Elective national board track for secondary students who choose it

## Proposed Curriculum Pillars
1. Self-Knowledge & Inner Development (mindfulness, reflection, yoga)
2. Ecological & Earth Literacy (permaculture, biology, sustainability)
3. Creative Arts & Making (visual art, music, craft, storytelling)
4. Mathematics & Logical Thinking
5. Language & Communication (English, Tamil, French, Sanskrit electives)
6. Community & World Understanding (history, civics, global awareness)
7. Practical Skills & Livelihood (cooking, building, coding, gardening)

## Budget
₹3.5 Lakh for proposal development phase
Full implementation (teacher training, materials, facility adaptations): ₹18 Lakh over 3 years

## Timeline
Proposal ready for vote: October 2026
Phased implementation: 2027–2030

## Open Questions
- How do we support students who transfer in/out from conventional schools?
- What role should digital technology play at different ages?
- How do teachers transition from a subject-based to a project-based model?'
WHERE issue_id = 'e0e0e0e0-0000-0000-0000-000000000003';

-- ----

UPDATE public.ev_execution_plans SET proposal_text =
'# Mandatory Rainwater Harvesting Policy — Project Proposal

## Background
Auroville sits on the Coromandel Coast where annual rainfall averages 1,100mm — almost entirely concentrated in the October–December northeast monsoon. Despite this, groundwater levels have declined steadily as population and water demand grow. Currently fewer than 35% of buildings have functional rainwater harvesting systems. Without intervention, the community will face critical water shortages within a decade.

## Objective
Mandate rainwater harvesting systems on all buildings within Auroville, establish enforceable technical standards, and create a community support fund for units unable to self-finance installation.

## Policy Structure

### Scope
All residential, working, and public buildings within the Auroville township boundary.

### Technical Minimum Standard
- Minimum tank capacity: 5,000L per 100m² of roof catchment area
- First-flush diverter: mandatory
- Filter type: mesh + slow-sand or equivalent
- Connection to: ground recharge pit or storage tank (owner''s choice)

### Compliance Timeline
- New buildings: mandatory from date of policy adoption
- Existing buildings: 18-month grace period with phased support

### Enforcement
Annual self-declaration + random spot inspections by the Water Service team.
Non-compliance: building flagged in community records; water supply not cut (humanitarian grounds).

## Community Support Fund
₹12 Lakh fund to subsidise installation for low-income and older residential units.
Applications assessed by Water Service + Finance Service jointly.

## Budget (Policy Development)
₹1.8 Lakh for research, legal drafting, and consultations.
Installation support fund: separate community budget line.

## Open Questions
- Should greywater recycling be included in scope or addressed in a later phase?
- How should shared buildings (guest houses, dining halls) be handled?
- What role should the Auroville Water Service play in procurement support?'
WHERE issue_id = 'e0e0e0e0-0000-0000-0000-000000000004';

-- ----

UPDATE public.ev_execution_plans SET proposal_text =
'# Community Medicinal Herb & Wellness Garden — Project Proposal

## Background
Auroville has a long relationship with traditional medicine through Ayurveda, Siddha, and herbal practices. Several Aurovilians maintain small personal herb gardens, and the community''s health centre uses medicinal plants in consultations. However, there is no shared community resource for growing, learning about, or accessing medicinal herbs. This proposal creates one.

## Objective
Establish a 2-acre community medicinal herb and wellness garden in Auroville — open to all residents, maintained collectively, and serving as both a practical resource and a living educational space.

## Garden Zones
1. **Healing Herbs Zone** — 60+ Ayurvedic and Siddha medicinal plants (tulsi, ashwagandha, brahmi, neem, turmeric, etc.)
2. **Kitchen Herbs Zone** — Everyday culinary herbs available for community harvest (curry leaf, lemongrass, mint, etc.)
3. **Rare & Sacred Plants Zone** — Protected cultivation of rare or slow-growing species with restricted harvest
4. **Learning Circle** — Seating, interpretive signage, space for workshops and school visits
5. **Seed Library Corner** — Community seed exchange and propagation station

## Access & Maintenance Policy
- Open 7 days a week, 6am–6pm
- Harvesting: permitted in Kitchen Herbs Zone freely; Healing Herbs Zone by registered request
- Maintenance: coordinated volunteer roster (minimum 2 hours/month per participating household)
- Paid gardener: 1 part-time position for coordination and specialist care

## Budget
Total: ₹4.2 Lakh
- Land preparation & soil work: ₹80,000
- Irrigation system: ₹60,000
- Plants, seeds & nursery stock: ₹1.2 Lakh
- Tools, storage & compost area: ₹40,000
- Signage & learning materials: ₹30,000
- Paid gardener (year 1): ₹90,000
- Contingency: ₹40,000

## Timeline
5 months to proposal ready → 12 months to first full harvest season

## Open Questions
- Who holds stewardship responsibility for the Rare & Sacred Plants Zone?
- Should practitioners (Ayurvedic doctors, herbalists) have reserved plots?
- How do we prevent over-harvesting of high-demand species?
- Should the garden also function as a space for paid wellness workshops?'
WHERE issue_id = 'e0e0e0e0-0000-0000-0000-000000000011';

-- ============================================================
-- 4. Seed a few comments per plan
-- ============================================================

INSERT INTO public.ev_execution_comments (id, plan_id, author_id, text, created_at) VALUES
  ('c1000001-0000-0000-0000-000000000001',
   'f1000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000002',
   'The MNRE subsidy application window opens in June — we should make sure Phase 1 installation is documented before then so we have evidence of commitment.',
   '2026-04-01 09:00:00'),
  ('c1000001-0000-0000-0000-000000000002',
   'f1000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000004',
   'I''d suggest we add a section on what happens to surplus energy produced on sunny days. A credit system per household would make this much more equitable.',
   '2026-04-02 14:30:00'),

  ('c2000001-0000-0000-0000-000000000001',
   'f2000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003',
   'The Ring Road northern segment near Certitude is in by far the worst condition. I''d recommend we start there regardless of traffic volume.',
   '2026-04-01 11:00:00'),
  ('c2000001-0000-0000-0000-000000000002',
   'f2000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001',
   'Can we look at using recycled rubber in the cycle path surface? There''s a supplier in Chennai doing this for municipal projects at comparable cost.',
   '2026-04-03 10:15:00'),

  ('c3000001-0000-0000-0000-000000000001',
   'f3000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000005',
   'The teachers are very supportive of the portfolio-based assessment idea. The main concern raised in our last meeting was how to handle students who later transfer to conventional schools and need formal grades.',
   '2026-04-02 08:45:00'),

  ('c4000001-0000-0000-0000-000000000001',
   'f4000001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000006',
   'The 18-month grace period feels too long given how urgent the water situation is. Could we offer an incentive (subsidy priority) for early compliance to speed things up?',
   '2026-04-01 16:00:00'),

  ('c1100001-0000-0000-0000-000000000001',
   'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000003',
   'I spoke with the Ayurvedic practitioner at Arogya — she is very interested in contributing to the plant selection and would be willing to lead workshops in the Learning Circle once the garden is established.',
   '2026-04-01 10:30:00'),
  ('c1100001-0000-0000-0000-000000000002',
   'f1100001-0000-0000-0000-000000000001',
   'a0a0a0a0-0000-0000-0000-000000000001',
   'SAIIER confirmed informally that they would consider co-funding the signage and educational materials. We should submit a formal request as part of the proposal.',
   '2026-04-04 09:00:00')
ON CONFLICT DO NOTHING;
