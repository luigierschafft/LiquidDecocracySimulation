import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { context, history, question } = await req.json()
  if (!question) return NextResponse.json({ error: 'Missing question' }, { status: 400 })

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    {
      role: 'system',
      content: `You are a helpful, friendly assistant in the Auroville community app helping people learn about a topic.

You have two sources of knowledge:
1. The current community discussion about this topic (provided below)
2. Your general world knowledge

Answer any question the user has — you can use both sources freely.
When referencing the community discussion, mention it ("According to the community discussion…").
When using your general knowledge, you can answer freely.
Be concise, warm, and educational. Keep answers short enough to read on a phone.

COMMUNITY DISCUSSION:
${context || 'No discussion data available yet.'}`,
    },
  ]

  for (const msg of history ?? []) {
    messages.push({ role: msg.role, content: msg.text })
  }
  messages.push({ role: 'user', content: question })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 400,
    messages,
  })

  const answer = completion.choices[0]?.message?.content ?? 'Sorry, I could not answer that.'
  return NextResponse.json({ answer })
}
