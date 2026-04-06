import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: member } = await supabase.from('member').select('is_admin').eq('id', user.id).single()
  if (!member?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { issueId, initiativeId } = await request.json()
  if (!issueId || !initiativeId) {
    return NextResponse.json({ error: 'Missing issueId or initiativeId' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('issue')
    .update({
      accepted_initiative_id: initiativeId,
      status: 'closed',
      closed_at: new Date().toISOString(),
    })
    .eq('id', issueId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
