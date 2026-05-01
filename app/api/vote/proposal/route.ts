import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applyProxyVotes } from '@/lib/delegation/resolveProxy'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { proposal_id, vote } = await request.json()
  const valid = ['approve', 'abstain', 'disapprove', 'strong_disapproval']
  if (!proposal_id || !valid.includes(vote)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { error } = await supabase
    .from('ev_proposal_votes')
    .upsert(
      { proposal_id, user_id: user.id, vote, is_proxy: false },
      { onConflict: 'proposal_id,user_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Look up issue context via proposal
  const { data: proposal } = await supabase
    .from('ev_topic_proposals')
    .select('issue_id, issue:issue(area_id)')
    .eq('id', proposal_id)
    .single()

  const issueId = proposal?.issue_id ?? null
  const areaId = (proposal?.issue as any)?.area_id ?? null

  await applyProxyVotes({
    supabase,
    voterId: user.id,
    issueId,
    areaId,
    tableName: 'ev_proposal_votes',
    idField: 'proposal_id',
    idValue: proposal_id,
    userField: 'user_id',
    voteField: 'vote',
    voteValue: vote,
  })

  return NextResponse.json({ ok: true })
}
