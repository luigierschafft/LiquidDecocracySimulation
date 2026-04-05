'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion, OpinionIntent } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { MessageSquare, Send, Reply, Quote, Network } from 'lucide-react'
import { PostVoteButton } from './PostVoteButton'
import { IntentBadge, IntentPicker } from './IntentBadge'
import { QuoteBlock } from './QuoteBlock'
import { ReportButton } from '@/components/moderation/ReportButton'
import { VerifiedBadge } from '@/components/profile/VerifiedBadge'
import { ArgumentJourney } from '@/components/ai/ArgumentJourney'
import { ArgumentMap } from './ArgumentMap'

interface Props {
  issueId: string
  opinions: Opinion[]
  userId: string | null
  postVotingEnabled?: boolean
  intentEnabled?: boolean
  questionsTaggingEnabled?: boolean
  referencingEnabled?: boolean
  reportingEnabled?: boolean
  verificationEnabled?: boolean
  anonymityEnabled?: boolean
  mentionsEnabled?: boolean
  journeyModeEnabled?: boolean
  aiModerationEnabled?: boolean
  argumentMapEnabled?: boolean
}

export function TopicDiscussion({
  issueId,
  opinions: initial,
  userId,
  postVotingEnabled = false,
  intentEnabled = false,
  questionsTaggingEnabled = false,
  referencingEnabled = false,
  reportingEnabled = false,
  verificationEnabled = false,
  anonymityEnabled = false,
  mentionsEnabled = false,
  journeyModeEnabled = false,
  aiModerationEnabled = false,
  argumentMapEnabled = false,
}: Props) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [mapView, setMapView] = useState(false)
  const [text, setText] = useState('')
  const [intent, setIntent] = useState<OpinionIntent | null>(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [quotingOpinion, setQuotingOpinion] = useState<Opinion | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyLoading, setReplyLoading] = useState(false)
  const supabase = createClient()

  // Module 87: detect @display_name mentions and send notifications
  async function sendMentionNotifications(content: string, opinionId: string) {
    if (!mentionsEnabled) return
    const handles = content.match(/@([\w.-]+)/g) ?? []
    if (handles.length === 0) return
    const names = handles.map((h) => h.slice(1))
    const { data: mentioned } = await supabase
      .from('member')
      .select('id, display_name')
      .in('display_name', names)
      .eq('is_approved', true)
    for (const m of mentioned ?? []) {
      if (m.id === userId) continue
      await supabase.from('notification').insert({
        member_id: m.id,
        type: 'mention',
        title: 'You were mentioned in a discussion',
        body: content.slice(0, 100),
        link: `/proposals/${issueId}`,
      })
    }
  }

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

    // Module 48: AI Moderation — pre-screen content
    if (aiModerationEnabled) {
      try {
        const res = await fetch('/api/ai/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: text.trim() }),
        })
        const { approved, reason } = await res.json()
        if (!approved) {
          alert(`Your post was flagged by AI moderation: ${reason ?? 'inappropriate content'}`)
          setLoading(false)
          return
        }
      } catch { /* allow on error */ }
    }

    const { data, error } = await supabase
      .from('opinion')
      .insert({ issue_id: issueId, author_id: userId, content: text.trim(), intent: intent ?? null, is_anonymous: isAnonymous })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, { ...(data as unknown as Opinion), replies: [] }])
      await sendMentionNotifications(text.trim(), (data as any).id)
      setText('')
      setIntent(null)
      setIsAnonymous(false)
    }
    setLoading(false)
  }

  async function addReply(parentId: string) {
    if (!replyText.trim() || !userId) return
    setReplyLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({
        issue_id: issueId,
        author_id: userId,
        content: replyText.trim(),
        parent_id: parentId,
        referenced_opinion_id: quotingOpinion?.id ?? null,
      })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, data as unknown as Opinion])
      await sendMentionNotifications(replyText.trim(), (data as any).id)
      setReplyText('')
      setReplyingTo(null)
      setQuotingOpinion(null)
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Discussion
          <span className="text-sm font-normal text-foreground/40">({topLevel.length})</span>
        </h2>
        {argumentMapEnabled && (
          <button
            onClick={() => setMapView((v) => !v)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              mapView
                ? 'bg-accent text-white border-accent'
                : 'text-foreground/50 border-sand hover:border-accent/40 hover:text-accent'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            {mapView ? 'List view' : 'Argument Map'}
          </button>
        )}
      </div>

      {/* Argument Map view */}
      {argumentMapEnabled && mapView && (
        <ArgumentMap
          issueId={issueId}
          userId={userId}
          initialOpinions={opinions}
        />
      )}

      {!mapView && <div className="space-y-5">
        {topLevel.length === 0 && (
          <p className="text-sm text-foreground/40">No comments yet. Start the discussion.</p>
        )}

        {topLevel.map((op) => {
          const authorName = op.is_anonymous ? 'Anonymous' : getMemberDisplayName(op.author)
          return (
          <div key={op.id} className="space-y-3">
            <div className="flex gap-3">
              <Avatar name={authorName} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold">{authorName}</span>
                  {verificationEnabled && !op.is_anonymous && (op.author as any)?.is_verified && <VerifiedBadge />}
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
                        setQuotingOpinion(null)
                        setReplyText('')
                      }}
                      className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  )}
                  {referencingEnabled && userId && (
                    <button
                      onClick={() => {
                        setReplyingTo(op.id)
                        setQuotingOpinion(op)
                        setReplyText('')
                      }}
                      className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
                    >
                      <Quote className="w-3.5 h-3.5" />
                      Quote
                    </button>
                  )}
                  {reportingEnabled && userId && userId !== op.author_id && (
                    <ReportButton targetType="opinion" targetId={op.id} userId={userId} />
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
                      {referencingEnabled && reply.referenced_opinion && (
                        <div className="mt-1">
                          <QuoteBlock opinion={reply.referenced_opinion} />
                        </div>
                      )}
                      <p className="text-sm text-foreground/80 mt-0.5 break-words leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {replyingTo === op.id && (
              <div className="ml-11 space-y-1.5">
                {referencingEnabled && quotingOpinion && quotingOpinion.id === op.id && (
                  <QuoteBlock opinion={quotingOpinion} />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply…"
                    className="input flex-1 text-sm py-1.5"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addReply(op.id) }
                      if (e.key === 'Escape') { setReplyingTo(null); setQuotingOpinion(null) }
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
              </div>
            )}
          </div>
          )
        })}
      </div>}

      {!mapView && userId ? (
        <form onSubmit={addComment} className="space-y-2 pt-2 border-t border-sand">
          {/* Module 51: Argument Journey Mode */}
          {journeyModeEnabled && (
            <ArgumentJourney onPost={(content) => { setText(content) }} />
          )}
          {showIntentPicker && (
            <IntentPicker
              value={intent}
              onChange={setIntent}
            />
          )}
          {anonymityEnabled && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground/50">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-3.5 h-3.5 rounded"
              />
              Post anonymously
            </label>
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
      ) : (!mapView && (
        <p className="text-xs text-foreground/40 pt-2 border-t border-sand">Sign in to join the discussion.</p>
      ))}
    </div>
  )
}
