import { createClient } from '@/lib/supabase/server'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import { PlayHome } from '@/components/play/PlayHome'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getEffectiveModules } from '@/lib/modules'
import type { Issue } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function PlayPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)

  const { data: issues } = await supabase
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Mongoose header */}
      <PlayHome />

      {/* New Topic button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Topics</h2>
        {modules.proposal_creation && (
          <Link href="/proposals/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Topic
          </Link>
        )}
      </div>

      {/* Topic grid */}
      {issues && issues.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <ProposalCard key={issue.id} issue={issue as unknown as Issue} />
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
