'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { DiscussionNode } from '@/lib/types/ev'
import { List, GitBranch, Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface Props {
  statementId: string
  userId: string | null
}

function buildTree(nodes: DiscussionNode[]): DiscussionNode[] {
  const map = new Map<string, DiscussionNode>()
  const roots: DiscussionNode[] = []

  nodes.forEach((n) => map.set(n.id, { ...n, children: [] }))
  map.forEach((node) => {
    if (node.parent_id) {
      const parent = map.get(node.parent_id)
      if (parent) {
        parent.children = parent.children ?? []
        parent.children.push(node)
      } else {
        roots.push(node)
      }
    } else {
      roots.push(node)
    }
  })
  return roots
}

const TYPE_STYLES: Record<string, { label: string; color: string; border: string }> = {
  pro: { label: 'PRO', color: 'bg-green-100 text-green-700', border: 'border-green-200' },
  contra: { label: 'CONTRA', color: 'bg-red-100 text-red-700', border: 'border-red-200' },
  question: { label: 'QUESTION', color: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  statement: { label: 'STATEMENT', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
}

interface TreeNodeProps {
  node: DiscussionNode
  userId: string | null
  treeMode: boolean
  depth?: number
  onAdded: () => void
}

function TreeNode({ node, userId, treeMode, depth = 0, onAdded }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const [replyType, setReplyType] = useState<DiscussionNode['type'] | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  const style = TYPE_STYLES[node.type] ?? TYPE_STYLES.statement
  const children = node.children ?? []
  const authorName = node.author?.display_name || node.author?.email || 'Anonym'

  async function submitReply() {
    if (!replyText.trim() || !userId || !replyType) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_discussion_nodes').insert({
      statement_id: node.statement_id,
      parent_id: node.id,
      type: replyType,
      text: replyText.trim(),
      author_id: userId,
      source_links: [],
    })
    setReplyText('')
    setReplyType(null)
    setLoading(false)
    onAdded()
  }

  const indent = treeMode ? depth * 20 : 0

  return (
    <div>
      <div
        style={{ marginLeft: indent }}
        className={`border rounded-lg p-3 mb-2 ${style.border} bg-white`}
      >
        <div className="flex items-start gap-2">
          <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 ${style.color}`}>
            {style.label}
          </span>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{node.text}</p>
          </div>
          {children.length > 0 && (
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600">
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {userId && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            <span className="text-xs text-gray-400 mr-1">Reply:</span>
            {(['pro', 'contra', 'question', 'statement'] as DiscussionNode['type'][]).map((t) => (
              <button
                key={t}
                onClick={() => setReplyType(replyType === t ? null : t)}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  replyType === t ? `${TYPE_STYLES[t].color} font-bold` : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                + {TYPE_STYLES[t].label}
              </button>
            ))}
          </div>
        )}

        {replyType && (
          <div className="mt-2 flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Add ${TYPE_STYLES[replyType].label}…`}
              rows={2}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={submitReply}
              disabled={loading || !replyText.trim()}
              className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {expanded &&
        children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            userId={userId}
            treeMode={treeMode}
            depth={depth + 1}
            onAdded={onAdded}
          />
        ))}
    </div>
  )
}

export function KialoTreeView({ statementId, userId }: Props) {
  const [nodes, setNodes] = useState<DiscussionNode[] | null>(null)
  const [treeMode, setTreeMode] = useState(true)
  const [addType, setAddType] = useState<DiscussionNode['type'] | null>(null)
  const [addText, setAddText] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .select('*')
      .eq('statement_id', statementId)
      .in('type', ['pro', 'contra'])
      .order('created_at', { ascending: true })
    setNodes(data ?? [])
    setLoaded(true)
  }, [statementId])

  if (!loaded) {
    load()
    return <div className="text-xs text-gray-400 py-2">Loading…</div>
  }

  const tree = buildTree(nodes ?? [])

  async function handleAddRoot() {
    if (!addText.trim() || !userId || !addType) return
    setAddLoading(true)
    const supabase = createClient()
    await supabase.from('ev_discussion_nodes').insert({
      statement_id: statementId,
      parent_id: null,
      type: addType,
      text: addText.trim(),
      author_id: userId,
      source_links: [],
    })
    setAddText('')
    setAddType(null)
    setAddLoading(false)
    setLoaded(false)
    load()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Pro / Contra Arguments</span>
        <button
          onClick={() => setTreeMode(!treeMode)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
        >
          {treeMode ? <List className="w-3.5 h-3.5" /> : <GitBranch className="w-3.5 h-3.5" />}
          {treeMode ? 'List view' : 'Tree view'}
        </button>
      </div>

      {tree.length === 0 && (
        <p className="text-xs text-gray-400">No arguments yet.</p>
      )}

      {tree.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          userId={userId}
          treeMode={treeMode}
          onAdded={() => { setLoaded(false); load() }}
        />
      ))}

      {userId && (
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">New argument:</span>
            {(['pro', 'contra'] as DiscussionNode['type'][]).map((t) => (
              <button
                key={t}
                onClick={() => setAddType(addType === t ? null : t)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${
                  addType === t
                    ? t === 'pro'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t === 'pro' ? '+ PRO' : '− CONTRA'}
              </button>
            ))}
          </div>
          {addType && (
            <div className="flex gap-2">
              <textarea
                value={addText}
                onChange={(e) => setAddText(e.target.value)}
                placeholder={`Add ${addType === 'pro' ? 'pro' : 'contra'} argument…`}
                rows={2}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleAddRoot}
                disabled={addLoading || !addText.trim()}
                className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
