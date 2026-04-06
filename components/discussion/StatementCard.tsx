'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { StatementRating } from './StatementRating'
import { KialoTreeView } from './KialoTreeView'
import { DiscussionNodeView } from './DiscussionNode'

type Tab = 'procontra' | 'fragen' | 'statements'

interface Props {
  statement: any
  userId: string | null
  topicId: string
}

export function StatementCard({ statement, userId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [userRating, setUserRating] = useState<number | null>(statement.user_rating ?? null)
  const [avgRating, setAvgRating] = useState<number | null>(statement.avg_rating ?? null)

  const sourceLinks: string[] = statement.source_links ?? []
  const authorName = statement.author?.display_name || statement.author?.email || 'Anonym'

  function handleRatingChange(rating: number, newAvg: number) {
    setUserRating(rating)
    setAvgRating(newAvg)
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'procontra', label: 'Pro/Contra' },
    { key: 'fragen', label: 'Fragen' },
    { key: 'statements', label: 'Statements' },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-gray-900 leading-relaxed flex-1">{statement.text}</p>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {avgRating !== null && (
            <span className="flex items-center gap-1 text-xs text-purple-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
              {avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400">{authorName}</span>
        {sourceLinks.map((url, i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-full transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Quelle {sourceLinks.length > 1 ? i + 1 : ''}
          </a>
        ))}
      </div>

      {userId && (
        <StatementRating
          statementId={statement.id}
          userId={userId}
          currentRating={userRating}
          ratings={statement.ratings ?? []}
          onRatingChange={handleRatingChange}
        />
      )}

      <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white'
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
      {(activeTab === 'fragen' || activeTab === 'statements') && (
        <DiscussionNodeView
          statementId={statement.id}
          userId={userId}
          filterType={activeTab === 'fragen' ? 'question' : 'statement'}
        />
      )}
    </div>
  )
}
