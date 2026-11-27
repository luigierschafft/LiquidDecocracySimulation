import { generateText } from '@/lib/ai/client'
import { toChatMessages } from '@/lib/ai/chat'
import { apiRoute, badRequest, readJson } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { context, history, question } = await readJson<{ context?: string; history?: unknown; question?: string }>(req)
  if (!context || !question) throw badRequest('Missing data')

  const answer = await generateText({
    model: 'fast',
    maxTokens: 350,
    system: `You are a helpful assistant for the Auroville community app answering questions about a specific topic discussion.

RULES:
- Answer ONLY based on the discussion data below — never invent or assume facts
- If the question is about something not mentioned in the discussion, clearly say: "This hasn't been discussed yet in this topic."
- Do not answer questions unrelated to this topic
- Be concise and friendly
- Always end your answer by suggesting 1-2 specific follow-up questions the user might want to explore

DISCUSSION DATA:
${context}`,
    messages: [...toChatMessages(history), { role: 'user', content: question }],
  })

  return { answer: answer || 'Sorry, I could not answer that.' }
})
