---
tags: [plattform]
status: entwurf
---
# Plattform-Überblick

Next.js 14 (App Router) + TypeScript, Supabase (Postgres + Auth), Tailwind, gehostet auf Vercel. KI-Anfragen laufen aktuell über Groq (Llama).

## Bereiche im Code
| Bereich | Ordner |
|---|---|
| Topics, Diskussion, Proposals, Execution | `app/topics/` |
| Delegation ([[Liquid Democracy]]) | `app/delegation/`, `lib/delegation/` |
| Abstimmungsverfahren (Schulze, Approval) | `lib/voting/` |
| KI-Funktionen | `lib/ai/`, `components/ai/` |
| Spielerischer Modus | `app/play/`, `app/playful/`, `components/play/` |
| Datenbank | `supabase/` |

## Technische Dokumente im Repo
Diese liegen außerhalb des Vaults in `docs/`:
- [System-Architektur](https://github.com/luigierschafft/LiquidDecocracySimulation/blob/main/docs/system-architecture.md)
- [Modul-Plan (96 Module)](https://github.com/luigierschafft/LiquidDecocracySimulation/blob/main/docs/modules.md)
- [Erste Version, Plattform-Plan](https://github.com/luigierschafft/LiquidDecocracySimulation/blob/main/docs/ersteversionplan.md)

Siehe auch: [[Designprinzipien]], [[Offene Fragen]]
