import { apiRoute, badRequest, readJson, requireAdmin } from '@/lib/api/handler'

// Module 103: Hate Speech Filter — admin approve/reject a pending statement
export const POST = apiRoute(async (req) => {
  const { supabase } = await requireAdmin()
  const { statement_id, action } = await readJson<{ statement_id?: string; action?: string }>(req)
  if (!statement_id || !action) throw badRequest('Missing statement_id or action')

  const query =
    action === 'approve'
      ? supabase.from('ev_statements').update({ moderation_status: 'approved' }).eq('id', statement_id)
      : action === 'reject'
        ? supabase.from('ev_statements').delete().eq('id', statement_id)
        : null
  if (!query) throw badRequest('Invalid action')

  const { error } = await query
  if (error) throw error
  return { success: true }
})
