import { createClient } from '@/lib/supabase/server'
import { TopicProposalCard } from '@/components/proposals/TopicProposalCard'
import { AddTopicProposalForm } from '@/components/proposals/AddTopicProposalForm'

export const dynamic = 'force-dynamic'

export default async function ProposalsPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: proposals } = await supabase
    .schema('ev')
    .from('topic_proposals')
    .select(
      `
      *,
      author:member!topic_proposals_author_id_fkey(display_name, email),
      votes:proposal_votes(*),
      arguments:proposal_arguments(*, author:member!proposal_arguments_author_id_fkey(display_name, email)),
      improvements:proposed_improvements(*, author:member!proposed_improvements_author_id_fkey(display_name, email))
    `
    )
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  return (
    <div className="space-y-6">
      {user && <AddTopicProposalForm topicId={params.topicId} />}
      <div className="space-y-8">
        {(proposals ?? []).length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Noch keine Proposals. Reiche den ersten ein!</p>
          </div>
        )}
        {(proposals ?? []).map((proposal, index) => (
          <TopicProposalCard
            key={proposal.id}
            proposal={proposal}
            userId={user?.id ?? null}
            nextProposal={(proposals ?? [])[index + 1] ?? null}
          />
        ))}
      </div>
    </div>
  )
}
