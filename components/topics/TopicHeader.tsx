'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuthUser } from '@/lib/hooks/useAuthUser'
import type { Issue } from '@/lib/types'
import type { TopicMeta } from '@/lib/types/ev'

type Section = 'discussion' | 'proposals' | 'plan'

const SECTIONS: { value: Section; label: string; description: string }[] = [
  {
    value: 'discussion',
    label: 'Discussion',
    description:
      'Collect and rate statements together. Each statement is max 200 characters and can be discussed with pro/contra arguments. Rate statements on a scale from 0 (not important) to 10 (very important).',
  },
  {
    value: 'proposals',
    label: 'Proposals',
    description:
      'Submit and vote on concrete proposals. Each proposal can be rated Approve, Abstain, Disapprove or Strong No. Add pro/contra arguments and improvement suggestions.',
  },
  {
    value: 'plan',
    label: 'Plan',
    description:
      'The project workspace for an accepted initiative. Contains tasks, team, timeline and goals. Track progress and collaborate on implementation.',
  },
]

interface Props {
  issue: Issue
  meta: TopicMeta | null
  topicId: string
  proposalCount: number
  planCount: number
}

function getTimelineInfo(issue: Issue) {
  if (!issue.duration || issue.duration === 'forever' || !issue.closes_at) {
    return { isForever: true, percentUsed: 0, daysRemaining: null }
  }
  const created = new Date(issue.created_at).getTime()
  const closes = new Date(issue.closes_at).getTime()
  const now = Date.now()
  const total = closes - created
  const elapsed = now - created
  const percentUsed = Math.min(100, Math.max(0, (elapsed / total) * 100))
  const daysRemaining = Math.max(0, Math.ceil((closes - now) / (1000 * 60 * 60 * 24)))
  return { isForever: false, percentUsed, daysRemaining }
}

export function TopicHeader({ issue, topicId, proposalCount, planCount }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useAuthUser()
  // Space for the fixed buttons top-right: "Sign in" + menu for visitors, menu only otherwise
  const clearFixedButtons = !loading && !user ? 'pr-36' : 'pr-14'

  const activeSection: Section =
    pathname.includes('/proposals')
      ? 'proposals'
      : pathname.includes('/plan')
      ? 'plan'
      : 'discussion'

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const section = e.target.value as Section
    router.push(`/topics/${topicId}/${section}`)
  }

  const description = (issue as Issue & { description?: string | null }).description
  const { isForever, percentUsed, daysRemaining } = getTimelineInfo(issue)
  const sectionInfo = SECTIONS.find((s) => s.value === activeSection)

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Right padding keeps the title clear of the fixed Sign-in / menu buttons */}
      <div className="max-w-4xl mx-auto px-4 pt-5 pb-4 space-y-3">
        {/* 1. Title — always first */}
        <div className={`flex items-start gap-2 ${clearFixedButtons} xl:pr-0`}>
          <Link
            href="/topics"
            aria-label="Back to all topics"
            title="All topics"
            className="mt-1 -ml-1.5 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{issue.title}</h1>
        </div>

        {description && (
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">{description}</p>
        )}

        {/* 2. Section switcher */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <select
            value={activeSection}
            onChange={handleChange}
            aria-label="Topic section"
            className="border border-purple-300 rounded-lg px-3 py-2 text-base font-medium text-purple-700 bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">
            <span className="text-purple-600 font-semibold">{proposalCount}</span> Proposals
            {' · '}
            <span className="text-purple-600 font-semibold">{planCount}</span> Plan Items
          </p>
        </div>
        {sectionInfo && <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">{sectionInfo.description}</p>}

        {/* 3. Timeline */}
        {isForever ? (
          <p className="text-sm text-gray-500">Open forever</p>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">{daysRemaining} days left</span>
          </div>
        )}
      </div>
    </div>
  )
}
