import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 44: Argument Extraction — key points from discussion
// Module 45: Pro/Con Detection — classify arguments
// Module 46: Gap Detection — missing perspectives
const PROMPTS: Record<string, string> = {
  extract: 'Extract the 5 most important arguments or key points from this community discussion. Format as a numbered list.',
  proCon: 'Classify the main arguments in this discussion as pro or con regarding the proposal topic. Group them clearly. Format as two sections: "Pro Arguments" and "Con Arguments" with bullet points.',
  gaps: 'Analyze this community discussion and identify 3-5 important perspectives or considerations that are MISSING or underrepresented. Format as a numbered list with a brief explanation for each gap.',
}

export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { issueId, mode } = await readJson<{ issueId?: string; mode?: string }>(req)
  if (!issueId || !mode) throw badRequest('issueId and mode required')
  const instruction = PROMPTS[mode]
  if (!instruction) throw badRequest(`Unknown mode: ${mode}`)

  const { data: initiatives } = await supabase.from('initiative').select('id').eq('issue_id', issueId)
  const [{ data: opinions }, { data: args }] = await Promise.all([
    supabase.from('opinion').select('content, intent').eq('issue_id', issueId).is('parent_id', null).limit(40),
    supabase.from('argument').select('stance, content').in('initiative_id', (initiatives ?? []).map((i) => i.id)).limit(20),
  ])

  const allText = [
    ...(opinions ?? []).map((o) => `[${o.intent ?? 'comment'}] ${o.content}`),
    ...(args ?? []).map((a) => `[${a.stance}] ${a.content}`),
  ].join('\n')

  if (!allText.trim()) return { result: 'Not enough discussion to analyze.' }

  const result = await generateText({ prompt: `${instruction}\n\n${allText}`, maxTokens: 500 })
  return { result }
})
