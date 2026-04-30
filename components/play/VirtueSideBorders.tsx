'use client'

import { useState, useEffect } from 'react'

const VIRTUES = [
  { name: 'Sincerity',    color: '#7B5CB8', shadow: '#4D3580' },
  { name: 'Humility',     color: '#5FAD2C', shadow: '#3A7015' },
  { name: 'Gratitude',    color: '#F5A93D', shadow: '#C47520' },
  { name: 'Perseverance', color: '#4A8FD4', shadow: '#2462A8' },
  { name: 'Aspiration',   color: '#E8965A', shadow: '#B86030' },
  { name: 'Receptivity',  color: '#9B59B6', shadow: '#6C3483' },
  { name: 'Progress',     color: '#26C6DA', shadow: '#0097A7' },
  { name: 'Courage',      color: '#E74C3C', shadow: '#A93226' },
  { name: 'Goodness',     color: '#E91E8C', shadow: '#9C1264' },
  { name: 'Generosity',   color: '#AB47BC', shadow: '#7B1FA2' },
  { name: 'Equality',     color: '#5C6BC0', shadow: '#3949AB' },
  { name: 'Peace',        color: '#42A5F5', shadow: '#1565C0' },
]

function randomFour(): [number, number, number, number] {
  const arr = Array.from({ length: VIRTUES.length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return [arr[0], arr[1], arr[2], arr[3]]
}

// ── LEFT sidebar paths (viewBox 0 0 100 100) ──────────────────
// x=0 = screen edge, x=100 = inner edge facing content

const L_TOP_SHADOW    = 'M 0 0 L 93 0 C 102 7 80 16 68 24 C 54 32 92 40 62 50 C 42 57 50 65 30 72 C 14 77 2 75 0 78 Z'
const L_TOP_MAIN      = 'M 0 0 L 88 0 C 100 6 74 15 62 22 C 48 30 86 38 56 47 C 36 54 44 62 24 68 C 10 72 2 70 0 73 Z'
const L_BOT_SHADOW    = 'M 0 25 C 6 23 24 30 46 36 C 63 41 42 52 56 60 C 70 68 86 72 64 81 C 46 90 82 95 78 100 L 0 100 Z'
const L_BOT_MAIN      = 'M 0 31 C 6 29 23 35 44 41 C 60 46 40 57 54 65 C 68 72 84 76 62 85 C 44 93 80 97 76 100 L 0 100 Z'

// ── RIGHT sidebar paths (x-mirrored: x → 100 − x) ────────────
const R_TOP_SHADOW    = 'M 100 0 L 7 0 C -2 7 20 16 32 24 C 46 32 8 40 38 50 C 58 57 50 65 70 72 C 86 77 98 75 100 78 Z'
const R_TOP_MAIN      = 'M 100 0 L 12 0 C 0 6 26 15 38 22 C 52 30 14 38 44 47 C 64 54 56 62 76 68 C 90 72 98 70 100 73 Z'
const R_BOT_SHADOW    = 'M 100 25 C 94 23 76 30 54 36 C 37 41 58 52 44 60 C 30 68 14 72 36 81 C 54 90 18 95 22 100 L 100 100 Z'
const R_BOT_MAIN      = 'M 100 31 C 94 29 77 35 56 41 C 40 46 60 57 46 65 C 32 72 16 76 38 85 C 56 93 20 97 24 100 L 100 100 Z'

type Virtue = (typeof VIRTUES)[number]

function Sidebar({ top, bottom, side }: { top: Virtue; bottom: Virtue; side: 'left' | 'right' }) {
  const topShadow    = side === 'left' ? L_TOP_SHADOW : R_TOP_SHADOW
  const topMain      = side === 'left' ? L_TOP_MAIN   : R_TOP_MAIN
  const botShadow    = side === 'left' ? L_BOT_SHADOW : R_BOT_SHADOW
  const botMain      = side === 'left' ? L_BOT_MAIN   : R_BOT_MAIN
  const rotate       = side === 'left' ? '-90deg'      : '90deg'

  const textStyle: React.CSSProperties = {
    transform: `rotate(${rotate})`,
    whiteSpace: 'nowrap',
    fontSize: 'clamp(13px, 4.2vw, 18px)',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
    textShadow: '0 1px 6px rgba(0,0,0,0.35)',
    fontFamily: "'Nunito', 'Arial Rounded MT Bold', 'Varela Round', system-ui, sans-serif",
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full block"
      >
        {/* Draw shadows first (they peek out from behind main blobs) */}
        <path d={topShadow} fill={top.shadow} />
        <path d={botShadow} fill={bottom.shadow} />
        {/* Main blobs on top */}
        <path d={topMain}   fill={top.color} />
        <path d={botMain}   fill={bottom.color} />
      </svg>

      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span style={textStyle}>{top.name}</span>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span style={textStyle}>{bottom.name}</span>
        </div>
      </div>
    </div>
  )
}

export function VirtueSideBorders() {
  const [quad, setQuad] = useState<[number, number, number, number] | null>(null)

  useEffect(() => {
    setQuad(randomFour())

    // Load Nunito from Google Fonts
    if (!document.getElementById('nunito-font')) {
      const link = document.createElement('link')
      link.id = 'nunito-font'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  if (!quad) return null

  const [li0, li1, ri0, ri1] = quad

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-[11vw] sm:w-12 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[li0]} bottom={VIRTUES[li1]} side="left" />
      </div>
      <div className="fixed top-0 right-0 h-screen w-[11vw] sm:w-12 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[ri0]} bottom={VIRTUES[ri1]} side="right" />
      </div>
    </>
  )
}
