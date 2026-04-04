import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: member } = await supabase
    .from('member')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!member?.is_admin) notFound()

  const modules = await getEffectiveModules(user.id)

  const [
    issuesByStatusResult,
    totalVotesResult,
    totalOpinionsResult,
    totalArgumentsResult,
    topMembersResult,
    topTopicsResult,
    topReputationResult,
  ] = await Promise.all([
    supabase.from('issue').select('status'),
    supabase.from('vote').select('*', { count: 'exact', head: true }),
    supabase.from('opinion').select('*', { count: 'exact', head: true }),
    supabase.from('argument').select('*', { count: 'exact', head: true }),
    supabase
      .from('vote')
      .select('member_id, member:member!vote_member_id_fkey(display_name, email)')
      .limit(1000),
    supabase
      .from('opinion')
      .select('issue_id, issue:issue!inner(title)')
      .is('initiative_id', null)
      .limit(1000),
    modules.reputation_system
      ? supabase
          .from('member')
          .select('id, display_name, email, reputation_score')
          .order('reputation_score', { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
  ])

  const issueStatuses = issuesByStatusResult.data ?? []
  const statusCounts: Record<string, number> = {}
  for (const i of issueStatuses) {
    statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1
  }
  const totalIssues = issueStatuses.length
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1)

  const statusOrder = ['admission', 'discussion', 'verification', 'voting', 'closed']
  const statusLabels: Record<string, string> = {
    admission: 'Admission',
    discussion: 'Discussion',
    verification: 'Verification',
    voting: 'Voting',
    closed: 'Closed',
  }

  // Top 5 members by vote count
  const memberVoteCounts: Record<string, { count: number; name: string }> = {}
  for (const v of totalVotesResult.data ?? ([] as any[])) {
    const vid = (v as any).member_id
    const name = getMemberDisplayName((v as any).member)
    if (!memberVoteCounts[vid]) memberVoteCounts[vid] = { count: 0, name }
    memberVoteCounts[vid].count++
  }
  const topMembers = Object.values(memberVoteCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Top 5 topics by opinion count
  const topicOpinionCounts: Record<string, { count: number; title: string }> = {}
  for (const op of topTopicsResult.data ?? []) {
    const o = op as any
    const id = o.issue_id
    const title = o.issue?.title ?? 'Unknown'
    if (!topicOpinionCounts[id]) topicOpinionCounts[id] = { count: 0, title }
    topicOpinionCounts[id].count++
  }
  const topTopics = Object.values(topicOpinionCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const maxMemberCount = Math.max(...topMembers.map((m) => m.count), 1)
  const maxTopicCount = Math.max(...topTopics.map((t) => t.count), 1)

  const topReputation = (topReputationResult as any).data ?? []
  const maxRepScore = Math.max(...topReputation.map((m: any) => m.reputation_score ?? 0), 1)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-accent" />
            Analytics
          </h1>
          <p className="text-foreground/60 mt-0.5">Platform statistics overview</p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Topics', value: totalIssues },
          { label: 'Total Votes', value: totalVotesResult.count ?? 0 },
          { label: 'Total Comments', value: totalOpinionsResult.count ?? 0 },
          { label: 'Total Arguments', value: totalArgumentsResult.count ?? 0 },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl font-bold text-accent">{s.value}</div>
            <div className="text-xs text-foreground/60 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topics by status */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Topics by Status</h2>
        <div className="space-y-3">
          {statusOrder.map((s) => {
            const count = statusCounts[s] ?? 0
            const pct = Math.round((count / maxStatusCount) * 100)
            return (
              <div key={s} className="flex items-center gap-3">
                <span className="text-sm text-foreground/60 w-28 shrink-0">{statusLabels[s]}</span>
                <div className="flex-1 bg-sand rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Most active members */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Most Active Members (by votes)</h2>
        {topMembers.length === 0 ? (
          <p className="text-sm text-foreground/40">No votes yet.</p>
        ) : (
          <div className="space-y-3">
            {topMembers.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-foreground/60 w-4 shrink-0">#{i + 1}</span>
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{m.name}</span>
                <div className="w-32 bg-sand rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${Math.round((m.count / maxMemberCount) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{m.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Most discussed topics */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Most Discussed Topics (by comments)</h2>
        {topTopics.length === 0 ? (
          <p className="text-sm text-foreground/40">No discussions yet.</p>
        ) : (
          <div className="space-y-3">
            {topTopics.map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-foreground/60 w-4 shrink-0">#{i + 1}</span>
                <span className="text-sm font-medium flex-1 min-w-0 truncate">{t.title}</span>
                <div className="w-32 bg-sand rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${Math.round((t.count / maxTopicCount) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold w-8 text-right">{t.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top by Reputation — Module 4 */}
      {modules.reputation_system && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Top by Reputation</h2>
          {topReputation.length === 0 ? (
            <p className="text-sm text-foreground/40">No reputation scores yet.</p>
          ) : (
            <div className="space-y-3">
              {topReputation.map((m: any, i: number) => (
                <div key={m.id} className="flex items-center gap-3">
                  <span className="text-sm text-foreground/60 w-4 shrink-0">#{i + 1}</span>
                  <span className="text-sm font-medium flex-1 min-w-0 truncate">
                    {m.display_name ?? m.email ?? 'Unknown'}
                  </span>
                  <div className="w-32 bg-sand rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${Math.round(((m.reputation_score ?? 0) / maxRepScore) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-10 text-right">{m.reputation_score ?? 0} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
