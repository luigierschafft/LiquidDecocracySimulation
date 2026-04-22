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

// ─── Convert to sunburst data format ─────────────────────────────────────────

interface SunNode {
  name: string
  nodeType: 'root' | 'pro' | 'contra'
  value: number
  children?: SunNode[]
}

function toSunNode(node: DiscussionNode): SunNode {
  const children = (node.children ?? []).filter(
    (c) => c.type === 'pro' || c.type === 'contra'
  )
  return {
    name: node.text,
    nodeType: node.type as 'pro' | 'contra',
    value: 1,
    children: children.length > 0 ? children.map(toSunNode) : undefined,
  }
}

function toSunData(statementText: string, tree: DiscussionNode[]): SunNode {
  const pros = tree.filter((n) => n.type === 'pro')
  const contras = tree.filter((n) => n.type === 'contra')
  return {
    name: statementText,
    nodeType: 'root',
    value: 1,
    children: [...pros, ...contras].map(toSunNode),
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  statementId: string
  statementText: string
  userId: string | null
}

export function SunView({ statementId, statementText, userId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [tree, setTree] = useState<DiscussionNode[]>([])

  const loadData = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .select('*, author:member(display_name, email)')
      .eq('statement_id', statementId)
      .order('created_at', { ascending: true })
    setTree(buildTree(data ?? []))
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

      const sunData = toSunData(statementText, tree)

      if (chartRef.current) {
        // Already mounted — just update data
        chartRef.current.data(sunData)
        return
      }

      const chart = Sunburst()

      chart
        .data(sunData)
        .width(w)
        .height(w) // square — looks best for sunburst
        .color((node: any) => {
          const t = node.nodeType ?? node.__dataNode?.data?.nodeType
          if (t === 'root') return '#a855f7'
          if (t === 'pro')  return '#22c55e'
          return '#ef4444'
        })
        .strokeColor(() => 'white')
        .label((node: any) => {
          const txt: string = node.name ?? ''
          return txt.length > 28 ? txt.slice(0, 27) + '…' : txt
        })
        .size('value')
        .centerRadius(0.22)
        .radiusScaleExponent(0.55)
        .transitionDuration(450)
        .tooltipContent((node: any) => {
          const t = node.nodeType
          if (t === 'root') return ''
          const badge = t === 'pro'
            ? '<span style="color:#22c55e;font-weight:700">PRO</span>'
            : '<span style="color:#ef4444;font-weight:700">CONTRA</span>'
          return `${badge} — ${node.name}`
        })

      chart(container)
      chartRef.current = chart
    }

    initChart()
  }, [dataLoaded, tree, statementText])

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
