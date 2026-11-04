import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 58: Decision Readiness — score how ready the community is to decide
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { issueId } = await readJson<{ issueId?: string }>(req)
  if (!issueId) throw badRequest('issueId required')

  const { data: initiatives } = await supabase.from('initiative').select('id').eq('issue_id', issueId)
  const [opinionsResult, argsResult, initResult] = await Promise.all([
    supabase.from('opinion').select('id', { count: 'exact', head: true }).eq('issue_id', issueId),
    supabase.from('argument').select('id', { count: 'exact', head: true }).in('initiative_id', (initiatives ?? []).map((i) => i.id)),
    supabase.from('initiative').select('id', { count: 'exact', head: true }).eq('issue_id', issueId).eq('is_draft', false),
  ])

  const raw = await generateText({
    maxTokens: 250,
    prompt: `A community governance topic has the following discussion stats:\n- Opinions posted: ${opinionsResult.count ?? 0}\n- Arguments submitted: ${argsResult.count ?? 0}\n- Propositions submitted: ${initResult.count ?? 0}\n\nBased on these numbers, provide:\n1. A readiness score (0-100)\n2. A one-sentence assessment\n3. What's still needed before a vote (if anything)\n\nReply as JSON: {"score": number, "assessment": "...", "missing": "..."}`,
  })

  return parseJsonObject(raw) ?? { score: 50, assessment: 'Unable to assess at this time.', missing: '' }
})
