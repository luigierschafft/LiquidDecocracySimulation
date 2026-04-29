import { createClient } from '@/lib/supabase/server'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import Link from 'next/link'
import type { Issue, IssueStatus } from '@/lib/types'
import { Plus } from 'lucide-react'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

const STATUS_FILTERS: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'admission', label: 'Discussion' },
  { value: 'discussion', label: 'Proposition' },
  { value: 'voting', label: 'Voting' },
  { value: 'closed', label: 'Closed' },
]

interface Props {
  searchParams: { status?: string }
}

export default async function TopicsPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)
  const rawStatus = searchParams.status
  const validStatuses: string[] = ['admission', 'discussion', 'verification', 'voting', 'closed']
  const filterByStatus = rawStatus && validStatuses.includes(rawStatus)

  let query = supabase
    .from('issue')
    .select(`
      *,
      area(*, unit(*)),
      author:member!issue_author_id_fkey(*),
      initiatives:initiative!initiative_issue_id_fkey(
        *,
        author:member!initiative_author_id_fkey(*),
        votes:vote(*)
      )
    `)
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  if (filterByStatus) {
    query = query.eq('status', rawStatus)
  }

  const status = rawStatus && validStatuses.includes(rawStatus) ? rawStatus : 'all'

  const { data: issues } = await query

  // Tags per issue — Module 62
  type TagMap = Record<string, { id: string; name: string; color: string }[]>
  const tagMap: TagMap = {}
  if (modules.tagging_system && issues && issues.length > 0) {
    const issueIds = issues.map((i: any) => i.id)
    const { data: tagRows } = await supabase
      .from('issue_tag')
      .select('issue_id, tag:tag(id, name, color)')
      .in('issue_id', issueIds)
    for (const row of tagRows ?? []) {
      const r = row as any
      if (!tagMap[r.issue_id]) tagMap[r.issue_id] = []
      if (r.tag) tagMap[r.issue_id].push(r.tag)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Topics</h1>
          <p className="text-foreground/60 mt-1">Select a topic you want to discuss, learn, vote or work on</p>
        </div>
        {modules.proposal_creation && (
          <Link href="/proposals/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Topic
          </Link>
        )}
      </div>

      {/* Grid */}
      {issues && issues.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <ProposalCard key={issue.id} issue={issue as unknown as Issue} tags={tagMap[(issue as any).id]} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/40">
          <p className="text-lg">No topics yet.</p>
          <Link href="/proposals/new" className="text-accent hover:underline text-sm mt-2 inline-block">
            Be the first to create one
          </Link>
        </div>
      )}
    </div>
  )
}
