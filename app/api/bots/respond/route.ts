import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { pickPersonas, isBotMemberId } from '@/lib/bots/personas'
import { getTestIssue, askPersona, clamp } from '@/lib/bots/server'

// Lets 2–3 test personas react to a statement or argument in the Kialo tree.
// Only works for topics on the Test Platform.

export const maxDuration = 60

interface NodeRow {
  id: string
  parent_id: string | null
  type: string
  text: string
  author_id: string
  created_at: string
  author?: { display_name: string | null } | null
}

interface BotReply {
  action: 'pro' | 'contra' | 'skip'
  reply_to: number
  text: string
  statement_rating?: number
  statement_vote?: 'agree' | 'pass' | 'disagree'
}

function renderTree(statementText: string, nodes: NodeRow[], numbers: Map<string, number>): string {
  const lines = [`[0] STATEMENT: "${statementText}"`]
  const walk = (parentId: string | null, depth: number) => {
    for (const n of nodes.filter((x) => x.parent_id === parentId)) {
      const who = n.author?.display_name ?? 'Someone'
      lines.push(`${'  '.repeat(depth)}[${numbers.get(n.id)}] ${n.type.toUpperCase()} by ${who}: "${n.text}"`)
      walk(n.id, depth + 1)
    }
  }
  walk(null, 1)
  return lines.join('\n')
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not logged in' }, { status: 401 })

  const { statementId, parentId = null, count = 2 } = await req.json()
  if (!statementId) return NextResponse.json({ error: 'Missing statementId' }, { status: 400 })

  const admin = createAdminClient()
  const { data: statement } = await admin
    .from('ev_statements')
    .select('id, text, issue_id, author_id')
    .eq('id', statementId)
    .single()
  if (!statement) return NextResponse.json({ error: 'Statement not found' }, { status: 404 })

  const issue = await getTestIssue(admin, statement.issue_id)
  if (!issue) return NextResponse.json({ error: 'Bots only run on the Test Platform' }, { status: 403 })

  const loadNodes = async () => {
    const { data } = await admin
      .from('ev_discussion_nodes')
      .select('id, parent_id, type, text, author_id, created_at, author:member(display_name)')
      .eq('statement_id', statementId)
      .order('created_at', { ascending: true })
    return (data ?? []) as unknown as NodeRow[]
  }

  let nodes = await loadNodes()
  const target = parentId ? nodes.find((n) => n.id === parentId) : null
  if (parentId && !target) return NextResponse.json({ error: 'Argument not found' }, { status: 404 })

  // Don't let a bot answer itself, and give the most recent bot a break.
  const exclude: string[] = []
  const targetAuthor = target ? target.author_id : statement.author_id
  if (isBotMemberId(targetAuthor)) exclude.push(targetAuthor)
  const lastBot = [...nodes].reverse().find((n) => isBotMemberId(n.author_id))
  if (lastBot) exclude.push(lastBot.author_id)

  const personas = pickPersonas(Math.min(Math.max(1, Number(count) || 2), 3), exclude)
  const posted: { persona: string; type: string; text: string }[] = []

  for (const persona of personas) {
    const numbers = new Map(nodes.map((n, i) => [n.id, i + 1]))
    const byNumber = new Map(nodes.map((n, i) => [i + 1, n]))
    const targetNo = target ? numbers.get(target.id)! : 0
    const own = nodes.filter((n) => n.author_id === persona.id).map((n) => `- "${n.text}"`).join('\n')

    const task = `TOPIC: ${issue.title}${issue.description ? `\nDESCRIPTION: ${issue.description}` : ''}

DISCUSSION SO FAR (numbers in brackets, indentation = reply):
${renderTree(statement.text, nodes, numbers)}

${own ? `You already wrote:\n${own}\n` : ''}
Someone just engaged with item [${targetNo}]. React as your character.
Usually reply to [${targetNo}], but you may pick another item if your character would rather respond there.
"pro" supports the item you reply to, "contra" argues against it. Choose "skip" only if you truly have nothing new to add.
Also give your honest view of the STATEMENT [0]: importance 0–10 and agree/pass/disagree.

Answer as JSON only:
{"action":"pro"|"contra"|"skip","reply_to":<number>,"text":"<your argument>","statement_rating":<0-10>,"statement_vote":"agree"|"pass"|"disagree"}`

    const reply = await askPersona<BotReply>(persona, task)
    if (!reply) continue

    // Rate the statement like a normal member would.
    const rating = Number(reply.statement_rating)
    const vote = ['agree', 'pass', 'disagree'].includes(reply.statement_vote as string) ? reply.statement_vote : null
    if (Number.isFinite(rating) || vote) {
      await admin.from('ev_statement_ratings').upsert(
        {
          statement_id: statementId,
          user_id: persona.id,
          ...(Number.isFinite(rating) ? { rating: Math.round(Math.min(10, Math.max(0, rating))) } : {}),
          ...(vote ? { vote } : {}),
        },
        { onConflict: 'statement_id,user_id' }
      )
    }

    if (reply.action !== 'pro' && reply.action !== 'contra') continue
    const text = clamp(reply.text, 300)
    if (!text) continue
    const replyNode = byNumber.get(Number(reply.reply_to))
    const parent = Number(reply.reply_to) === 0 ? null : (replyNode?.id ?? target?.id ?? null)

    const { error } = await admin.from('ev_discussion_nodes').insert({
      statement_id: statementId,
      parent_id: parent,
      type: reply.action,
      text,
      author_id: persona.id,
      source_links: [],
    })
    if (error) {
      console.error('[bots] insert failed:', error.message)
      continue
    }
    posted.push({ persona: persona.name, type: reply.action, text })
    nodes = await loadNodes()
  }

  return NextResponse.json({ posted })
}
