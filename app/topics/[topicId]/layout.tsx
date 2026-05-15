import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { TopicHeader } from '@/components/topics/TopicHeader'

export default async function TopicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { topicId: string }
}) {
  const supabase = createClient()
  const [{ data: issue }, { data: meta }, { data: proposals }, proposalCountResult] = await Promise.all([
    supabase.from('issue').select('*').eq('id', params.topicId).single(),
    supabase.from('ev_topic_meta').select('*').eq('issue_id', params.topicId).maybeSingle(),
    supabase.from('ev_topic_proposals').select('id').eq('issue_id', params.topicId),
    supabase.from('ev_topic_proposals').select('id', { count: 'exact', head: true }).eq('issue_id', params.topicId),
  ])
  if (!issue) notFound()

  const proposalCount = proposalCountResult.count ?? 0
  const proposalIds = (proposals ?? []).map((p) => p.id)
  const planCountResult = proposalIds.length > 0
    ? await supabase.from('ev_execution_sections').select('id', { count: 'exact', head: true }).in('proposal_id', proposalIds)
    : { count: 0 }
  const planCount = planCountResult.count ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <TopicHeader issue={issue} meta={meta} topicId={params.topicId} proposalCount={proposalCount} planCount={planCount} />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
