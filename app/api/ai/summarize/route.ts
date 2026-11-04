import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 43: AI Summaries — summarize all opinions on a topic
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { issueId } = await readJson<{ issueId?: string }>(req)
  if (!issueId) throw badRequest('issueId required')

  const { data: opinions } = await supabase
    .from('opinion')
    .select('content, intent')
    .eq('issue_id', issueId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })
    .limit(50)

  if (!opinions?.length) return { summary: 'No discussion yet to summarize.' }

  const discussionText = opinions
    .map((o, i) => `${i + 1}. [${o.intent ?? 'comment'}] ${o.content}`)
    .join('\n')

  const summary = await generateText({
    maxTokens: 400,
    prompt: `Summarize this community discussion. Use plain text only — no asterisks, no markdown, no bold or italic formatting. Structure the output as short paragraphs with blank lines between them. Where helpful, use simple bullet lists with a dash (-) at the start of each item. Cover: the main topic, key opinions and ratings if mentioned, points of agreement and disagreement, and any open questions. Be neutral and concise.\n\nDiscussion:\n${discussionText}`,
  })
  return { summary }
})
