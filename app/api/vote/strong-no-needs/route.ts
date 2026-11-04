import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, need } = await readJson<{ proposal_id?: string; need?: string }>(req)
  if (!proposal_id) throw badRequest('proposal_id required')

  const { error } = await supabase.from('ev_strong_no_needs').insert({ proposal_id, user_id: user.id, need })
  if (error) throw error
  return { ok: true }
})
