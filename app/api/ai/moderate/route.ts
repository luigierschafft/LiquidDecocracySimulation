import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 48: AI Moderation — check content before posting
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: `Is the following community discussion post appropriate? It should be respectful, constructive, and relevant to governance. Reply with JSON only: {"approved": true/false, "reason": "brief reason if not approved"}\n\nPost:\n${content.slice(0, 500)}`,
    }],
  })

  try {
    const text = completion.choices[0]?.message?.content ?? '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { approved: true }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ approved: true })
  }
}
