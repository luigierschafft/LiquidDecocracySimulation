import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pickPersonas } from '@/lib/bots/personas'
import { getTestIssue, askPersona, clamp } from '@/lib/bots/server'

// Lets a few test personas add new statements to a topic. Test Platform only.

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { topicId, count = 3 } = await req.json()
  if (!topicId) return NextResponse.json({ error: 'Missing topicId' }, { status: 400 })

  const admin = createAdminClient()
  const issue = await getTestIssue(admin, topicId)
  if (!issue) return NextResponse.json({ error: 'Bots only run on the Test Platform' }, { status: 403 })

  const posted: { persona: string; text: string }[] = []
  const personas = pickPersonas(Math.min(Math.max(1, Number(count) || 3), 4))

  for (const persona of personas) {
    const { data: existing } = await admin
      .from('ev_statements')
      .select('text')
      .eq('issue_id', topicId)
      .order('created_at', { ascending: true })
    const list = (existing ?? []).map((s) => `- ${s.text}`).join('\n') || '(none yet)'

    const task = `TOPIC: ${issue.title}${issue.description ? `\nDESCRIPTION: ${issue.description}` : ''}

EXISTING STATEMENTS:
${list}

Add ONE new statement to this topic that your character would want the community to rate. It must be a clear claim or proposal (not a question), at most 180 characters, and different from the existing ones.
Answer as JSON only: {"text":"<statement>"}`

    const reply = await askPersona<{ text: string }>(persona, task)
    const text = clamp(reply?.text, 200)
    if (!text) continue

    const { error } = await admin.from('ev_statements').insert({
      issue_id: topicId,
      text,
      author_id: persona.id,
      source_links: [],
    })
    if (error) {
      console.error('[bots] statement insert failed:', error.message)
      continue
    }
    posted.push({ persona: persona.name, text })
  }

  return NextResponse.json({ posted })
}
