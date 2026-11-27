import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'
import { castVote } from '@/lib/voting/castVote'

const VALUES = ['approve', 'abstain', 'disapprove', 'strong_disapproval']

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { proposal_id, vote } = await readJson<{ proposal_id?: string; vote?: string }>(req)
  if (!proposal_id || !vote || !VALUES.includes(vote)) throw badRequest()

  await castVote({ supabase, userId: user.id, kind: 'proposal', id: proposal_id, value: vote })
  return { ok: true }
})
