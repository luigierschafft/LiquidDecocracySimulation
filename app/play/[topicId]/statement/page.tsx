import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatementSwiper } from '@/components/play/StatementSwiper'

export const dynamic = 'force-dynamic'

export default async function PlayStatementPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const [{ data: issue }, { data: opinions }] = await Promise.all([
    supabase
      .from('issue')
      .select('id, title')
      .eq('id', params.topicId)
      .single(),
    supabase
      .from('opinion')
      .select('id, content')
      .eq('issue_id', params.topicId)
      .is('parent_id', null)
      .order('created_at', { ascending: true }),
  ])

  if (!issue) notFound()

  const statements = (opinions ?? []).map((o) => ({ id: o.id, content: o.content }))

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
      />

      <Link href={`/play/${issue.id}`} className="mt-6 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
