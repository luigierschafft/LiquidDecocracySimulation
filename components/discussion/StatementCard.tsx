'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { StatementRating } from './StatementRating'
import { KialoTreeView } from './KialoTreeView'

interface Props {
  statement: any
  userId: string | null
  topicId: string
}

export function StatementCard({ statement, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [userRating, setUserRating] = useState<number | null>(statement.user_rating ?? null)
  const [avgRating, setAvgRating] = useState<number | null>(statement.avg_rating ?? null)
  const [argCount, setArgCount] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('ev_discussion_nodes')
      .select('type')
      .eq('statement_id', statement.id)
      .is('parent_id', null)
      .in('type', ['pro', 'contra'])
      .then(({ data }) => {
        setArgCount(data?.length ?? 0)
      })
  }, [statement.id])

  const sourceLinks: string[] = statement.source_links ?? []

  function handleRatingChange(rating: number, newAvg: number) {
    setUserRating(rating)
    setAvgRating(newAvg)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      <p className="text-sm font-medium text-gray-900 leading-relaxed">{statement.text}</p>

      {sourceLinks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {sourceLinks.map((url, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Source {sourceLinks.length > 1 ? i + 1 : ''}
            </a>
          ))}
        </div>
      )}

      {userId && (
        <StatementRating
          statementId={statement.id}
          userId={userId}
          currentRating={userRating}
          avgRating={avgRating}
          ratings={statement.ratings ?? []}
          onRatingChange={handleRatingChange}
        />
      )}

      {!userId && avgRating !== null && (
        <p className="text-xs text-gray-500">
          Importance average: <span className="font-semibold text-purple-700">{avgRating.toFixed(1)}</span>
        </p>
      )}

      <div className="pt-1 border-t border-gray-100">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            open
              ? 'bg-purple-600 text-white'
              : argCount > 0
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {open ? 'Hide Discussion' : argCount > 0 ? `${argCount} Arguments` : '+ Discuss'}
        </button>
      </div>

      {open && (
        <KialoTreeView statementId={statement.id} userId={userId} />
      )}
    </div>
  )
}
