import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mascot } from '@/components/play/Mascot'
import { PlayBack } from '@/components/play/PlayBack'

export const dynamic = 'force-dynamic'

const CUTOFF = '2026-04-30'

export default async function PlayTopicPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, status, created_at, description')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  const isNew = issue.created_at >= CUTOFF
  const base = `/playful/${issue.id}`

  const actions: { href: string; title: string; sub?: string; ai?: boolean }[] = [
    { href: `${base}/discussion`, title: 'Discussion', sub: 'Add and rate statements' },
    { href: `${base}/statement`, title: 'Pros and cons', sub: 'See all statements, one by one' },
    { href: `${base}/proposals`, title: 'Proposals' },
    { href: `${base}/plan`, title: 'Plans' },
    { href: `${base}/summary`, title: 'Summary', sub: 'Where the discussion stands', ai: true },
    { href: `${base}/learn`, title: 'Learn more', sub: 'Ask a specialised AI', ai: true },
  ]

  return (
    <div className="mx-auto w-full max-w-sm pb-16">
      <PlayBack href="/playful/topics" label="Topics" />

      <header className="flex items-start gap-3 mb-7">
        <div className="flex-1 min-w-0">
          <h1 className="font-fun font-semibold text-[1.6rem] leading-[1.2] text-gray-900">{issue.title}</h1>
          {issue.description && (
            <p className="mt-2 text-[15px] font-semibold text-gray-600 leading-relaxed">{issue.description}</p>
          )}
        </div>
        <Mascot pose="ball" size="md" className="mt-1" />
      </header>

      <nav className="flex flex-col gap-3.5" aria-label="Topic actions">
        {actions.map((a, i) => {
          const disabled = a.ai && !isNew
          const cls = disabled ? 'play-btn-muted' : i === 0 ? 'play-btn-sun' : 'play-btn-white'
          const body = (
            <>
              {a.title}
              {a.sub && (
                <span className={`block font-playful font-bold text-[0.9rem] mt-0.5 ${i === 0 ? 'text-sun-900/70' : 'text-gray-500'}`}>
                  {disabled ? 'Only for new topics' : a.sub}
                </span>
              )}
            </>
          )
          return disabled ? (
            <div key={a.href} className={cls} aria-disabled="true">{body}</div>
          ) : (
            <Link key={a.href} href={a.href} className={cls}>{body}</Link>
          )
        })}
      </nav>
    </div>
  )
}
