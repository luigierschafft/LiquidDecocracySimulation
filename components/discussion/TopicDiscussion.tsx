'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { MessageSquare, Send, CornerDownRight } from 'lucide-react'

interface Props {
  issueId: string
  opinions: Opinion[]
  userId: string | null
}

export function TopicDiscussion({ issueId, opinions: initial, userId }: Props) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const supabase = createClient()

  const topLevel = opinions.filter((o) => !o.parent_id)
  const replies = (parentId: string) => opinions.filter((o) => o.parent_id === parentId)

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({ issue_id: issueId, author_id: userId, content: text.trim() })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, { ...(data as unknown as Opinion), replies: [] }])
      setText('')
    }
    setLoading(false)
  }

  async function addReply(parentId: string) {
    if (!replyText.trim() || !userId) return
    setReplyLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({ issue_id: issueId, author_id: userId, content: replyText.trim(), parent_id: parentId })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, data as unknown as Opinion])
      setReplyText('')
      setReplyingTo(null)
    }
    setReplyLoading(false)
  }

  return (
    <div className="card space-y-5">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent" />
        Discussion
        <span className="text-sm font-normal text-foreground/40">({topLevel.length})</span>
      </h2>

      {/* Comment list */}
      <div className="space-y-4">
        {topLevel.length === 0 && (
          <p className="text-sm text-foreground/40">No comments yet. Start the discussion.</p>
        )}

        {topLevel.map((op) => (
          <div key={op.id} className="space-y-3">
            {/* Top-level comment */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {getMemberDisplayName(op.author)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-medium">{getMemberDisplayName(op.author)}</span>
                  <span className="text-xs text-foreground/40">{formatDate(op.created_at)}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-0.5 break-words">{op.content}</p>
                {userId && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === op.id ? null : op.id)}
                    className="text-xs text-foreground/40 hover:text-accent mt-1 transition-colors"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>

            {/* Replies */}
            {replies(op.id).length > 0 && (
              <div className="ml-11 space-y-3 border-l-2 border-sand pl-4">
                {replies(op.id).map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <CornerDownRight className="w-3.5 h-3.5 text-foreground/20 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-medium">{getMemberDisplayName(reply.author)}</span>
                        <span className="text-xs text-foreground/40">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-0.5 break-words">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyingTo === op.id && (
              <div className="ml-11 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply…"
                  className="input flex-1 text-sm py-1.5"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addReply(op.id) } }}
                />
                <button
                  onClick={() => addReply(op.id)}
                  disabled={replyLoading || !replyText.trim()}
                  className="btn-primary px-3 py-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New comment input */}
      {userId ? (
        <form onSubmit={addComment} className="flex gap-2 pt-2 border-t border-sand">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add to the discussion…"
            className="input flex-1 text-sm py-1.5"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="btn-primary px-3 py-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <p className="text-xs text-foreground/40 pt-2 border-t border-sand">Sign in to join the discussion.</p>
      )}
    </div>
  )
}
