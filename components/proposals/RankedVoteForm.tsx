'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Initiative, RankedVote } from '@/lib/types'
import { getMemberDisplayName } from '@/lib/utils'
import { ListOrdered, Check } from 'lucide-react'

interface Props {
  issueId: string
  initiatives: Initiative[]
  userId: string
  existingVotes: RankedVote[]
}

export function RankedVoteForm({ issueId, initiatives, userId, existingVotes }: Props) {
  const initialRanks: Record<string, number> = {}
  for (const v of existingVotes) initialRanks[v.initiative_id] = v.rank

  const [ranks, setRanks] = useState<Record<string, number>>(initialRanks)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  function setRank(initiativeId: string, value: number) {
    setRanks((prev) => ({ ...prev, [initiativeId]: value }))
    setSaved(false)
  }

  async function submitRanking(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()

    // Delete existing votes for this member+issue
    await supabase
      .from('ranked_vote')
      .delete()
      .eq('issue_id', issueId)
      .eq('member_id', userId)

    // Insert new votes
    const inserts = initiatives
      .filter((i) => ranks[i.id] != null && ranks[i.id] > 0)
      .map((i) => ({
        issue_id: issueId,
        initiative_id: i.id,
        member_id: userId,
        rank: ranks[i.id],
      }))

    if (inserts.length > 0) {
      await supabase.from('ranked_vote').insert(inserts)
    }

    setSaved(true)
    setLoading(false)
  }

  const hasVotes = Object.values(ranks).some((r) => r > 0)

  return (
    <div className="border border-accent/20 rounded-xl bg-accent/5 p-5 space-y-4">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <ListOrdered className="w-5 h-5 text-accent" />
        Rank the Proposals
        <span className="text-xs font-normal text-foreground/40 ml-1">(Schulze method)</span>
      </h2>
      <p className="text-sm text-foreground/60">
        Assign a rank to each proposal — <strong>1 = most preferred</strong>. Leave at 0 to abstain on a proposal.
      </p>

      <form onSubmit={submitRanking} className="space-y-3">
        {initiatives.map((initiative) => (
          <div key={initiative.id} className="flex items-center gap-3 rounded-lg bg-background border border-sand px-4 py-3">
            <input
              type="number"
              min={0}
              max={initiatives.length}
              value={ranks[initiative.id] ?? 0}
              onChange={(e) => setRank(initiative.id, Number(e.target.value))}
              className="input w-16 text-center text-sm py-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{initiative.title}</p>
              <p className="text-xs text-foreground/40">{getMemberDisplayName(initiative.author)}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-1">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <Check className="w-3.5 h-3.5" />
              Ranking saved
            </span>
          )}
          {!saved && <span />}
          <button
            type="submit"
            disabled={loading || !hasVotes}
            className="btn-primary"
          >
            {loading ? 'Saving…' : 'Save Ranking'}
          </button>
        </div>
      </form>
    </div>
  )
}
