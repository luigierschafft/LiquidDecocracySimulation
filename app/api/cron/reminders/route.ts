import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Module 88: Reminders — sends voting deadline notifications
// Called by Vercel cron (see vercel.json)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()

  // Find voting issues ending in < 48 hours
  const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { data: urgentIssues } = await supabase
    .from('issue')
    .select('id, title, voting_at')
    .eq('status', 'voting')
    .not('voting_at', 'is', null)
    .lte('voting_at', in48h)

  if (!urgentIssues || urgentIssues.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  // Get all approved members
  const { data: members } = await supabase
    .from('member')
    .select('id')
    .eq('is_approved', true)

  let sent = 0
  for (const issue of urgentIssues) {
    for (const member of members ?? []) {
      // Skip if already notified for this issue
      const { data: existing } = await supabase
        .from('notification')
        .select('id')
        .eq('member_id', member.id)
        .eq('type', 'reminder')
        .like('link', `%${issue.id}%`)
        .single()

      if (existing) continue

      await supabase.from('notification').insert({
        member_id: member.id,
        type: 'reminder',
        title: `Voting closes soon: ${issue.title}`,
        body: 'Cast your vote before time runs out.',
        link: `/proposals/${issue.id}`,
      })
      sent++
    }
  }

  return NextResponse.json({ sent })
}
