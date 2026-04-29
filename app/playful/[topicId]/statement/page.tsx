import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      <div className="w-full max-w-xs relative mb-6">
        <h1 className="text-xl font-black text-gray-900 leading-tight">{issue.title}</h1>
      </div>

      <StatementSwiper
        statements={statements}
        topicId={issue.id}
        topicTitle={issue.title}
        nodes={nodes ?? []}
      />

      <Link href={`/playful/${issue.id}`} className="mt-6 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
