import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'
import { castVote } from '@/lib/voting/castVote'

const VALUES = ['approve', 'oppose', 'abstain', 'strong_no']

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { initiative_id, value } = await readJson<{ initiative_id?: string; value?: string }>(req)
  if (!initiative_id || !value || !VALUES.includes(value)) throw badRequest()

  return castVote({ supabase, userId: user.id, kind: 'initiative', id: initiative_id, value })
})
