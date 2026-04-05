'use client'

import { useMemo, useState } from 'react'
import { getMemberDisplayName } from '@/lib/utils'

interface Member {
  id: string
  display_name: string | null
  email: string
}

interface DelegationEdge {
  from_member: Member | null
  to_member: Member | null
  from_member_id: string
  to_member_id: string
}

interface Props {
  delegations: DelegationEdge[]
  currentUserId: string | null
}

const W = 560
const H = 400
const NODE_R = 22

function layoutNodes(members: Member[]) {
  const n = members.length
  if (n === 0) return new Map<string, { x: number; y: number }>()

  const map = new Map<string, { x: number; y: number }>()
  const cx = W / 2
  const cy = H / 2
  const r = Math.min(cx, cy) - NODE_R - 16

  if (n === 1) {
    map.set(members[0].id, { x: cx, y: cy })
    return map
  }

  members.forEach((m, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    map.set(m.id, {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    })
  })
  return map
}

function CurvedArrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return null

  // Offset start/end to edge of circle
  const ux = dx / len
  const uy = dy / len
  const sx = x1 + ux * NODE_R
  const sy = y1 + uy * NODE_R
  const ex = x2 - ux * (NODE_R + 4)
  const ey = y2 - uy * (NODE_R + 4)

  // Slight curve
  const mx = (sx + ex) / 2 - uy * 30
  const my = (sy + ey) / 2 + ux * 30

  const id = `arrow-${color.replace('#', '')}`
  return (
    <>
      <defs>
        <marker id={id} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>
      <path
        d={`M ${sx},${sy} Q ${mx},${my} ${ex},${ey}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity="0.6"
        markerEnd={`url(#${id})`}
      />
    </>
  )
}

export function DelegationGraph({ delegations, currentUserId }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  // Collect unique members
  const membersMap = useMemo(() => {
    const map = new Map<string, Member>()
    for (const d of delegations) {
      if (d.from_member) map.set(d.from_member_id, d.from_member)
      if (d.to_member) map.set(d.to_member_id, d.to_member)
    }
    return map
  }, [delegations])

  const members = useMemo(() => {
    // Sort: highest in-degree (most delegations received) first
    const inDegree = new Map<string, number>()
    for (const d of delegations) {
      inDegree.set(d.to_member_id, (inDegree.get(d.to_member_id) ?? 0) + 1)
    }
    return Array.from(membersMap.values()).sort(
      (a, b) => (inDegree.get(b.id) ?? 0) - (inDegree.get(a.id) ?? 0)
    )
  }, [membersMap, delegations])

  const positions = useMemo(() => layoutNodes(members), [members])

  if (delegations.length === 0) return null

  // Delegation weight per delegate
  const inDegree = new Map<string, number>()
  for (const d of delegations) {
    inDegree.set(d.to_member_id, (inDegree.get(d.to_member_id) ?? 0) + 1)
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-sand flex items-center justify-between">
        <p className="text-sm font-semibold">Network Graph</p>
        <p className="text-xs text-foreground/40">{members.length} members · {delegations.length} delegations</p>
      </div>
      <div className="overflow-x-auto">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 320, maxWidth: '100%' }}
        >
          {/* Edges */}
          {delegations.map((d, i) => {
            const from = positions.get(d.from_member_id)
            const to = positions.get(d.to_member_id)
            if (!from || !to) return null
            const isHighlighted = hovered === d.from_member_id || hovered === d.to_member_id
            const isCurrentUser = d.from_member_id === currentUserId || d.to_member_id === currentUserId
            const color = isCurrentUser ? '#6c7a52' : '#9ca3af'
            return (
              <g key={i} style={{ opacity: hovered && !isHighlighted ? 0.15 : 1, transition: 'opacity 0.15s' }}>
                <CurvedArrow x1={from.x} y1={from.y} x2={to.x} y2={to.y} color={color} />
              </g>
            )
          })}

          {/* Nodes */}
          {members.map((m) => {
            const pos = positions.get(m.id)
            if (!pos) return null
            const isCurrent = m.id === currentUserId
            const isHovered = hovered === m.id
            const degree = inDegree.get(m.id) ?? 0
            const r = NODE_R + (degree > 0 ? Math.min(degree * 3, 10) : 0)
            const name = getMemberDisplayName(m)

            return (
              <g
                key={m.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={r}
                  fill={isCurrent ? '#6c7a52' : isHovered ? '#c8b9a2' : '#e8e0d8'}
                  stroke={isCurrent ? '#4a5538' : isHovered ? '#9ca3af' : '#d1c9c0'}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={isCurrent ? 11 : 10}
                  fontWeight="700"
                  fill={isCurrent ? 'white' : '#4b5563'}
                >
                  {name[0]?.toUpperCase()}
                </text>
                {/* Name label below */}
                <text
                  textAnchor="middle"
                  y={r + 12}
                  fontSize="9"
                  fill={isCurrent ? '#4a5538' : '#6b7280'}
                  fontWeight={isCurrent ? '600' : '400'}
                >
                  {name.length > 10 ? name.slice(0, 9) + '…' : name}
                </text>
                {degree > 0 && (
                  <text
                    textAnchor="middle"
                    y={r + 22}
                    fontSize="8"
                    fill="#9ca3af"
                  >
                    +{degree} vote{degree !== 1 ? 's' : ''}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div className="px-4 py-2 border-t border-sand flex items-center gap-4 text-[11px] text-foreground/40">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-accent inline-block" /> You
        </span>
        <span>→ arrow = delegation direction</span>
        <span>Larger circle = more delegations received</span>
      </div>
    </div>
  )
}
