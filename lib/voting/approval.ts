import type { Vote, VoteCount } from '@/lib/types'

export function countVotes(votes: Vote[]): VoteCount {
  const counts = { approve: 0, oppose: 0, abstain: 0 }
  for (const v of votes) counts[v.value]++
  const total = votes.length
  const decisive = counts.approve + counts.oppose
  const approvalPercent = decisive > 0 ? Math.round((counts.approve / decisive) * 100) : 0
  return { ...counts, total, approvalPercent }
}
