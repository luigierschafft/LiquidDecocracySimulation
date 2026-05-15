import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { proposal_id, vote_value, core_values, pro_arguments, contra_arguments } = await req.json()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase.from('ev_position_papers').insert({
    proposal_id,
    user_id: user.id,
    vote_value,
    core_values: core_values || null,
    pro_arguments: pro_arguments || null,
    contra_arguments: contra_arguments || null,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
