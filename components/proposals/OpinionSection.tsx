'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { MessageSquare, Send, Reply } from 'lucide-react'
import { PostVoteButton } from '@/components/discussion/PostVoteButton'
import { ReportButton } from '@/components/moderation/ReportButton'

interface OpinionSectionProps {
  initiativeId: string
  opinions: Opinion[]
  userId: string | null
  postVotingEnabled?: boolean
  reportingEnabled?: boolean
}

export function OpinionSection({ initiativeId, opinions: initial, userId, postVotingEnabled = false, reportingEnabled = false }: OpinionSectionProps) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const supabase = createClient()

  const topLevel = opinions.filter((o) => !o.parent_id)
  const repliesFor = (parentId: string) => opinions.filter((o) => o.parent_id === parentId)

  async function addOpinion(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({ initiative_id: initiativeId, author_id: userId, content: text.trim() })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, data as unknown as Opinion])
      setText('')
    }
    setLoading(false)
  }

  async function addReply(parentId: string) {
    if (!replyText.trim() || !userId) return
    setReplyLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({ initiative_id: initiativeId, author_id: userId, content: replyText.trim(), parent_id: parentId })
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
    <div className="border-t border-sand pt-5 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground/70">
        <MessageSquare className="w-4 h-4" />
        Comments ({topLevel.length})
      </h3>

      <div className="space-y-4">
        {topLevel.map((op) => (
          <div key={op.id} className="space-y-2">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {getMemberDisplayName(op.author)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold">{getMemberDisplayName(op.author)}</span>
                  <span className="text-xs text-foreground/40">{formatDate(op.created_at)}</span>
                </div>
                <p className="text-sm text-foreground/70 mt-0.5 break-words leading-relaxed">{op.content}</p>
                <div className="flex items-center gap-3 mt-1">
                  {postVotingEnabled && (
                    <PostVoteButton
                      targetType="opinion"
                      targetId={op.id}
                      initialCount={(op as any)._vote_count ?? 0}
                      initialVoted={(op as any)._user_voted ?? false}
                      userId={userId}
                    />
                  )}
                  {userId && (
                    <button
                      onClick={() => {
                        setReplyingTo(replyingTo === op.id ? null : op.id)
                        setReplyText('')
                      }}
                      className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                  )}
                  {reportingEnabled && userId && userId !== op.author_id && (
                    <ReportButton targetType="opinion" targetId={op.id} userId={userId} />
                  )}
                </div>
              </div>
            </div>

            {/* Nested replies */}
            {repliesFor(op.id).length > 0 && (
              <div className="ml-10 space-y-2 border-l-2 border-accent/20 pl-3">
                {repliesFor(op.id).map((reply) => (
                  <div key={reply.id} className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-sand flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
                      {getMemberDisplayName(reply.author)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold">{getMemberDisplayName(reply.author)}</span>
                        <span className="text-xs text-foreground/40">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground/70 mt-0.5 break-words">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            {replyingTo === op.id && (
              <div className="ml-10 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply…"
                  className="input flex-1 text-sm py-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addReply(op.id) }
                    if (e.key === 'Escape') setReplyingTo(null)
                  }}
                />
                <button
                  onClick={() => addReply(op.id)}
                  disabled={replyLoading || !replyText.trim()}
                  className="btn-primary px-2.5 py-1"
                  title="Send reply"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {userId ? (
        <form onSubmit={addOpinion} className="flex gap-2 mt-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
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
        <p className="text-xs text-foreground/40">Sign in to comment.</p>
      )}
    </div>
  )
}
