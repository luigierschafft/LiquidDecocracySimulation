import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { VoteBar } from '@/components/proposals/VoteBar'
import { VoteButton } from '@/components/proposals/VoteButton'
import { countVotes } from '@/lib/voting/approval'
import { formatDate, statusLabel } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import type { Issue, Initiative, VoteValue } from '@/lib/types'
import { Calendar, User } from 'lucide-react'
import { OpinionSection } from '@/components/proposals/OpinionSection'

const statusVariants: Record<string, 'default' | 'sand' | 'green' | 'blue' | 'purple'> = {
  admission: 'sand',
  discussion: 'blue',
  verification: 'purple',
  voting: 'green',
  closed: 'sand',
}

interface Props {
  params: { id: string }
}

export default async function ProposalDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select(`
      *,
      area(*, unit(*)),
      author:member!issue_author_id_fkey(*),
      initiatives:initiative(
        *,
        author:member!initiative_author_id_fkey(*),
        votes:vote(*),
        opinions:opinion(*, author:member!opinion_author_id_fkey(*))
      )
    `)
    .eq('id', params.id)
    .single()

  if (!issue) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const typedIssue = issue as unknown as Issue

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold leading-tight">{typedIssue.title}</h1>
          <Badge variant={statusVariants[typedIssue.status] ?? 'sand'} className="flex-shrink-0 mt-1">
            {statusLabel(typedIssue.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-foreground/50">
          {typedIssue.area && (
            <span>{typedIssue.area.unit?.name} · {typedIssue.area.name}</span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(typedIssue.created_at)}
          </span>
          {typedIssue.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {typedIssue.author.display_name ?? typedIssue.author.email}
            </span>
          )}
        </div>
      </div>

      {/* Initiatives */}
      {typedIssue.initiatives?.map((initiative: Initiative) => {
        const votes = countVotes(initiative.votes ?? [])
        const userVote = initiative.votes?.find((v) => v.member_id === user?.id)?.value as VoteValue | undefined

        return (
          <div key={initiative.id} className="card space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{initiative.title}</h2>
              <p className="text-xs text-foreground/40">
                by {initiative.author?.display_name ?? initiative.author?.email} · {formatDate(initiative.created_at)}
              </p>
            </div>

            <div className="prose prose-sm max-w-none text-foreground/80">
              <ReactMarkdown>{initiative.content}</ReactMarkdown>
            </div>

            {/* Voting */}
            <div className="border-t border-sand pt-5 space-y-4">
              <VoteBar votes={votes} />
              {typedIssue.status === 'voting' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/70">Cast your vote:</p>
                  <VoteButton
                    initiativeId={initiative.id}
                    currentVote={userVote ?? null}
                  />
                  {!user && (
                    <p className="text-xs text-foreground/40">Sign in to vote</p>
                  )}
                </div>
              )}
            </div>

            {/* Opinions */}
            <OpinionSection
              initiativeId={initiative.id}
              opinions={initiative.opinions ?? []}
              userId={user?.id ?? null}
            />
          </div>
        )
      })}
    </div>
  )
}
