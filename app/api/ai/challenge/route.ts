import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 53: Perspective Switch — show alternative viewpoints
// Module 54: Auto Debater — generate counterarguments
// Module 57: Bias Breaker — challenge user bias
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, mode } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'content required' }, { status: 400 })

  let prompt = ''
  if (mode === 'perspective') {
    prompt = `Someone wrote: "${content}"\n\nPresent 2-3 alternative perspectives that someone with a different background or values might hold on this topic. Be empathetic and fair to each perspective. Keep it brief.`
  } else if (mode === 'debate') {
    prompt = `Someone wrote: "${content}"\n\nGenerate 3 strong counterarguments to this position. Be intellectually honest — the goal is to help the person stress-test their reasoning, not to attack them.`
  } else if (mode === 'bias') {
    prompt = `Analyze this statement for potential cognitive biases or assumptions: "${content}"\n\nIdentify 2-3 possible biases (e.g. confirmation bias, availability heuristic, in-group favoritism) and briefly explain how they might be influencing this view. Be respectful and educational.`
  }

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ result: (message.content[0] as any).text ?? '' })
}
