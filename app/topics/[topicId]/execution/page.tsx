import { createClient } from '@/lib/supabase/server'
import { ProjectHeader } from '@/components/execution/ProjectHeader'
import { TaskBoard } from '@/components/execution/TaskBoard'
import { TeamList } from '@/components/execution/TeamList'
import { MilestoneTimeline } from '@/components/execution/MilestoneTimeline'

export const dynamic = 'force-dynamic'

export default async function ExecutionPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: plan } = await supabase
    .schema('ev')
    .from('execution_plans')
    .select(
      `
      *,
      tasks:execution_tasks(*, assignee:member!execution_tasks_assignee_id_fkey(display_name, email), comments:task_comments(*, author:member!task_comments_author_id_fkey(display_name, email))),
      milestones:execution_milestones(*),
      team:execution_team(*, member:member!execution_team_user_id_fkey(display_name, email))
    `
    )
    .eq('issue_id', params.topicId)
    .maybeSingle()

  if (!plan) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">Noch kein Execution Workspace</p>
        <p className="text-sm mt-2">
          Der Workspace wird automatisch erstellt, sobald eine Initiative angenommen wurde.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ProjectHeader plan={plan} />
      <div className="grid grid-cols-1 gap-8">
        <TaskBoard tasks={plan.tasks ?? []} planId={plan.id} userId={user?.id ?? null} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeamList team={plan.team ?? []} planId={plan.id} userId={user?.id ?? null} />
          <MilestoneTimeline milestones={plan.milestones ?? []} planId={plan.id} userId={user?.id ?? null} />
        </div>
      </div>
    </div>
  )
}
