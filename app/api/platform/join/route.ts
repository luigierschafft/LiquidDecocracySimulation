import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { platformId } = await request.json()
  if (!platformId) {
    return NextResponse.json({ error: 'platformId required' }, { status: 400 })
  }

  const { error } = await supabase.from('platform_member').insert({
    platform_id: platformId,
    user_id: user.id,
    role: 'member',
    status: 'pending',
  })

  if (error && error.code !== '23505') {
    // 23505 = unique violation (already requested)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
