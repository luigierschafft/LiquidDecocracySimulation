'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ProposalVote } from '@/lib/types/ev'

type VoteValue = ProposalVote['vote']

const VOTE_OPTIONS: { value: VoteValue; label: string; activeClass: string; baseClass: string }[] = [
  {
    value: 'approve',
    label: 'Approve',
    activeClass: 'bg-green-600 text-white border-green-600',
    baseClass: 'border-green-200 text-green-700 hover:bg-green-50',
  },
  {
    value: 'abstain',
    label: 'Abstain',
    activeClass: 'bg-gray-500 text-white border-gray-500',
    baseClass: 'border-gray-200 text-gray-600 hover:bg-gray-50',
  },
  {
    value: 'disapprove',
    label: 'Disapprove',
    activeClass: 'bg-orange-500 text-white border-orange-500',
    baseClass: 'border-orange-200 text-orange-600 hover:bg-orange-50',
  },
  {
    value: 'strong_disapproval',
    label: 'Strong No',
    activeClass: 'bg-red-600 text-white border-red-600',
    baseClass: 'border-red-200 text-red-700 hover:bg-red-50',
  },
]

interface Props {
  proposalId: string
  userId: string
  votes: ProposalVote[]
  onVoted?: (votes: ProposalVote[]) => void
}

export function ProposalVoteButtons({ proposalId, userId, votes, onVoted }: Props) {
  const router = useRouter()
  const currentVote = votes.find((v) => v.user_id === userId)?.vote ?? null
  const [selected, setSelected] = useState<VoteValue | null>(currentVote)
  const [loading, setLoading] = useState(false)

  async function handleVote(value: VoteValue) {
    if (loading) return
    setLoading(true)
    const supabase = createClient()

    await supabase.schema('ev').from('proposal_votes').upsert(
      {
        proposal_id: proposalId,
        user_id: userId,
        vote: value,
      },
      { onConflict: 'proposal_id,user_id' }
    )

    setSelected(value)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {VOTE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleVote(opt.value)}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
            selected === opt.value ? opt.activeClass : opt.baseClass
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
