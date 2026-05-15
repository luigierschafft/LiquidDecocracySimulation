import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const supabase = createClient()

  // 1. Total counts (parallel)
  const [statementsResult, argumentsResult, proposalsResult, sectionsResult, topicsResult] = await Promise.all([
    supabase.from('ev_statements').select('id', { count: 'exact', head: true }),
    supabase.from('ev_proposal_arguments').select('id', { count: 'exact', head: true }),
    supabase.from('ev_topic_proposals').select('id', { count: 'exact', head: true }),
    supabase.from('ev_execution_sections').select('id', { count: 'exact', head: true }),
    supabase.from('issue').select('id', { count: 'exact', head: true }).neq('status', 'draft'),
  ])

  const totalStatements = statementsResult.count ?? 0
  const totalArguments = argumentsResult.count ?? 0
  const totalProposals = proposalsResult.count ?? 0
  const totalSections = sectionsResult.count ?? 0
  const totalTopics = topicsResult.count ?? 0

  // 2. New topics this week
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: newTopicsCount } = await supabase
    .from('issue')
    .select('id', { count: 'exact', head: true })
    .neq('status', 'draft')
    .gte('created_at', oneWeekAgo)

  // 3. Most discussed topics (top 5 by statement count)
  const { data: allStatements } = await supabase
    .from('ev_statements')
    .select('issue_id')

  const countMap: Record<string, number> = {}
  for (const s of allStatements ?? []) {
    if (s.issue_id) {
      countMap[s.issue_id] = (countMap[s.issue_id] ?? 0) + 1
    }
  }

  const topIssueIds = Object.entries(countMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id)

  const { data: topIssues } = topIssueIds.length > 0
    ? await supabase.from('issue').select('id, title').in('id', topIssueIds)
    : { data: [] }

  const topTopics = topIssueIds.map(id => ({
    id,
    title: topIssues?.find((i: any) => i.id === id)?.title ?? 'Unknown',
    count: countMap[id],
  }))

  const maxCount = topTopics[0]?.count ?? 1

  const statCards = [
    { icon: '💬', label: 'Statements', value: totalStatements },
    { icon: '🗣', label: 'Arguments', value: totalArguments },
    { icon: '📋', label: 'Proposals', value: totalProposals },
    { icon: '🗂', label: 'Plan Items', value: totalSections },
    { icon: '📚', label: 'Active Topics', value: totalTopics },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-normal">Community Activity</h1>
        <p className="text-foreground/60 mt-1">How the Auroville community is engaging</p>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-2">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-3xl font-bold text-purple-700">{card.value.toLocaleString()}</span>
            <span className="text-sm text-foreground/60">{card.label}</span>
          </div>
        ))}
      </div>

      {/* Second row */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* New this week */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wide mb-4">New This Week</h2>
          <div className="flex flex-col gap-1">
            <span className="text-5xl font-bold text-green-600">{newTopicsCount ?? 0}</span>
            <span className="text-foreground/60 text-sm mt-1">new topics</span>
          </div>
        </div>

        {/* Most active topics */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-sm font-medium text-foreground/50 uppercase tracking-wide mb-4">Most Active Topics</h2>
          {topTopics.length === 0 ? (
            <p className="text-foreground/40 text-sm">No discussion data yet.</p>
          ) : (
            <ol className="space-y-3">
              {topTopics.map((topic, i) => (
                <li key={topic.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-foreground/30 w-4 shrink-0">{i + 1}</span>
                      <span className="text-sm font-medium truncate">{topic.title}</span>
                    </div>
                    <span className="text-xs text-foreground/50 shrink-0">{topic.count}</span>
                  </div>
                  <div className="ml-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-400 rounded-full"
                      style={{ width: `${Math.round((topic.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
