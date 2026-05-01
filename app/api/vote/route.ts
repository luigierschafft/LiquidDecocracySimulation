import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { applyProxyVotes } from '@/lib/delegation/resolveProxy'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { initiative_id, value } = await request.json()
  if (!initiative_id || !['approve', 'oppose', 'abstain', 'strong_no'].includes(value)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // Direct vote (overrides any proxy)
  const { data, error } = await supabase
    .from('vote')
    .upsert(
      { initiative_id, member_id: user.id, value, is_proxy: false },
      { onConflict: 'initiative_id,member_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Resolve issue/area context for delegation lookup
  const { data: initiative } = await supabase
    .from('initiative')
    .select('issue_id, issue:issue(area_id)')
    .eq('id', initiative_id)
    .single()

  const issueId = initiative?.issue_id ?? null
  const areaId = (initiative?.issue as any)?.area_id ?? null

  // Apply liquid democracy: proxy-votes for all transitively delegating members
  await applyProxyVotes({
    supabase,
    voterId: user.id,
    issueId,
    areaId,
    tableName: 'vote',
    idField: 'initiative_id',
    idValue: initiative_id,
    userField: 'member_id',
    voteField: 'value',
    voteValue: value,
  })

  return NextResponse.json(data)
}
