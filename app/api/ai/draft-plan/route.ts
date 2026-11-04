import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { apiRoute, badRequest, forbidden, readJson, requireUser } from '@/lib/api/handler'
import { SECTION_TEMPLATE } from '@/lib/execution/sections'

export const POST = apiRoute(async (req) => {
  const { supabase, user } = await requireUser()
  const { issueId, planId } = await readJson<{ issueId?: string; planId?: string }>(req)
  if (!issueId || !planId) throw badRequest('issueId and planId required')

  // Check user is team lead
  const { data: teamEntry } = await supabase
    .from('ev_execution_team')
    .select('is_lead')
    .eq('plan_id', planId)
    .eq('user_id', user.id)
    .single()

  if (!teamEntry?.is_lead) throw forbidden('Only the team lead can generate a draft')

  // Gather context from discussion phase
  const [{ data: issue }, { data: statements }, { data: proposals }] = await Promise.all([
    supabase.from('issue').select('title, description').eq('id', issueId).single(),
    supabase
      .from('ev_statements')
      .select('id, text, ratings:ev_statement_ratings(rating, vote)')
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

  const raw = await generateText({
    maxTokens: 4000,
    prompt: `You are drafting a project plan for a community initiative in Auroville, India.

Topic: ${issue?.title ?? 'Unknown'}
Description: ${issue?.description ?? 'N/A'}

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
  })
  const sections = parseJsonObject<Record<string, string>>(raw) ?? {}

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

  return { success: true, sectionCount: SECTION_TEMPLATE.length }
})
