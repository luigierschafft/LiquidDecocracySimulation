import { createClient } from '@/lib/supabase/server'
import { ProjectHeader } from '@/components/execution/ProjectHeader'
import { TaskBoard } from '@/components/execution/TaskBoard'
import { TeamList } from '@/components/execution/TeamList'
import { MilestoneTimeline } from '@/components/execution/MilestoneTimeline'
import { ProposalDocument } from '@/components/execution/ProposalDocument'
import { ExecutionComments } from '@/components/execution/ExecutionComments'

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

  const sortedComments = [...(plan.comments ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  return (
    <div className="space-y-8">
      <ProjectHeader plan={plan} />
      <div className="grid grid-cols-1 gap-8">
        <TaskBoard tasks={plan.tasks ?? []} planId={plan.id} userId={user?.id ?? null} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamList team={plan.team ?? []} planId={plan.id} userId={user?.id ?? null} />
          <MilestoneTimeline milestones={plan.milestones ?? []} planId={plan.id} userId={user?.id ?? null} />
        </div>
        <ProposalDocument planId={plan.id} proposalText={plan.proposal_text ?? null} userId={user?.id ?? null} />
        <ExecutionComments planId={plan.id} userId={user?.id ?? null} comments={sortedComments} />
      </div>
    </div>
  )
}
