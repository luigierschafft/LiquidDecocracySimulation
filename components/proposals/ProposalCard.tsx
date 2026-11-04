import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Issue } from '@/lib/types'

interface TagItem {
  id: string
  name: string
  color: string
}

interface ProposalCardProps {
  issue: Issue
  tags?: TagItem[]
  muted?: boolean
}

/** Topic row in the classic topic list: title, a two-line teaser, and a chevron. */
export function ProposalCard({ issue, tags, muted = false }: ProposalCardProps) {
  const description = (issue as Issue & { description?: string | null }).description
  return (
    <Link
      href={`/topics/${issue.id}/discussion`}
      className={`group flex items-center gap-4 bg-white rounded-2xl border border-line shadow-soft px-5 py-4 min-h-[72px] transition-all hover:shadow-lift hover:border-gray-300 ${
        muted ? 'opacity-75' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-bold text-gray-900 leading-snug">{issue.title}</h3>
        {description && (
          <p className="mt-1 text-[15px] text-gray-500 leading-relaxed line-clamp-2">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t.id} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                {t.name}
              </span>
            ))}
          </div>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  )
}
