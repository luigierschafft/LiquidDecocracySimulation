import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 49: Opinion Clustering — group similar opinions by theme
// Module 50: Consensus Suggestions — generate compromise proposals
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId, mode } = await request.json()
  if (!issueId) return NextResponse.json({ error: 'issueId required' }, { status: 400 })

  const { data: opinions } = await supabase
    .from('opinion')
    .select('id, content, intent')
    .eq('issue_id', issueId)
    .is('parent_id', null)
    .limit(50)

  if (!opinions || opinions.length < 3) {
    return NextResponse.json({ result: 'Not enough opinions to cluster (need at least 3).' })
  }

  const numbered = opinions.map((o, i) => `${i + 1}. ${o.content}`).join('\n')

  let prompt = ''
  if (mode === 'consensus') {
    const { data: initiatives } = await supabase
      .from('initiative')
      .select('title, content')
      .eq('issue_id', issueId)
      .eq('is_draft', false)
      .limit(5)

    const propsText = (initiatives ?? []).map(i => `- ${i.title}: ${i.content.slice(0, 200)}`).join('\n')
    prompt = `Based on these community opinions and existing propositions, suggest ONE compromise proposal that could achieve broad consensus. Be specific and constructive.\n\nOpinions:\n${numbered}\n\nExisting propositions:\n${propsText || 'None yet'}`
  } else {
    prompt = `Group these community opinions into 3-5 thematic clusters. For each cluster, give it a short name and list the opinion numbers that belong to it.\n\nOpinions:\n${numbered}`
  }

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ result: (message.content[0] as any).text ?? '' })
}
