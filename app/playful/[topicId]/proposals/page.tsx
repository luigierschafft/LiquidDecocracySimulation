import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Mascot } from '@/components/play/Mascot'
import { PlayHeader } from '@/components/play/PlayHeader'
import { TopicProposalCard } from '@/components/proposals/TopicProposalCard'
import { AddTopicProposalForm } from '@/components/proposals/AddTopicProposalForm'

export const dynamic = 'force-dynamic'

export default async function PlayProposalsPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const [{ data: issue }, { data: { user } }, { data: proposals }] = await Promise.all([
    supabase.from('issue').select('id, title').eq('id', params.topicId).single(),
    supabase.auth.getUser(),
    supabase
      .from('ev_topic_proposals')
      .select(`
        *,
        author:member(display_name, email),
        votes:ev_proposal_votes(*),
        arguments:ev_proposal_arguments(*, author:member(display_name, email)),
        improvements:ev_proposed_improvements(*, votes:ev_improvement_votes(*))
      `)
      .eq('issue_id', params.topicId)
      .order('created_at', { ascending: true }),
  ])

  if (!issue) notFound()

  const list = proposals ?? []

  return (
    <div className="pb-16">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <PlayHeader backHref={`/playful/${params.topicId}`} section="Proposals" title={issue.title} />

        {/* Add proposal form */}
        {user && (
          <div className="play-card">
            <AddTopicProposalForm topicId={params.topicId} />
          </div>
        )}

        {/* Proposals list */}
        {list.length === 0 ? (
          <div className="play-card px-6 py-10 flex flex-col items-center text-center">
            <Mascot pose="thinking" size="md" />
            <p className="mt-3 font-fun font-semibold text-lg text-gray-800">No proposals yet</p>
            <p className="text-[15px] font-semibold text-gray-500">Be the first to suggest what to do.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {list.map((proposal: any, index: number) => (
              <div key={proposal.id} className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
                {/* Playful proposal number badge */}
                <div className="px-5 pt-4 flex items-center gap-2">
                  <span className="h-7 min-w-[28px] px-2 rounded-full bg-sun-100 text-sun-700 font-fun font-semibold text-sm inline-flex items-center justify-center">{index + 1}</span>
                  <span className="font-fun font-semibold text-[15px] text-gray-500">Proposal</span>
                </div>
                <div className="p-5">
                  <TopicProposalCard
                    proposal={proposal}
                    userId={user?.id ?? null}
                    nextProposal={list[index + 1] ?? null}
                    topicId={params.topicId}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
