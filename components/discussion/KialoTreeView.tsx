'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DiscussionNode } from '@/lib/types/ev'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  statementId: string
  userId: string | null
}

function buildTree(nodes: DiscussionNode[]): DiscussionNode[] {
  // Only pro and contra — no questions or statements
  const filtered = nodes.filter((n) => n.type === 'pro' || n.type === 'contra')
  const map = new Map<string, DiscussionNode>()

  filtered.forEach((n) => map.set(n.id, { ...n, children: [] }))

  const roots: DiscussionNode[] = []
  map.forEach((node) => {
    if (!node.parent_id) {
      roots.push(node)
    } else if (map.has(node.parent_id)) {
      const parent = map.get(node.parent_id)!
      parent.children = parent.children ?? []
      parent.children.push(node)
    }
    // if parent_id exists but parent was filtered out (e.g. was a question) → skip entirely
  })

  return roots
}

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  node: DiscussionNode
  userId: string | null
  statementId: string
  onAdded: () => void
}

function KialoCard({ node, userId, statementId, onAdded }: CardProps) {
  const [expanded, setExpanded] = useState(false)
  const children = node.children ?? []
  const proCount = children.filter((c) => c.type === 'pro').length
  const contraCount = children.filter((c) => c.type === 'contra').length
  const hasChildren = children.length > 0
  const canExpand = hasChildren || userId !== null

  const isPro = node.type === 'pro'
  const leftBorder = isPro ? 'border-l-green-400' : 'border-l-red-400'
  const chevronColor = isPro ? 'text-green-500' : 'text-red-400'
  const countProColor = 'text-green-600'
  const countContraColor = 'text-red-500'

  return (
    <div>
      <div
        onClick={() => canExpand && setExpanded((v) => !v)}
        className={`rounded-lg border border-gray-100 border-l-4 ${leftBorder} bg-white p-2.5 transition-colors ${
          canExpand ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
      >
        <div className="flex items-start gap-2">
          <p className="text-sm text-gray-800 flex-1 leading-snug">{node.text}</p>
          {canExpand && (
            <span className={`shrink-0 mt-0.5 ${chevronColor}`}>
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </span>
          )}
        </div>

        {node.author?.display_name && (
          <p className="text-xs text-gray-400 mt-1">{node.author.display_name}</p>
        )}

        {hasChildren && !expanded && (
          <div className="flex gap-3 mt-1.5">
            {proCount > 0 && (
              <span className={`text-xs font-medium ${countProColor}`}>
                {proCount} pro
              </span>
            )}
            {contraCount > 0 && (
              <span className={`text-xs font-medium ${countContraColor}`}>
                {contraCount} contra
              </span>
            )}
          </div>
        )}
      </div>

      {expanded && (
        <div className="mt-2 ml-3 border-l-2 border-gray-100 pl-2">
          <KialoSplit
            nodes={children}
            userId={userId}
            parentId={node.id}
            statementId={statementId}
            onAdded={onAdded}
          />
        </div>
      )}
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

interface ColumnProps {
  type: 'pro' | 'contra'
  nodes: DiscussionNode[]
  userId: string | null
  parentId: string | null
  statementId: string
  onAdded: () => void
}

function KialoColumn({ type, nodes, userId, parentId, statementId, onAdded }: ColumnProps) {
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
  const submitBtnStyle = isPro
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-red-500 hover:bg-red-600'

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
      {/* Header */}
      <div className={`px-3 py-2 border-b ${headerBg} flex items-center justify-between`}>
        <span className={`text-xs font-bold uppercase tracking-wide ${headerText}`}>
          {isPro ? '✓ Pro' : '✗ Contra'}
        </span>
        {nodes.length > 0 && (
          <span className={`text-xs font-medium ${headerText} opacity-70`}>{nodes.length}</span>
        )}
      </div>

      {/* Arguments */}
      <div className="p-2 space-y-2 bg-white flex-1 min-h-[48px]">
        {nodes.map((node) => (
          <KialoCard
            key={node.id}
            node={node}
            userId={userId}
            statementId={statementId}
            onAdded={onAdded}
          />
        ))}

        {nodes.length === 0 && !userId && (
          <p className="text-xs text-gray-400 py-1">No {isPro ? 'pro' : 'contra'} arguments yet.</p>
        )}

        {/* Add form */}
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

// ─── Split ────────────────────────────────────────────────────────────────────

interface SplitProps {
  nodes: DiscussionNode[]
  userId: string | null
  parentId: string | null
  statementId: string
  onAdded: () => void
}

function KialoSplit({ nodes, userId, parentId, statementId, onAdded }: SplitProps) {
  const pros = nodes.filter((n) => n.type === 'pro')
  const contras = nodes.filter((n) => n.type === 'contra')

  return (
    <div className="grid grid-cols-2 gap-3">
      <KialoColumn
        type="pro"
        nodes={pros}
        userId={userId}
        parentId={parentId}
        statementId={statementId}
        onAdded={onAdded}
      />
      <KialoColumn
        type="contra"
        nodes={contras}
        userId={userId}
        parentId={parentId}
        statementId={statementId}
        onAdded={onAdded}
      />
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function KialoTreeView({ statementId, userId }: Props) {
  const [nodes, setNodes] = useState<DiscussionNode[] | null>(null)
  const [loaded, setLoaded] = useState(false)

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

  if (!loaded) {
    load()
    return <div className="text-xs text-gray-400 py-2">Loading…</div>
  }

  const tree = buildTree(nodes ?? [])

  return (
    <KialoSplit
      nodes={tree}
      userId={userId}
      parentId={null}
      statementId={statementId}
      onAdded={() => { setLoaded(false); load() }}
    />
  )
}
