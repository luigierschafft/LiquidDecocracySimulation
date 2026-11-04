# Liquid Democracy Auroville

Das Design-System für die Classic-Ansicht von Liquid Democracy Auroville: weiß, ruhig, golden. Es ist eine Plattform, auf der die Menschen von Auroville gemeinsam Themen besprechen, Vorschläge abwägen und abstimmen. Das Design soll dabei helfen, sich zu sammeln, statt zu zerstreuen.

> Status: Entwurf 1, November 2026. Noch nicht im Code umgesetzt; siehe „Umsetzung“ am Ende.

---

## 1. Woher die Gestaltung kommt

Die Farben und Formen orientieren sich an der Bildwelt der Mutter (Mirra Alfassa) und an Auroville selbst. Wir übernehmen keine Symbolik eins zu eins, sondern ihre Stimmung:

| Quelle | Was wir daraus nehmen |
| --- | --- |
| **Der weiße Raum im Inneren des Matrimandir** | Weiß als Grundzustand jeder Seite. Viel Leere, wenig Rahmen. |
| **Die goldenen Scheiben des Matrimandir** | Gold als einzige „laute“ Farbe: für das, was Gewicht hat (die Hauptaktion, die Wichtigkeit eines Statements). |
| **Das Zeichen der Mutter** (innerer Kreis, 4 innere und 12 äußere Blütenblätter) | Die Blütenblatt-Form als wiederkehrendes Motiv: Bewertungsskala, Ladeanzeige, Deckblatt. Die Zahl 12 erscheint im Playful-Modus bereits als die zwölf Qualitäten. |
| **Das Orangerot des Auroville-Emblems** | Eine Markenfarbe, die nur für das Zeichen und den Namen steht, nie für Bedienelemente. |
| **Die rote Erde (Laterit)** | Das Rot für Contra und Fehler: erdig, nicht alarmierend. |
| **Der Grüngürtel** | Das Grün für Pro und Zustimmung. |
| **Der weite Himmel über Auroville** | Ein ruhiges Blau für Verbindungen: Links, Delegation, Fokus. |

Wichtig: Die Plattform ist ein Werkzeug der Gemeinschaft, kein religiöses Objekt. Das Zeichen der Mutter wird als Logo nur dort gezeigt, wo die Gemeinschaft das ausdrücklich möchte. Das Blütenblatt-Motiv dagegen ist abstrakt genug, um überall verwendet zu werden.

## 2. Prinzipien

1. **Weiß zuerst.** Mindestens 80 % jeder Seite sind Weiß. Farbe ist ein Ereignis, kein Hintergrund. Keine cremefarbenen oder grauen Seitenhintergründe hinter weißen Karten.
2. **Ein Gold pro Blick.** Auf einem Bildschirmausschnitt gibt es höchstens eine goldene Fläche: die eine Sache, die man jetzt tun kann. Alles andere ist Text auf Weiß.
3. **Linien statt Kästen.** Inhalte werden durch Abstand und feine Haarlinien gegliedert, nicht durch eingerahmte Karten mit Schatten. Eine Fläche mit Rahmen gibt es nur, wo etwas wirklich umschlossen ist: ein Formular, ein Dialog.
4. **Die Worte der Menschen sind die größte Schrift.** Ein Statement ist größer als jede Beschriftung um es herum. Die Bedienung tritt zurück.
5. **Bedeutung nie nur über Farbe.** Pro und Contra, Zustimmung und Ablehnung tragen immer ein Wort und ein Zeichen (✓ / ✗). Wer Rot und Grün nicht unterscheiden kann, verliert nichts.
6. **Ruhe vor Effekt.** Keine Verläufe, keine Animationen ohne Anlass. Bewegung nur als Antwort auf eine Handlung (etwas klappt auf, eine Bewertung wird gespeichert).

## 3. Farben

Ein einziges Thema, „Weiß“. Alle Textfarben erfüllen mindestens 4,5:1 auf `surface` und `surface-sunk`.

### Neutrale Töne (tragen 95 % der Oberfläche)

| Token | Wert | Einsatz |
| --- | --- | --- |
| `surface` | `#ffffff` | Jede Seite. |
| `surface-sunk` | `#f7f6f3` | Eingabefelder, abgesenkte Zonen. Nie ganze Seiten. |
| `line` | `#e7e2da` | Haarlinien zwischen Einträgen. |
| `line-control` | `#9c8f7e` | Rahmen von Feldern und Schaltern. |
| `ink` | `#231b14` | Text und Titel. |
| `ink-muted` | `#5e5145` | Beschreibungen, Metadaten. |
| `ink-subtle` | `#7a6a5a` | Zähler, Zeitangaben. Hellste erlaubte Textfarbe. |

### Gold (Gewicht, Wichtigkeit, Hauptaktion)

| Token | Wert | Einsatz |
| --- | --- | --- |
| `gold-100` | `#fbf3de` | Ausgewählter Zustand, eigene Bewertung. |
| `gold-300` | `#ecc766` | Helle Blütenblätter (Wichtigkeit 1–4). |
| `gold-500` | `#d4a02a` | Hauptaktion (Fläche, Text in `ink`), volle Blütenblätter. |
| `gold-600` | `#a97a17` | Goldene Linien und Zeichen auf Weiß. |
| `gold-700` | `#8c6414` | Goldener Text, z. B. der Durchschnittswert „7,4“. |

### Bedeutungsfarben

| Token | Wert | Bedeutung | Immer zusammen mit |
| --- | --- | --- | --- |
| `green-700` / `green-100` | `#2f6b40` / `#e5f2e8` | Pro, Approve | „Pro“ / „Approve“ und ✓ |
| `earth-700` / `earth-100` | `#9e3320` / `#f9e6e1` | Contra, Disapprove, Fehler | „Contra“ / „Disapprove“ und ✗ |
| `sky-700` / `sky-100` | `#2b638e` / `#e6f0f7` | Links, Delegation, Fokus, Information | unterstrichener Link oder Symbol |
| `vermilion-600` / `vermilion-100` | `#b5431d` / `#fbe9e1` | Nur Marke und Zeichen | – |

**Achtung:** `green-700` und `earth-700` sind fast gleich hell. Deshalb stehen Pro und Contra immer in getrennten Spalten mit Überschrift, Wort und Zeichen. Die Farbe ist nur Bestätigung, nie die einzige Information.

### Was wir bewusst nicht verwenden

- **Lila.** Die bisherige Classic-Ansicht nutzt Lila für Auswahl und Bewertung. Lila hat keinen Bezug zu Auroville und konkurriert mit dem Gold. Es entfällt.
- **Terrakotta als Button-Farbe.** Das bisherige `#c2650a` wird durch Gold (Aktion) und Vermilion (nur Marke) ersetzt.
- **Verläufe, Grau-Schwarz `#111`, Schatten unter Karten.**

## 4. Schrift

Zwei Familien mit klar getrennten Rollen:

- **Marcellus** (Display): eine ruhige, klassische Antiqua nach dem Vorbild römischer Inschriften, mit nur einem Schnitt. Sie wirkt wie in Stein gesetzt, passend zum Matrimandir, ohne kirchlich zu sein. Sie wird nur für Titel ab 22 px verwendet.
- **Source Sans 3** (Text): eine humanistische Grotesk, sehr gut lesbar auf Handys und für Menschen, für die Englisch nicht die Muttersprache ist. Sie deckt alle europäischen Akzente ab und ist im Code bereits eingebaut.

Beide Schriften kommen von Google Fonts:
`https://fonts.googleapis.com/css2?family=Marcellus&family=Source+Sans+3:wght@400;500;600;700&display=swap`

| Stil | Familie | Größe / Zeilenhöhe | Gewicht | Wofür |
| --- | --- | --- | --- | --- |
| `display` | Marcellus | 40 / 46 | 400 | Seitentitel von Übersichten |
| `title` | Marcellus | 30 / 36 (mobil 26 / 32) | 400 | Topic-Titel |
| `heading` | Marcellus | 22 / 28 | 400 | Abschnitte |
| `statement` | Source Sans 3 | 19 / 28 | 500 | Text eines Statements |
| `body-lg` | Source Sans 3 | 18 / 29 | 400 | Topic-Beschreibung |
| `body` | Source Sans 3 | 16 / 26 | 400 | Standardtext, Argumente |
| `label` | Source Sans 3 | 15 / 20 | 600 | Buttons, Beschriftungen |
| `small` | Source Sans 3 | 14 / 20 | 400 | Metadaten |
| `caption` | Source Sans 3 | 13 / 18 | 400 | Zähler |

Regeln:
- **Satzschreibung überall:** „Submit statement“, nicht „Submit Statement“ oder „SUBMIT“. Keine Großbuchstaben-Etiketten über Überschriften.
- **Nie unter 13 px.** Die bisherigen 12-px-Texte in Hellgrau entfallen.
- **Zeilenlänge höchstens etwa 70 Zeichen** (`measure-text`, 680 px).
- **Ziffern:** Durchschnittswerte mit einer Nachkommastelle („7,4“ bzw. „7.4“ in der englischen Oberfläche), in `gold-700`, Gewicht 600.

## 5. Abstände, Radien, Schatten

- **Raster von 4 px.** Abstände: 4, 8, 12, 16, 24, 32, 48, 64 (`space-1` bis `space-16`).
- **Seitenrand:** mobil 16 px, ab Tablet 24 px. Inhalt höchstens 680 px breit (Lesespalte) bzw. 960 px (Übersichten).
- **Zwischen Statements:** 24 px Luft und eine Haarlinie (`line`). Kein Kasten.
- **Radien:** 6 px für Bedienelemente, 12 px für umschließende Flächen, 999 px für Blütenblätter und Pillen. Nie mehr als diese drei.
- **Schatten:** nur `shadow-overlay`, nur für Menüs und Dialoge.
- **Antippbare Elemente** sind mindestens 44 px hoch.

## 6. Layout

Alles ist linksbündig. Zentriert werden nur leere Zustände und das Login-Formular.

### Topic-Seite (Classic, mobil)

```
┌──────────────────────────────────┐
│ ←                  [Sign in] [☰] │  Leiste: Zurück-Pfeil, Anmelden, Menü
│                                  │
│ Cows inside of Auroville         │  title (Marcellus 26/32), ganz oben
│ walking around freely            │
│                                  │
│ Free-roaming cows are a common   │  body-lg, ink-muted
│ sight in Auroville …             │
│                                  │
│ Discussion  Proposals  Plan      │  Reiter statt Auswahlfeld;
│ ─────────                        │  aktiver Reiter gold unterstrichen
│ 8 days left ▬▬▬▬▬▬▬▬▬▬▬░░        │  small + dünne goldene Zeitleiste
├──────────────────────────────────┤
│ ┌ Add a statement ─────────────┐ │  einzige umrahmte Fläche
│ │ ...                          │ │
│ │ [Submit statement]  Add source│ │  Gold-Button
│ └──────────────────────────────┘ │
│                                  │
│ Cows are one of the main reasons │  statement (19/28)
│ for fences in Auroville          │
│ ◖◗◖◗◖◗◖◗○○○  7.4   4 arguments   │  Blütenblatt-Skala, Schnitt, Argumente
│ ──────────────────────────────── │  Haarlinie
│ Cows make it difficult to have … │
└──────────────────────────────────┘
```

### Topic-Liste

```
Topics                                   display (Marcellus 40)
Select a topic you want to discuss …     body-lg, ink-muted

Do we want regular General Meetings?     heading (Marcellus 22)
Discussion, 12 statements, 8 days left  small, ink-subtle
──────────────────────────────────────
Community Medicinal Herb Garden
Proposals, 3 proposals, open
──────────────────────────────────────
```

Die Liste ist eine Liste mit Haarlinien, kein Raster aus Kacheln. Ältere Demo-Topics werden nicht ausgegraut, sondern stehen in einem eigenen, zugeklappten Abschnitt „Earlier topics“.

## 7. Bausteine

Für jeden Baustein gibt es unter „Components“ eine Vorschau. Kurzfassung:

- **Button:** Es gibt drei Arten. *Primary* ist eine Gold-Fläche mit `ink`-Text, eine pro Ansicht. *Secondary* ist weiß mit `line-control`-Rahmen. *Quiet* ist reiner Text in `sky-700`. Die Beschriftung nennt immer die Handlung: „Submit statement“, „Make a proposal“, „Delegate my vote“.
- **Statement:** Text im Stil `statement`, darunter in einer Zeile die Blütenblatt-Skala, der Durchschnitt und die Anzahl der Argumente. Ein Antippen öffnet die Pro/Contra-Diskussion darunter.
- **Bewertungsskala (Blütenblätter):** 0 bis 10 als elf kleine Blütenblätter. Nicht gewählte Blätter sind weiß mit `line-control`-Rand, gewählte füllen sich von `gold-300` zu `gold-500`. Der eigene Wert steht als Zahl daneben, der Durchschnitt erst nach der eigenen Bewertung (wie bisher).
- **Argumente:** Pro und Contra stehen in zwei Spalten (mobil untereinander), jeweils mit Kopfzeile „✓ Pro“ (`green-100`/`green-700`) bzw. „✗ Contra“ (`earth-100`/`earth-700`). Die Argumente sind Zeilen mit Haarlinie, keine Karten mit farbigem Rand links.
- **Abstimmung:** Approve, Abstain, Disapprove und Strong no als gleich breite Schaltflächen mit Wort und Zeichen. Die gewählte Option wird gefüllt, die anderen bleiben weiß.
- **Topic-Kopf:** Zurück-Pfeil, Titel, Beschreibung, Reiter, Zeitleiste, in dieser Reihenfolge.
- **Menü:** Schwebt oben rechts (`shadow-overlay`, `radius-md`). Ein sichtbarer „Sign in“-Button für Besucher, als Secondary-Button, nicht in Gold.

## 8. Sprache

- Die Oberfläche ist englisch, kurz und in aktiven Verben: „Submit statement“, „Rate importance“, „Delegate my vote“.
- Eine Handlung heißt überall gleich: Wenn der Button „Submit statement“ heißt, lautet die Bestätigung „Statement submitted“.
- Leere Zustände laden zum Handeln ein: „No statements yet. Share the first thought on this topic.“
- Fehler sagen, was passiert ist und was hilft, ohne Entschuldigung: „Your argument wasn't saved. Check your connection and try again.“
- Keine Emojis in der Classic-Ansicht. Die bisherigen „📊 Analytics“ und „🐾 Play“ im Menü werden zu „Analytics“ und „Playful mode“.

## 9. Barrierefreiheit

| Paar | Kontrast | Erlaubt für |
| --- | --- | --- |
| `ink` auf `surface` | 17,0 : 1 | jeden Text |
| `ink-muted` auf `surface` | 7,7 : 1 | jeden Text |
| `ink-subtle` auf `surface` / `surface-sunk` | 5,2 / 4,8 : 1 | jeden Text ab 13 px |
| `ink` auf `gold-500` | 7,2 : 1 | Primary-Button |
| `gold-700` auf `surface` | 5,3 : 1 | goldener Text |
| `sky-700` auf `surface` | 6,4 : 1 | Links, Fokusring |
| `green-700` / `earth-700` auf Weiß | 6,4 / 7,1 : 1 | Pro / Contra-Text |
| `line-control` auf `surface` | 3,2 : 1 | Feldrahmen |
| `gold-500` auf `surface` | 2,4 : 1 | **nur** als Fläche mit Text darin, nie als Linie oder Symbol allein |

- **Fokusring:** 2 px `sky-700` mit 2 px Abstand, auf jedem bedienbaren Element sichtbar.
- **Bewegung** wird bei „Bewegung reduzieren“ abgeschaltet.
- **Die Bewertungsskala** ist mit der Tastatur bedienbar (Pfeiltasten) und wird vorgelesen als „Importance 7 of 10“.

## 10. Classic und Playful

Dieses System gilt für die **Classic-Ansicht**. Der Playful-Modus behält seinen verspielten Charakter: runde Formen, Maskottchen und die zwölf Qualitäten am Rand. Er teilt aber die Bedeutungsfarben (Pro, Contra, Delegation) und das Gold, damit beide Ansichten erkennbar zur selben Plattform gehören.

## 11. Umsetzung im Code

Reihenfolge der Umstellung, jeweils als eigener Schritt prüfbar:

1. **Tokens:** Die Farben und Radien aus diesem System kommen in `tailwind.config.ts` (`colors`, `borderRadius`). Lila (`purple-*`) und das alte `accent` werden ersetzt.
2. **Schrift:** Marcellus wird per `next/font/google` als `--font-display` geladen. Source Sans 3 ist bereits da.
3. **Topic-Seite:** `TopicHeader`, `StatementCard`, `StatementRating`, `KialoTreeView`, `AddStatementForm`.
4. **Topic-Liste:** `app/topics/page.tsx`, `ProposalCard` werden zur Liste mit Haarlinien.
5. **Vorschläge und Abstimmung:** `ProposalVoteButtons`, `TopicProposalCard`.
6. **Navigation und Login:** `Navbar`, `app/auth/login`.
7. **Restliche Seiten** (Delegation, Profil, Admin) übernehmen die Tokens automatisch und werden danach einzeln geprüft.

## 12. Offene Fragen

- Soll das Zeichen der Mutter als Logo erscheinen (z. B. klein im Menü oder auf der Startseite), oder bleibt es beim abstrakten Blütenblatt-Motiv?
- Reiter statt Auswahlfeld für Discussion / Proposals / Plan: passt das?
- Sollen ältere Demo-Topics ausgeblendet oder in „Earlier topics“ gesammelt werden?
