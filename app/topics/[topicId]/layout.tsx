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
  const [{ data: issue }, { data: meta }] = await Promise.all([
    supabase.from('issue').select('*').eq('id', params.topicId).single(),
    supabase.from('ev_topic_meta').select('*').eq('issue_id', params.topicId).maybeSingle(),
  ])
  if (!issue) notFound()
  return (
    <div className="min-h-screen bg-gray-50">
      <TopicHeader issue={issue} meta={meta} topicId={params.topicId} />
      <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
