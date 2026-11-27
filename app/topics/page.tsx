import { createClient } from '@/lib/supabase/server'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import Link from 'next/link'
import type { Issue } from '@/lib/types'
import { Plus } from 'lucide-react'
import { getEffectiveModules } from '@/lib/modules'
import { getCurrentPlatformId } from '@/lib/platform'
import { NEW_TOPIC_CUTOFF } from '@/lib/config/topics'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { status?: string }
}

export default async function TopicsPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [modules, platformId] = await Promise.all([
    getEffectiveModules(user?.id),
    getCurrentPlatformId(),
  ])
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

  if (platformId) {
    query = query.eq('platform_id', platformId)
  }

  if (filterByStatus) {
    query = query.eq('status', rawStatus)
  }

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

  const all = (issues ?? []) as any[]
  const current = all.filter((i) => i.created_at >= NEW_TOPIC_CUTOFF)
  const earlier = all.filter((i) => i.created_at < NEW_TOPIC_CUTOFF)
  const renderGrid = (list: any[]) => (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {list.map((issue) => (
        <ProposalCard key={issue.id} issue={issue as unknown as Issue} tags={tagMap[issue.id]} />
      ))}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Topics</h1>
          <p className="text-lg text-foreground/70 mt-1">Select a topic you want to discuss, learn, vote or work on</p>
        </div>
        {modules.proposal_creation && (
          <Link href="/proposals/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Topic
          </Link>
        )}
      </div>

      {/* Current topics first, earlier demo topics below */}
      {issues && issues.length > 0 ? (
        <div className="space-y-10">
          {current.length > 0 && renderGrid(current)}
          {earlier.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/50 mb-3">
                Earlier demo topics
              </h2>
              <div className="opacity-70">{renderGrid(earlier)}</div>
            </section>
          )}
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
