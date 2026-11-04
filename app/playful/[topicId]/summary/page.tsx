import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlayHeader } from '@/components/play/PlayHeader'
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
    <div className="mx-auto w-full max-w-sm pb-16 flex flex-col items-center">
      <div className="w-full">
        <PlayHeader
          backHref={`/playful/${issue.id}`}
          section="Summary"
          title={issue.title}
          description={(issue as any).description}
        />
      </div>

      <SummaryChat context={context} topicId={issue.id} />
    </div>
  )
}
