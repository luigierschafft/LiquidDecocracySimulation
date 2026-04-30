import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'
import { SECTION_TEMPLATE } from '@/lib/execution/sections'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { issueId, planId } = await request.json()
  if (!issueId || !planId) return NextResponse.json({ error: 'issueId and planId required' }, { status: 400 })

  // Check user is team lead
  const { data: teamEntry } = await supabase
    .from('ev_execution_team')
    .select('is_lead')
    .eq('plan_id', planId)
    .eq('user_id', user.id)
    .single()

  if (!teamEntry?.is_lead) {
    return NextResponse.json({ error: 'Only the team lead can generate a draft' }, { status: 403 })
  }

  // Gather context from discussion phase
  const [{ data: issue }, { data: statements }, { data: proposals }] = await Promise.all([
    supabase.from('issue').select('title, body').eq('id', issueId).single(),
    supabase
      .from('ev_statements')
      .select('text, ratings:ev_statement_ratings(rating, vote)')
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true }),
    supabase
      .from('ev_topic_proposals')
      .select('text, votes:ev_proposal_votes(vote)')
      .eq('issue_id', issueId),
  ])

  // Get discussion arguments
  const stmtIds = (statements ?? []).map((s: any) => s.id).filter(Boolean)
  const { data: args } = stmtIds.length > 0
    ? await supabase
        .from('ev_discussion_nodes')
        .select('type, text')
        .in('statement_id', stmtIds)
        .in('type', ['pro', 'contra'])
    : { data: [] }

  // Build context string
  const statementsText = (statements ?? []).map((s: any) => {
    const ratings = s.ratings ?? []
    const agrees = ratings.filter((r: any) => r.vote === 'agree').length
    const disagrees = ratings.filter((r: any) => r.vote === 'disagree').length
    const avgRating = ratings.filter((r: any) => r.rating != null).length > 0
      ? (ratings.filter((r: any) => r.rating != null).reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.filter((r: any) => r.rating != null).length).toFixed(1)
      : 'N/A'
    return `- "${s.text}" (Agree: ${agrees}, Disagree: ${disagrees}, Importance: ${avgRating}/10)`
  }).join('\n')

  const argsText = (args ?? []).map((a: any) => `- [${a.type}] ${a.text}`).join('\n')

  const proposalsText = (proposals ?? []).map((p: any) => {
    const votes = p.votes ?? []
    const approves = votes.filter((v: any) => v.vote === 'approve').length
    const disapproves = votes.filter((v: any) => v.vote === 'disapprove' || v.vote === 'strong_disapproval').length
    return `- "${p.text}" (Approve: ${approves}, Disapprove: ${disapproves})`
  }).join('\n')

  const sectionKeys = SECTION_TEMPLATE.map((s) => `${s.key}: ${s.title}`).join('\n')

  let sections: Record<string, string> = {}

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are drafting a project plan for a community initiative in Auroville, India.

Topic: ${issue?.title ?? 'Unknown'}
Description: ${issue?.body ?? 'N/A'}

Community discussion statements (with votes and importance ratings):
${statementsText || 'No statements yet.'}

Pro/Contra arguments from discussion:
${argsText || 'No arguments yet.'}

Proposals submitted:
${proposalsText || 'No proposals yet.'}

Generate content for each of these sections. Use Markdown formatting (# headings, **bold**, - lists). Be practical, specific to the topic, and reference insights from the discussion where possible. Each section should be 3-8 lines.

Sections to fill:
${sectionKeys}

Respond ONLY with a JSON object where keys are the section keys and values are the markdown content strings. No other text, no markdown code fences.`,
      }],
    })

    const responseText = chat.choices[0]?.message?.content ?? '{}'
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    sections = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch (e: any) {
    console.error('AI draft-plan error:', e?.message ?? e)
    return NextResponse.json({ error: e?.message ?? 'AI generation failed' }, { status: 500 })
  }

  // Upsert sections into DB
  for (const tmpl of SECTION_TEMPLATE) {
    const content = sections[tmpl.key] ?? ''
    await supabase.from('ev_execution_sections').upsert(
      {
        plan_id: planId,
        key: tmpl.key,
        title: tmpl.title,
        content,
        sort_order: tmpl.sort_order,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'plan_id,key' }
    )
  }

  return NextResponse.json({ success: true, sectionCount: SECTION_TEMPLATE.length })
}
