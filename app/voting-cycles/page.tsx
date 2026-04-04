import { createClient } from '@/lib/supabase/server'
import { getEffectiveModules } from '@/lib/modules'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { CalendarClock, Vote } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

// Module 71: Voting Cycles — list of current and upcoming voting issues
export const dynamic = 'force-dynamic'

export default async function VotingCyclesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)

  if (!modules.voting_cycles) notFound()

  const { data: voting } = await supabase
    .from('issue')
    .select('id, title, voting_at, created_at, area:area(name, unit:unit(name))')
    .eq('status', 'voting')
    .order('voting_at', { ascending: true })

  const { data: upcoming } = await supabase
    .from('issue')
    .select('id, title, discussion_at, verification_at, created_at, area:area(name, unit:unit(name))')
    .in('status', ['admission', 'discussion', 'verification'])
    .order('created_at', { ascending: false })

  function daysLeft(dateStr: string | null): string {
    if (!dateStr) return 'Unknown deadline'
    const diff = new Date(dateStr).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days <= 0) return 'Ends today'
    return `${days} day${days !== 1 ? 's' : ''} left`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CalendarClock className="w-7 h-7 text-accent" />
          Voting Cycles
        </h1>
        <p className="text-foreground/60 mt-1">Active votes and topics advancing toward a vote.</p>
      </div>

      {/* Active Votes */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Vote className="w-5 h-5 text-accent" />
          Currently Voting
          <span className="text-sm font-normal text-foreground/40">({voting?.length ?? 0})</span>
        </h2>

        {(voting ?? []).length === 0 ? (
          <div className="card text-center py-8 text-foreground/40 text-sm">No active votes right now.</div>
        ) : (
          <div className="space-y-2">
            {(voting ?? []).map((issue) => (
              <Link key={issue.id} href={`/proposals/${issue.id}`}>
                <div className="card hover:shadow-md hover:border-accent/30 transition-all flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {(issue.area as any)?.unit?.name} · {(issue.area as any)?.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <Badge variant="default">Voting</Badge>
                    <p className="text-xs text-amber-600 font-medium">{daysLeft(issue.voting_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="font-semibold text-lg">Advancing Toward Vote</h2>

        {(upcoming ?? []).length === 0 ? (
          <div className="card text-center py-8 text-foreground/40 text-sm">No topics in progress.</div>
        ) : (
          <div className="space-y-2">
            {(upcoming ?? []).map((issue: any) => (
              <Link key={issue.id} href={`/proposals/${issue.id}`}>
                <div className="card hover:shadow-md hover:border-accent/30 transition-all flex items-center justify-between gap-4 cursor-pointer">
                  <div>
                    <p className="font-medium">{issue.title}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">
                      {issue.area?.unit?.name} · {issue.area?.name}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <Badge variant="default">In Progress</Badge>
                    <p className="text-xs text-foreground/40">Created {formatDate(issue.created_at)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
