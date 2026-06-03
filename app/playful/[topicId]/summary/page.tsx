import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SummaryChat } from '@/components/play/SummaryChat'

export const dynamic = 'force-dynamic'

export default async function PlaySummaryPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, status, description')
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

  // Fetch proposals
  const { data: proposals } = await supabase
    .from('ev_topic_proposals')
    .select('text')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  // Build context string for AI — only real data
  const lines: string[] = [`Topic: ${issue.title}`]

  if ((issue as any).description) {
    lines.push(`Description: ${(issue as any).description}`)
  }
  lines.push('')

  const stmtList = statements ?? []
  const proposalList = proposals ?? []

  if (stmtList.length === 0 && proposalList.length === 0) {
    lines.push('No discussion data available yet. The community has not added any statements or proposals.')
  }

  for (const stmt of stmtList) {
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

  if (proposalList.length > 0) {
    lines.push('Proposals from the community:')
    proposalList.forEach((p: any, i: number) => lines.push(`  ${i + 1}. ${p.text}`))
  }

  const context = lines.join('\n')

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs mb-5 text-center">
        <h1 className="text-xl font-black text-gray-900 leading-tight">{issue.title}</h1>
        <span className="text-sm font-bold text-gray-400">Summary</span>
        {(issue as any).description && (
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-left">
            <p className="text-xs font-semibold text-amber-700 mb-1">About this topic</p>
            <p className="text-xs text-gray-600 leading-relaxed">{(issue as any).description}</p>
          </div>
        )}
      </div>

      <SummaryChat context={context} topicId={issue.id} />

      <Link href={`/playful/${issue.id}`} className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
