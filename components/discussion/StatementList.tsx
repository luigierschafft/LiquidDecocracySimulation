'use client'

import { StatementCard } from './StatementCard'

interface Props {
  statements: any[]
  userId: string | null
  topicId: string
}

export function StatementList({ statements, userId, topicId }: Props) {
  if (statements.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">Noch keine Statements. Sei der Erste!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {statements.map((statement) => (
        <StatementCard
          key={statement.id}
          statement={statement}
          userId={userId}
          topicId={topicId}
        />
      ))}
    </div>
  )
}
