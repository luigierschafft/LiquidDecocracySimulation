import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const topicId = searchParams.get('topicId')
  const mode = parseInt(searchParams.get('mode') ?? '0')

  if (!topicId || !mode) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // ── Mode 1: Agree / Disagree ─────────────────────────────
  if (mode === 1) {
    const { data: statements } = await supabase
      .from('ev_statements')
      .select('id, text')
      .eq('issue_id', topicId)
      .order('created_at', { ascending: true })

    return NextResponse.json({ statements: statements ?? [] })
  }

  // ── Mode 2: Pairwise ranking ─────────────────────────────
  if (mode === 2) {
    const { data: statements } = await supabase
      .from('ev_statements')
      .select('id, text, elo_score')
      .eq('issue_id', topicId)

    if (!statements || statements.length < 2) {
      return NextResponse.json({ pair: null })
    }

    if (user) {
      const { data: compared } = await supabase
        .from('ev_statement_comparisons')
        .select('winner_id, loser_id')
        .eq('issue_id', topicId)
        .eq('user_id', user.id)

      const seen = new Set(
        (compared ?? []).flatMap(c => [
          `${c.winner_id}|${c.loser_id}`,
          `${c.loser_id}|${c.winner_id}`,
        ])
      )

      const shuffled = [...statements].sort(() => Math.random() - 0.5)
      for (let i = 0; i < shuffled.length; i++) {
        for (let j = i + 1; j < shuffled.length; j++) {
          if (!seen.has(`${shuffled[i].id}|${shuffled[j].id}`)) {
            return NextResponse.json({ pair: [shuffled[i], shuffled[j]] })
          }
        }
      }
      return NextResponse.json({ pair: null }) // all pairs done
    }

    // No user — random pair
    const shuffled = [...statements].sort(() => Math.random() - 0.5)
    return NextResponse.json({ pair: [shuffled[0], shuffled[1]] })
  }

  // ── Mode 3: Pro / Contra adding ──────────────────────────
  if (mode === 3) {
    const { data: statements } = await supabase
      .from('ev_statements')
      .select('id, text')
      .eq('issue_id', topicId)

    if (!statements || statements.length === 0) {
      return NextResponse.json({ statement: null, nodes: [] })
    }

    const { data: nodes } = await supabase
      .from('ev_discussion_nodes')
      .select('id, statement_id, type, text')
      .in('statement_id', statements.map(s => s.id))
      .in('type', ['pro', 'contra'])
      .is('parent_id', null)

    // Find statements with fewest top-level pro/contra nodes
    const counts = new Map(statements.map(s => [s.id, 0]))
    for (const n of nodes ?? []) {
      counts.set(n.statement_id, (counts.get(n.statement_id) ?? 0) + 1)
    }

    const sorted = [...statements].sort(
      (a, b) => (counts.get(a.id) ?? 0) - (counts.get(b.id) ?? 0)
    )
    // Pick randomly from the bottom third (most in need)
    const poolSize = Math.max(1, Math.ceil(sorted.length / 3))
    const stmt = sorted[Math.floor(Math.random() * poolSize)]
    const stmtNodes = (nodes ?? []).filter(n => n.statement_id === stmt.id)

    return NextResponse.json({ statement: stmt, nodes: stmtNodes })
  }

  return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
}
