'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { MessageSquare, Send } from 'lucide-react'

interface OpinionSectionProps {
  initiativeId: string
  opinions: Opinion[]
  userId: string | null
}

export function OpinionSection({ initiativeId, opinions: initial, userId }: OpinionSectionProps) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

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

  return (
    <div className="border-t border-sand pt-5 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground/70">
        <MessageSquare className="w-4 h-4" />
        Comments ({opinions.length})
      </h3>

      <div className="space-y-3">
        {opinions.map((op) => (
          <div key={op.id} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center text-xs font-medium flex-shrink-0">
              {getMemberDisplayName(op.author)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium">{getMemberDisplayName(op.author)}</span>
                <span className="text-xs text-foreground/40">{formatDate(op.created_at)}</span>
              </div>
              <p className="text-sm text-foreground/70 mt-0.5 break-words">{op.content}</p>
            </div>
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
