'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion } from '@/lib/types'
import { getMemberDisplayName } from '@/lib/utils'
import { ThumbsUp, ThumbsDown, Send, X, Loader2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ArgNode {
  id: string
  content: string
  intent: 'support' | 'concern'
  parent_id: string | null
  author: { display_name: string | null; email: string } | null
  children: ArgNode[]
}

interface LayoutNode extends ArgNode {
  x: number
  y: number
  depth: number
  angleStart: number
  angleEnd: number
}

interface Props {
  issueId: string
  userId: string | null
  initialOpinions: Opinion[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOT_R = 36
const NODE_R = 22
const DEPTH_STEP = 115
const MIN_SECTOR = (5 * Math.PI) / 180 // 5° minimum sector per node

// ─── Color helpers ────────────────────────────────────────────────────────────

function nodeColor(intent: 'support' | 'concern' | null, depth: number, selected: boolean): string {
  if (!intent) return selected ? '#6c7a52' : '#c8b9a2'
  const t = Math.min(depth - 1, 4) / 4 // 0 → 1 as depth increases
  if (intent === 'support') {
    // green: deep → light
    const l = Math.round(38 + t * 28)
    return selected ? `hsl(142,65%,${l - 6}%)` : `hsl(142,55%,${l}%)`
  } else {
    const l = Math.round(48 + t * 22)
    return selected ? `hsl(0,72%,${l - 6}%)` : `hsl(0,65%,${l}%)`
  }
}

function textColor(intent: 'support' | 'concern' | null, depth: number): string {
  if (!intent) return '#fff'
  const t = Math.min(depth - 1, 4) / 4
  if (intent === 'support') return t > 0.5 ? '#14532d' : '#fff'
  return t > 0.5 ? '#7f1d1d' : '#fff'
}

// ─── Tree builder ─────────────────────────────────────────────────────────────

function buildTree(opinions: Opinion[]): ArgNode[] {
  const args = opinions.filter(
    (o) => o.intent === 'support' || o.intent === 'concern'
  ) as (Opinion & { intent: 'support' | 'concern' })[]

  const map = new Map<string, ArgNode>()
  for (const o of args) {
    map.set(o.id, {
      id: o.id,
      content: o.content,
      intent: o.intent,
      parent_id: o.parent_id ?? null,
      author: (o.author as any) ?? null,
      children: [],
    })
  }

  const roots: ArgNode[] = []
  for (const [, node] of Array.from(map.entries())) {
    if (!node.parent_id || !map.has(node.parent_id)) {
      roots.push(node)
    } else {
      map.get(node.parent_id)!.children.push(node)
    }
  }
  return roots
}

// ─── Layout ──────────────────────────────────────────────────────────────────

function subtreeSize(node: ArgNode): number {
  if (node.children.length === 0) return 1
  return node.children.reduce((s, c) => s + subtreeSize(c), 0)
}

function computeLayout(roots: ArgNode[]): { nodes: LayoutNode[]; edges: { x1: number; y1: number; x2: number; y2: number }[] } {
  const nodes: LayoutNode[] = []
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = []

  function place(
    node: ArgNode,
    depth: number,
    angleStart: number,
    angleEnd: number
  ) {
    const angle = (angleStart + angleEnd) / 2
    const r = depth * DEPTH_STEP
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)

    nodes.push({ ...node, x, y, depth, angleStart, angleEnd })

    if (node.children.length > 0) {
      const totalSize = node.children.reduce((s, c) => s + subtreeSize(c), 0)
      const range = angleEnd - angleStart
      const usable = Math.max(range, node.children.length * MIN_SECTOR)
      let cursor = angleStart + (range - usable) / 2

      for (const child of node.children) {
        const share = (subtreeSize(child) / totalSize) * usable
        const childAngleStart = cursor
        const childAngleEnd = cursor + Math.max(share, MIN_SECTOR)
        const childAngle = (childAngleStart + childAngleEnd) / 2
        const childR = (depth + 1) * DEPTH_STEP
        const px = r * Math.cos(angle)
        const py = r * Math.sin(angle)
        const cx2 = childR * Math.cos(childAngle)
        const cy2 = childR * Math.sin(childAngle)
        edges.push({ x1: px, y1: py, x2: cx2, y2: cy2 })
        place(child, depth + 1, childAngleStart, childAngleEnd)
        cursor = childAngleEnd
      }
    }
  }

  if (roots.length === 0) return { nodes, edges }

  const totalSize = roots.reduce((s, r) => s + subtreeSize(r), 0)
  const fullAngle = 2 * Math.PI
  let cursor = -Math.PI / 2

  for (const root of roots) {
    const share = (subtreeSize(root) / totalSize) * fullAngle
    const childAngle = cursor + share / 2
    const r = DEPTH_STEP
    edges.push({ x1: 0, y1: 0, x2: r * Math.cos(childAngle), y2: r * Math.sin(childAngle) })
    place(root, 1, cursor, cursor + share)
    cursor += share
  }

  return { nodes, edges }
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ArgumentMap({ issueId, userId, initialOpinions }: Props) {
  const [opinions, setOpinions] = useState<Opinion[]>(initialOpinions)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addingSide, setAddingSide] = useState<'support' | 'concern' | null>(null)
  const [addText, setAddText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  const tree = useMemo(() => buildTree(opinions), [opinions])
  const { nodes, edges } = useMemo(() => computeLayout(tree), [tree])

  // Canvas bounds
  const padding = 60
  const allX = nodes.map((n) => n.x).concat([0])
  const allY = nodes.map((n) => n.y).concat([0])
  const minX = Math.min(...allX) - NODE_R - padding
  const maxX = Math.max(...allX) + NODE_R + padding
  const minY = Math.min(...allY) - NODE_R - padding
  const maxY = Math.max(...allY) + NODE_R + padding
  const vw = maxX - minX
  const vh = maxY - minY

  const selected = nodes.find((n) => n.id === selectedId) ?? null

  async function addArgument() {
    if (!addText.trim() || !userId || !addingSide) return
    setSubmitting(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({
        issue_id: issueId,
        author_id: userId,
        content: addText.trim(),
        intent: addingSide,
        parent_id: selectedId,
      })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, data as unknown as Opinion])
      setAddText('')
      setAddingSide(null)
    }
    setSubmitting(false)
  }

  const rootLabel = 'Topic'

  return (
    <div className="space-y-3">
      {/* Instructions */}
      <p className="text-xs text-foreground/40">
        Click any argument to respond. Green = Pro · Red = Contra
      </p>

      {/* SVG Map */}
      <div className="overflow-auto rounded-xl border border-sand bg-[#faf9f7]" style={{ maxHeight: 600 }}>
        <svg
          width={Math.max(vw, 320)}
          height={Math.max(vh, 320)}
          viewBox={`${minX} ${minY} ${vw} ${vh}`}
          style={{ display: 'block', margin: '0 auto' }}
        >
          {/* Edges */}
          {edges.map((e, i) => {
            const mx = (e.x1 + e.x2) / 2
            const my = (e.y1 + e.y2) / 2
            return (
              <path
                key={i}
                d={`M ${e.x1},${e.y1} Q ${mx},${my} ${e.x2},${e.y2}`}
                fill="none"
                stroke="#d1c9c0"
                strokeWidth="1.5"
              />
            )
          })}

          {/* Root node */}
          <g style={{ cursor: 'pointer' }} onClick={() => { setSelectedId(null); setAddingSide(null) }}>
            <circle cx={0} cy={0} r={ROOT_R} fill="#6c7a52" />
            <text textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="white">
              {rootLabel}
            </text>
          </g>

          {/* Argument nodes */}
          {nodes.map((n) => {
            const isSelected = selectedId === n.id
            const fill = nodeColor(n.intent, n.depth, isSelected)
            const tc = textColor(n.intent, n.depth)
            const words = n.content.split(' ').slice(0, 3).join(' ')
            const label = words + (n.content.split(' ').length > 3 ? '…' : '')

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); setSelectedId(n.id); setAddingSide(null); setAddText('') }}
              >
                <circle
                  r={NODE_R + (isSelected ? 4 : 0)}
                  fill={fill}
                  stroke={isSelected ? '#fff' : 'transparent'}
                  strokeWidth={isSelected ? 2 : 0}
                  style={{ transition: 'r 0.15s, fill 0.15s' }}
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7.5"
                  fontWeight="600"
                  fill={tc}
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected node panel */}
      {selected && (
        <div className={`rounded-xl border p-4 space-y-3 ${
          selected.intent === 'support'
            ? 'border-green-200 bg-green-50/50'
            : 'border-red-200 bg-red-50/50'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                {selected.intent === 'support'
                  ? <ThumbsUp className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  : <ThumbsDown className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                }
                <span className="text-xs text-foreground/40">
                  {getMemberDisplayName(selected.author)}
                </span>
              </div>
              <p className="text-sm text-foreground/85 leading-snug">{selected.content}</p>
            </div>
            <button onClick={() => { setSelectedId(null); setAddingSide(null) }} className="text-foreground/30 hover:text-foreground transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {userId && (
            <div className="space-y-2 border-t border-inherit pt-3">
              <p className="text-xs text-foreground/50 font-medium">Respond to this argument:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setAddingSide(addingSide === 'support' ? null : 'support')}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    addingSide === 'support'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'text-green-700 border-green-300 hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" /> Pro
                </button>
                <button
                  onClick={() => setAddingSide(addingSide === 'concern' ? null : 'concern')}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    addingSide === 'concern'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'text-red-600 border-red-300 hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="w-3 h-3" /> Contra
                </button>
              </div>

              {addingSide && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={addText}
                    onChange={(e) => setAddText(e.target.value)}
                    placeholder={addingSide === 'support' ? 'Supporting argument…' : 'Counter argument…'}
                    className="input flex-1 text-sm py-1.5"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addArgument() }
                      if (e.key === 'Escape') setAddingSide(null)
                    }}
                  />
                  <button
                    onClick={addArgument}
                    disabled={submitting || !addText.trim()}
                    className="btn-primary px-3 py-1.5"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Add top-level argument (when nothing selected) */}
      {!selected && userId && (
        <div className="rounded-xl border border-sand p-3 space-y-2">
          <p className="text-xs text-foreground/50 font-medium">Add argument to the topic:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setAddingSide(addingSide === 'support' ? null : 'support')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                addingSide === 'support'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'text-green-700 border-green-300 hover:bg-green-50'
              }`}
            >
              <ThumbsUp className="w-3 h-3" /> Pro
            </button>
            <button
              onClick={() => setAddingSide(addingSide === 'concern' ? null : 'concern')}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                addingSide === 'concern'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'text-red-600 border-red-300 hover:bg-red-50'
              }`}
            >
              <ThumbsDown className="w-3 h-3" /> Contra
            </button>
          </div>
          {addingSide && (
            <div className="flex gap-2">
              <input
                type="text"
                value={addText}
                onChange={(e) => setAddText(e.target.value)}
                placeholder={addingSide === 'support' ? 'Your pro argument…' : 'Your contra argument…'}
                className="input flex-1 text-sm py-1.5"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addArgument() }
                  if (e.key === 'Escape') setAddingSide(null)
                }}
              />
              <button
                onClick={addArgument}
                disabled={submitting || !addText.trim()}
                className="btn-primary px-3 py-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
