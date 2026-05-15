import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'

// Module 103: AI Duplicate Detection — checks if a new statement is logically equivalent to an existing one
export async function POST(request: Request) {
  const { newText, existingStatements } = await request.json()

  if (!newText || !existingStatements || existingStatements.length === 0) {
    return NextResponse.json({ isDuplicate: false, matchedId: null, confidence: 0 })
  }

  const statementList = existingStatements
    .map((s: { id: string; text: string }, i: number) => `[${i + 1}] ID:${s.id} — "${s.text}"`)
    .join('\n')

  const prompt = `You are a semantic duplicate detector for a community discussion platform.

A user wants to post this new statement:
"${newText}"

Existing statements in this discussion:
${statementList}

Task: Determine if the new statement is logically equivalent or semantically the same as any existing statement (even if worded differently). Two statements are duplicates if they express the same core idea or claim.

Respond with ONLY valid JSON in this exact format:
{
  "isDuplicate": true or false,
  "matchedId": "the UUID of the matching statement, or null if no match",
  "confidence": a number between 0.0 and 1.0
}

Only set isDuplicate to true if confidence is above 0.85. Be strict — similar topics are NOT duplicates, only logically equivalent claims are.`

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 150,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  })

  const raw = completion.choices[0]?.message?.content ?? ''

  let result = { isDuplicate: false, matchedId: null as string | null, confidence: 0 }
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      result = {
        isDuplicate: parsed.confidence > 0.85 ? Boolean(parsed.isDuplicate) : false,
        matchedId: parsed.confidence > 0.85 ? (parsed.matchedId ?? null) : null,
        confidence: Number(parsed.confidence) || 0,
      }
    }
  } catch {
    // Return no-duplicate on parse error
  }

  return NextResponse.json(result)
}
