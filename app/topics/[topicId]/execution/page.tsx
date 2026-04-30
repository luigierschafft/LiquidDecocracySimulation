import { createClient } from '@/lib/supabase/server'
import { ProjectHeader } from '@/components/execution/ProjectHeader'
import { TaskBoard } from '@/components/execution/TaskBoard'
import { TeamList } from '@/components/execution/TeamList'
import { MilestoneTimeline } from '@/components/execution/MilestoneTimeline'
import { ExecutionComments } from '@/components/execution/ExecutionComments'
import { SectionEditor } from '@/components/execution/SectionEditor'
import { GenerateDraftButton } from '@/components/execution/GenerateDraftButton'
import { SECTION_TEMPLATE } from '@/lib/execution/sections'

export const dynamic = 'force-dynamic'

export default async function ExecutionPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: plan } = await supabase
    .from('ev_execution_plans')
    .select(
      `
      *,
      tasks:ev_execution_tasks(*, assignee:member(display_name, email), comments:ev_task_comments(*, author:member(display_name, email))),
      milestones:ev_execution_milestones(*),
      team:ev_execution_team(*, member(display_name, email)),
      comments:ev_execution_comments(*, author:member(display_name, email))
    `
    )
    .eq('issue_id', params.topicId)
    .maybeSingle()

  if (!plan) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No execution workspace yet</p>
        <p className="text-sm mt-2">
          The workspace is created once a proposal has been accepted by the community.
        </p>
      </div>
    )
  }

  // Fetch sections with pending proposals
  const { data: sections } = await supabase
    .from('ev_execution_sections')
    .select('*, updater:member!updated_by(display_name, email), proposals:ev_section_proposals(*, author:member(display_name, email))')
    .eq('plan_id', plan.id)
    .order('sort_order', { ascending: true })

  // If no sections exist yet, create them from template
  if (!sections || sections.length === 0) {
    for (const tmpl of SECTION_TEMPLATE) {
      await supabase.from('ev_execution_sections').upsert(
        { plan_id: plan.id, key: tmpl.key, title: tmpl.title, content: '', sort_order: tmpl.sort_order },
        { onConflict: 'plan_id,key' }
      )
    }
  }

  // Refetch if we just created them
  const { data: finalSections } = sections && sections.length > 0
    ? { data: sections }
    : await supabase
        .from('ev_execution_sections')
        .select('*, updater:member!updated_by(display_name, email), proposals:ev_section_proposals(*, author:member(display_name, email))')
        .eq('plan_id', plan.id)
        .order('sort_order', { ascending: true })

  const team = plan.team ?? []
  const isLead = user ? team.some((m: any) => m.user_id === user.id && m.is_lead) : false
  const isMember = user ? team.some((m: any) => m.user_id === user.id) : false

  const sortedComments = [...(plan.comments ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const allSectionsEmpty = (finalSections ?? []).every((s: any) => !s.content)

  return (
    <div className="space-y-8">
      <ProjectHeader plan={plan} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TeamList team={team} planId={plan.id} userId={user?.id ?? null} />
        <MilestoneTimeline milestones={plan.milestones ?? []} planId={plan.id} userId={user?.id ?? null} />
      </div>

      {/* Project Plan Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Project Plan</h2>
          {isLead && allSectionsEmpty && (
            <GenerateDraftButton planId={plan.id} issueId={params.topicId} />
          )}
        </div>

        {(finalSections ?? []).map((section: any) => (
          <SectionEditor
            key={section.id}
            section={section}
            isLead={isLead}
            isMember={isMember}
            userId={user?.id ?? null}
          />
        ))}
      </div>

      <TaskBoard tasks={plan.tasks ?? []} planId={plan.id} userId={user?.id ?? null} />
      <ExecutionComments planId={plan.id} userId={user?.id ?? null} comments={sortedComments} />
    </div>
  )
}
