import { schulze, buildPreferenceMatrix } from './schulze'

export async function computeSchulzeWinner(
  supabase: any,
  issueId: string
): Promise<string | null> {
  const { data: initiatives } = await supabase
    .from('initiative')
    .select('id')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true })

  if (!initiatives?.length) return null

  const initiativeIds: string[] = initiatives.map((i: any) => i.id)
  const candidateCount = initiativeIds.length

  const { data: votes } = await supabase
    .from('ranked_vote')
    .select('member_id, initiative_id, rank')
    .eq('issue_id', issueId)

  if (!votes?.length) return null

  // Group votes by member
  const byMember = new Map<string, Map<string, number>>()
  for (const v of votes) {
    if (!byMember.has(v.member_id)) byMember.set(v.member_id, new Map())
    byMember.get(v.member_id)!.set(v.initiative_id, v.rank)
  }

  // Build ballots as ordered index arrays (rank 1 = best = first in array)
  const ballots: number[][] = []
  Array.from(byMember.values()).forEach((rankMap) => {
    const ballot: { idx: number; rank: number }[] = []
    Array.from(rankMap.entries()).forEach(([initId, rank]) => {
      const idx = initiativeIds.indexOf(initId)
      if (idx >= 0) ballot.push({ idx, rank })
    })
    ballot.sort((a, b) => a.rank - b.rank)
    ballots.push(ballot.map((b) => b.idx))
  })

  if (ballots.length === 0) return null

  const matrix = buildPreferenceMatrix(ballots, candidateCount)
  const ranking = schulze(matrix)

  return initiativeIds[ranking[0]] ?? null
}
