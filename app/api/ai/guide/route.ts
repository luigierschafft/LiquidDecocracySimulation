import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 59: Guided Exploration — AI answers user questions about a topic
export const POST = apiRoute(async (req) => {
  await requireUser()
  const { issueTitle, question } = await readJson<{ issueTitle?: string; question?: string }>(req)
  if (!question?.trim()) throw badRequest('question required')

  const answer = await generateText({
    maxTokens: 300,
    prompt: `You are a helpful guide for a community governance platform. A member is reading a topic titled "${issueTitle ?? 'unknown'}" and has asked:\n\n"${question}"\n\nAnswer helpfully and concisely. If the question is about the governance process itself, explain it. Keep your answer under 150 words.`,
  })
  return { answer }
})
