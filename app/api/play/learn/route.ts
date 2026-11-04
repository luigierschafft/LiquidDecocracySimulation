import { generateText } from '@/lib/ai/client'
import { toChatMessages } from '@/lib/ai/chat'
import { apiRoute, badRequest, readJson } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { context, history, question } = await readJson<{ context?: string; history?: unknown; question?: string }>(req)
  if (!question) throw badRequest('Missing question')

  const answer = await generateText({
    model: 'fast',
    maxTokens: 400,
    system: `You are a helpful, friendly assistant in the Auroville community app helping people learn about a topic.

You have two sources of knowledge:
1. The current community discussion about this topic (provided below)
2. Your general world knowledge

Answer any question the user has — you can use both sources freely.
When referencing the community discussion, mention it ("According to the community discussion…").
When using your general knowledge, you can answer freely.
Be concise, warm, and educational. Keep answers short enough to read on a phone.

COMMUNITY DISCUSSION:
${context || 'No discussion data available yet.'}`,
    messages: [...toChatMessages(history), { role: 'user', content: question }],
  })

  return { answer: answer || 'Sorry, I could not answer that.' }
})
