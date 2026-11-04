import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 49: Opinion Clustering — group similar opinions by theme
// Module 50: Consensus Suggestions — generate compromise proposals
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { issueId, mode } = await readJson<{ issueId?: string; mode?: string }>(req)
  if (!issueId) throw badRequest('issueId required')

  const { data: opinions } = await supabase
    .from('opinion')
    .select('id, content, intent')
    .eq('issue_id', issueId)
    .is('parent_id', null)
    .limit(50)

  if (!opinions || opinions.length < 3) {
    return { result: 'Not enough opinions to cluster (need at least 3).' }
  }

  const numbered = opinions.map((o, i) => `${i + 1}. ${o.content}`).join('\n')

  let prompt: string
  if (mode === 'consensus') {
    const { data: initiatives } = await supabase
      .from('initiative')
      .select('title, content')
      .eq('issue_id', issueId)
      .eq('is_draft', false)
      .limit(5)
    const propsText = (initiatives ?? []).map((i) => `- ${i.title}: ${i.content.slice(0, 200)}`).join('\n')
    prompt = `Based on these community opinions and existing propositions, suggest ONE compromise proposal that could achieve broad consensus. Be specific and constructive.\n\nOpinions:\n${numbered}\n\nExisting propositions:\n${propsText || 'None yet'}`
  } else {
    prompt = `Group these community opinions into 3-5 thematic clusters. For each cluster, give it a short name and list the opinion numbers that belong to it.\n\nOpinions:\n${numbered}`
  }

  const result = await generateText({ prompt, maxTokens: 500 })
  return { result }
})
