import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SummaryChat } from '@/components/play/SummaryChat'

export const dynamic = 'force-dynamic'

export default async function PlaySummaryPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, status')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  // Fetch statements with ratings
  const { data: statements } = await supabase
    .from('ev_statements')
    .select('id, text, ratings:ev_statement_ratings(rating)')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  // Fetch discussion nodes (pro/contra) for all statements
  const statementIds = (statements ?? []).map((s: any) => s.id)
  const { data: nodes } = statementIds.length > 0
    ? await supabase
        .from('ev_discussion_nodes')
        .select('statement_id, type, text')
        .in('statement_id', statementIds)
        .in('type', ['pro', 'contra'])
    : { data: [] }

  // Build context string for AI
  const lines: string[] = [`Topic: ${issue.title}\n`]

  for (const stmt of statements ?? []) {
    const ratings = (stmt.ratings ?? []).map((r: any) => r.rating)
    const avg = ratings.length > 0
      ? (ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length).toFixed(1)
      : null

    lines.push(`Statement: "${stmt.text}"`)
    if (avg) lines.push(`  Community rating: ${avg}/10 (${ratings.length} votes)`)
    else lines.push(`  Community rating: no ratings yet`)

    const stmtNodes = (nodes ?? []).filter((n: any) => n.statement_id === stmt.id)
    const pros = stmtNodes.filter((n: any) => n.type === 'pro')
    const contras = stmtNodes.filter((n: any) => n.type === 'contra')

    if (pros.length > 0) {
      lines.push(`  Pro arguments:`)
      pros.forEach((n: any) => lines.push(`    + ${n.text}`))
    }
    if (contras.length > 0) {
      lines.push(`  Contra arguments:`)
      contras.forEach((n: any) => lines.push(`    - ${n.text}`))
    }
    lines.push('')
  }

  const context = lines.join('\n')

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs relative mb-6">
        <Link
          href={`/topics/${issue.id}`}
          className="absolute top-0 right-0 z-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-md leading-tight text-center"
        >
          Tradi­<br />tional
        </Link>
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">
          {issue.title}<br />
          <span className="text-lg font-extrabold text-gray-500">Summary</span>
        </h1>
      </div>

      <SummaryChat context={context} topicId={issue.id} />

      <Link href={`/play/${issue.id}`} className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
