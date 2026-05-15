import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 pt-6 pb-16">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link href={`/playful/${params.topicId}`} className="text-xs text-gray-400 underline">
            ← Back
          </Link>
          <h1 className="text-xl font-black text-gray-900 leading-tight mt-2">{issue.title}</h1>
          <p className="text-sm text-amber-600 font-semibold mt-0.5">Proposals</p>
        </div>

        {/* Add proposal form */}
        {user && (
          <div className="bg-white rounded-[1.5rem] border border-amber-200 shadow-sm p-4">
            <AddTopicProposalForm topicId={params.topicId} />
          </div>
        )}

        {/* Proposals list */}
        {list.length === 0 ? (
          <div className="bg-white/80 rounded-[1.5rem] border border-amber-200 shadow-sm px-6 py-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 text-sm">No proposals yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {list.map((proposal: any, index: number) => (
              <div key={proposal.id} className="bg-white rounded-[1.5rem] border border-amber-200 shadow-md overflow-hidden">
                {/* Playful proposal number badge */}
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-2 flex items-center gap-2">
                  <span className="text-white font-black text-sm">#{index + 1}</span>
                  <span className="text-white/70 text-xs">Proposal</span>
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
