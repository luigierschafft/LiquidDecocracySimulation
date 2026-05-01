import { createClient } from '@/lib/supabase/server'
import { ProjectHeader } from '@/components/execution/ProjectHeader'
import { TaskBoard } from '@/components/execution/TaskBoard'
import { TeamList } from '@/components/execution/TeamList'
import { MilestoneTimeline } from '@/components/execution/MilestoneTimeline'
import { ExecutionComments } from '@/components/execution/ExecutionComments'
import { SectionEditor } from '@/components/execution/SectionEditor'
import { GenerateDraftButton } from '@/components/execution/GenerateDraftButton'
import { CreateWorkspaceButton } from '@/components/execution/CreateWorkspaceButton'
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
        <p className="text-sm mt-2 mb-6">
          Start a workspace to collaboratively build a project plan with your team.
        </p>
        {user && <CreateWorkspaceButton topicId={params.topicId} />}
      </div>
    )
  }

  // Ensure all template sections exist in DB
  for (const tmpl of SECTION_TEMPLATE) {
    await supabase.from('ev_execution_sections').upsert(
      { plan_id: plan.id, key: tmpl.key, title: tmpl.title, content: '', sort_order: tmpl.sort_order },
      { onConflict: 'plan_id,key', ignoreDuplicates: true }
    )
  }

  // Fetch sections (without proposal join to avoid FK resolution issues)
  const { data: dbSections } = await supabase
    .from('ev_execution_sections')
    .select('*')
    .eq('plan_id', plan.id)
    .order('sort_order', { ascending: true })

  // Fetch proposals + improvements separately
  const sectionIds = (dbSections ?? []).map((s: any) => s.id)
  const [{ data: proposals }, { data: improvements }] = await Promise.all([
    sectionIds.length > 0
      ? supabase.from('ev_section_proposals').select('*, author:member(display_name, email)').in('section_id', sectionIds)
      : Promise.resolve({ data: [] }),
    sectionIds.length > 0
      ? supabase.from('ev_section_improvements').select('*, author:member(display_name, email)').in('section_id', sectionIds).order('created_at', { ascending: true })
      : Promise.resolve({ data: [] }),
  ])

  // Merge into sections; fallback to template if DB empty
  const finalSections = (dbSections && dbSections.length > 0)
    ? dbSections.map((s: any) => ({
        ...s,
        proposals: (proposals ?? []).filter((p: any) => p.section_id === s.id),
        improvements: (improvements ?? []).filter((i: any) => i.section_id === s.id),
      }))
    : SECTION_TEMPLATE.map((tmpl) => ({
        id: null,
        plan_id: plan.id,
        key: tmpl.key,
        title: tmpl.title,
        content: '',
        sort_order: tmpl.sort_order,
        proposals: [],
        improvements: [],
      }))

  const team = plan.team ?? []
  const isLead = user ? team.some((m: any) => m.user_id === user.id && m.is_lead) : false
  const isMember = user ? team.some((m: any) => m.user_id === user.id) : false

  const sortedComments = [...(plan.comments ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const allSectionsEmpty = finalSections.every((s: any) => !s.content)

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

        {finalSections.map((section: any) => (
          <SectionEditor
            key={section.id ?? section.key}
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
