import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 47: AI Proposal Improvement — suggest improvements to a proposition
export const POST = apiRoute(async (req) => {
  await requireUser()
  const { title, content } = await readJson<{ title?: string; content?: string }>(req)
  if (!content?.trim()) throw badRequest('content required')

  const suggestions = await generateText({
    maxTokens: 600,
    prompt: `You are helping improve a community governance proposal. Review this proposition and suggest specific improvements for clarity, completeness, and community acceptance. Focus on: 1) Missing details 2) Potential concerns to address 3) Wording improvements. Be constructive and brief.\n\nTitle: ${title ?? 'Untitled'}\n\nContent:\n${content}`,
  })
  return { suggestions }
})
