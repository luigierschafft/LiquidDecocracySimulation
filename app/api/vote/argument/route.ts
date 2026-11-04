import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'
import { castVote } from '@/lib/voting/castVote'

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { node_id, rating } = await readJson<{ node_id?: string; rating?: unknown }>(req)
  if (!node_id || typeof rating !== 'number' || rating < 0 || rating > 10) throw badRequest()

  await castVote({ supabase, userId: user.id, kind: 'argument', id: node_id, value: rating })
  return { ok: true }
})
