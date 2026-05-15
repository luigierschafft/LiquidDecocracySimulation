'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [userVote, setUserVote] = useState<'agree' | 'pass' | 'disagree' | null>(
    statement.ratings?.find((r: any) => r.user_id === userId)?.vote ?? null
  )
  const [avgRating, setAvgRating] = useState<number | null>(statement.avg_rating ?? null)
  const [liveRatings, setLiveRatings] = useState<{ user_id: string; rating: number; vote?: string }[]>(statement.ratings ?? [])
  const [argCount, setArgCount] = useState(0)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Fetch arg count
    supabase
      .from('ev_discussion_nodes')
      .select('type')
      .eq('statement_id', statement.id)
      .is('parent_id', null)
      .in('type', ['pro', 'contra'])
      .then(({ data }) => setArgCount(data?.length ?? 0))

    // Realtime subscription for ratings
    const channel = supabase
      .channel(`ratings:${statement.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ev_statement_ratings', filter: `statement_id=eq.${statement.id}` },
        async () => {
          const { data } = await supabase
            .from('ev_statement_ratings')
            .select('user_id, rating')
            .eq('statement_id', statement.id)
          if (data) {
            setLiveRatings(data)
            const avg = data.length > 0
              ? data.reduce((s, r) => s + r.rating, 0) / data.length
              : null
            setAvgRating(avg)
            if (userId) {
              const mine = data.find((r) => r.user_id === userId)
              setUserRating(mine?.rating ?? null)
              setUserVote((mine as any)?.vote ?? null)
            }
          }
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => { supabase.removeChannel(channel) }
  }, [statement.id, userId])

  const sourceLinks: string[] = statement.source_links ?? []

  function handleRatingChange(rating: number | null, newAvg: number | null) {
    setUserRating(rating)
    setAvgRating(newAvg)
  }

  return (
    <div id={`statement-${statement.id}`} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      <div
        className="cursor-pointer group"
        onClick={() => { setOpen((v) => !v); if (!open) setViewMode('split') }}
      >
        <p className="text-sm font-medium text-gray-900 leading-relaxed group-hover:text-purple-700 transition-colors">{statement.text}</p>
        <p className="text-xs text-gray-300 group-hover:text-purple-300 transition-colors mt-1">
          {open ? 'Click to close discussion' : 'Click to open discussion'}
        </p>
      </div>

      {sourceLinks.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
        <div onClick={(e) => e.stopPropagation()}>
          <StatementRating
            statementId={statement.id}
            userId={userId}
            currentRating={userRating}
            currentVote={userVote}
            avgRating={avgRating}
            ratings={liveRatings}
            onRatingChange={handleRatingChange}
          />
        </div>
      )}

      {!userId && avgRating !== null && (
        <p className="text-xs text-gray-500">
          Importance average: <span className="font-semibold text-purple-700">{avgRating.toFixed(1)}</span>
        </p>
      )}

      <div className="pt-1 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={() => { setOpen((v) => !v); if (!open) setViewMode('split') }}
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
        <div onClick={(e) => e.stopPropagation()}>
          <KialoTreeView statementId={statement.id} statementText={statement.text} userId={userId} />
        </div>
      )}
      {open && viewMode === 'sun' && (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
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
