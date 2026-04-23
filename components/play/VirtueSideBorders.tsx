'use client'

import { useState, useEffect } from 'react'

const VIRTUES = [
  { name: 'Sincerity',    color: '#64B5F6', light: true  },
  { name: 'Humility',     color: '#66BB6A', light: false },
  { name: 'Gratitude',    color: '#A5D6A7', light: true  },
  { name: 'Perseverance', color: '#FFEE58', light: true  },
  { name: 'Aspiration',   color: '#FFCA28', light: true  },
  { name: 'Receptivity',  color: '#FFA726', light: false },
  { name: 'Progress',     color: '#4DD0E1', light: true  },
  { name: 'Courage',      color: '#EF5350', light: false },
  { name: 'Goodness',     color: '#EC407A', light: false },
  { name: 'Generosity',   color: '#AB47BC', light: false },
  { name: 'Equality',     color: '#5C6BC0', light: false },
  { name: 'Peace',        color: '#42A5F5', light: false },
]

function randomFour(): [number, number, number, number] {
  const arr = Array.from({ length: VIRTUES.length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return [arr[0], arr[1], arr[2], arr[3]]
}

// ── Left sidebar — divider at y≈50 (screen middle), big waves on inner edge ──
// Seam guarantee: last curve of LT reversed = first curve of LB

const LT = `M 0 0
  L 52 0
  C 100 0, 106 14, 78 22
  C 50 30, 104 40, 70 47
  C 46 52, 24 54, 0 55
  Z`

const LB = `M 0 55
  C 24 54, 46 52, 70 47
  C 104 58, 72 68, 88 76
  C 100 84, 68 94, 80 100
  C 53 100, 27 100, 0 100
  Z`

// ── Right sidebar — exact mirror (x → 100 - x) ──
const RT = `M 100 0
  L 48 0
  C 0 0, -6 14, 22 22
  C 50 30, -4 40, 30 47
  C 54 52, 76 54, 100 55
  Z`

const RB = `M 100 55
  C 76 54, 54 52, 30 47
  C -4 58, 28 68, 12 76
  C 0 84, 32 94, 20 100
  C 47 100, 73 100, 100 100
  Z`

type Virtue = (typeof VIRTUES)[number]

function Sidebar({ top, bottom, side }: { top: Virtue; bottom: Virtue; side: 'left' | 'right' }) {
  const pathTop    = side === 'left' ? LT : RT
  const pathBottom = side === 'left' ? LB : RB
  const rotate     = side === 'left' ? '-90deg' : '90deg'

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full block"
      >
        <path d={pathTop}    fill={top.color}    />
        <path d={pathBottom} fill={bottom.color} />
      </svg>

      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span style={{
            transform: `rotate(${rotate})`,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(5px, 1.8vw, 7px)',
            fontWeight: 800,
            color: top.light ? 'rgba(0,0,0,0.7)' : '#fff',
            letterSpacing: '0.05em',
            textShadow: top.light ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            {top.name}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <span style={{
            transform: `rotate(${rotate})`,
            whiteSpace: 'nowrap',
            fontSize: 'clamp(5px, 1.8vw, 7px)',
            fontWeight: 800,
            color: bottom.light ? 'rgba(0,0,0,0.7)' : '#fff',
            letterSpacing: '0.05em',
            textShadow: bottom.light ? 'none' : '0 1px 3px rgba(0,0,0,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            {bottom.name}
          </span>
        </div>
      </div>
    </div>
  )
}

export function VirtueSideBorders() {
  const [quad, setQuad] = useState<[number, number, number, number] | null>(null)

  useEffect(() => { setQuad(randomFour()) }, [])

  if (!quad) return null

  const [li0, li1, ri0, ri1] = quad

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-[10vw] sm:w-10 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[li0]} bottom={VIRTUES[li1]} side="left" />
      </div>
      <div className="fixed top-0 right-0 h-screen w-[10vw] sm:w-10 z-40 pointer-events-none">
        <Sidebar top={VIRTUES[ri0]} bottom={VIRTUES[ri1]} side="right" />
      </div>
    </>
  )
}
