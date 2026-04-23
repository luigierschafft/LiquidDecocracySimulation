'use client'

import { useState, useEffect } from 'react'

const VIRTUES = [
  { name: 'Sincerity',    color: '#87CEEB', light: true  }, // Pale Blue
  { name: 'Humility',     color: '#2E7D32', light: false }, // Deep Green
  { name: 'Gratitude',    color: '#8FBC8F', light: true  }, // Pale Green
  { name: 'Perseverance', color: '#FDD835', light: true  }, // Yellow
  { name: 'Aspiration',   color: '#F9A825', light: true  }, // Golden Yellow
  { name: 'Receptivity',  color: '#FF9800', light: false }, // Orange
  { name: 'Progress',     color: '#FF5722', light: false }, // Orange Red
  { name: 'Courage',      color: '#C62828', light: false }, // Red
  { name: 'Goodness',     color: '#AD1457', light: false }, // Reddish Violet
  { name: 'Generosity',   color: '#7B1FA2', light: false }, // Violet
  { name: 'Equality',     color: '#5C6BC0', light: false }, // Blue Violet
  { name: 'Peace',        color: '#1A237E', light: false }, // Dark Blue
]

/** Pick 4 different random indices (no repeats) */
function randomFour(): [number, number, number, number] {
  const arr = Array.from({ length: VIRTUES.length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return [arr[0], arr[1], arr[2], arr[3]]
}

// ── Pre-computed organic SVG paths (viewBox "0 0 100 100", preserveAspectRatio="none") ──
//
// Left sidebar:  outer edge = x=0 (screen left), inner wavy edge faces right
// Divider sits around y=50 with an organic wave.
//
// Seam guarantee: the bottom curve of LT is the exact reverse of the top curve of LB.

const LT = `M 0 0
  C 35 0  75 -3  88 0
  C 96 15  90 35  82 50
  C 65.6 53  32.8 60  0 60
  Z`

const LB = `M 0 60
  C 32.8 60  65.6 53  82 50
  C 90 65  91 82  86 100
  C 60.2 100  34.4 100  0 100
  Z`

// Right sidebar: outer edge = x=100 (screen right), inner wavy edge faces left
// Exact mirror of LT / LB around x = 50.

const RT = `M 100 0
  C 65 0  25 -3  12 0
  C 4 15  10 35  18 50
  C 34.4 53  67.2 60  100 60
  Z`

const RB = `M 100 60
  C 67.2 60  34.4 53  18 50
  C 10 65  9 82  14 100
  C 39.8 100  65.6 100  100 100
  Z`

// ── One sidebar (2 coloured sections + labels) ──────────────────────────────
type Virtue = (typeof VIRTUES)[number]

function Sidebar({
  top,
  bottom,
  side,
}: {
  top: Virtue
  bottom: Virtue
  side: 'left' | 'right'
}) {
  const pathTop    = side === 'left' ? LT : RT
  const pathBottom = side === 'left' ? LB : RB
  // Left label reads bottom→top, right label reads top→bottom
  const rotate = side === 'left' ? '-90deg' : '90deg'

  return (
    <div className="relative w-full h-full">
      {/* Organic coloured blobs */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full block"
      >
        <path d={pathTop}    fill={top.color}    />
        <path d={pathBottom} fill={bottom.color} />
      </svg>

      {/* Labels – split into two halves matching the blobs */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        {/* Top half label */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span
            style={{
              transform: `rotate(${rotate})`,
              whiteSpace: 'nowrap',
              fontSize: 'clamp(9px, 7vw, 14px)',
              fontWeight: 700,
              color: top.light ? 'rgba(0,0,0,0.65)' : '#fff',
              letterSpacing: '0.04em',
              textShadow: top.light ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {top.name}
          </span>
        </div>

        {/* Bottom half label */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span
            style={{
              transform: `rotate(${rotate})`,
              whiteSpace: 'nowrap',
              fontSize: 'clamp(9px, 7vw, 14px)',
              fontWeight: 700,
              color: bottom.light ? 'rgba(0,0,0,0.65)' : '#fff',
              letterSpacing: '0.04em',
              textShadow: bottom.light ? 'none' : '0 1px 4px rgba(0,0,0,0.3)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {bottom.name}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Public component ─────────────────────────────────────────────────────────
export function VirtueSideBorders() {
  const [quad, setQuad] = useState<[number, number, number, number] | null>(null)

  useEffect(() => {
    setQuad(randomFour())
  }, [])

  if (!quad) return null

  const [li0, li1, ri0, ri1] = quad

  return (
    <>
      {/* Left border – two virtues */}
      <div className="fixed top-0 left-0 h-screen w-[10vw] sm:w-10 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[li0]} bottom={VIRTUES[li1]} side="left" />
      </div>

      {/* Right border – two virtues */}
      <div className="fixed top-0 right-0 h-screen w-[10vw] sm:w-10 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[ri0]} bottom={VIRTUES[ri1]} side="right" />
      </div>
    </>
  )
}
