import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs relative mb-6">
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">
          {issue.title}<br />
          <span className="text-lg font-extrabold text-gray-500">Learn</span>
        </h1>
      </div>

      <LearnChat context={context} />

      <Link href={`/playful/${issue.id}`} className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
