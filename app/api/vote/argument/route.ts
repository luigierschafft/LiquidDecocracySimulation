import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applyProxyVotes } from '@/lib/delegation/resolveProxy'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { node_id, rating } = await request.json()
  if (!node_id || typeof rating !== 'number' || rating < 0 || rating > 10) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Direct rating
  const { error } = await supabase
    .from('ev_argument_ratings')
    .upsert(
      { node_id, user_id: user.id, rating, is_proxy: false },
      { onConflict: 'node_id,user_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Look up issue/area context: node → statement → issue
  const { data: node } = await supabase
    .from('ev_discussion_nodes')
    .select('statement_id')
    .eq('id', node_id)
    .single()

  if (node?.statement_id) {
    const { data: statement } = await supabase
      .from('ev_statements')
      .select('issue_id, issue:issue(area_id)')
      .eq('id', node.statement_id)
      .single()

    const issueId = statement?.issue_id ?? null
    const areaId = (statement?.issue as any)?.area_id ?? null

    await applyProxyVotes({
      supabase,
      voterId: user.id,
      issueId,
      areaId,
      tableName: 'ev_argument_ratings',
      idField: 'node_id',
      idValue: node_id,
      userField: 'user_id',
      voteField: 'rating',
      voteValue: rating,
    })
  }

  return NextResponse.json({ ok: true })
}
