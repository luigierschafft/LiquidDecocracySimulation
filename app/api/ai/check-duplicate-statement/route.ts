import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, readJson } from '@/lib/api/handler'

// Module 103: AI Duplicate Detection — checks if a new statement is logically equivalent to an existing one
const CONFIDENCE_THRESHOLD = 0.85

interface Body {
  newText?: string
  existingStatements?: { id: string; text: string }[]
}

export const POST = apiRoute(async (req) => {
  const { newText, existingStatements } = await readJson<Body>(req)
  const noDuplicate = { isDuplicate: false, matchedId: null as string | null, confidence: 0 }

  if (!newText || !existingStatements?.length) return noDuplicate

  const statementList = existingStatements
    .map((s, i) => `[${i + 1}] ID:${s.id} — "${s.text}"`)
    .join('\n')

  const raw = await generateText({
    maxTokens: 150,
    temperature: 0.1,
    prompt: `You are a semantic duplicate detector for a community discussion platform.

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

Only set isDuplicate to true if confidence is above ${CONFIDENCE_THRESHOLD}. Be strict — similar topics are NOT duplicates, only logically equivalent claims are.`,
  })

  const parsed = parseJsonObject<{ isDuplicate?: boolean; matchedId?: string | null; confidence?: number }>(raw)
  if (!parsed) return noDuplicate

  const confidence = Number(parsed.confidence) || 0
  const confident = confidence > CONFIDENCE_THRESHOLD
  return {
    isDuplicate: confident ? Boolean(parsed.isDuplicate) : false,
    matchedId: confident ? (parsed.matchedId ?? null) : null,
    confidence,
  }
})
