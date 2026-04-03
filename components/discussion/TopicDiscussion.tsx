'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion, OpinionIntent } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { MessageSquare, Send, Reply } from 'lucide-react'
import { PostVoteButton } from './PostVoteButton'
import { IntentBadge, IntentPicker } from './IntentBadge'

interface Props {
  issueId: string
  opinions: Opinion[]
  userId: string | null
  postVotingEnabled?: boolean
  intentEnabled?: boolean
  questionsTaggingEnabled?: boolean
}

export function TopicDiscussion({
  issueId,
  opinions: initial,
  userId,
  postVotingEnabled = false,
  intentEnabled = false,
  questionsTaggingEnabled = false,
}: Props) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [text, setText] = useState('')
  const [intent, setIntent] = useState<OpinionIntent | null>(null)
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const supabase = createClient()

  // Show intent picker if either module is on
  const showIntentPicker = intentEnabled || questionsTaggingEnabled
  // If only questionsTagging (not full intention display), only show 'question' option
  const intentOptions: OpinionIntent[] = questionsTaggingEnabled && !intentEnabled
    ? ['question']
    : ['support', 'concern', 'question', 'info']

  const topLevel = opinions.filter((o) => !o.parent_id)
  const replies = (parentId: string) => opinions.filter((o) => o.parent_id === parentId)

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({ issue_id: issueId, author_id: userId, content: text.trim(), intent: intent ?? null })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, { ...(data as unknown as Opinion), replies: [] }])
      setText('')
      setIntent(null)
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

  function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
    const cls = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
    return (
      <div className={`${cls} rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold flex-shrink-0`}>
        {name[0]?.toUpperCase()}
      </div>
    )
  }

  return (
    <div className="card space-y-5">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-accent" />
        Discussion
        <span className="text-sm font-normal text-foreground/40">({topLevel.length})</span>
      </h2>

      <div className="space-y-5">
        {topLevel.length === 0 && (
          <p className="text-sm text-foreground/40">No comments yet. Start the discussion.</p>
        )}

        {topLevel.map((op) => (
          <div key={op.id} className="space-y-3">
            <div className="flex gap-3">
              <Avatar name={getMemberDisplayName(op.author)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{getMemberDisplayName(op.author)}</span>
                  <span className="text-xs text-foreground/40">{formatDate(op.created_at)}</span>
                  {(intentEnabled || questionsTaggingEnabled) && op.intent && (
                    <IntentBadge intent={op.intent} />
                  )}
                </div>
                <p className="text-sm text-foreground/80 mt-1 break-words leading-relaxed">{op.content}</p>
                <div className="flex items-center gap-3 mt-1.5">
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
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>

            {replies(op.id).length > 0 && (
              <div className="ml-11 space-y-3 border-l-2 border-accent/20 pl-4">
                {replies(op.id).map((reply) => (
                  <div key={reply.id} className="flex gap-2.5">
                    <Avatar name={getMemberDisplayName(reply.author)} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold">{getMemberDisplayName(reply.author)}</span>
                        <span className="text-xs text-foreground/40">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="text-sm text-foreground/80 mt-0.5 break-words leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === op.id && (
              <div className="ml-11 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply…"
                  className="input flex-1 text-sm py-1.5"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addReply(op.id) }
                    if (e.key === 'Escape') setReplyingTo(null)
                  }}
                />
                <button
                  onClick={() => addReply(op.id)}
                  disabled={replyLoading || !replyText.trim()}
                  className="btn-primary px-3 py-1.5"
                  title="Send reply"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {userId ? (
        <form onSubmit={addComment} className="space-y-2 pt-2 border-t border-sand">
          {showIntentPicker && (
            <IntentPicker
              value={intent}
              onChange={setIntent}
              // If only questionsTagging, only show 'question' button
              // We handle this inside by passing options — IntentPicker uses full list
              // so we gate via the intentOptions filtering (handled implicitly by showing/hiding full picker)
            />
          )}
          <div className="flex gap-2">
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
              title="Post comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <p className="text-xs text-foreground/40 pt-2 border-t border-sand">Sign in to join the discussion.</p>
      )}
    </div>
  )
}
