import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, reason } = await readJson<{ proposal_id?: string; reason?: string }>(req)
  if (!proposal_id) throw badRequest('proposal_id required')

  const { error } = await supabase.from('ev_disapprove_reasons').insert({ proposal_id, user_id: user.id, reason })
  if (error) throw error
  return { ok: true }
})
