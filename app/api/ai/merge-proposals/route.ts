import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, badRequest, HttpError, notFound, readJson, requireUser } from '@/lib/api/handler'

// Module 21: AI Proposal Merger — generate a merged proposal from two existing ones
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { initiativeId1, initiativeId2 } = await readJson<{ initiativeId1?: string; initiativeId2?: string }>(req)
  if (!initiativeId1 || !initiativeId2) throw badRequest('Two initiative IDs required')

  const [r1, r2] = await Promise.all([
    supabase.from('initiative').select('title, content').eq('id', initiativeId1).single(),
    supabase.from('initiative').select('title, content').eq('id', initiativeId2).single(),
  ])
  if (!r1.data || !r2.data) throw notFound('Could not load proposals')

  const raw = await generateText({
    maxTokens: 1200,
    prompt: `You are helping merge two community proposals into one coherent proposal. Combine the best elements of both, resolve contradictions, and create a unified proposition.

Proposal A — "${r1.data.title}":
${r1.data.content}

Proposal B — "${r2.data.title}":
${r2.data.content}

Return ONLY a JSON object with this exact shape:
{"title": "...", "content": "..."}

Rules:
- Title: concise, combining the core ideas of both
- Content: well-structured Markdown, synthesise both proposals fairly
- Keep concrete details (costs, timelines, affected areas) from both where possible
- Do not add explanations outside the JSON`,
  })

  const json = parseJsonObject<{ title?: string; content?: string }>(raw)
  if (!json) throw new HttpError(500, 'AI returned unexpected format')
  return { title: json.title ?? '', content: json.content ?? '' }
})
