import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { getCurrentPlatformId } from '@/lib/platform'
import { Mascot } from '@/components/play/Mascot'

export const dynamic = 'force-dynamic'

const CUTOFF = '2026-04-30'

// Each topic gets a calm virtue colour as its marker, cycling through the palette
const DOTS = ['#F5AE3A', '#4C95DB', '#6DBA4A', '#E866A6', '#33B4C6', '#8E74D0', '#F08D5B', '#5AAFEF']

type Issue = { id: string; title: string; created_at: string }

function TopicButton({ issue, color, muted }: { issue: Issue; color: string; muted?: boolean }) {
  return (
    <Link
      href={`/playful/${issue.id}`}
      className={`play-btn-white flex items-center gap-4 text-left !min-h-[60px] !py-3.5 !text-base ${muted ? 'opacity-70' : ''}`}
    >
      <span
        aria-hidden="true"
        className="h-9 w-9 shrink-0 rounded-full"
        style={{ background: muted ? '#CDD2DA' : color }}
      />
      <span className="flex-1">{issue.title}</span>
    </Link>
  )
}

export default async function PlayTopicsPage() {
  const supabase = createClient()
  const platformId = await getCurrentPlatformId()
  let issueQuery = supabase
    .from('issue')
    .select('id, title, status, created_at')
    .neq('status', 'draft')
    .order('created_at', { ascending: false })
  if (platformId) issueQuery = issueQuery.eq('platform_id', platformId)
  const { data: issues } = await issueQuery

  const list = issues ?? []
  const current = list.filter((i) => i.created_at >= CUTOFF)
  const earlier = list.filter((i) => i.created_at < CUTOFF)

  return (
    <div className="mx-auto w-full max-w-sm pb-16">
      <div className="flex items-center gap-3 mb-6">
        <Mascot pose="handstand" size="sm" />
        <div>
          <h1 className="font-fun font-semibold text-[1.75rem] leading-tight text-gray-900">Topics</h1>
          <p className="text-[15px] font-semibold text-gray-600 leading-snug">Pick one to sense, discuss and learn.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {current.map((issue, i) => (
          <TopicButton key={issue.id} issue={issue} color={DOTS[i % DOTS.length]} />
        ))}

        <Link href="/proposals/new" className="play-btn-sun !min-h-[60px] !text-base">
          Start a new topic
        </Link>
      </div>

      {earlier.length > 0 && (
        <section className="mt-10">
          <h2 className="font-fun font-semibold text-lg text-gray-600 mb-3 px-1">Earlier topics</h2>
          <div className="flex flex-col gap-3">
            {earlier.map((issue, i) => (
              <TopicButton key={issue.id} issue={issue} color={DOTS[i % DOTS.length]} muted />
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <p className="text-center text-gray-500 font-semibold mt-6">No topics yet. Start the first one.</p>
      )}
    </div>
  )
}
