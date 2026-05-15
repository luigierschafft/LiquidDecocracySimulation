'use client'

import { useRouter, usePathname } from 'next/navigation'
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

  const activeSection: Section =
    pathname.includes('/proposals')
      ? 'proposals'
      : pathname.includes('/plan')
      ? 'plan'
      : 'discussion'

  const current = SECTIONS.find((s) => s.value === activeSection)!

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const section = e.target.value as Section
    router.push(`/topics/${topicId}/${section}`)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug">{issue.title}</h1>
          <select
            value={activeSection}
            onChange={handleChange}
            className="self-start sm:self-auto border border-purple-300 rounded-lg px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {(() => {
          const { isForever, percentUsed, daysRemaining } = getTimelineInfo(issue)
          return (
            <div className="mt-3 space-y-1.5">
              {isForever ? (
                <p className="text-xs text-gray-400">Open forever</p>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                      style={{ width: `${percentUsed}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{daysRemaining} days left</span>
                </div>
              )}
              <p className="text-xs text-gray-400">
                <span className="text-purple-600 font-medium">{proposalCount}</span> Proposals
                {' · '}
                <span className="text-purple-600 font-medium">{planCount}</span> Plan Items
              </p>
            </div>
          )
        })()}
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">{current.description}</p>
      </div>
    </div>
  )
}
