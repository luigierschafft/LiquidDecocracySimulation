import { NextResponse } from 'next/server'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 58: Decision Readiness — score how ready the community is to decide
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId } = await request.json()
  if (!issueId) return NextResponse.json({ error: 'issueId required' }, { status: 400 })

  const [opinionsResult, argsResult, initResult] = await Promise.all([
    supabase.from('opinion').select('id', { count: 'exact', head: true }).eq('issue_id', issueId),
    supabase.from('argument').select('id', { count: 'exact', head: true })
      .in('initiative_id', (await supabase.from('initiative').select('id').eq('issue_id', issueId)).data?.map(i => i.id) ?? []),
    supabase.from('initiative').select('id', { count: 'exact', head: true }).eq('issue_id', issueId).eq('is_draft', false),
  ])

  const opinionCount = opinionsResult.count ?? 0
  const argCount = argsResult.count ?? 0
  const initiativeCount = initResult.count ?? 0

  const completion = await groq.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 250,
    messages: [{
      role: 'user',
      content: `A community governance topic has the following discussion stats:\n- Opinions posted: ${opinionCount}\n- Arguments submitted: ${argCount}\n- Propositions submitted: ${initiativeCount}\n\nBased on these numbers, provide:\n1. A readiness score (0-100)\n2. A one-sentence assessment\n3. What's still needed before a vote (if anything)\n\nReply as JSON: {"score": number, "assessment": "...", "missing": "..."}`,
    }],
  })

  try {
    const text = completion.choices[0]?.message?.content ?? '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { score: 50, assessment: 'Moderate discussion activity.', missing: 'More community input needed.' }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ score: 50, assessment: 'Unable to assess at this time.', missing: '' })
  }
}
