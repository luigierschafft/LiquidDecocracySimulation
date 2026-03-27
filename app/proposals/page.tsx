import { createClient } from '@/lib/supabase/server'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import Link from 'next/link'
import type { Issue, IssueStatus } from '@/lib/types'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_FILTERS: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'admission', label: 'Admission' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'verification', label: 'Verification' },
  { value: 'voting', label: 'Voting' },
  { value: 'closed', label: 'Closed' },
]

interface Props {
  searchParams: { status?: string }
}

export default async function ProposalsPage({ searchParams }: Props) {
  const supabase = createClient()
  const rawStatus = searchParams.status
  const validStatuses: string[] = ['admission', 'discussion', 'verification', 'voting', 'closed']
  const filterByStatus = rawStatus && validStatuses.includes(rawStatus)

  let query = supabase
    .from('issue')
    .select(`
      *,
      area(*, unit(*)),
      author:member!issue_author_id_fkey(*),
      initiatives:initiative(
        *,
        author:member!initiative_author_id_fkey(*),
        votes:vote(*)
      )
    `)
    .order('created_at', { ascending: false })

  if (filterByStatus) {
    query = query.eq('status', rawStatus)
  }

  const status = rawStatus && validStatuses.includes(rawStatus) ? rawStatus : 'all'

  const { data: issues } = await query

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-foreground/60 mt-1">Community decisions in progress</p>
        </div>
        <Link href="/proposals/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Proposal
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === 'all' ? '/proposals' : `/proposals?status=${f.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              status === f.value || (f.value === 'all' && status === 'all')
                ? 'bg-accent text-white'
                : 'bg-sand text-foreground/70 hover:bg-sand/70'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {issues && issues.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <ProposalCard key={issue.id} issue={issue as unknown as Issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/40">
          <p className="text-lg">No proposals yet.</p>
          <Link href="/proposals/new" className="text-accent hover:underline text-sm mt-2 inline-block">
            Be the first to submit one
          </Link>
        </div>
      )}
    </div>
  )
}
