import { apiRoute, badRequest, notFound, readJson, requireUser } from '@/lib/api/handler'

const UNIQUE_VIOLATION = '23505' // already a member

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { platformId } = await readJson<{ platformId?: string }>(req)
  if (!platformId) throw badRequest('platformId required')

  // Public platforms: join directly. Invite-only: send a join request.
  const { data: platform } = await supabase.from('platform').select('is_invite_only').eq('id', platformId).single()
  if (!platform) throw notFound('Platform not found')

  const { error } = await supabase.from('platform_member').insert({
    platform_id: platformId,
    user_id: user.id,
    role: 'member',
    status: platform.is_invite_only ? 'pending' : 'approved',
  })
  if (error && error.code !== UNIQUE_VIOLATION) throw error
  return { ok: true }
})
