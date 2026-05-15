'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ProposalVote } from '@/lib/types/ev'
import { useModules } from '@/components/ModulesContext'
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation'
import { DisapproveReasonModal } from './DisapproveReasonModal'
import { StrongNoNeedsModal } from './StrongNoNeedsModal'
import { PositionPaperModal } from './PositionPaperModal'
import { ImpactLevelModal } from './ImpactLevelModal'

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

type ModalStep =
  | 'impact_level'
  | 'disapprove_reason'
  | 'strong_no_needs'
  | 'position_paper'
  | null

export function ProposalVoteButtons({ proposalId, userId, votes, onVoted }: Props) {
  const router = useRouter()
  const modules = useModules()

  const currentVote = votes.find((v) => v.user_id === userId)?.vote ?? null
  const hasVotedOnThis = currentVote !== null

  const [selected, setSelected] = useState<VoteValue | null>(currentVote)
  const [loading, setLoading] = useState(false)
  const [pendingVote, setPendingVote] = useState<VoteValue | null>(null)
  const [activeModal, setActiveModal] = useState<ModalStep>(null)
  const [castVoteValue, setCastVoteValue] = useState<VoteValue | null>(currentVote)
  const [showVoteAnimation, setShowVoteAnimation] = useState(false)

  async function castVote(value: VoteValue) {
    setLoading(true)
    await fetch('/api/vote/proposal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: proposalId, vote: value }),
    })
    setSelected(value)
    setCastVoteValue(value)
    setShowVoteAnimation(true)
    setLoading(false)
    router.refresh()
  }

  /**
   * Orchestrates the modal flow for a given vote value:
   * 1. impact_level (only on first vote, if module active)
   * 2. disapprove_reason / strong_no_needs (if applicable module active)
   * 3. cast the actual vote
   * 4. position_paper (if module active)
   */
  async function handleVoteFlow(value: VoteValue) {
    if (loading) return
    setPendingVote(value)

    // Step 1: impact_level (first vote only)
    if (modules.impact_level && !hasVotedOnThis) {
      setActiveModal('impact_level')
      return
    }

    // Step 2a: disapprove reason
    if (value === 'disapprove' && modules.disapprove_reason) {
      setActiveModal('disapprove_reason')
      return
    }

    // Step 2b: strong no needs
    if (value === 'strong_disapproval' && modules.strong_no_needs) {
      setActiveModal('strong_no_needs')
      return
    }

    // No pre-vote modals — cast vote directly
    await castVote(value)
    setPendingVote(null)

    // Step 4: position paper
    if (modules.position_paper) {
      setActiveModal('position_paper')
    }
  }

  async function handleImpactDone() {
    const value = pendingVote!
    setActiveModal(null)

    // After impact level, check for reason/needs modals
    if (value === 'disapprove' && modules.disapprove_reason) {
      setActiveModal('disapprove_reason')
      return
    }
    if (value === 'strong_disapproval' && modules.strong_no_needs) {
      setActiveModal('strong_no_needs')
      return
    }

    await castVote(value)
    setPendingVote(null)

    if (modules.position_paper) {
      setActiveModal('position_paper')
    }
  }

  async function handleDisapproveDone() {
    const value = pendingVote!
    setActiveModal(null)
    await castVote(value)
    setPendingVote(null)

    if (modules.position_paper) {
      setActiveModal('position_paper')
    }
  }

  async function handleStrongNoDone() {
    const value = pendingVote!
    setActiveModal(null)
    await castVote(value)
    setPendingVote(null)

    if (modules.position_paper) {
      setActiveModal('position_paper')
    }
  }

  function handlePositionPaperDone() {
    setActiveModal(null)
    setPendingVote(null)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {VOTE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleVoteFlow(opt.value)}
            disabled={loading}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
              selected === opt.value ? opt.activeClass : opt.baseClass
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {activeModal === 'impact_level' && (
        <ImpactLevelModal
          proposalId={proposalId}
          onDone={handleImpactDone}
        />
      )}

      {activeModal === 'disapprove_reason' && (
        <DisapproveReasonModal
          proposalId={proposalId}
          onDone={handleDisapproveDone}
        />
      )}

      {activeModal === 'strong_no_needs' && (
        <StrongNoNeedsModal
          proposalId={proposalId}
          onDone={handleStrongNoDone}
        />
      )}

      {showVoteAnimation && (
        <CelebrationAnimation size="small" onComplete={() => setShowVoteAnimation(false)} />
      )}

      {activeModal === 'position_paper' && castVoteValue !== null && (
        <PositionPaperModal
          proposalId={proposalId}
          voteValue={castVoteValue}
          onDone={handlePositionPaperDone}
        />
      )}
    </>
  )
}
