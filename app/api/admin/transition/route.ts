import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const PHASE_ORDER = ['admission', 'discussion', 'verification', 'voting', 'closed'] as const

export async function POST(request: Request) {
  // Verify cron secret or admin token
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Get all non-closed issues with their policies
  const { data: issues } = await supabase
    .from('issue')
    .select('*, policy:policy(*)')
    .neq('status', 'closed')

  const now = new Date()
  const transitioned: string[] = []

  for (const issue of issues ?? []) {
    const policy = issue.policy
    if (!policy) continue

    const currentIdx = PHASE_ORDER.indexOf(issue.status)
    if (currentIdx < 0 || currentIdx >= PHASE_ORDER.length - 1) continue

    // Determine deadline for current phase
    const phaseStart = getPhaseStart(issue)
    if (!phaseStart) continue

    const daysInPhase = getPhaseDays(issue.status, policy)
    const deadline = new Date(phaseStart)
    deadline.setDate(deadline.getDate() + daysInPhase)

    if (now >= deadline) {
      const nextStatus = PHASE_ORDER[currentIdx + 1]
      const tsField = `${nextStatus}_at`

      const { error } = await supabase
        .from('issue')
        .update({ status: nextStatus, [tsField]: now.toISOString() })
        .eq('id', issue.id)

      if (!error) transitioned.push(`${issue.id} → ${nextStatus}`)
    }
  }

  return NextResponse.json({ transitioned, count: transitioned.length })
}

function getPhaseStart(issue: any): string | null {
  switch (issue.status) {
    case 'admission': return issue.admission_at ?? issue.created_at
    case 'discussion': return issue.discussion_at
    case 'verification': return issue.verification_at
    case 'voting': return issue.voting_at
    default: return null
  }
}

function getPhaseDays(status: string, policy: any): number {
  switch (status) {
    case 'admission': return policy.admission_days
    case 'discussion': return policy.discussion_days
    case 'verification': return policy.verification_days
    case 'voting': return policy.voting_days
    default: return 0
  }
}
