import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 59: Guided Exploration — AI answers user questions about a topic
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueTitle, question } = await request.json()
  if (!question?.trim()) return NextResponse.json({ error: 'question required' }, { status: 400 })

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are a helpful guide for a community governance platform. A member is reading a topic titled "${issueTitle ?? 'unknown'}" and has asked:\n\n"${question}"\n\nAnswer helpfully and concisely. If the question is about the governance process itself, explain it. Keep your answer under 150 words.`,
    }],
  })

  return NextResponse.json({ answer: (message.content[0] as any).text ?? '' })
}
