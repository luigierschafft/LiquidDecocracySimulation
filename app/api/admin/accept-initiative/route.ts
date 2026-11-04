import { apiRoute, badRequest, readJson, requireAdmin } from '@/lib/api/handler'
import { createAdminClient } from '@/lib/supabase/admin'

export const POST = apiRoute(async (req) => {
  await requireAdmin()
  const { issueId, initiativeId } = await readJson<{ issueId?: string; initiativeId?: string }>(req)
  if (!issueId || !initiativeId) throw badRequest('Missing issueId or initiativeId')

  const { error } = await createAdminClient()
    .from('issue')
    .update({ accepted_initiative_id: initiativeId, status: 'closed', closed_at: new Date().toISOString() })
    .eq('id', issueId)
  if (error) throw error
  return { success: true }
})
