'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { DiscussionNode } from '@/lib/types/ev'
import { ChevronDown, ChevronRight, Plus } from 'lucide-react'

const TYPE_STYLES: Record<string, { label: string; color: string }> = {
  pro: { label: 'PRO', color: 'bg-green-100 text-green-700' },
  contra: { label: 'CONTRA', color: 'bg-red-100 text-red-700' },
  question: { label: 'FRAGE', color: 'bg-blue-100 text-blue-700' },
  statement: { label: 'STATEMENT', color: 'bg-gray-100 text-gray-600' },
}

interface NodeProps {
  node: DiscussionNode
  userId: string | null
  depth?: number
  onAdded?: () => void
}

function NodeItem({ node, userId, depth = 0, onAdded }: NodeProps) {
  const [open, setOpen] = useState(false)
  const [replyType, setReplyType] = useState<DiscussionNode['type'] | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(false)

  const style = TYPE_STYLES[node.type] ?? TYPE_STYLES.statement
  const authorName = node.author?.display_name || node.author?.email || 'Anonym'
  const children = node.children ?? []

  async function submitReply() {
    if (!replyText.trim() || !userId) return
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
    onAdded?.()
  }

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l-2 border-gray-100 pl-3' : ''}`}>
      <div className="py-2">
        <div className="flex items-start gap-2">
          <span className={`text-xs px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5 ${style.color}`}>
            {style.label}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">{node.text}</p>
            <span className="text-xs text-gray-400">{authorName}</span>
          </div>
          {children.length > 0 && (
            <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600 shrink-0">
              {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>

        {userId && (
          <div className="flex items-center gap-1.5 mt-1.5 ml-7">
            {(['pro', 'contra', 'question', 'statement'] as DiscussionNode['type'][]).map((t) => (
              <button
                key={t}
                onClick={() => setReplyType(replyType === t ? null : t)}
                className={`text-xs px-2 py-0.5 rounded transition-colors ${
                  replyType === t
                    ? `${TYPE_STYLES[t].color} font-bold`
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                + {TYPE_STYLES[t].label}
              </button>
            ))}
          </div>
        )}

        {replyType && (
          <div className="mt-2 ml-7 flex gap-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`${TYPE_STYLES[replyType].label} hinzufügen…`}
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

      {open && children.length > 0 && (
        <div>
          {children.map((child) => (
            <NodeItem key={child.id} node={child} userId={userId} depth={depth + 1} onAdded={onAdded} />
          ))}
        </div>
      )}
    </div>
  )
}

interface ListProps {
  statementId: string
  userId: string | null
  filterType: 'question' | 'statement'
}

export function DiscussionNodeView({ statementId, userId, filterType }: ListProps) {
  const [nodes, setNodes] = useState<DiscussionNode[] | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [addText, setAddText] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .select('*, author:member!discussion_nodes_author_id_fkey(display_name, email)')
      .eq('statement_id', statementId)
      .eq('type', filterType)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
    setNodes(data ?? [])
    setLoaded(true)
  }

  if (!loaded) {
    load()
    return <div className="text-xs text-gray-400 py-2">Laden…</div>
  }

  async function handleAdd() {
    if (!addText.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_discussion_nodes').insert({
      statement_id: statementId,
      parent_id: null,
      type: filterType,
      text: addText.trim(),
      author_id: userId,
      source_links: [],
    })
    setAddText('')
    setLoading(false)
    setLoaded(false)
    load()
  }

  const typeStyle = TYPE_STYLES[filterType]

  return (
    <div className="space-y-2">
      {(nodes ?? []).length === 0 && (
        <p className="text-xs text-gray-400">Noch keine {typeStyle.label}.</p>
      )}
      {(nodes ?? []).map((node) => (
        <NodeItem key={node.id} node={node} userId={userId} onAdded={() => { setLoaded(false); load() }} />
      ))}
      {userId && (
        <div className="flex gap-2 mt-2">
          <textarea
            value={addText}
            onChange={(e) => setAddText(e.target.value)}
            placeholder={`${typeStyle.label} hinzufügen…`}
            rows={2}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !addText.trim()}
            className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
