import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'
import { castVote } from '@/lib/voting/castVote'

const VALUES = ['agree', 'pass', 'disagree']

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { statement_id, vote } = await readJson<{ statement_id?: string; vote?: string }>(req)
  if (!statement_id || !vote || !VALUES.includes(vote)) throw badRequest()

  await castVote({ supabase, userId: user.id, kind: 'statement', id: statement_id, value: vote })
  return { ok: true }
})
