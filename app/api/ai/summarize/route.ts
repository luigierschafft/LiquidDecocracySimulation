import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 43: AI Summaries — summarize all opinions on a topic
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId } = await request.json()
  if (!issueId) return NextResponse.json({ error: 'issueId required' }, { status: 400 })

  const { data: opinions } = await supabase
    .from('opinion')
    .select('content, intent')
    .eq('issue_id', issueId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })
    .limit(50)

  if (!opinions || opinions.length === 0) {
    return NextResponse.json({ summary: 'No discussion yet to summarize.' })
  }

  const discussionText = opinions
    .map((o, i) => `${i + 1}. [${o.intent ?? 'comment'}] ${o.content}`)
    .join('\n')

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Summarize this community discussion. Use plain text only — no asterisks, no markdown, no bold or italic formatting. Structure the output as short paragraphs with blank lines between them. Where helpful, use simple bullet lists with a dash (-) at the start of each item. Cover: the main topic, key opinions and ratings if mentioned, points of agreement and disagreement, and any open questions. Be neutral and concise.\n\nDiscussion:\n${discussionText}`,
    }],
  })

  const summary = completion.choices[0]?.message?.content ?? ''
  return NextResponse.json({ summary })
}
