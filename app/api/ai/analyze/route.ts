import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 44: Argument Extraction — key points from discussion
// Module 45: Pro/Con Detection — classify arguments
// Module 46: Gap Detection — missing perspectives
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId, mode } = await request.json()
  if (!issueId || !mode) return NextResponse.json({ error: 'issueId and mode required' }, { status: 400 })

  const { data: opinions } = await supabase
    .from('opinion')
    .select('content, intent')
    .eq('issue_id', issueId)
    .is('parent_id', null)
    .limit(40)

  const { data: args } = await supabase
    .from('argument')
    .select('stance, content')
    .in('initiative_id',
      (await supabase.from('initiative').select('id').eq('issue_id', issueId)).data?.map(i => i.id) ?? []
    )
    .limit(20)

  const allText = [
    ...(opinions ?? []).map(o => `[${o.intent ?? 'comment'}] ${o.content}`),
    ...(args ?? []).map(a => `[${a.stance}] ${a.content}`),
  ].join('\n')

  if (!allText.trim()) {
    return NextResponse.json({ result: 'Not enough discussion to analyze.' })
  }

  let prompt = ''
  if (mode === 'extract') {
    prompt = `Extract the 5 most important arguments or key points from this community discussion. Format as a numbered list.\n\n${allText}`
  } else if (mode === 'proCon') {
    prompt = `Classify the main arguments in this discussion as pro or con regarding the proposal topic. Group them clearly. Format as two sections: "Pro Arguments" and "Con Arguments" with bullet points.\n\n${allText}`
  } else if (mode === 'gaps') {
    prompt = `Analyze this community discussion and identify 3-5 important perspectives or considerations that are MISSING or underrepresented. Format as a numbered list with a brief explanation for each gap.\n\n${allText}`
  }

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  })

  return NextResponse.json({ result: completion.choices[0]?.message?.content ?? '' })
}
