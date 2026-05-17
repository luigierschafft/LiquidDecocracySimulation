import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Module 103: Hate Speech Filter — admin approve/reject a pending statement
export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: member } = await supabase
    .from('member')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!member?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { statement_id, action } = await request.json() as {
    statement_id: string
    action: 'approve' | 'reject'
  }

  if (!statement_id || !action) {
    return NextResponse.json({ error: 'Missing statement_id or action' }, { status: 400 })
  }

  if (action === 'approve') {
    const { error } = await supabase
      .from('ev_statements')
      .update({ moderation_status: 'approved' })
      .eq('id', statement_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else if (action === 'reject') {
    const { error } = await supabase
      .from('ev_statements')
      .delete()
      .eq('id', statement_id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
