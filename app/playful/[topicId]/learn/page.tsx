import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlayHeader } from '@/components/play/PlayHeader'
import { LearnChat } from '@/components/play/LearnChat'

export const dynamic = 'force-dynamic'

export default async function PlayLearnPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select('id, title')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  // Load discussion context
  const { data: statements } = await supabase
    .from('ev_statements')
    .select('id, text, ratings:ev_statement_ratings(rating)')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  const statementIds = (statements ?? []).map((s: any) => s.id)
  const { data: nodes } = statementIds.length > 0
    ? await supabase
        .from('ev_discussion_nodes')
        .select('statement_id, type, text')
        .in('statement_id', statementIds)
        .in('type', ['pro', 'contra'])
    : { data: [] }

  const lines: string[] = [`Topic: ${issue.title}\n`]
  for (const stmt of statements ?? []) {
    const ratings = (stmt.ratings ?? []).map((r: any) => r.rating)
    const avg = ratings.length > 0
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : null
    lines.push(`Statement: "${stmt.text}"${avg ? ` (avg rating: ${avg}/10)` : ''}`)
    const pros = (nodes ?? []).filter((n: any) => n.statement_id === stmt.id && n.type === 'pro')
    const contras = (nodes ?? []).filter((n: any) => n.statement_id === stmt.id && n.type === 'contra')
    pros.forEach((n: any) => lines.push(`  + ${n.text}`))
    contras.forEach((n: any) => lines.push(`  - ${n.text}`))
    lines.push('')
  }
  const context = lines.join('\n')

  return (
    <div className="mx-auto w-full max-w-sm pb-16 flex flex-col items-center">
      <div className="w-full">
        <PlayHeader backHref={`/playful/${issue.id}`} section="Learn more" title={issue.title} />
      </div>

      <LearnChat context={context} />
    </div>
  )
}
