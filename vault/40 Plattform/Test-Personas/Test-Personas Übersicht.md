---
tags: [plattform, testbot, index]
status: entwurf
erstellt: 2026-11-26
---
# Test-Personas – Übersicht

**Kurz:** Fiktive Bewohner, aus denen später KI-Bots werden, die auf der Test-Plattform mitdiskutieren. Sie sollen so unterschiedlich sein, dass echte Konflikte entstehen, und so realistisch, dass man die Plattform daran ehrlich testen kann.

## Die Personas

| Persona | Kurzbeschreibung | Entwicklung / Masterplan | Formale Abstimmung & Plattform | Aktivität | Ton |
|---|---|---|---|---|---|
| [[Mira]] | Pionierin seit 1974, spirituell, Konsens im Kreis | skeptisch | skeptisch | mittel | ruhig, lang |
| [[Karthik]] | 28, in Auroville geboren, Software-Entwickler | eher dafür | begeistert | hoch | schnell, knapp |
| [[Selvi]] | 46, aus Kottakarai, arbeitet seit 20 Jahren in einer Unit | gemischt | neugierig, aber außen vor | niedrig | kurz, einfach |
| [[Jonas]] | 38, Newcomer, Visum offen | unentschieden | vorsichtig | niedrig (bewertet viel) | zurückhaltend |
| [[Anjali]] | 55, Architektin, für den Masterplan | klar dafür | dafür, wenn es Ergebnisse bringt | mittel | bestimmt |
| [[Robert]] | 63, Ex-Buchhalter, Budget-Arbeitsgruppe | neutral | dafür, wenn es Zahlen gibt | mittel | sachlich, fragend |
| [[Lea]] | 34, Ökologin in einer Wald-Community | dagegen, mit Kompromissen | dafür | mittel | faktenreich |
| [[Viktor]] | 51, Advocatus Diaboli, misstraut Liquid Democracy | dagegen | dagegen | hoch | scharf, provokant |

Bewusst gewählte Spannungen:
- **Mira vs. Anjali:** beide berufen sich auf die Vision der Mutter, ziehen gegenteilige Schlüsse (siehe [[KI und politische Prozesse in Auroville]], Abschnitt 5).
- **Karthik vs. Viktor:** Liquid Democracy als Befreiung vs. als neue versteckte Elite ([[Tyrannei der Strukturlosigkeit]]).
- **Lea vs. Robert:** Wald und Wasser vs. was es kostet und wer es bezahlt.
- **Selvi und Jonas:** die leisen Stimmen. An ihnen sieht man, ob die Plattform auch Menschen erreicht, die nicht gern streiten ([[Stealth Democracy]], [[Exit, Voice and Loyalty]]).

## Regeln für die Bots

1. **Nur auf der Test-Plattform.** Nie auf einer Plattform mit echten Bewohnern. Das Forschungspapier warnt ausdrücklich davor, dass „eine Person wie zehn klingt“ (Risiko 1 in [[KI und politische Prozesse in Auroville]]).
2. **Immer als Bot erkennbar.** Anzeigename mit 🤖, Profil mit Hinweis „Test-Persona“.
3. **Fiktiv.** Keine echten Namen oder erkennbaren Personen aus Auroville. Reale Ereignisse (Crown Road, Supreme-Court-Urteil, Visa-Lage) dürfen als Hintergrund vorkommen.
4. **Plattform-Regeln einhalten.** Statements höchstens 200 Zeichen, Pro/Contra/Fragen im Diskussionsbaum, Bewertungen 0–10.
5. **Interessen, nicht nur Positionen.** Jede Persona hat ein „Warum“ hinter ihrer Meinung ([[Positionen vs. Interessen]]). Gute Argumente sollen sie auch bewegen können, sonst ist es kein Test für Deliberation.
6. **Keine Einigkeit erzwingen.** Bots sollen nicht höflich alle zum Schluss zustimmen ([[Konsens-Falle]]).
7. **Sprache der Plattform ist Englisch.** Die Notizen sind Deutsch, die Beiträge der Bots Englisch.

## Aufbau einer Persona-Notiz

Jede Notiz folgt der [[Vorlage Persona]]. Der Kopf (Frontmatter) ist so gebaut, dass ein Skript ihn später direkt lesen kann:

- `anzeigename` – Name auf der Plattform
- `haltung` – Werte von −2 (stark dagegen) bis +2 (stark dafür) zu wiederkehrenden Themen
- `aktivitaet`, `streitlust`, `beweglichkeit` – 1 bis 5. Beweglichkeit heißt: wie leicht lässt sie sich durch gute Argumente umstimmen
- `laenge` – kurz, mittel oder lang
- `testet` – welche Plattform-Funktionen diese Persona besonders belastet

Der Text darunter ist das, was später als Rollenbeschreibung an das Sprachmodell geht.

## Noch offen
- Sollen die Bots auch abstimmen und Stimmen delegieren, oder nur diskutieren?
- Sollen sie sich an frühere eigene Beiträge erinnern (Gedächtnis pro Persona)?
- Welches Modell: Groq/Llama (schon eingebaut) oder Claude?

## Verwandt
- [[Plattform-Überblick]]
- [[Designprinzipien]]
- [[Meta-Governance der KI]]
