import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getEffectiveModules } from '@/lib/modules'
import { BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TransparencyPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)

  if (!modules.transparency_dashboard) notFound()

  const [
    issuesResult,
    votesResult,
    opinionsResult,
    membersResult,
  ] = await Promise.all([
    supabase.from('issue').select('status'),
    supabase.from('vote').select('*', { count: 'exact', head: true }),
    supabase.from('opinion').select('*', { count: 'exact', head: true }),
    supabase.from('member').select('*', { count: 'exact', head: true }).eq('is_approved', true),
  ])

  const issues = issuesResult.data ?? []
  const statusCounts: Record<string, number> = {}
  for (const i of issues) {
    statusCounts[i.status] = (statusCounts[i.status] ?? 0) + 1
  }

  const statusOrder = ['admission', 'discussion', 'verification', 'voting', 'closed']
  const statusLabels: Record<string, string> = {
    admission: 'Admission',
    discussion: 'Discussion',
    verification: 'Verification',
    voting: 'Voting',
    closed: 'Closed',
  }
  const maxCount = Math.max(...Object.values(statusCounts), 1)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-accent" />
          Transparency Dashboard
        </h1>
        <p className="text-foreground/60 mt-1">Public statistics for the Autopoietic Agora community</p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Members', value: membersResult.count ?? 0 },
          { label: 'Total Topics', value: issues.length },
          { label: 'Votes Cast', value: votesResult.count ?? 0 },
          { label: 'Contributions', value: opinionsResult.count ?? 0 },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl font-bold text-accent">{s.value}</div>
            <div className="text-sm text-foreground/60 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topics by status */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Topics by Phase</h2>
        <div className="space-y-3">
          {statusOrder.map((s) => {
            const count = statusCounts[s] ?? 0
            const pct = Math.round((count / maxCount) * 100)
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

      <p className="text-xs text-foreground/30 text-center">
        Statistics updated in real-time. No personal data is shown.
      </p>
    </div>
  )
}
