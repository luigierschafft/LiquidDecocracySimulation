'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { StatementRating } from './StatementRating'
import { KialoTreeView } from './KialoTreeView'
import { DiscussionNodeView } from './DiscussionNode'

type Tab = 'procontra' | 'questions'

interface Props {
  statement: any
  userId: string | null
  topicId: string
}

export function StatementCard({ statement, userId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [userRating, setUserRating] = useState<number | null>(statement.user_rating ?? null)
  const [avgRating, setAvgRating] = useState<number | null>(statement.avg_rating ?? null)
  const [counts, setCounts] = useState<Record<Tab, number>>({ procontra: 0, questions: 0 })

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('ev_discussion_nodes')
      .select('type')
      .eq('statement_id', statement.id)
      .is('parent_id', null)
      .then(({ data }) => {
        if (!data) return
        const procontra = data.filter((n) => n.type === 'pro' || n.type === 'contra').length
        const questions = data.filter((n) => n.type === 'question').length
        setCounts({ procontra, questions })
      })
  }, [statement.id])

  const sourceLinks: string[] = statement.source_links ?? []

  function handleRatingChange(rating: number, newAvg: number) {
    setUserRating(rating)
    setAvgRating(newAvg)
  }

  const tabs: { key: Tab; label: string; activeColor: string; hasContentColor: string }[] = [
    { key: 'procontra', label: '+ Pro/Contra', activeColor: 'bg-purple-600 text-white', hasContentColor: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { key: 'questions', label: '+ Question', activeColor: 'bg-purple-600 text-white', hasContentColor: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  ]

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

      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? tab.activeColor
                : counts[tab.key] > 0
                ? tab.hasContentColor
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'procontra' && (
        <KialoTreeView statementId={statement.id} userId={userId} />
      )}
      {activeTab === 'questions' && (
        <DiscussionNodeView
          statementId={statement.id}
          userId={userId}
          filterType="question"
        />
      )}
    </div>
  )
}
