import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const K = 32

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { winnerId, loserId, issueId } = await req.json()
  if (!winnerId || !loserId || !issueId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  await supabase.from('ev_statement_comparisons').insert({
    issue_id: issueId,
    winner_id: winnerId,
    loser_id: loserId,
    user_id: user?.id ?? null,
  })

  const { data: stmts } = await supabase
    .from('ev_statements')
    .select('id, elo_score')
    .in('id', [winnerId, loserId])

  if (stmts && stmts.length === 2) {
    const w = stmts.find(s => s.id === winnerId)!
    const l = stmts.find(s => s.id === loserId)!
    const eW = w.elo_score ?? 1000
    const eL = l.elo_score ?? 1000
    const expected = 1 / (1 + Math.pow(10, (eL - eW) / 400))
    const newW = Math.round(eW + K * (1 - expected))
    const newL = Math.round(eL + K * (0 - (1 - expected)))

    await Promise.all([
      supabase.from('ev_statements').update({ elo_score: newW }).eq('id', winnerId),
      supabase.from('ev_statements').update({ elo_score: newL }).eq('id', loserId),
    ])

    return NextResponse.json({ newEloW: newW, newEloL: newL })
  }

  return NextResponse.json({ ok: true })
}
