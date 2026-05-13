'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TopicProposal, ProposalVote, ProposalArgument } from '@/lib/types/ev'
import { AiDiffPanel } from './AiDiffPanel'
import { ProposalVoteButtons } from './ProposalVoteButtons'
import { ProposedImprovements } from './ProposedImprovements'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react'

type VoteValue = ProposalVote['vote']

const VOTE_COLORS: Record<VoteValue, string> = {
  approve: 'bg-green-500',
  abstain: 'bg-gray-400',
  disapprove: 'bg-orange-400',
  strong_disapproval: 'bg-red-600',
}

const VOTE_LABELS: Record<VoteValue, string> = {
  approve: 'Approve',
  abstain: 'Abstain',
  disapprove: 'Disapprove',
  strong_disapproval: 'Strong No',
}

const VOTE_ORDER: VoteValue[] = ['approve', 'abstain', 'disapprove', 'strong_disapproval']

interface Props {
  proposal: TopicProposal
  userId: string | null
  nextProposal: TopicProposal | null
  topicId: string
}

export function TopicProposalCard({ proposal, userId, nextProposal, topicId }: Props) {
  const router = useRouter()
  const votes: ProposalVote[] = proposal.votes ?? []
  const args: ProposalArgument[] = proposal.arguments ?? []

  const totalVotes = votes.length
  const voteCounts: Record<VoteValue, number> = {
    approve: votes.filter((v) => v.vote === 'approve').length,
    abstain: votes.filter((v) => v.vote === 'abstain').length,
    disapprove: votes.filter((v) => v.vote === 'disapprove').length,
    strong_disapproval: votes.filter((v) => v.vote === 'strong_disapproval').length,
  }

  const proArgs = args.filter((a) => a.type === 'pro')
  const contraArgs = args.filter((a) => a.type === 'contra')

  const [addArgType, setAddArgType] = useState<'pro' | 'contra' | null>(null)
  const [argText, setArgText] = useState('')
  const [argLoading, setArgLoading] = useState(false)

  async function handleAddArg() {
    if (!argText.trim() || !userId || !addArgType) return
    setArgLoading(true)
    const supabase = createClient()
    await supabase.from('ev_proposal_arguments').insert({
      proposal_id: proposal.id,
      type: addArgType,
      text: argText.trim(),
      author_id: userId,
    })
    setArgText('')
    setAddArgType(null)
    setArgLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Proposal text */}
      <p className="text-sm text-gray-800 leading-relaxed">{proposal.text}</p>

      {/* Two-column: left = voting + pro/contra | right = AI diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">

          {/* 1. Current vote summary */}
          {totalVotes > 0 && (
            <div className="space-y-1">
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                {VOTE_ORDER.filter((v) => voteCounts[v] > 0).map((vote) => (
                  <div
                    key={vote}
                    className={`${VOTE_COLORS[vote]} transition-all`}
                    style={{ width: `${(voteCounts[vote] / totalVotes) * 100}%` }}
                    title={`${VOTE_LABELS[vote]}: ${voteCounts[vote]}`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {VOTE_ORDER.map((vote) => (
                  <span key={vote} className="text-xs text-gray-500">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${VOTE_COLORS[vote]}`} />
                    {VOTE_LABELS[vote]}: {voteCounts[vote]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 2. Your vote */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your Vote</h4>
            {userId ? (
              <ProposalVoteButtons proposalId={proposal.id} userId={userId} votes={votes} />
            ) : (
              <p className="text-xs text-gray-400">Log in to vote.</p>
            )}
          </div>

          {/* 3. Pro/Contra arguments */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wide flex items-center gap-1 mb-2">
                  <ThumbsUp className="w-3.5 h-3.5" /> Pro
                </h4>
                {proArgs.length === 0 ? (
                  <p className="text-xs text-gray-400">No pro arguments.</p>
                ) : (
                  <div className="space-y-1.5">
                    {proArgs.map((arg) => (
                      <div key={arg.id} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-800">{arg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-red-700 uppercase tracking-wide flex items-center gap-1 mb-2">
                  <ThumbsDown className="w-3.5 h-3.5" /> Contra
                </h4>
                {contraArgs.length === 0 ? (
                  <p className="text-xs text-gray-400">No contra arguments.</p>
                ) : (
                  <div className="space-y-1.5">
                    {contraArgs.map((arg) => (
                      <div key={arg.id} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-800">{arg.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {userId && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setAddArgType(addArgType === 'pro' ? null : 'pro')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      addArgType === 'pro'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    + PRO
                  </button>
                  <button
                    onClick={() => setAddArgType(addArgType === 'contra' ? null : 'contra')}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                      addArgType === 'contra'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    − CONTRA
                  </button>
                </div>
                {addArgType && (
                  <div className="flex gap-2">
                    <textarea
                      value={argText}
                      onChange={(e) => setArgText(e.target.value)}
                      placeholder={`Add ${addArgType === 'pro' ? 'pro' : 'contra'} argument…`}
                      rows={2}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleAddArg}
                      disabled={argLoading || !argText.trim()}
                      className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Improvements + AI Diff panel */}
        <div className="space-y-4">
          <ProposedImprovements
            proposalId={proposal.id}
            userId={userId}
            improvements={proposal.improvements ?? []}
          />
          <AiDiffPanel currentText={proposal.text} nextText={nextProposal?.text ?? null} />
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <Link
          href={`/topics/${topicId}/plan/${proposal.id}`}
          className="btn-primary inline-flex items-center justify-center px-5 py-2.5 text-sm"
        >
          Write a project plan for this proposal
        </Link>
      </div>
    </div>
  )
}
