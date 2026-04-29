'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { StatementRating } from './StatementRating'
import { KialoTreeView } from './KialoTreeView'
import { SunView } from './SunView'

type ViewMode = 'split' | 'sun'

interface Props {
  statement: any
  userId: string | null
  topicId: string
}

export function StatementCard({ statement, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [sunClickedNodeId, setSunClickedNodeId] = useState<string | null>(null)
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

  function handleRatingChange(rating: number | null, newAvg: number | null) {
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

      <div className="pt-1 border-t border-gray-100 flex items-center gap-2">
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

        {open && (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'split' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('sun')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'sun' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ☀ Sun
            </button>
          </div>
        )}
      </div>

      {open && viewMode === 'split' && (
        <KialoTreeView statementId={statement.id} statementText={statement.text} userId={userId} />
      )}
      {open && viewMode === 'sun' && (
        <div className="space-y-4">
          <SunView
            statementId={statement.id}
            statementText={statement.text}
            userId={userId}
            onNodeClick={(id) => setSunClickedNodeId(id)}
          />
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Argument Tree</p>
            <KialoTreeView statementId={statement.id} statementText={statement.text} userId={userId} autoFocusNodeId={sunClickedNodeId} />
          </div>
        </div>
      )}
    </div>
  )
}
