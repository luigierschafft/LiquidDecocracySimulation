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
  const all = issues ?? []
  const current = all.filter((i: any) => i.created_at >= NEW_TOPIC_CUTOFF)
  const earlier = all.filter((i: any) => i.created_at < NEW_TOPIC_CUTOFF)
  const renderList = (list: any[], muted = false) => (
    <div className="grid gap-3 lg:grid-cols-2">
      {list.map((issue) => (
        <ProposalCard key={issue.id} issue={issue as unknown as Issue} tags={tagMap[issue.id]} muted={muted} />
      ))}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] sm:text-4xl font-extrabold text-gray-900">Topics</h1>
          <p className="text-[17px] text-gray-600 mt-1.5">Choose a topic to discuss, learn about, vote on or work on.</p>
        </div>
        {modules.proposal_creation && (
          <Link href="/proposals/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" aria-hidden="true" />
            New topic
          </Link>
        )}
      </div>

      {all.length > 0 ? (
        <>
          {renderList(current)}
          {earlier.length > 0 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-gray-500 mb-3">Earlier topics</h2>
              {renderList(earlier, true)}
            </section>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-line">
          <p className="text-lg font-semibold text-gray-700">No topics yet.</p>
          <Link href="/proposals/new" className="btn-primary inline-flex mt-4">
            Start the first topic
          </Link>
        </div>
      )}
    </div>
  )
}
