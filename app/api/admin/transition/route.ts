import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { countVotes } from '@/lib/voting/approval'
import { computeSchulzeWinner } from '@/lib/voting/computeSchulze'
import { getActiveConfig } from '@/lib/process/configs'
import { getNextPhase, getPhaseDuration, getPhaseStart } from '@/lib/process/engine'
import type { Phase } from '@/lib/process/types'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const config = getActiveConfig()

  const { data: issues } = await supabase
    .from('issue')
    .select('*, policy:policy(*)')
    .neq('status', 'closed')

  const now = new Date()
  const transitioned: string[] = []

  for (const issue of issues ?? []) {
    const policy = issue.policy
    if (!policy) continue

    const currentPhase = issue.status as Phase
    if (!config.phases.includes(currentPhase)) continue

    const nextPhase = getNextPhase(currentPhase, config)
    if (!nextPhase) continue

    // Check early voting close conditions (only during voting phase)
    if (currentPhase === 'voting') {
      const earlyClose = await checkEarlyClose(supabase, issue, policy)
      if (earlyClose) {
        const winnerId = await determineWinner(supabase, issue.id, policy)
        const updatePayload: Record<string, unknown> = {
          status: 'closed',
          closed_at: now.toISOString(),
        }
        if (winnerId) updatePayload.accepted_initiative_id = winnerId

        const { error } = await supabase.from('issue').update(updatePayload).eq('id', issue.id)
        if (!error) transitioned.push(`${issue.id} → closed (early)`)
        continue
      }
    }

    // Time-based transition
    const phaseStart = getPhaseStart(issue, currentPhase)
    if (!phaseStart) continue

    const daysInPhase = getPhaseDuration(currentPhase, policy, config)
    const deadline = new Date(phaseStart)
    deadline.setDate(deadline.getDate() + daysInPhase)

    if (now >= deadline) {
      const tsField = config.timestampField[nextPhase]
      const updatePayload: Record<string, unknown> = {
        status: nextPhase,
        [tsField]: now.toISOString(),
      }

      if (currentPhase === 'voting') {
        const winnerId = await determineWinner(supabase, issue.id, policy)
        if (winnerId) updatePayload.accepted_initiative_id = winnerId
      }

      const { error } = await supabase
        .from('issue')
        .update(updatePayload)
        .eq('id', issue.id)

      if (!error) transitioned.push(`${issue.id} → ${nextPhase}`)
    }
  }

  return NextResponse.json({ transitioned, count: transitioned.length })
}

async function checkEarlyClose(supabase: any, issue: any, policy: any): Promise<boolean> {
  if (!policy.close_by_quorum && !policy.close_by_consensus) return false

  const { data: initiatives } = await supabase
    .from('initiative')
    .select('id, votes:vote(*)')
    .eq('issue_id', issue.id)

  if (!initiatives?.length) return false

  const threshold = policy.consensus_threshold ?? 80

  // For quorum/consensus close: look at aggregate votes across all initiatives
  // (use the initiative with the best standing)
  const voteCounts = initiatives.map((i: any) => countVotes(i.votes ?? []))
  const totalVotes = voteCounts.reduce((sum: number, vc: any) => sum + vc.total, 0)
  const totalApprove = voteCounts.reduce((sum: number, vc: any) => sum + vc.approve, 0)
  const totalOppose = voteCounts.reduce((sum: number, vc: any) => sum + vc.oppose, 0)
  const overallApprovalPct = totalVotes > 0 ? (totalApprove / totalVotes) * 100 : 0
  const overallOpposePct = totalVotes > 0 ? (totalOppose / totalVotes) * 100 : 0

  if (policy.close_by_quorum) {
    if (totalVotes >= policy.quorum && overallApprovalPct >= threshold) return true
  }

  if (policy.close_by_consensus) {
    if (totalVotes > 0 && overallOpposePct < (100 - threshold)) return true
  }

  return false
}

async function determineWinner(supabase: any, issueId: string, policy: any): Promise<string | null> {
  if (policy.voting_method === 'schulze') {
    return computeSchulzeWinner(supabase, issueId)
  }

  // Approval voting (default)
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
