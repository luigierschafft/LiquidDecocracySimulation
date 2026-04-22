'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DiscussionNode } from '@/lib/types/ev'

// ─── Constants ────────────────────────────────────────────────────────────────

const CX = 350
const CY = 240
const NODE_W = 110
const NODE_H = 46
const CENTER_W = 150
const CENTER_H = 66
const LINE_H = 12

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildTree(nodes: DiscussionNode[]): DiscussionNode[] {
  const filtered = nodes.filter((n) => n.type === 'pro' || n.type === 'contra')
  const map = new Map<string, DiscussionNode>()
  filtered.forEach((n) => map.set(n.id, { ...n, children: [] }))
  const roots: DiscussionNode[] = []
  map.forEach((node) => {
    if (!node.parent_id) {
      roots.push(node)
    } else if (map.has(node.parent_id)) {
      map.get(node.parent_id)!.children!.push(node)
    }
  })
  return roots
}

/** Wrap text into lines of max maxChars, up to maxLines */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    if (lines.length >= maxLines) break
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > maxChars) {
      if (cur) { lines.push(cur); cur = w.slice(0, maxChars) }
      else { lines.push(w.slice(0, maxChars - 1) + '…'); cur = '' }
    } else {
      cur = candidate
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur)
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1]
    if (last.length >= maxChars - 1) lines[maxLines - 1] = last.slice(0, maxChars - 2) + '…'
  }
  return lines
}

/** Calculate (x,y) positions for a set of nodes placed in a circle arc */
function positions(
  nodes: DiscussionNode[],
  centerDeg: number,
): { node: DiscussionNode; x: number; y: number }[] {
  if (nodes.length === 0) return []
  const spread = nodes.length === 1 ? 0 : Math.min(160, nodes.length * 48)
  const R = Math.max(200, nodes.length * 60)
  return nodes.map((node, i) => {
    const deg =
      nodes.length === 1
        ? centerDeg
        : centerDeg - spread / 2 + (spread / (nodes.length - 1)) * i
    const rad = (deg * Math.PI) / 180
    return { node, x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
  })
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface FocusLevel {
  id: string | null
  text: string
  pros: DiscussionNode[]
  contras: DiscussionNode[]
}

interface Props {
  statementId: string
  statementText: string
  userId: string | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SunView({ statementId, statementText, userId }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [stack, setStack] = useState<FocusLevel[]>([])

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .select('*, author:member(display_name, email)')
      .eq('statement_id', statementId)
      .order('created_at', { ascending: true })
    const tree = buildTree(data ?? [])
    setStack([{
      id: null,
      text: statementText,
      pros: tree.filter((n) => n.type === 'pro'),
      contras: tree.filter((n) => n.type === 'contra'),
    }])
    setLoaded(true)
  }, [statementId, statementText])

  if (!loaded) {
    load()
    return <div className="text-xs text-gray-400 py-6 text-center">Loading…</div>
  }

  const current = stack[stack.length - 1]
  const proPos = positions(current.pros, 180)
  const contraPos = positions(current.contras, 0)
  const all = [...proPos, ...contraPos]

  // Dynamic viewBox so everything fits
  const pad = 24
  const xs = all.map((p) => p.x)
  const ys = all.map((p) => p.y)
  const minX = (all.length > 0 ? Math.min(CX - CENTER_W / 2, ...xs.map((x) => x - NODE_W / 2)) : CX - CENTER_W / 2) - pad
  const minY = (all.length > 0 ? Math.min(CY - CENTER_H / 2, ...ys.map((y) => y - NODE_H / 2 - 12)) : CY - CENTER_H / 2) - pad
  const maxX = (all.length > 0 ? Math.max(CX + CENTER_W / 2, ...xs.map((x) => x + NODE_W / 2)) : CX + CENTER_W / 2) + pad
  const maxY = (all.length > 0 ? Math.max(CY + CENTER_H / 2, ...ys.map((y) => y + NODE_H / 2)) : CY + CENTER_H / 2) + pad
  const vw = maxX - minX
  const vh = maxY - minY

  function drillDown(node: DiscussionNode) {
    const ch = node.children ?? []
    setStack((prev) => [
      ...prev,
      { id: node.id, text: node.text, pros: ch.filter((n) => n.type === 'pro'), contras: ch.filter((n) => n.type === 'contra') },
    ])
  }

  const centerLines = wrap(current.text, 17, 3)

  return (
    <div className="relative">
      {/* Breadcrumb */}
      {stack.length > 1 && (
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setStack((p) => p.slice(0, -1))}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg px-2.5 py-1 transition-colors shrink-0"
          >
            ← Back
          </button>
          <div className="flex items-center gap-1 overflow-hidden">
            {stack.map((s, i) => (
              <span key={i} className="flex items-center gap-1 shrink-0">
                {i > 0 && <span className="text-gray-300 text-xs">›</span>}
                <span
                  className={`text-xs truncate max-w-[100px] ${
                    i === stack.length - 1 ? 'text-purple-700 font-medium' : 'text-gray-400'
                  }`}
                >
                  {s.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <svg
        viewBox={`${minX} ${minY} ${vw} ${vh}`}
        className="w-full"
        style={{ maxHeight: 460 }}
      >
        {/* Lines */}
        {all.map(({ node, x, y }) => (
          <line
            key={`l-${node.id}`}
            x1={CX} y1={CY} x2={x} y2={y}
            stroke={node.type === 'pro' ? '#86efac' : '#fca5a5'}
            strokeWidth={1.5}
          />
        ))}

        {/* Center node */}
        <rect
          x={CX - CENTER_W / 2} y={CY - CENTER_H / 2}
          width={CENTER_W} height={CENTER_H}
          rx={12} fill="#faf5ff" stroke="#a855f7" strokeWidth={2}
        />
        {centerLines.map((line, i) => (
          <text
            key={i}
            x={CX}
            y={CY + (i - (centerLines.length - 1) / 2) * LINE_H}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={10} fill="#7c3aed" fontWeight="600"
          >
            {line}
          </text>
        ))}

        {/* Argument nodes */}
        {all.map(({ node, x, y }) => {
          const isPro = node.type === 'pro'
          const fill = isPro ? '#f0fdf4' : '#fff1f2'
          const stroke = isPro ? '#4ade80' : '#f87171'
          const textCol = isPro ? '#166534' : '#991b1b'
          const badgeBg = isPro ? '#22c55e' : '#ef4444'
          const label = isPro ? 'PRO' : 'CONTRA'
          const ch = node.children ?? []
          const lines = wrap(node.text, 13, 2)

          return (
            <g
              key={node.id}
              onClick={() => ch.length > 0 && drillDown(node)}
              style={{ cursor: ch.length > 0 ? 'pointer' : 'default' }}
            >
              {/* Shadow */}
              <rect
                x={x - NODE_W / 2 + 1} y={y - NODE_H / 2 + 2}
                width={NODE_W} height={NODE_H}
                rx={8} fill="rgba(0,0,0,0.07)"
              />
              {/* Card */}
              <rect
                x={x - NODE_W / 2} y={y - NODE_H / 2}
                width={NODE_W} height={NODE_H}
                rx={8} fill={fill} stroke={stroke}
                strokeWidth={ch.length > 0 ? 2 : 1.5}
              />
              {/* Type badge */}
              <rect
                x={x - NODE_W / 2 + 5} y={y - NODE_H / 2 - 10}
                width={label.length * 5.8 + 10} height={15}
                rx={4} fill={badgeBg}
              />
              <text
                x={x - NODE_W / 2 + 5 + (label.length * 5.8 + 10) / 2}
                y={y - NODE_H / 2 - 3}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={7.5} fill="white" fontWeight="700"
              >
                {label}
              </text>
              {/* Text */}
              {lines.map((line, i) => (
                <text
                  key={i}
                  x={x}
                  y={y + (i - (lines.length - 1) / 2) * LINE_H}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fill={textCol}
                >
                  {line}
                </text>
              ))}
              {/* Children count badge */}
              {ch.length > 0 && (
                <g>
                  <circle cx={x + NODE_W / 2 - 8} cy={y - NODE_H / 2 + 8} r={9} fill={stroke} />
                  <text
                    x={x + NODE_W / 2 - 8} y={y - NODE_H / 2 + 8}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={8} fill="white" fontWeight="700"
                  >
                    {ch.length}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {/* Empty state */}
        {all.length === 0 && (
          <text x={CX} y={CY + 90} textAnchor="middle" fontSize={11} fill="#9ca3af">
            No arguments yet — switch to Split view to add some
          </text>
        )}
      </svg>
    </div>
  )
}
