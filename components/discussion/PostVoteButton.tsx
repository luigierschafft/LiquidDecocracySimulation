'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { ThumbsUp } from 'lucide-react'

interface Props {
  targetType: 'opinion' | 'argument'
  targetId: string
  initialCount: number
  initialVoted: boolean
  userId: string | null
}

export function PostVoteButton({ targetType, targetId, initialCount, initialVoted, userId }: Props) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function toggle() {
    if (!userId || loading) return
    setLoading(true)

    if (voted) {
      // Remove vote
      const filter = targetType === 'opinion'
        ? { member_id: userId, opinion_id: targetId }
        : { member_id: userId, argument_id: targetId }
      await supabase.from('post_vote').delete().match(filter)
      setVoted(false)
      setCount((c) => c - 1)
    } else {
      // Add vote
      const payload = targetType === 'opinion'
        ? { member_id: userId, opinion_id: targetId, value: 1 }
        : { member_id: userId, argument_id: targetId, value: 1 }
      await supabase.from('post_vote').insert(payload)
      setVoted(true)
      setCount((c) => c + 1)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={!userId || loading}
      title={userId ? (voted ? 'Remove upvote' : 'Upvote') : 'Sign in to vote'}
      className={`flex items-center gap-1 text-xs font-medium transition-colors px-1.5 py-0.5 rounded ${
        voted
          ? 'text-accent'
          : userId
            ? 'text-foreground/30 hover:text-accent'
            : 'text-foreground/20 cursor-default'
      }`}
    >
      <ThumbsUp className="w-3 h-3" />
      {count > 0 && <span>{count}</span>}
    </button>
  )
}
