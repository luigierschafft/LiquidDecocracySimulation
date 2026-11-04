import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlayHeader } from '@/components/play/PlayHeader'
import { StatementSwiper } from '@/components/play/StatementSwiper'

export const dynamic = 'force-dynamic'

export default async function PlayStatementPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const [{ data: issue }, { data: evStatements }] = await Promise.all([
    supabase
      .from('issue')
      .select('id, title')
      .eq('id', params.topicId)
      .single(),
    supabase
      .from('ev_statements')
      .select('id, text')
      .eq('issue_id', params.topicId)
      .order('created_at', { ascending: true }),
  ])

  if (!issue) notFound()

  const statements = (evStatements ?? []).map((s) => ({ id: s.id, text: s.text }))

  const statementIds = statements.map((s) => s.id)
  const { data: nodes } = statementIds.length > 0
    ? await supabase
        .from('ev_discussion_nodes')
        .select('id, statement_id, type, text')
        .in('statement_id', statementIds)
        .in('type', ['pro', 'contra'])
    : { data: [] }

  return (
    <div className="mx-auto w-full max-w-sm pb-16 flex flex-col items-center">
      <div className="w-full">
        <PlayHeader backHref={`/playful/${issue.id}`} section="Pros and cons" title={issue.title} />
      </div>

      <StatementSwiper
        statements={statements}
        topicId={issue.id}
        topicTitle={issue.title}
        nodes={nodes ?? []}
      />
    </div>
  )
}
