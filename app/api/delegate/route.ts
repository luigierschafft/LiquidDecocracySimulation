import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { to_member_id, unit_id, area_id, issue_id } = await request.json()
  if (!to_member_id) return NextResponse.json({ error: 'Missing to_member_id' }, { status: 400 })
  if (to_member_id === user.id) return NextResponse.json({ error: 'Cannot delegate to yourself' }, { status: 400 })

  const { data, error } = await supabase
    .from('delegation')
    .insert({
      from_member_id: user.id,
      to_member_id,
      unit_id: unit_id ?? null,
      area_id: area_id ?? null,
      issue_id: issue_id ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  const { error } = await supabase
    .from('delegation')
    .delete()
    .eq('id', id)
    .eq('from_member_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
