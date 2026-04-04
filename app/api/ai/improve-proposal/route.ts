import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 47: AI Proposal Improvement — suggest improvements to a proposition
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `You are helping improve a community governance proposal. Review this proposition and suggest specific improvements for clarity, completeness, and community acceptance. Focus on: 1) Missing details 2) Potential concerns to address 3) Wording improvements. Be constructive and brief.\n\nTitle: ${title ?? 'Untitled'}\n\nContent:\n${content}`,
    }],
  })

  return NextResponse.json({ suggestions: (message.content[0] as any).text ?? '' })
}
