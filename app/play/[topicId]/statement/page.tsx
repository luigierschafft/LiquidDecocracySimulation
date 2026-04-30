import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatementSwiper } from '@/components/play/StatementSwiper'

export const dynamic = 'force-dynamic'

export default async function PlayStatementPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const [{ data: issue }, { data: evStatements }, { data: evNodes }] = await Promise.all([
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
    supabase
      .from('ev_discussion_nodes')
      .select('*')
      .eq('statement_id', params.topicId),
  ])

  if (!issue) notFound()

  const statements = (evStatements ?? []).map((s) => ({ id: s.id, text: s.text }))
  const nodes = evNodes ?? []

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
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">{issue.title}</h1>
      </div>

      <StatementSwiper
        statements={statements}
        topicId={issue.id}
        topicTitle={issue.title}
        nodes={nodes}
      />

      <Link href={`/play/${issue.id}`} className="mt-6 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
