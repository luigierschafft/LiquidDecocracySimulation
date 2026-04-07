import { NextRequest, NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'

export async function POST(req: NextRequest) {
  const { current, next } = await req.json()

  if (!current || !next) {
    return NextResponse.json({ error: 'Missing current or next proposal text' }, { status: 400 })
  }

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `You are comparing two proposals. Identify the key meaningful differences.

Proposal A (current):
"${current}"

Proposal B (next):
"${next}"

Return a JSON object with exactly two arrays:
- "only_in_a": bullet points for things present or emphasized in Proposal A but NOT in Proposal B (max 3 items)
- "only_in_b": bullet points for things present or emphasized in Proposal B but NOT in Proposal A (max 3 items)

Each bullet should be a short phrase (max 10 words). Focus on conceptual differences, not word-for-word comparison.
Return only valid JSON, no explanation.`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(raw)
    return NextResponse.json(parsed)
  } catch {
    // Fallback: try to extract JSON from response
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return NextResponse.json(JSON.parse(match[0]))
      } catch {}
    }
    return NextResponse.json({ only_in_a: [], only_in_b: [], raw })
  }
}
