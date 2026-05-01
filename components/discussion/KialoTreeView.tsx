'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DiscussionNode } from '@/lib/types/ev'
import { Plus } from 'lucide-react'

// ─── Rating scale ─────────────────────────────────────────────────────────────

function interpolateColor(t: number): string {
  const r = Math.round(255 + (124 - 255) * t)
  const g = Math.round(255 + (58 - 255) * t)
  const b = Math.round(255 + (237 - 255) * t)
  return `rgb(${r},${g},${b})`
}

function MiniScale({ nodeId, userId }: { nodeId: string; userId: string | null }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!userId || initialized) return
    const supabase = createClient()
    supabase
      .from('ev_argument_ratings')
      .select('rating')
      .eq('node_id', nodeId)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSelected(data.rating)
        setInitialized(true)
      })
  }, [nodeId, userId, initialized])

  async function handleClick(val: number) {
    if (loading || !userId) return
    const next = val === selected ? null : val
    setSelected(next)
    setLoading(true)
    if (next === null) {
      // Toggle off — clear rating directly (no delegation needed for removal)
      const supabase = createClient()
      await supabase.from('ev_argument_ratings').delete().eq('node_id', nodeId).eq('user_id', userId)
    } else {
      // Apply rating with liquid democracy proxy propagation
      await fetch('/api/vote/argument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_id: nodeId, rating: next }),
      })
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-0.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
      {Array.from({ length: 11 }, (_, i) => i).map((val) => (
        <button
          key={val}
          onClick={() => handleClick(val)}
          title={`${val}/10`}
          disabled={loading}
          style={{ backgroundColor: interpolateColor(val / 10) }}
          className={`w-3.5 h-3.5 rounded-sm transition-all border flex items-center justify-center ${
            selected === val ? 'border-purple-700 scale-110' : 'border-transparent hover:border-purple-400'
          }`}
        >
          {selected === val && (
            <span className={`text-[8px] font-bold leading-none ${val >= 6 ? 'text-white' : 'text-purple-900'}`}>{val}</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Argument card (click to navigate into) ───────────────────────────────────

interface CardProps {
  node: DiscussionNode
  userId: string | null
  onNavigate: (node: DiscussionNode) => void
}

function KialoCard({ node, userId, onNavigate }: CardProps) {
  const children = node.children ?? []
  const proCount = children.filter((c) => c.type === 'pro').length
  const contraCount = children.filter((c) => c.type === 'contra').length
  const hasChildren = children.length > 0
  const isPro = node.type === 'pro'

  return (
    <div
      onClick={() => onNavigate(node)}
      className={`rounded-lg border bg-white p-2.5 cursor-pointer hover:shadow-sm active:scale-[0.99] transition-all ${
        isPro ? 'border-l-4 border-l-green-400 border-gray-100' : 'border-l-4 border-l-red-400 border-gray-100'
      }`}
    >
      <p className="text-sm text-gray-800 leading-snug">{node.text}</p>

      <MiniScale nodeId={node.id} userId={userId} />

      {hasChildren && (
        <div className="flex gap-3 mt-1.5">
          {proCount > 0 && (
            <span className="text-xs font-medium text-green-600">{proCount} pro →</span>
          )}
          {contraCount > 0 && (
            <span className="text-xs font-medium text-red-500">{contraCount} contra →</span>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Column (pro or contra) ───────────────────────────────────────────────────

interface ColumnProps {
  type: 'pro' | 'contra'
  nodes: DiscussionNode[]
  userId: string | null
  parentId: string | null
  statementId: string
  onAdded: () => void
  onNavigate: (node: DiscussionNode) => void
}

function KialoColumn({ type, nodes, userId, parentId, statementId, onAdded, onNavigate }: ColumnProps) {
  const [adding, setAdding] = useState(false)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const isPro = type === 'pro'
  const borderColor = isPro ? 'border-green-200' : 'border-red-200'
  const headerBg = isPro ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  const headerText = isPro ? 'text-green-700' : 'text-red-700'
  const addBtnStyle = isPro
    ? 'border-green-200 text-green-600 hover:border-green-400 hover:bg-green-50'
    : 'border-red-200 text-red-500 hover:border-red-400 hover:bg-red-50'
  const submitBtnStyle = isPro ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'

  async function handleAdd() {
    if (!text.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_discussion_nodes').insert({
      statement_id: statementId,
      parent_id: parentId,
      type,
      text: text.trim(),
      author_id: userId,
      source_links: [],
    })
    setText('')
    setAdding(false)
    setLoading(false)
    onAdded()
  }

  return (
    <div className={`rounded-xl border ${borderColor} overflow-hidden flex flex-col`}>
      <div className={`px-3 py-2 border-b ${headerBg} flex items-center justify-between`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${headerText}`}>
          {isPro ? '✓ Pro' : '✗ Contra'}
        </span>
        {nodes.length > 0 && (
          <span className={`text-xs font-medium ${headerText} opacity-70`}>{nodes.length}</span>
        )}
      </div>

      <div className="p-2 space-y-2 bg-white flex-1 min-h-[48px]">
        {nodes.map((node) => (
          <KialoCard
            key={node.id}
            node={node}
            userId={userId}
            onNavigate={onNavigate}
          />
        ))}

        {nodes.length === 0 && !userId && (
          <p className="text-xs text-gray-400 py-1">No {isPro ? 'pro' : 'contra'} arguments yet.</p>
        )}

        {userId && (
          adding ? (
            <div className="space-y-1.5 pt-1">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`${isPro ? 'Pro' : 'Contra'} argument…`}
                rows={2}
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={loading || !text.trim()}
                  className={`text-xs px-3 py-1 rounded-lg font-medium text-white disabled:opacity-50 transition-colors ${submitBtnStyle}`}
                >
                  Add
                </button>
                <button
                  onClick={() => { setAdding(false); setText('') }}
                  className="text-xs px-3 py-1 rounded-lg text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className={`w-full text-xs py-1.5 rounded-lg border border-dashed ${addBtnStyle} transition-colors flex items-center justify-center gap-1`}
            >
              <Plus className="w-3 h-3" />
              {isPro ? 'Add Pro' : 'Add Contra'}
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Split view (2 columns) ───────────────────────────────────────────────────

interface SplitProps {
  nodes: DiscussionNode[]
  userId: string | null
  parentId: string | null
  statementId: string
  onAdded: () => void
  onNavigate: (node: DiscussionNode) => void
}

function KialoSplit({ nodes, userId, parentId, statementId, onAdded, onNavigate }: SplitProps) {
  const pros = nodes.filter((n) => n.type === 'pro')
  const contras = nodes.filter((n) => n.type === 'contra')

  return (
    <div className="grid grid-cols-2 gap-3">
      <KialoColumn type="pro" nodes={pros} userId={userId} parentId={parentId} statementId={statementId} onAdded={onAdded} onNavigate={onNavigate} />
      <KialoColumn type="contra" nodes={contras} userId={userId} parentId={parentId} statementId={statementId} onAdded={onAdded} onNavigate={onNavigate} />
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

interface Props {
  statementId: string
  statementText: string
  userId: string | null
  autoFocusNodeId?: string | null
}

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

function findPath(nodes: DiscussionNode[], targetId: string, path: DiscussionNode[] = []): DiscussionNode[] | null {
  for (const n of nodes) {
    if (n.id === targetId) return [...path, n]
    const found = findPath(n.children ?? [], targetId, [...path, n])
    if (found) return found
  }
  return null
}

export function KialoTreeView({ statementId, statementText, userId, autoFocusNodeId }: Props) {
  const [nodes, setNodes] = useState<DiscussionNode[] | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [focusStack, setFocusStack] = useState<DiscussionNode[]>([])

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .select('*, author:member(display_name, email)')
      .eq('statement_id', statementId)
      .order('created_at', { ascending: true })
    setNodes(data ?? [])
    setLoaded(true)
  }, [statementId])

  useEffect(() => {
    load()
  }, [load])

  const tree = buildTree(nodes ?? [])

  useEffect(() => {
    if (!autoFocusNodeId || !loaded) return
    const path = findPath(tree, autoFocusNodeId)
    if (path) setFocusStack(path)
  }, [autoFocusNodeId, loaded]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loaded) return <div className="text-xs text-gray-400 py-2">Loading…</div>
  const focusedNode = focusStack[focusStack.length - 1] ?? null
  const currentNodes = focusedNode ? (focusedNode.children ?? []) : tree
  const currentParentId = focusedNode ? focusedNode.id : null

  function navigateTo(node: DiscussionNode) {
    // Rebuild node from latest tree so children are up to date
    setFocusStack((prev) => [...prev, node])
  }

  function navigateBackTo(index: number) {
    setFocusStack((prev) => prev.slice(0, index))
  }

  function handleAdded() {
    setLoaded(false)
    load().then(() => {
      // After reload, rebuild focusStack nodes from fresh tree
      setFocusStack([])
    })
  }

  return (
    <div className="space-y-3">

      {/* Parent context — small, clickable to go back */}
      {(() => {
        const parentText = focusStack.length === 0
          ? statementText
          : focusStack.length === 1
            ? statementText
            : focusStack[focusStack.length - 2].text
        const canGoBack = focusStack.length > 0
        const goBack = () => setFocusStack((prev) => prev.slice(0, -1))

        return (
          <div
            onClick={canGoBack ? goBack : undefined}
            className={`rounded-lg px-3 py-2 border border-gray-200 bg-gray-50 ${
              canGoBack ? 'cursor-pointer hover:bg-gray-100 active:scale-[0.99] transition-all' : ''
            }`}
          >
            {canGoBack && (
              <span className="text-xs text-gray-400 font-medium">← back  </span>
            )}
            <span className="text-xs text-gray-500 leading-snug line-clamp-2">
              {parentText}
            </span>
          </div>
        )
      })()}

      {/* Focused argument — shown large */}
      {focusedNode && (
        <div className={`rounded-xl p-4 border-l-4 ${
          focusedNode.type === 'pro'
            ? 'border-l-green-500 bg-green-50 border border-green-200'
            : 'border-l-red-500 bg-red-50 border border-red-200'
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wide ${
            focusedNode.type === 'pro' ? 'text-green-600' : 'text-red-600'
          }`}>
            {focusedNode.type === 'pro' ? '✓ Pro' : '✗ Contra'}
          </span>
          <p className="text-base font-semibold text-gray-900 mt-1 leading-snug">
            {focusedNode.text}
          </p>
          <MiniScale nodeId={focusedNode.id} userId={userId} />
          {currentNodes.length === 0 && (
            <p className="text-xs text-gray-400 mt-2">No sub-arguments yet.</p>
          )}
        </div>
      )}

      {/* Pro / Contra columns */}
      {(currentNodes.length > 0 || userId) && (
        <KialoSplit
          nodes={currentNodes}
          userId={userId}
          parentId={currentParentId}
          statementId={statementId}
          onAdded={handleAdded}
          onNavigate={navigateTo}
        />
      )}

      {tree.length === 0 && !userId && (
        <p className="text-xs text-gray-400 text-center py-2">No arguments yet.</p>
      )}
    </div>
  )
}
