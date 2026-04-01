import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { countVotes } from '@/lib/voting/approval'

const PHASE_ORDER = ['admission', 'discussion', 'verification', 'voting', 'closed'] as const

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

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

    const phaseStart = getPhaseStart(issue)
    if (!phaseStart) continue

    const daysInPhase = getPhaseDays(issue.status, policy)
    const deadline = new Date(phaseStart)
    deadline.setDate(deadline.getDate() + daysInPhase)

    if (now >= deadline) {
      const nextStatus = PHASE_ORDER[currentIdx + 1]
      const tsField = `${nextStatus}_at`

      const updatePayload: Record<string, unknown> = {
        status: nextStatus,
        [tsField]: now.toISOString(),
      }

      // When closing voting: determine and record the winning initiative
      if (issue.status === 'voting') {
        const winnerId = await determineWinner(supabase, issue.id)
        if (winnerId) updatePayload.accepted_initiative_id = winnerId
      }

      const { error } = await supabase
        .from('issue')
        .update(updatePayload)
        .eq('id', issue.id)

      if (!error) transitioned.push(`${issue.id} → ${nextStatus}`)
    }
  }

  return NextResponse.json({ transitioned, count: transitioned.length })
}

async function determineWinner(supabase: any, issueId: string): Promise<string | null> {
  const { data: initiatives } = await supabase
    .from('initiative')
    .select('id, votes:vote(*)')
    .eq('issue_id', issueId)

  if (!initiatives?.length) return null

  const ranked = initiatives
    .map((i: any) => ({ id: i.id, votes: countVotes(i.votes ?? []) }))
    .filter((i: any) => i.votes.total > 0)
    .sort((a: any, b: any) => {
      if (b.votes.approvalPercent !== a.votes.approvalPercent) {
        return b.votes.approvalPercent - a.votes.approvalPercent
      }
      return b.votes.approve - a.votes.approve
    })

  return ranked[0]?.id ?? null
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
