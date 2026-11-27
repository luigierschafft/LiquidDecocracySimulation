import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

interface Body {
  proposal_id?: string
  vote_value?: string
  core_values?: string
  pro_arguments?: string
  contra_arguments?: string
}

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, vote_value, core_values, pro_arguments, contra_arguments } = await readJson<Body>(req)
  if (!proposal_id) throw badRequest('proposal_id required')

  const { error } = await supabase.from('ev_position_papers').insert({
    proposal_id,
    user_id: user.id,
    vote_value,
    core_values: core_values || null,
    pro_arguments: pro_arguments || null,
    contra_arguments: contra_arguments || null,
  })
  if (error) throw error
  return { ok: true }
})
