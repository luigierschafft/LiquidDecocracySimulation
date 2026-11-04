import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

const UNIQUE_VIOLATION = '23505' // already a member

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { platformId } = await readJson<{ platformId?: string }>(req)
  if (!platformId) throw badRequest('platformId required')

  const { error } = await supabase.from('platform_member').insert({
    platform_id: platformId,
    user_id: user.id,
    role: 'member',
    status: 'approved',
  })
  if (error && error.code !== UNIQUE_VIOLATION) throw error
  return { ok: true }
})
