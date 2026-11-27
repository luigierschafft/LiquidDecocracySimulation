import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 56: Argument Merger — find and suggest merging duplicate/similar arguments
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireUser()
  const { initiativeId } = await readJson<{ initiativeId?: string }>(req)
  if (!initiativeId) throw badRequest('initiativeId required')

  const { data: args } = await supabase
    .from('argument')
    .select('id, stance, content')
    .eq('initiative_id', initiativeId)
    .limit(30)

  if (!args || args.length < 3) {
    return { result: 'Not enough arguments to find duplicates (need at least 3).' }
  }

  const numbered = args.map((a, i) => `${i + 1}. [${a.stance}] ${a.content}`).join('\n')
  const result = await generateText({
    maxTokens: 400,
    prompt: `Review these arguments for a community proposal and identify any that are very similar or redundant. For each group of similar arguments, suggest a merged version that captures all their points concisely.\n\nArguments:\n${numbered}`,
  })
  return { result }
})
