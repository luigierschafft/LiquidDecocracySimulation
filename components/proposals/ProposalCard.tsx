import Link from 'next/link'
import type { Issue } from '@/lib/types'

const CUTOFF = '2026-04-30'

interface TagItem {
  id: string
  name: string
  color: string
}

interface ProposalCardProps {
  issue: Issue
  tags?: TagItem[]
}

export function ProposalCard({ issue }: ProposalCardProps) {
  const isNew = (issue as any).created_at >= CUTOFF
  return (
    <Link href={`/topics/${issue.id}/discussion`}>
      <div className={`card hover:shadow-md transition-all cursor-pointer ${isNew ? 'hover:border-accent/30' : 'opacity-50 grayscale'}`}>
        <h3 className="font-normal text-foreground leading-tight">{issue.title}</h3>
      </div>
    </Link>
  )
}
