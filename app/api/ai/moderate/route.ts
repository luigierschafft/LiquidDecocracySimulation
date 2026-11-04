import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 48: AI Moderation — check content before posting
export const POST = apiRoute(async (req) => {
  await requireUser()
  const { content } = await readJson<{ content?: string }>(req)
  if (!content?.trim()) throw badRequest('content required')

  const raw = await generateText({
    maxTokens: 100,
    prompt: `Is the following community discussion post appropriate? It should be respectful, constructive, and relevant to governance. Reply with JSON only: {"approved": true/false, "reason": "brief reason if not approved"}\n\nPost:\n${content.slice(0, 500)}`,
  })

  // Fail open: if the model answer can't be parsed, don't block the user.
  return parseJsonObject(raw) ?? { approved: true }
})
