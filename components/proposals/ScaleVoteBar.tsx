'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface ScaleVoteData {
  userScore: number | null
  average: number | null
  count: number
}

interface Props {
  initiativeId: string
  userId: string | null
  initialData: ScaleVoteData
}

export function ScaleVoteBar({ initiativeId, userId, initialData }: Props) {
  const [data, setData] = useState<ScaleVoteData>(initialData)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function vote(score: number) {
    if (!userId || loading) return
    setLoading(true)

    const { error } = await supabase
      .from('scale_vote')
      .upsert({ initiative_id: initiativeId, member_id: userId, score }, { onConflict: 'initiative_id,member_id' })

    if (!error) {
      const { data: rows } = await supabase
        .from('scale_vote')
        .select('score')
        .eq('initiative_id', initiativeId)

      const scores = (rows ?? []).map((r) => r.score as number)
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null
      setData({ userScore: score, average: avg, count: scores.length })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
          <button
            key={score}
            onClick={() => vote(score)}
            disabled={!userId || loading}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border ${
              data.userScore === score
                ? 'bg-accent text-white border-accent'
                : 'bg-sand border-sand hover:border-accent/40 text-foreground/60 hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed'
            }`}
            title={`Score ${score}`}
          >
            {score}
          </button>
        ))}
      </div>
      {data.count > 0 && (
        <p className="text-xs text-foreground/40">
          Average: <span className="font-semibold text-foreground/60">{data.average?.toFixed(1)}</span>
          {' '}· {data.count} vote{data.count !== 1 ? 's' : ''}
        </p>
      )}
      {!userId && (
        <p className="text-xs text-foreground/40">Sign in to rate.</p>
      )}
    </div>
  )
}
