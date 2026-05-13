import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { StatementList } from '@/components/discussion/StatementList'
import { AddStatementForm } from '@/components/discussion/AddStatementForm'

export const dynamic = 'force-dynamic'

export default async function DiscussionPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: statements } = await supabase
    .from('ev_statements')
    .select(
      `
      *,
      author:member(display_name, email),
      ratings:ev_statement_ratings(*)
    `
    )
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: false })

  const statementsWithAvg = (statements ?? []).map((s) => {
    const ratedEntries = (s.ratings ?? []).filter((r: any) => r.rating != null)
    return {
      ...s,
      avg_rating: ratedEntries.length > 0
        ? ratedEntries.reduce((sum: number, r: any) => sum + r.rating, 0) / ratedEntries.length
        : null,
      user_rating: s.ratings?.find((r: any) => r.user_id === user?.id)?.rating ?? null,
    }
  })

  return (
    <div className="space-y-6">
      {user && <AddStatementForm topicId={params.topicId} />}
      <StatementList statements={statementsWithAvg} userId={user?.id ?? null} topicId={params.topicId} />
      <div className="pt-4 flex flex-col items-center gap-3">
        <Link href={`/topics/${params.topicId}/proposals`} className="btn-primary inline-flex items-center justify-center px-6 py-3 text-base">
          Make a proposal on this topic
        </Link>
        <Link href={`/topics/${params.topicId}/analysis`} className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-base">
          See the analysis of this discussion
        </Link>
      </div>
    </div>
  )
}
