import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Module 96: External Integration — create topics via webhook
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { title?: string; content?: string; area_id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.title?.trim() || !body.content?.trim()) {
    return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
  }

  const supabase = createClient()

  // Use first admin as author
  const { data: admin } = await supabase
    .from('member')
    .select('id')
    .eq('is_admin', true)
    .limit(1)
    .single()

  if (!admin) {
    return NextResponse.json({ error: 'No admin found' }, { status: 500 })
  }

  const { data: issue, error } = await supabase
    .from('issue')
    .insert({
      title: body.title.trim(),
      content: body.content.trim(),
      area_id: body.area_id ?? null,
      author_id: admin.id,
      status: 'admission',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: issue.id }, { status: 201 })
}
