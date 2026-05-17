import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { proposal_id, vote_value, response } = await req.json()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!response || typeof response !== 'string' || response.trim().length === 0) {
    return NextResponse.json({ error: 'Response cannot be empty' }, { status: 400 })
  }

  if (response.length > 500) {
    return NextResponse.json({ error: 'Response must be 500 characters or fewer' }, { status: 400 })
  }

  const { error } = await supabase.from('ev_empathy_responses').insert({
    proposal_id,
    user_id: user.id,
    vote_value,
    response: response.trim(),
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
