import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 55: Truth Layer — flag potentially false claims
// Module 60: Fact Checking — validate claims in proposals
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `Review this governance proposal/statement for factual claims. Identify any claims that:\n1. Appear to be verifiable facts\n2. May be inaccurate or require verification\n3. Are opinions presented as facts\n\nBe balanced. If the content is mostly opinion/value-based (not factual), note that.\n\nContent:\n${content.slice(0, 1000)}`,
    }],
  })

  return NextResponse.json({ result: completion.choices[0]?.message?.content ?? '' })
}
