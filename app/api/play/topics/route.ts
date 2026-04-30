import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { title?: string; content?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
  }

  const { data: topic, error } = await supabase
    .from('issue')
    .insert({
      title: body.title.trim(),
      content: body.content.trim(),
      author_id: user.id,
      status: 'admission',
    })
    .select('id, title, content, status, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ topic }, { status: 201 })
}
