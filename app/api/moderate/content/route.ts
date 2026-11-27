import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, readJson, requireUser } from '@/lib/api/handler'

// Module 103: Hate Speech Filter — screens statement text before insert
const SYSTEM_PROMPT =
  'You are a content moderation assistant. Analyze the given text and return JSON with this exact shape: {"flagged": true or false, "reason": "brief reason if flagged, else null"}. Flag the text if it contains hate speech, personal insults directed at a specific person or group, slurs, or explicit threats. Do NOT flag normal disagreement, criticism of ideas, strong opinions, or passionate language. Return ONLY valid JSON — no explanation, no markdown.'

export const POST = apiRoute(async (req) => {
  await requireUser()
  const { text } = await readJson<{ text?: unknown }>(req)
  if (typeof text !== 'string' || !text.trim()) return { flagged: false }

  try {
    const raw = await generateText({ system: SYSTEM_PROMPT, prompt: text.trim(), maxTokens: 100, temperature: 0 })
    const parsed = parseJsonObject<{ flagged?: boolean; reason?: string | null }>(raw)
    if (parsed) return { flagged: Boolean(parsed.flagged), reason: parsed.reason ?? undefined }
  } catch (err) {
    console.error('[moderate/content]', err)
  }
  // Fail open: on any AI or parse error, do not block the post
  return { flagged: false }
})
