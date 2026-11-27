import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { context } = await readJson<{ context?: string }>(req)
  if (!context) throw badRequest('Missing context')

  const summary = await generateText({
    model: 'fast',
    maxTokens: 400,
    system: `You are summarizing a community discussion for the Auroville community app.
STRICT RULE: Only use information explicitly provided — never invent or add facts.
Write in a warm, community-oriented tone. Format your response with clear sections using the exact headers below.`,
    prompt: `Here is the full discussion data:\n\n${context}\n\n
If no statements or proposals exist, write only this section:
**What this topic is about**
(1-2 sentences from the description, or say the topic is new and invite the reader to contribute)

Otherwise write all relevant sections using this exact format — only include a section if data exists for it:

**What this topic is about**
1-2 sentences explaining the topic.

**Community statements & ratings**
1. "Statement text" — rated X/10 by Y people
2. ...

**Key arguments raised**
For:
- ...
Against:
- ...

**Proposals from the community**
1. ...
2. ...

At the very end, one short friendly sentence inviting the reader to ask follow-up questions.`,
  })
  return { summary }
})
