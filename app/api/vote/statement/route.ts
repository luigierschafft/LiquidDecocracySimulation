import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applyProxyVotes } from '@/lib/delegation/resolveProxy'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { statement_id, vote } = await request.json()
  if (!statement_id || !['agree', 'pass', 'disagree'].includes(vote)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Direct vote
  const { error } = await supabase
    .from('ev_statement_ratings')
    .upsert(
      { statement_id, user_id: user.id, vote, is_proxy: false },
      { onConflict: 'statement_id,user_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Resolve issue/area for delegation
  const { data: statement } = await supabase
    .from('ev_statements')
    .select('issue_id, issue:issue(area_id)')
    .eq('id', statement_id)
    .single()

  const issueId = statement?.issue_id ?? null
  const areaId = (statement?.issue as any)?.area_id ?? null

  await applyProxyVotes({
    supabase,
    voterId: user.id,
    issueId,
    areaId,
    tableName: 'ev_statement_ratings',
    idField: 'statement_id',
    idValue: statement_id,
    userField: 'user_id',
    voteField: 'vote',
    voteValue: vote,
  })

  return NextResponse.json({ ok: true })
}
