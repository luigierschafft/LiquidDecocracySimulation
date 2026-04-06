'use client'

import { useRouter, usePathname } from 'next/navigation'
import type { Issue } from '@/lib/types'
import type { TopicMeta } from '@/lib/types/ev'

type Section = 'discussion' | 'proposals' | 'execution'

const SECTIONS: { value: Section; label: string; description: string }[] = [
  {
    value: 'discussion',
    label: 'Diskussion',
    description:
      'Hier werden gemeinsam Statements gesammelt und bewertet. Jedes Statement kann maximal 100 Zeichen lang sein und mit Pro/Contra-Argumenten diskutiert werden. Statements können auf einer Skala von 0 (unwichtig) bis 10 (sehr wichtig) bewertet werden.',
  },
  {
    value: 'proposals',
    label: 'Proposals',
    description:
      'Hier werden konkrete Vorschläge eingereicht und abgestimmt. Jeder Vorschlag kann mit Approve, Abstain, Disapprove oder Strong Disapproval bewertet werden. Pro/Contra-Argumente und Verbesserungsvorschläge können hinzugefügt werden.',
  },
  {
    value: 'execution',
    label: 'Execution',
    description:
      'Hier entsteht der Projektplan für eine angenommene Initiative. Der Workspace enthält Aufgaben, Team, Zeitplan und Ziele. Alle Änderungen werden als Vorschläge eingereicht und gemeinsam abgestimmt.',
  },
]

interface Props {
  issue: Issue
  meta: TopicMeta | null
  topicId: string
}

export function TopicHeader({ issue, topicId }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const activeSection: Section =
    pathname.includes('/proposals')
      ? 'proposals'
      : pathname.includes('/execution')
      ? 'execution'
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
        <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-2xl">{current.description}</p>
      </div>
    </div>
  )
}
