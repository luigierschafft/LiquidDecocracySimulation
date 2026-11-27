import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 55: Truth Layer — flag potentially false claims
// Module 60: Fact Checking — validate claims in proposals
export const POST = apiRoute(async (req) => {
  await requireUser()
  const { content } = await readJson<{ content?: string }>(req)
  if (!content?.trim()) throw badRequest('content required')

  const result = await generateText({
    maxTokens: 500,
    prompt: `Review this governance proposal/statement for factual claims. Identify any claims that:\n1. Appear to be verifiable facts\n2. May be inaccurate or require verification\n3. Are opinions presented as facts\n\nBe balanced. If the content is mostly opinion/value-based (not factual), note that.\n\nContent:\n${content.slice(0, 1000)}`,
  })
  return { result }
})
