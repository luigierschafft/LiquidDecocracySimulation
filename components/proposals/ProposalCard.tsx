import Link from 'next/link'
import type { Issue } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { VoteBar } from './VoteBar'
import { countVotes } from '@/lib/voting/approval'
import { formatDate, statusLabel, truncate, getStatusVariant } from '@/lib/utils'
import { MessageSquare, ThumbsUp } from 'lucide-react'

interface TagItem {
  id: string
  name: string
  color: string
}

interface ProposalCardProps {
  issue: Issue
  tags?: TagItem[]
}

export function ProposalCard({ issue, tags }: ProposalCardProps) {
  const initiative = issue.initiatives?.[0]
  const votes = initiative?.votes ? countVotes(initiative.votes) : null

  return (
    <Link href={`/proposals/${issue.id}`}>
      <div className="card hover:shadow-md hover:border-accent/30 transition-all cursor-pointer h-full flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight line-clamp-2">{issue.title}</h3>
            {issue.area && (
              <p className="text-xs text-foreground/50 mt-0.5">{issue.area.unit?.name} · {issue.area.name}</p>
            )}
          </div>
          <Badge variant={getStatusVariant(issue.status)}>
            {statusLabel(issue.status)}
          </Badge>
        </div>

        {initiative && (
          <p className="text-sm text-foreground/60 line-clamp-2 flex-1">
            {truncate(initiative.content.replace(/[#*`]/g, ''), 120)}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {votes && issue.status === 'voting' && (
          <VoteBar votes={votes} />
        )}

        <div className="flex items-center justify-between text-xs text-foreground/40 pt-1 border-t border-sand">
          <span>{formatDate(issue.created_at)}</span>
          <div className="flex items-center gap-3">
            {issue.initiatives && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {issue.initiatives.length}
              </span>
            )}
            {votes && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" />
                {votes.total}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
