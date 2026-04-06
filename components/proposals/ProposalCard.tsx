import Link from 'next/link'
import type { Issue } from '@/lib/types'

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
  return (
    <Link href={`/proposals/${issue.id}`}>
      <div className="card hover:shadow-md hover:border-accent/30 transition-all cursor-pointer">
        <h3 className="font-semibold text-foreground leading-tight">{issue.title}</h3>
      </div>
    </Link>
  )
}
