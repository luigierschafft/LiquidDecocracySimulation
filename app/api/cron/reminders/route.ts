import { apiRoute, requireCronSecret } from '@/lib/api/handler'
import { createAdminClient } from '@/lib/supabase/admin'

// Module 88: Reminders — sends voting deadline notifications
// Called daily by Vercel Cron (see vercel.json)
const REMINDER_WINDOW_MS = 48 * 60 * 60 * 1000

export const GET = apiRoute(async (request) => {
  requireCronSecret(request)

  // No user session in cron jobs — use the service-role client (bypasses RLS)
  const supabase = createAdminClient()

  const windowEnd = new Date(Date.now() + REMINDER_WINDOW_MS).toISOString()
  const { data: urgentIssues } = await supabase
    .from('issue')
    .select('id, title, voting_at')
    .eq('status', 'voting')
    .not('voting_at', 'is', null)
    .lte('voting_at', windowEnd)

  if (!urgentIssues?.length) return { sent: 0 }

  const { data: members } = await supabase.from('member').select('id').eq('is_approved', true)

  let sent = 0
  for (const issue of urgentIssues) {
    const link = `/proposals/${issue.id}`

    // One query per issue for who was already reminded (instead of one per member)
    const { data: existing } = await supabase
      .from('notification')
      .select('member_id')
      .eq('type', 'reminder')
      .eq('link', link)
    const alreadyNotified = new Set((existing ?? []).map((n) => n.member_id))

    const rows = (members ?? [])
      .filter((m) => !alreadyNotified.has(m.id))
      .map((m) => ({
        member_id: m.id,
        type: 'reminder',
        title: `Voting closes soon: ${issue.title}`,
        body: 'Cast your vote before time runs out.',
        link,
      }))

    if (rows.length) {
      const { error } = await supabase.from('notification').insert(rows)
      if (error) throw error
      sent += rows.length
    }
  }

  return { sent }
})
