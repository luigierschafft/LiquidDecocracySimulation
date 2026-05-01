import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Returns all member IDs that transitively delegated to `voterId`
 * for the given issue / area context (global delegations always apply).
 *
 * A delegation `B → A` is relevant when:
 *   - d.issue_id = issueId, OR
 *   - d.area_id = areaId, OR
 *   - both are null (global)
 *
 * The result is the transitive closure: if C → B → A, both B and C
 * are returned when A votes.
 */
export async function getTransitiveDelegators(
  voterId: string,
  issueId: string | null,
  areaId: string | null,
  supabase: SupabaseClient,
  visited = new Set<string>()
): Promise<string[]> {
  if (visited.has(voterId)) return []
  visited.add(voterId)

  const { data: delegations } = await supabase
    .from('delegation')
    .select('from_member_id, issue_id, area_id')
    .eq('to_member_id', voterId)

  if (!delegations || delegations.length === 0) return []

  const relevant = delegations.filter((d) => {
    if (issueId && d.issue_id === issueId) return true
    if (areaId && d.area_id === areaId) return true
    if (!d.issue_id && !d.area_id) return true // global
    return false
  })

  const result: string[] = []
  for (const d of relevant) {
    if (!visited.has(d.from_member_id)) {
      result.push(d.from_member_id)
      const sub = await getTransitiveDelegators(d.from_member_id, issueId, areaId, supabase, visited)
      result.push(...sub)
    }
  }
  return Array.from(new Set(result))
}

/**
 * After a direct vote is cast, upsert proxy votes for all delegating members
 * who haven't voted directly yet.
 *
 * tableName: 'vote' | 'ev_statement_ratings' | 'ev_proposal_votes'
 * idField: name of the FK column (e.g. 'initiative_id', 'statement_id', 'proposal_id')
 * userField: name of the user column (e.g. 'member_id', 'user_id')
 * voteField: name of the vote column (e.g. 'value', 'vote')
 */
export async function applyProxyVotes(opts: {
  supabase: SupabaseClient
  voterId: string
  issueId: string | null
  areaId: string | null
  tableName: string
  idField: string
  idValue: string
  userField: string
  voteField: string
  voteValue: string | number
}) {
  const { supabase, voterId, issueId, areaId, tableName, idField, idValue, userField, voteField, voteValue } = opts

  const delegators = await getTransitiveDelegators(voterId, issueId, areaId, supabase)
  if (delegators.length === 0) return

  // Find those who already voted directly
  const { data: direct } = await supabase
    .from(tableName)
    .select(userField)
    .eq(idField, idValue)
    .eq('is_proxy', false)
    .in(userField, delegators)

  const directIds = new Set((direct ?? []).map((r: any) => r[userField]))
  const proxyTargets = delegators.filter((id) => !directIds.has(id))
  if (proxyTargets.length === 0) return

  await supabase.from(tableName).upsert(
    proxyTargets.map((memberId) => ({
      [idField]: idValue,
      [userField]: memberId,
      [voteField]: voteValue,
      is_proxy: true,
    })),
    { onConflict: `${idField},${userField}` }
  )
}
