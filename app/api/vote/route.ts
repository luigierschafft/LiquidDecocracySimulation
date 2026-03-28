import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { initiative_id, value } = await request.json()
  if (!initiative_id || !['approve', 'oppose', 'abstain'].includes(value)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('vote')
    .upsert({ initiative_id, member_id: user.id, value }, { onConflict: 'initiative_id,member_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
