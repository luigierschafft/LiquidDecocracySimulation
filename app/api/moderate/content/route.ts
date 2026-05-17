import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'

// Module 103: Hate Speech Filter — screens statement text before insert
export async function POST(request: Request) {
  const { text } = await request.json()

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ flagged: false })
  }

  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      max_tokens: 100,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'You are a content moderation assistant. Analyze the given text and return JSON with this exact shape: {"flagged": true or false, "reason": "brief reason if flagged, else null"}. Flag the text if it contains hate speech, personal insults directed at a specific person or group, slurs, or explicit threats. Do NOT flag normal disagreement, criticism of ideas, strong opinions, or passionate language. Return ONLY valid JSON — no explanation, no markdown.',
        },
        {
          role: 'user',
          content: text.trim(),
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? ''

    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        flagged: Boolean(parsed.flagged),
        reason: parsed.reason ?? undefined,
      })
    }
  } catch {
    // Fail open: on any AI or parse error, do not block the post
  }

  return NextResponse.json({ flagged: false })
}
