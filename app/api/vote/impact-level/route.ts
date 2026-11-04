import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, impact_level, wants_participation } =
    await readJson<{ proposal_id?: string; impact_level?: string; wants_participation?: boolean }>(req)
  if (!proposal_id) throw badRequest('proposal_id required')

  const { error } = await supabase.from('ev_vote_impact').insert({
    proposal_id,
    user_id: user.id,
    impact_level,
    wants_participation: wants_participation ?? false,
  })
  if (error) throw error
  return { ok: true }
})
