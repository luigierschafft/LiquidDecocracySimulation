'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DiscussionNode } from '@/lib/types/ev'

// ─── Tree building ────────────────────────────────────────────────────────────

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

// ─── Color helpers ────────────────────────────────────────────────────────────

function proColor(avg: number): string {
  const t = avg / 10
  const r = Math.round(187 + (21 - 187) * t)
  const g = Math.round(247 + (128 - 247) * t)
  const b = Math.round(208 + (61 - 208) * t)
  return `rgb(${r},${g},${b})`
}

function contraColor(avg: number): string {
  const t = avg / 10
  const r = Math.round(254 + (185 - 254) * t)
  const g = Math.round(202 + (28 - 202) * t)
  const b = Math.round(202 + (28 - 202) * t)
  return `rgb(${r},${g},${b})`
}

// ─── Convert to sunburst data format ─────────────────────────────────────────

interface SunNode {
  name: string
  nodeId: string | null
  nodeType: 'root' | 'pro' | 'contra'
  avgRating: number
  value: number
  children?: SunNode[]
}

function toSunNode(node: DiscussionNode, avgMap: Map<string, number>): SunNode {
  const children = (node.children ?? []).filter(
    (c) => c.type === 'pro' || c.type === 'contra'
  )
  return {
    name: node.text,
    nodeId: node.id,
    nodeType: node.type as 'pro' | 'contra',
    avgRating: avgMap.get(node.id) ?? 5,
    value: 1,
    children: children.length > 0 ? children.map((c) => toSunNode(c, avgMap)) : undefined,
  }
}

function toSunData(statementText: string, tree: DiscussionNode[], avgMap: Map<string, number>): SunNode {
  const pros = tree.filter((n) => n.type === 'pro')
  const contras = tree.filter((n) => n.type === 'contra')
  return {
    name: statementText,
    nodeId: null,
    nodeType: 'root',
    avgRating: 5,
    value: 1,
    children: [...pros, ...contras].map((n) => toSunNode(n, avgMap)),
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  statementId: string
  statementText: string
  userId: string | null
  onNodeClick?: (nodeId: string) => void
}

export function SunView({ statementId, statementText, userId, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [tree, setTree] = useState<DiscussionNode[]>([])
  const [avgMap, setAvgMap] = useState<Map<string, number>>(new Map())

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data: nodes } = await supabase
      .from('ev_discussion_nodes')
      .select('*, author:member(display_name, email)')
      .eq('statement_id', statementId)
      .order('created_at', { ascending: true })

    const nodeIds = (nodes ?? []).map((n: any) => n.id)
    const map = new Map<string, number>()

    if (nodeIds.length > 0) {
      const { data: ratings } = await supabase
        .from('ev_argument_ratings')
        .select('node_id, rating')
        .in('node_id', nodeIds)

      // group by node_id and compute average
      const groups = new Map<string, number[]>()
      for (const r of ratings ?? []) {
        const arr = groups.get(r.node_id) ?? []
        arr.push(r.rating)
        groups.set(r.node_id, arr)
      }
      groups.forEach((vals, id) => {
        map.set(id, vals.reduce((s, v) => s + v, 0) / vals.length)
      })
    }

    setAvgMap(map)
    setTree(buildTree(nodes ?? []))
    setDataLoaded(true)
  }, [statementId])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (!dataLoaded || !containerRef.current) return

    const container = containerRef.current
    const w = container.clientWidth || 520

    async function initChart() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sunburst = ((await import('sunburst-chart')) as any).default

      const sunData = toSunData(statementText, tree, avgMap)

      if (chartRef.current) {
        chartRef.current.data(sunData)
        return
      }

      const chart = Sunburst()

      chart
        .data(sunData)
        .width(w)
        .height(w)
        .color((node: any) => {
          const t = node.nodeType ?? node.__dataNode?.data?.nodeType
          const avg: number = node.avgRating ?? node.__dataNode?.data?.avgRating ?? 5
          if (t === 'root') return '#a855f7'
          if (t === 'pro')  return proColor(avg)
          return contraColor(avg)
        })
        .strokeColor(() => 'white')
        .label((node: any) => {
          const txt: string = node.name ?? ''
          const isRoot = (node.nodeType ?? node.__dataNode?.data?.nodeType) === 'root'
          if (isRoot) return txt
          return txt.length > 50 ? txt.slice(0, 49) + '…' : txt
        })
        .size('value')
        .centerRadius(0.38)
        .radiusScaleExponent(0.55)
        .transitionDuration(450)
        .onClick((node: any) => {
          const id: string | null = node.nodeId ?? node.__dataNode?.data?.nodeId ?? null
          if (id && onNodeClick) onNodeClick(id)
        })
        .tooltipContent((node: any) => {
          const t = node.nodeType
          if (t === 'root') return ''
          const avg: number = node.avgRating ?? 5
          const badge = t === 'pro'
            ? '<span style="color:#22c55e;font-weight:700">PRO</span>'
            : '<span style="color:#ef4444;font-weight:700">CONTRA</span>'
          return `${badge} — ${node.name} (avg: ${avg.toFixed(1)})`
        })

      chart(container)
      chartRef.current = chart

      // Override text rendering: white fill, no contour stroke
      if (!document.getElementById('sunburst-text-style')) {
        const style = document.createElement('style')
        style.id = 'sunburst-text-style'
        style.textContent = `
          .sunburst-viz .text-stroke { fill: white !important; }
          .sunburst-viz .text-contour { stroke: none !important; }
        `
        document.head.appendChild(style)
      }
    }

    initChart()
  }, [dataLoaded, tree, statementText, avgMap])

  return (
    <div>
      {!dataLoaded && (
        <div className="text-xs text-gray-400 py-6 text-center">Loading…</div>
      )}
      <div
        ref={containerRef}
        className={dataLoaded ? 'block' : 'hidden'}
        style={{ borderRadius: '12px', overflow: 'hidden' }}
      />
      {dataLoaded && tree.length === 0 && (
        <p className="text-xs text-gray-400 text-center pb-2">
          No arguments yet — switch to Split view to add some.
        </p>
      )}
    </div>
  )
}
