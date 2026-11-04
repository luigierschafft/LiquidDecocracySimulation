import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlayHeader } from '@/components/play/PlayHeader'
import { ProjectHeader } from '@/components/execution/ProjectHeader'
import { TaskBoard } from '@/components/execution/TaskBoard'
import { TeamList } from '@/components/execution/TeamList'
import { MilestoneTimeline } from '@/components/execution/MilestoneTimeline'
import { ExecutionComments } from '@/components/execution/ExecutionComments'
import { SectionEditor } from '@/components/execution/SectionEditor'
import { GenerateDraftButton } from '@/components/execution/GenerateDraftButton'
import { CreateWorkspaceButton } from '@/components/execution/CreateWorkspaceButton'
import { SECTION_TEMPLATE } from '@/lib/execution/sections'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function PlayProposalPlanPage({ params }: { params: { topicId: string; proposalId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: issue }, { data: proposal }, { data: plan }] = await Promise.all([
    supabase.from('issue').select('id, title').eq('id', params.topicId).single(),
    supabase.from('ev_topic_proposals').select('id, text').eq('id', params.proposalId).maybeSingle(),
    supabase
      .from('ev_execution_plans')
      .select(`
        *,
        tasks:ev_execution_tasks(*, assignee:member(display_name, email), comments:ev_task_comments(*, author:member(display_name, email))),
        milestones:ev_execution_milestones(*),
        team:ev_execution_team(*, member(display_name, email)),
        comments:ev_execution_comments(*, author:member(display_name, email))
      `)
      .eq('proposal_id', params.proposalId)
      .maybeSingle(),
  ])

  if (!issue) notFound()

  return (
    <div className="pb-16">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <PlayHeader backHref={`/playful/${params.topicId}/plan`} backLabel="Plans" section="Project plan" title={issue.title} />

        {/* Proposal text */}
        {proposal && (
          <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
            <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Proposal</span>
            </div>
            <div className="px-5 py-4">
              <p className="text-base font-semibold text-gray-800 leading-relaxed">{proposal.text}</p>
            </div>
          </div>
        )}

        {!plan ? (
          /* No plan yet */
          <div className="bg-white rounded-3xl shadow-cushion-white px-6 py-12 text-center space-y-4">
            <div className="text-5xl">🗺️</div>
            <p className="text-gray-700 font-semibold">No project plan yet</p>
            <p className="text-sm text-gray-400">
              Start a workspace to collaboratively build a project plan for this proposal.
            </p>
            {user && (
              <div className="flex justify-center">
                <CreateWorkspaceButton topicId={params.topicId} proposalId={params.proposalId} />
              </div>
            )}
          </div>
        ) : (
          <PlayfulPlanContent
            plan={plan}
            params={params}
            user={user}
          />
        )}

      </div>
    </div>
  )
}

async function PlayfulPlanContent({ plan, params, user }: { plan: any; params: { topicId: string; proposalId: string }; user: any }) {
  const supabase = createClient()

  // Ensure all template sections exist
  for (const tmpl of SECTION_TEMPLATE) {
    await supabase.from('ev_execution_sections').upsert(
      { plan_id: plan.id, key: tmpl.key, title: tmpl.title, content: '', sort_order: tmpl.sort_order },
      { onConflict: 'plan_id,key', ignoreDuplicates: true }
    )
  }

  const { data: dbSections } = await supabase
    .from('ev_execution_sections')
    .select('*')
    .eq('plan_id', plan.id)
    .order('sort_order', { ascending: true })

  const sectionIds = (dbSections ?? []).map((s: any) => s.id)
  const [{ data: sectionProposals }, { data: improvements }, { data: sectionOwners }, modules] = await Promise.all([
    sectionIds.length > 0
      ? supabase.from('ev_section_proposals').select('*, author:member(display_name, email)').in('section_id', sectionIds)
      : Promise.resolve({ data: [] }),
    sectionIds.length > 0
      ? supabase.from('ev_section_improvements').select('*, author:member(display_name, email)').in('section_id', sectionIds).order('created_at', { ascending: true })
      : Promise.resolve({ data: [] }),
    sectionIds.length > 0
      ? supabase.from('ev_section_owners').select('section_id, user_id, member(display_name, email)').in('section_id', sectionIds)
      : Promise.resolve({ data: [] }),
    getEffectiveModules(user?.id ?? null),
  ])

  const finalSections = (dbSections && dbSections.length > 0)
    ? dbSections.map((s: any) => ({
        ...s,
        proposals: (sectionProposals ?? []).filter((p: any) => p.section_id === s.id),
        improvements: (improvements ?? []).filter((i: any) => i.section_id === s.id),
        owners: (sectionOwners ?? []).filter((o: any) => o.section_id === s.id),
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
        owners: [],
      }))

  const team = plan.team ?? []
  const isLead = user ? team.some((m: any) => m.user_id === user.id && m.is_lead) : false
  const isMember = user ? team.some((m: any) => m.user_id === user.id) : false
  const allSectionsEmpty = finalSections.every((s: any) => !s.content)

  const sortedComments = [...(plan.comments ?? [])].sort(
    (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="space-y-5">

      {/* Project header */}
      <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
        <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Overview</span>
        </div>
        <div className="p-5">
          <ProjectHeader plan={plan} />
        </div>
      </div>

      {/* Team + Milestones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
          <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Team</span>
          </div>
          <div className="p-4">
            <TeamList team={team} planId={plan.id} userId={user?.id ?? null} />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
          <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Milestones</span>
          </div>
          <div className="p-4">
            <MilestoneTimeline milestones={plan.milestones ?? []} planId={plan.id} userId={user?.id ?? null} />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
        <div className="px-5 pt-4 flex items-center justify-between gap-2">
          <span className="font-fun font-semibold text-[17px] text-gray-800">Plan sections</span>
          {isLead && allSectionsEmpty && (
            <GenerateDraftButton planId={plan.id} issueId={params.topicId} />
          )}
        </div>
        <div className="p-4 space-y-4">
          {finalSections.map((section: any) => (
            <SectionEditor
              key={section.id ?? section.key}
              section={section}
              isLead={isLead}
              isMember={isMember}
              userId={user?.id ?? null}
              owners={section.owners}
              sectionOwnershipEnabled={modules.section_ownership ?? false}
            />
          ))}
        </div>
      </div>

      {/* Task board */}
      <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
        <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Tasks</span>
        </div>
        <div className="p-4">
          <TaskBoard tasks={plan.tasks ?? []} planId={plan.id} userId={user?.id ?? null} />
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
        <div className="px-5 pt-4">
              <span className="font-fun font-semibold text-[17px] text-gray-800">Discussion</span>
        </div>
        <div className="p-4">
          <ExecutionComments planId={plan.id} userId={user?.id ?? null} comments={sortedComments} />
        </div>
      </div>

    </div>
  )
}
