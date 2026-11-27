import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

const MAX_LENGTH = 500

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, vote_value, response } =
    await readJson<{ proposal_id?: string; vote_value?: string; response?: unknown }>(req)

  if (typeof response !== 'string' || !response.trim()) throw badRequest('Response cannot be empty')
  if (response.length > MAX_LENGTH) throw badRequest(`Response must be ${MAX_LENGTH} characters or fewer`)

  const { error } = await supabase.from('ev_empathy_responses').insert({
    proposal_id,
    user_id: user.id,
    vote_value,
    response: response.trim(),
  })
  if (error) throw error
  return { success: true }
})
