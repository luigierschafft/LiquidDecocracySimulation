'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const { user, loading } = useAuthUser()
  // Space for the fixed buttons top-right: "Sign in" + menu for visitors, menu only otherwise
  const clearFixedButtons = !loading && !user ? 'sm:pr-44' : 'sm:pr-16'

  const activeSection: Section =
    pathname.includes('/proposals')
      ? 'proposals'
      : pathname.includes('/plan')
      ? 'plan'
      : 'discussion'

  const description = (issue as Issue & { description?: string | null }).description
  const { isForever, percentUsed, daysRemaining } = getTimelineInfo(issue)
  const sectionInfo = SECTIONS.find((s) => s.value === activeSection)
  const counts: Record<Section, number | null> = { discussion: null, proposals: proposalCount, plan: planCount }

  return (
    <div className="bg-white border-b border-line">
      {/* Right padding keeps the title clear of the fixed Sign-in / menu buttons */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-[72px] sm:pt-6 pb-5 space-y-3.5">
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
          <h1 className="text-[1.6rem] sm:text-3xl font-extrabold text-gray-900 leading-tight">{issue.title}</h1>
        </div>

        {description && (
          <p className="text-base text-gray-600 max-w-2xl leading-relaxed">{description}</p>
        )}

        {/* 2. Section tabs (segmented control) */}
        <nav aria-label="Topic sections" className="pt-1">
          <div className="inline-flex w-full sm:w-auto rounded-2xl bg-gray-100 p-1 gap-1">
            {SECTIONS.map((s) => {
              const active = s.value === activeSection
              const count = counts[s.value]
              return (
                <Link
                  key={s.value}
                  href={`/topics/${topicId}/${s.value}`}
                  aria-current={active ? 'page' : undefined}
                  className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl text-[15px] font-semibold transition-colors ${
                    active ? 'bg-white text-gray-900 shadow-soft' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {s.label}
                  {count !== null && (
                    <span className={`min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold inline-flex items-center justify-center ${
                      active ? 'bg-accent-soft text-accent' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
        {sectionInfo && <p className="text-[15px] text-gray-500 max-w-2xl leading-relaxed">{sectionInfo.description}</p>}

        {/* 3. Timeline */}
        {isForever ? (
          <p className="text-sm text-gray-500">Open forever</p>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sun-400 to-accent"
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
