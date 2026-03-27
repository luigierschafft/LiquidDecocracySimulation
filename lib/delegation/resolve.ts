import type { Delegation, Vote, VoteValue } from '@/lib/types'

interface ResolveContext {
  memberId: string
  issueId: string
  areaId: string | null
  unitId: string | null
  delegations: Delegation[]
  votes: Record<string, Vote> // memberId → Vote
}

/**
 * Resolve effective vote for a member following delegation chain.
 * Returns the VoteValue or null if no vote found anywhere in chain.
 */
export function resolveVote(
  ctx: ResolveContext,
  visited: Set<string> = new Set()
): { value: VoteValue; via: string | null } | null {
  const { memberId } = ctx

  if (visited.has(memberId)) return null // cycle detected
  visited.add(memberId)

  // 1. Direct vote overrides delegation
  if (ctx.votes[memberId]) {
    return { value: ctx.votes[memberId].value, via: null }
  }

  // 2. Find most specific delegation (issue > area > unit > global)
  const delegation = findDelegation(ctx.delegations, memberId, ctx.issueId, ctx.areaId, ctx.unitId)
  if (!delegation) return null

  // 3. Follow delegation chain
  const result = resolveVote({ ...ctx, memberId: delegation.to_member_id }, visited)
  if (result) {
    return { value: result.value, via: delegation.to_member_id }
  }

  return null
}

function findDelegation(
  delegations: Delegation[],
  memberId: string,
  issueId: string,
  areaId: string | null,
  unitId: string | null
): Delegation | null {
  // Issue-level (most specific)
  const issueDeleg = delegations.find(
    (d) => d.from_member_id === memberId && d.issue_id === issueId
  )
  if (issueDeleg) return issueDeleg

  // Area-level
  if (areaId) {
    const areaDeleg = delegations.find(
      (d) => d.from_member_id === memberId && d.area_id === areaId
    )
    if (areaDeleg) return areaDeleg
  }

  // Unit-level
  if (unitId) {
    const unitDeleg = delegations.find(
      (d) => d.from_member_id === memberId && d.unit_id === unitId
    )
    if (unitDeleg) return unitDeleg
  }

  // Global
  const globalDeleg = delegations.find(
    (d) =>
      d.from_member_id === memberId &&
      !d.issue_id &&
      !d.area_id &&
      !d.unit_id
  )
  return globalDeleg ?? null
}

/**
 * Build weighted vote map: memberId → number of votes they carry
 */
export function buildWeightMap(
  memberIds: string[],
  ctx: Omit<ResolveContext, 'memberId'>
): Map<string, { count: number; value: VoteValue | null }> {
  const weightMap = new Map<string, { count: number; value: VoteValue | null }>()

  for (const memberId of memberIds) {
    const result = resolveVote({ ...ctx, memberId })
    if (result) {
      const effectiveVoter = getEffectiveVoter(ctx, memberId)
      if (effectiveVoter) {
        const current = weightMap.get(effectiveVoter) ?? { count: 0, value: result.value }
        weightMap.set(effectiveVoter, { count: current.count + 1, value: result.value })
      }
    }
  }

  return weightMap
}

function getEffectiveVoter(
  ctx: Omit<ResolveContext, 'memberId'>,
  memberId: string,
  visited: Set<string> = new Set()
): string | null {
  if (visited.has(memberId)) return null
  visited.add(memberId)

  if (ctx.votes[memberId]) return memberId

  const delegation = findDelegation(ctx.delegations, memberId, ctx.issueId, ctx.areaId, ctx.unitId)
  if (!delegation) return null

  return getEffectiveVoter(ctx, delegation.to_member_id, visited)
}
