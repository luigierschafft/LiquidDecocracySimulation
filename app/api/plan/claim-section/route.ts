import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { section_id } = body
  if (!section_id) return NextResponse.json({ error: 'section_id required' }, { status: 400 })

  const { error } = await supabase
    .from('ev_section_owners')
    .insert({ section_id, user_id: user.id })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { section_id } = body
  if (!section_id) return NextResponse.json({ error: 'section_id required' }, { status: 400 })

  const { error } = await supabase
    .from('ev_section_owners')
    .delete()
    .eq('section_id', section_id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
