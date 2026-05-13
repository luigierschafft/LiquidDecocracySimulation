import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function PlanPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const { data: proposals } = await supabase
    .from('ev_topic_proposals')
    .select('id, text, created_at')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-4">
      {(proposals ?? []).length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">No proposals yet. Go to Proposals to add one first.</p>
        </div>
      )}
      {(proposals ?? []).map((proposal) => (
        <div key={proposal.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="text-sm text-gray-800 leading-relaxed">{proposal.text}</p>
          <Link
            href={`/topics/${params.topicId}/plan/${proposal.id}`}
            className="btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm"
          >
            See the project plan for this proposal
          </Link>
        </div>
      ))}
    </div>
  )
}
