-- ============================================================
-- ERSTE VERSION — Seed Data für ev Schema
-- Verwendet bestehende member + issue IDs aus public Schema
-- ============================================================

-- Members:
-- a0a0a0a0-...-001  Priya Aurosmith (admin)
-- a0a0a0a0-...-002  Ravi Sundaram
-- a0a0a0a0-...-003  Lakshmi Devi
-- a0a0a0a0-...-004  Thomas Weber
-- a0a0a0a0-...-006  Sofia Bernhardt

-- Issues (Topics):
-- e0e0e0e0-...-001  Solar Energy
-- e0e0e0e0-...-002  Water Management
-- e0e0e0e0-...-003  Education Curriculum
-- e0e0e0e0-...-011  (das Topic das der User getestet hat)

-- ============================================================
-- 1. TOPIC META (Beschreibung + Abgrenzung)
-- ============================================================

INSERT INTO ev.topic_meta (issue_id, about, scope) VALUES
  ('e0e0e0e0-0000-0000-0000-000000000001',
   'Wie können wir Auroville vollständig mit erneuerbarer Sonnenenergie versorgen?',
   'Dieses Topic umfasst Solaranlagen, Energiespeicherung, Netzinfrastruktur und Finanzierung. Nicht enthalten: Windenergie, fossile Brennstoffe.'),
  ('e0e0e0e0-0000-0000-0000-000000000002',
   'Nachhaltiges Wassermanagement für die wachsende Gemeinschaft Aurovilles.',
   'Regenwassersammlung, Grundwasser, Aufbereitung und Verteilung. Nicht enthalten: Abwasserentsorgung (eigenes Topic).'),
  ('e0e0e0e0-0000-0000-0000-000000000003',
   'Gestaltung eines ganzheitlichen Lehrplans für die Schulen Aurovilles.',
   'Unterrichtsfächer, pädagogische Methoden, Sprachen und Lehrausbildung. Nicht enthalten: Hochschulbildung.'),
  ('e0e0e0e0-0000-0000-0000-000000000011',
   'Verbesserung der Mobilität innerhalb Aurovilles durch nachhaltige Transportmittel.',
   'E-Bikes, Busse, Fußwege, Fahrradinfrastruktur. Nicht enthalten: Fernverkehr außerhalb Aurovilles.')
ON CONFLICT (issue_id) DO NOTHING;

-- ============================================================
-- 2. STATEMENTS (max 100 Zeichen)
-- ============================================================

-- Topic 1: Solar Energy
INSERT INTO ev.statements (id, issue_id, text, author_id, source_links) VALUES
  ('b1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Wir brauchen sofort 500 neue Solarpanels auf allen Gemeinschaftsdächern.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY['https://irena.org/solar']),
  ('b1000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Batteriespeicher sind wichtiger als mehr Panels — Energie nachts nutzen.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]),
  ('b1000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Community Solar Sharing: jeder Haushalt kauft Anteile am Gemeinschaftskraftwerk.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY['https://en.wikipedia.org/wiki/Community_solar']),
  ('b1000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Ohne Subventionen ist Solarenergie für viele Familien noch zu teuer.',
   'a0a0a0a0-0000-0000-0000-000000000004', ARRAY[]::TEXT[]);

-- Topic 2: Water Management
INSERT INTO ev.statements (id, issue_id, text, author_id, source_links) VALUES
  ('b2000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Jedes Gebäude muss Regenwasser sammeln — das ist nicht verhandelbar.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY[]::TEXT[]),
  ('b2000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Der Grundwasserspiegel sinkt jedes Jahr — wir brauchen sofortige Maßnahmen.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY['https://cgwb.gov.in']),
  ('b2000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000002',
   'Wassermesstechnik für jeden Haushalt — Verbrauch sichtbar machen.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]);

-- Topic 3: Education
INSERT INTO ev.statements (id, issue_id, text, author_id, source_links) VALUES
  ('b3000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Kinder sollten selbst entscheiden, was sie lernen wollen — ab Alter 8.',
   'a0a0a0a0-0000-0000-0000-000000000006', ARRAY[]::TEXT[]),
  ('b3000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Tamil und Englisch als Pflichtsprachen, Sanskrit als Wahlfach.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY[]::TEXT[]),
  ('b3000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Outdoor-Lernen mindestens 3 Stunden täglich — Natur als Klassenzimmer.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY['https://www.naturebased.org']),
  ('b3000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Standardisierte Tests zerstören Kreativität — abschaffen!',
   'a0a0a0a0-0000-0000-0000-000000000004', ARRAY[]::TEXT[]);

-- Topic 11: Transport
INSERT INTO ev.statements (id, issue_id, text, author_id, source_links) VALUES
  ('b4000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000011',
   'E-Bike-Sharing an 10 zentralen Punkten — sofort umsetzbar.',
   'a0a0a0a0-0000-0000-0000-000000000001', ARRAY[]::TEXT[]),
  ('b4000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Benzin-Autos innerhalb Aurovilles komplett verbieten bis 2027.',
   'a0a0a0a0-0000-0000-0000-000000000002', ARRAY[]::TEXT[]),
  ('b4000001-0000-0000-0000-000000000003', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Elektrobus-Linie durch alle Hauptzonen, stündlich, kostenlos.',
   'a0a0a0a0-0000-0000-0000-000000000003', ARRAY['https://auroville.org/transport']),
  ('b4000001-0000-0000-0000-000000000004', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Breitere Fußwege vor neuen Straßen — Fußgänger haben Vorrang.',
   'a0a0a0a0-0000-0000-0000-000000000004', ARRAY[]::TEXT[]),
  ('b4000001-0000-0000-0000-000000000005', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Ein Auto-freier Tag pro Woche als erster Schritt — experiment.',
   'a0a0a0a0-0000-0000-0000-000000000006', ARRAY[]::TEXT[]);

-- ============================================================
-- 3. STATEMENT RATINGS (0–10, pro User)
-- ============================================================

-- Topic 1: Solar
INSERT INTO ev.statement_ratings (statement_id, user_id, rating) VALUES
  ('b1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001', 9),
  ('b1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002', 7),
  ('b1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003', 8),
  ('b1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004', 6),
  ('b1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000001', 10),
  ('b1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000002', 9),
  ('b1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006', 8),
  ('b1000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000001', 7),
  ('b1000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000003', 5),
  ('b1000001-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000002', 4),
  ('b1000001-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000004', 6);

-- Topic 11: Transport
INSERT INTO ev.statement_ratings (statement_id, user_id, rating) VALUES
  ('b4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001', 8),
  ('b4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002', 9),
  ('b4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003', 7),
  ('b4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000001', 5),
  ('b4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004', 3),
  ('b4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006', 7),
  ('b4000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000002', 10),
  ('b4000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000003', 9),
  ('b4000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000006', 8),
  ('b4000001-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000001', 6),
  ('b4000001-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000002', 4),
  ('b4000001-0000-0000-0000-000000000005','a0a0a0a0-0000-0000-0000-000000000003', 5);

-- Topic 3: Education
INSERT INTO ev.statement_ratings (statement_id, user_id, rating) VALUES
  ('b3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001', 6),
  ('b3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002', 4),
  ('b3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006', 9),
  ('b3000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000003', 8),
  ('b3000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004', 7),
  ('b3000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000001', 10),
  ('b3000001-0000-0000-0000-000000000003','a0a0a0a0-0000-0000-0000-000000000002', 9),
  ('b3000001-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000006', 8),
  ('b3000001-0000-0000-0000-000000000004','a0a0a0a0-0000-0000-0000-000000000001', 7);

-- ============================================================
-- 4. DISCUSSION NODES (Kialo-Stil, rekursiver Baum)
-- ============================================================

-- Statement: "Wir brauchen sofort 500 neue Solarpanels..."
-- Ebene 1: Pro/Contra direkt unter Statement
INSERT INTO ev.discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('c1000001-0000-0000-0000-000000000001', 'b1000001-0000-0000-0000-000000000001', NULL,
   'pro', 'Die Gemeinschaftsdächer sind bereits vorhanden — minimaler Installationsaufwand.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('c1000001-0000-0000-0000-000000000002', 'b1000001-0000-0000-0000-000000000001', NULL,
   'pro', '500 Panels erzeugen ca. 200 MWh/Jahr — genug für 40 Haushalte.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('c1000001-0000-0000-0000-000000000003', 'b1000001-0000-0000-0000-000000000001', NULL,
   'contra', 'Die Kosten von ~€500.000 übersteigen unser aktuelles Budget deutlich.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('c1000001-0000-0000-0000-000000000004', 'b1000001-0000-0000-0000-000000000001', NULL,
   'contra', 'Ohne Speicher nutzen wir nachts gar nichts von den Panels.',
   'a0a0a0a0-0000-0000-0000-000000000006'),
  ('c1000001-0000-0000-0000-000000000005', 'b1000001-0000-0000-0000-000000000001', NULL,
   'question', 'Wer ist verantwortlich für Wartung und Versicherung der Panels?',
   'a0a0a0a0-0000-0000-0000-000000000001');

-- Ebene 2: Antworten auf die Contra-Argumente
INSERT INTO ev.discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  -- Antwort auf "Kosten übersteigen Budget"
  ('c1000001-0000-0000-0000-000000000006', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000003',
   'pro', 'Es gibt EU-Förderprogramme die bis zu 70% der Kosten abdecken.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('c1000001-0000-0000-0000-000000000007', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000003',
   'contra', 'Förderprogramme haben lange Bearbeitungszeiten — 2–3 Jahre Wartezeit.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  -- Antwort auf "Ohne Speicher nutzlos"
  ('c1000001-0000-0000-0000-000000000008', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000004',
   'pro', 'Tagsüber verbrauchen Werkstätten und Schulen den Großteil der Energie.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('c1000001-0000-0000-0000-000000000009', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000004',
   'statement', 'Wir sollten Panels + Speicher als Paket planen, nicht separat.',
   'a0a0a0a0-0000-0000-0000-000000000003');

-- Ebene 3: Antwort auf Ebene 2
INSERT INTO ev.discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('c1000001-0000-0000-0000-000000000010', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000006',
   'question', 'Welche spezifischen Programme? Haben wir jemanden der Anträge stellen kann?',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('c1000001-0000-0000-0000-000000000011', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000006',
   'pro', 'Priya hat Erfahrung mit EU-Anträgen — sie könnte das übernehmen.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('c1000001-0000-0000-0000-000000000012', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000009',
   'pro', 'Richtig — ein integriertes Angebot ist oft günstiger als zwei Einzelaufträge.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('c1000001-0000-0000-0000-000000000013', 'b1000001-0000-0000-0000-000000000001',
   'c1000001-0000-0000-0000-000000000009',
   'contra', 'Aber das verdoppelt auch die Komplexität des Projekts.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Statement Transport: "Elektrobus-Linie durch alle Hauptzonen"
INSERT INTO ev.discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('c4000001-0000-0000-0000-000000000001', 'b4000001-0000-0000-0000-000000000003', NULL,
   'pro', 'Kostenlose öffentliche Busse erhöhen die Nutzungsrate dramatisch.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('c4000001-0000-0000-0000-000000000002', 'b4000001-0000-0000-0000-000000000003', NULL,
   'pro', 'Stündlich ist realistisch — andere kleine Gemeinschaften machen das.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('c4000001-0000-0000-0000-000000000003', 'b4000001-0000-0000-0000-000000000003', NULL,
   'contra', 'Betriebskosten für kostenlosen Bus sind langfristig nicht finanzierbar.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('c4000001-0000-0000-0000-000000000004', 'b4000001-0000-0000-0000-000000000003', NULL,
   'question', 'Wie viele Busse brauchen wir für stündlichen Betrieb auf allen Routen?',
   'a0a0a0a0-0000-0000-0000-000000000006');

INSERT INTO ev.discussion_nodes (id, statement_id, parent_id, type, text, author_id) VALUES
  ('c4000001-0000-0000-0000-000000000005', 'b4000001-0000-0000-0000-000000000003',
   'c4000001-0000-0000-0000-000000000003',
   'pro', 'Solarpanels auf den Bussen selbst können Betriebskosten senken.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('c4000001-0000-0000-0000-000000000006', 'b4000001-0000-0000-0000-000000000003',
   'c4000001-0000-0000-0000-000000000003',
   'contra', 'Fahrerlöhne sind die größte Kostenstelle, nicht Energie.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('c4000001-0000-0000-0000-000000000007', 'b4000001-0000-0000-0000-000000000003',
   'c4000001-0000-0000-0000-000000000004',
   'statement', 'Schätzung: 3 Busse für 2 Routen mit 30-Minuten-Takt wären realistisch.',
   'a0a0a0a0-0000-0000-0000-000000000002');

-- ============================================================
-- 5. TOPIC PROPOSALS
-- ============================================================

-- Topic 1: Solar Energy — 2 Proposals
INSERT INTO ev.topic_proposals (id, issue_id, text, author_id, created_at) VALUES
  ('d1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Wir installieren bis Ende 2026 insgesamt 300 Solarpanels auf den Dächern der Gemeinschaftsgebäude (Matrimandir Visitor Centre, SAWCHU, Bharat Nivas). Die Kosten werden zu 50% aus dem Gemeinschaftsfonds und zu 50% durch Crowdfunding von Auroville-Unterstützern finanziert. Ein dreiköpfiges Komitee übernimmt die Projektleitung.',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '20 days'),
  ('d1000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Wir starten mit einem Pilotprojekt: 50 Panels auf dem Dach der Auroville Bakery, kombiniert mit einem 100kWh Batteriespeicher. Wenn das Pilotprojekt nach 6 Monaten erfolgreich ist, skalieren wir auf alle Gemeinschaftsdächer. Budget: €80.000 aus bestehendem Energiefonds.',
   'a0a0a0a0-0000-0000-0000-000000000002', NOW() - INTERVAL '15 days');

-- Topic 11: Transport — 2 Proposals
INSERT INTO ev.topic_proposals (id, issue_id, text, author_id, created_at) VALUES
  ('d4000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Phase 1: 20 E-Bikes an 5 zentralen Stationen (Town Hall, Matrimandir, Solar Kitchen, Aspiration, Kottakarai). Nutzung kostenlos für alle registrierten Aurovilians, €5/Tag für Besucher. Finanzierung durch bestehenden Transportfonds. Start: April 2026.',
   'a0a0a0a0-0000-0000-0000-000000000001', NOW() - INTERVAL '10 days'),
  ('d4000001-0000-0000-0000-000000000002', 'e0e0e0e0-0000-0000-0000-000000000011',
   'Kompletter Umbau: Zunächst wird die Hauptachse Crown Road autofrei (außer Lieferverkehr 6–8 Uhr). Parallel werden 3 Elektrobusse angeschafft (Förderantrag läuft). Umsetzungszeitraum 18 Monate. Begleitende Bürgerversammlung alle 3 Monate.',
   'a0a0a0a0-0000-0000-0000-000000000003', NOW() - INTERVAL '5 days');

-- Topic 3: Education — 1 Proposal
INSERT INTO ev.topic_proposals (id, issue_id, text, author_id, created_at) VALUES
  ('d3000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000003',
   'Ab Schuljahr 2026/27 wird in allen Auroville-Schulen ein neuer Lehrplan eingeführt. Kernelemente: 40% Projektlernen, 30% Outdoor-Aktivitäten, 20% Sprachen (Tamil + Englisch), 10% freie Wahl. Standardisierte Tests werden durch Portfolio-Bewertungen ersetzt. Eine Übergangsjahr mit Lehrerfortbildungen ist vorgesehen.',
   'a0a0a0a0-0000-0000-0000-000000000006', NOW() - INTERVAL '8 days');

-- ============================================================
-- 6. PROPOSAL VOTES
-- ============================================================

-- Solar Proposal 1
INSERT INTO ev.proposal_votes (proposal_id, user_id, vote) VALUES
  ('d1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001','approve'),
  ('d1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002','abstain'),
  ('d1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003','approve'),
  ('d1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004','disapprove'),
  ('d1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006','approve');

-- Solar Proposal 2
INSERT INTO ev.proposal_votes (proposal_id, user_id, vote) VALUES
  ('d1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000001','approve'),
  ('d1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000002','approve'),
  ('d1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000003','approve'),
  ('d1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004','abstain'),
  ('d1000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006','strong_disapproval');

-- Transport Proposal 1
INSERT INTO ev.proposal_votes (proposal_id, user_id, vote) VALUES
  ('d4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001','approve'),
  ('d4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002','approve'),
  ('d4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003','abstain'),
  ('d4000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006','approve');

-- Transport Proposal 2
INSERT INTO ev.proposal_votes (proposal_id, user_id, vote) VALUES
  ('d4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000002','disapprove'),
  ('d4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000004','strong_disapproval'),
  ('d4000001-0000-0000-0000-000000000002','a0a0a0a0-0000-0000-0000-000000000006','abstain');

-- Education Proposal
INSERT INTO ev.proposal_votes (proposal_id, user_id, vote) VALUES
  ('d3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001','approve'),
  ('d3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002','approve'),
  ('d3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004','disapprove'),
  ('d3000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006','approve');

-- ============================================================
-- 7. PROPOSAL ARGUMENTS (Pro/Contra)
-- ============================================================

-- Solar Proposal 1
INSERT INTO ev.proposal_arguments (proposal_id, type, text, author_id) VALUES
  ('d1000001-0000-0000-0000-000000000001','pro',
   'Gemeinschaftsgebäude als Startpunkt ist strategisch klug — sichtbare Wirkung für alle.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1000001-0000-0000-0000-000000000001','pro',
   '50/50 Finanzierung verteilt das Risiko fair zwischen Gemeinschaft und Unterstützern.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1000001-0000-0000-0000-000000000001','contra',
   '300 Panels sind zu wenig — das ist ein Tropfen auf den heißen Stein.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('d1000001-0000-0000-0000-000000000001','contra',
   'Crowdfunding ist unsicher — was wenn das Ziel nicht erreicht wird?',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Solar Proposal 2
INSERT INTO ev.proposal_arguments (proposal_id, type, text, author_id) VALUES
  ('d1000001-0000-0000-0000-000000000002','pro',
   'Pilotprojekt reduziert Risiko — wir lernen bevor wir groß investieren.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d1000001-0000-0000-0000-000000000002','pro',
   'Bakery hat hohen Tagesverbrauch — idealer Testfall für Solareffizienz.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d1000001-0000-0000-0000-000000000002','contra',
   '6 Monate Pilotphase verzögert die eigentliche Lösung um mindestens 1 Jahr.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- Transport Proposal 1
INSERT INTO ev.proposal_arguments (proposal_id, type, text, author_id) VALUES
  ('d4000001-0000-0000-0000-000000000001','pro',
   'E-Bike-Sharing ist sofort umsetzbar — keine Baugenehmigungen nötig.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('d4000001-0000-0000-0000-000000000001','pro',
   'Bewährtes Modell aus anderen Öko-Gemeinschaften weltweit.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4000001-0000-0000-0000-000000000001','contra',
   'Ältere Community-Mitglieder können keine E-Bikes nutzen — nicht inklusiv.',
   'a0a0a0a0-0000-0000-0000-000000000004');

-- ============================================================
-- 8. PROPOSED IMPROVEMENTS
-- ============================================================

INSERT INTO ev.proposed_improvements (proposal_id, text, author_id) VALUES
  ('d1000001-0000-0000-0000-000000000001',
   'Komitee sollte mindestens eine Person aus jedem betroffenen Gebäude enthalten.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d1000001-0000-0000-0000-000000000002',
   'Pilotdauer auf 3 Monate reduzieren und gleichzeitig zweiten Standort planen.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('d4000001-0000-0000-0000-000000000001',
   'E-Lastenräder für Familien mit Kindern hinzufügen — nicht nur normale E-Bikes.',
   'a0a0a0a0-0000-0000-0000-000000000003'),
  ('d4000001-0000-0000-0000-000000000001',
   'Stationen sollten überdacht sein — Schutz vor Monsun und Hitze.',
   'a0a0a0a0-0000-0000-0000-000000000006');

-- ============================================================
-- 9. EXECUTION PLAN (für Topic 1: Solar — angenommene Initiative)
-- ============================================================

INSERT INTO ev.execution_plans (id, issue_id, goal, costs, duration) VALUES
  ('e1000001-0000-0000-0000-000000000001', 'e0e0e0e0-0000-0000-0000-000000000001',
   'Installation von 300 Solarpanels auf Gemeinschaftsdächern bis Ende 2026. Ziel: 30% des Gemeinschaftsenergieverbrauchs durch Solarenergie decken.',
   '€ 420.000 (50% Gemeinschaftsfonds, 50% Crowdfunding)',
   '18 Monate (Start: März 2026, Ende: August 2027)');

-- Tasks
INSERT INTO ev.execution_tasks (id, plan_id, title, description, status, assignee_id) VALUES
  ('a1100001-0000-0000-0000-000000000001','e1000001-0000-0000-0000-000000000001',
   'Dachabmessungen aller 3 Gebäude aufnehmen',
   'Technische Vermessung von Matrimandir Visitor Centre, SAWCHU und Bharat Nivas.',
   'done', 'a0a0a0a0-0000-0000-0000-000000000004'),
  ('a1100001-0000-0000-0000-000000000002','e1000001-0000-0000-0000-000000000001',
   'Angebote von 3 Solarinstallateuren einholen',
   'Mindestens ein lokaler Anbieter aus Tamil Nadu, ein internationaler Anbieter.',
   'done', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('a1100001-0000-0000-0000-000000000003','e1000001-0000-0000-0000-000000000001',
   'Crowdfunding-Kampagne starten',
   'Kampagne auf Auroville-Website + internationale Plattform. Ziel: €210.000.',
   'in_progress', 'a0a0a0a0-0000-0000-0000-000000000002'),
  ('a1100001-0000-0000-0000-000000000004','e1000001-0000-0000-0000-000000000001',
   'Baugenehmigung für Dachinstallation beantragen',
   'Antrag beim Auroville Foundation Board + lokaler Baubehörde.',
   'in_progress', 'a0a0a0a0-0000-0000-0000-000000000001'),
  ('a1100001-0000-0000-0000-000000000005','e1000001-0000-0000-0000-000000000001',
   'Installation Gebäude 1: Matrimandir Visitor Centre',
   '100 Panels, geplant für Mai 2026.',
   'todo', NULL),
  ('a1100001-0000-0000-0000-000000000006','e1000001-0000-0000-0000-000000000001',
   'Installation Gebäude 2: SAWCHU',
   '120 Panels, geplant für Juli 2026.',
   'todo', NULL),
  ('a1100001-0000-0000-0000-000000000007','e1000001-0000-0000-0000-000000000001',
   'Installation Gebäude 3: Bharat Nivas',
   '80 Panels, geplant für September 2026.',
   'todo', NULL),
  ('a1100001-0000-0000-0000-000000000008','e1000001-0000-0000-0000-000000000001',
   'Monitoring-System einrichten',
   'Echtzeit-Dashboard für Energieerzeugung, zugänglich für alle Community-Mitglieder.',
   'todo', 'a0a0a0a0-0000-0000-0000-000000000003');

-- Task Comments
INSERT INTO ev.task_comments (task_id, text, author_id) VALUES
  ('a1100001-0000-0000-0000-000000000001',
   'Alle Messungen abgeschlossen. Bharat Nivas hat Schattenprobleme durch Bäume — max 60 Panels statt 80.',
   'a0a0a0a0-0000-0000-0000-000000000004'),
  ('a1100001-0000-0000-0000-000000000001',
   'Danke Thomas! Das sollten wir im nächsten Meeting besprechen und den Gesamtplan anpassen.',
   'a0a0a0a0-0000-0000-0000-000000000001'),
  ('a1100001-0000-0000-0000-000000000003',
   'Erste Woche: €18.000 gesammelt. Wir sind auf Kurs aber müssen mehr kommunizieren.',
   'a0a0a0a0-0000-0000-0000-000000000002'),
  ('a1100001-0000-0000-0000-000000000003',
   'Newsletter an alle Auroville-Unterstützer wurde heute verschickt. Erwarte Anstieg.',
   'a0a0a0a0-0000-0000-0000-000000000001');

-- Milestones
INSERT INTO ev.execution_milestones (plan_id, title, date) VALUES
  ('e1000001-0000-0000-0000-000000000001', 'Projektstart & Kickoff-Meeting',        '2026-03-01'),
  ('e1000001-0000-0000-0000-000000000001', 'Crowdfunding-Ziel erreicht',             '2026-04-30'),
  ('e1000001-0000-0000-0000-000000000001', 'Baugenehmigung erhalten',                '2026-04-15'),
  ('e1000001-0000-0000-0000-000000000001', 'Installation Gebäude 1 abgeschlossen',   '2026-06-30'),
  ('e1000001-0000-0000-0000-000000000001', 'Installation Gebäude 2 abgeschlossen',   '2026-08-31'),
  ('e1000001-0000-0000-0000-000000000001', 'Installation Gebäude 3 abgeschlossen',   '2026-10-31'),
  ('e1000001-0000-0000-0000-000000000001', 'Monitoring live & Abschlussbericht',     '2026-12-01');

-- Team
INSERT INTO ev.execution_team (plan_id, user_id, role, status) VALUES
  ('e1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000001','Projektleitung', 'active'),
  ('e1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000002','Crowdfunding & Kommunikation', 'active'),
  ('e1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000004','Technische Koordination', 'active'),
  ('e1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000003','Monitoring & Daten', 'interested'),
  ('e1000001-0000-0000-0000-000000000001','a0a0a0a0-0000-0000-0000-000000000006','Rechtliches & Genehmigungen', 'interested');
