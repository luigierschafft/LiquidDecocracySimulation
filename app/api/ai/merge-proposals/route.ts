import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 21: AI Proposal Merger — generate a merged proposal from two existing ones
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { initiativeId1, initiativeId2 } = await request.json()
  if (!initiativeId1 || !initiativeId2) {
    return NextResponse.json({ error: 'Two initiative IDs required' }, { status: 400 })
  }

  const [r1, r2] = await Promise.all([
    supabase.from('initiative').select('title, content').eq('id', initiativeId1).single(),
    supabase.from('initiative').select('title, content').eq('id', initiativeId2).single(),
  ])

  if (!r1.data || !r2.data) {
    return NextResponse.json({ error: 'Could not load proposals' }, { status: 404 })
  }

  const prompt = `You are helping merge two community proposals into one coherent proposal. Combine the best elements of both, resolve contradictions, and create a unified proposition.

Proposal A — "${r1.data.title}":
${r1.data.content}

Proposal B — "${r2.data.title}":
${r2.data.content}

Return ONLY a JSON object with this exact shape:
{"title": "...", "content": "..."}

Rules:
- Title: concise, combining the core ideas of both
- Content: well-structured Markdown, synthesise both proposals fairly
- Keep concrete details (costs, timelines, affected areas) from both where possible
- Do not add explanations outside the JSON`

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 1200,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = (message.content[0] as any).text ?? ''

  try {
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] ?? '{}')
    return NextResponse.json({ title: json.title ?? '', content: json.content ?? '' })
  } catch {
    return NextResponse.json({ error: 'AI returned unexpected format', raw }, { status: 500 })
  }
}
