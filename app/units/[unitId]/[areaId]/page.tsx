import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProposalCard } from '@/components/proposals/ProposalCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Issue } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface Props {
  params: { unitId: string; areaId: string }
}

export default async function AreaPage({ params }: Props) {
  const supabase = createClient()

  const [{ data: area }, { data: issues }] = await Promise.all([
    supabase.from('area').select('*, unit(*)').eq('id', params.areaId).single(),
    supabase.from('issue').select(`
      *,
      area(*, unit(*)),
      author:member!issue_author_id_fkey(*),
      initiatives:initiative!initiative_issue_id_fkey(*, votes:vote(*))
    `).eq('area_id', params.areaId).order('created_at', { ascending: false }),
  ])

  if (!area) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-foreground/50 mb-1">
            <Link href="/units" className="hover:underline">Areas</Link>
            {' › '}
            {(area as any).unit?.name}
          </p>
          <h1 className="text-3xl font-bold">{area.name}</h1>
          {area.description && <p className="text-foreground/60 mt-1">{area.description}</p>}
        </div>
        <Link href="/proposals/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Propose
        </Link>
      </div>

      {issues && issues.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {issues.map((issue) => (
            <ProposalCard key={issue.id} issue={issue as unknown as Issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-foreground/40">
          <p>No proposals in this area yet.</p>
        </div>
      )}
    </div>
  )
}
