import type { SupabaseClient } from '@supabase/supabase-js'
import { applyProxyVotes } from '@/lib/delegation/resolveProxy'

/**
 * One place for "cast a direct vote, then propagate it to everyone who
 * delegated to this voter" — used by all vote API routes.
 */

interface VoteTarget {
  table: string
  idField: string
  userField: string
  voteField: string
  /** Look up the issue/area the voted-on item belongs to (for delegation scope). */
  resolveContext: (supabase: SupabaseClient, id: string) => Promise<{ issueId: string | null; areaId: string | null }>
}

/** Resolve issue + area from a table that has an `issue_id` column. */
function viaIssueColumn(table: string) {
  return async (supabase: SupabaseClient, id: string) => {
    const { data } = await supabase.from(table).select('issue_id, issue:issue(area_id)').eq('id', id).single()
    const issue = data?.issue as { area_id?: string | null } | null | undefined
    return { issueId: data?.issue_id ?? null, areaId: issue?.area_id ?? null }
  }
}

const NO_CONTEXT = { issueId: null, areaId: null }

export const VOTE_TARGETS = {
  /** Classic proposals (initiative) — values: approve / oppose / abstain / strong_no */
  initiative: {
    table: 'vote', idField: 'initiative_id', userField: 'member_id', voteField: 'value',
    resolveContext: viaIssueColumn('initiative'),
  },
  /** Discussion statements — values: agree / pass / disagree */
  statement: {
    table: 'ev_statement_ratings', idField: 'statement_id', userField: 'user_id', voteField: 'vote',
    resolveContext: viaIssueColumn('ev_statements'),
  },
  /** Topic proposals — values: approve / abstain / disapprove / strong_disapproval */
  proposal: {
    table: 'ev_proposal_votes', idField: 'proposal_id', userField: 'user_id', voteField: 'vote',
    resolveContext: viaIssueColumn('ev_topic_proposals'),
  },
  /** Pro/contra arguments — rating 0..10 */
  argument: {
    table: 'ev_argument_ratings', idField: 'node_id', userField: 'user_id', voteField: 'rating',
    resolveContext: async (supabase, id) => {
      const { data: node } = await supabase.from('ev_discussion_nodes').select('statement_id').eq('id', id).single()
      return node?.statement_id ? viaIssueColumn('ev_statements')(supabase, node.statement_id) : NO_CONTEXT
    },
  },
} satisfies Record<string, VoteTarget>

export type VoteTargetKind = keyof typeof VOTE_TARGETS

export async function castVote(opts: {
  supabase: SupabaseClient
  userId: string
  kind: VoteTargetKind
  id: string
  value: string | number
}) {
  const { supabase, userId, kind, id, value } = opts
  const target: VoteTarget = VOTE_TARGETS[kind]

  // Direct vote — always overrides a previous proxy vote
  const { data, error } = await supabase
    .from(target.table)
    .upsert(
      { [target.idField]: id, [target.userField]: userId, [target.voteField]: value, is_proxy: false },
      { onConflict: `${target.idField},${target.userField}` }
    )
    .select()
  if (error) throw error

  // Liquid democracy: proxy-vote for everyone who (transitively) delegated to this voter
  const { issueId, areaId } = await target.resolveContext(supabase, id)
  await applyProxyVotes({
    supabase,
    voterId: userId,
    issueId,
    areaId,
    tableName: target.table,
    idField: target.idField,
    idValue: id,
    userField: target.userField,
    voteField: target.voteField,
    voteValue: value,
  })

  return data?.[0] ?? null
}
