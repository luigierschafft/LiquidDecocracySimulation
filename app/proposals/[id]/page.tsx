import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { VoteBar } from '@/components/proposals/VoteBar'
import { VoteButton } from '@/components/proposals/VoteButton'
import { AddProposalForm } from '@/components/proposals/AddProposalForm'
import { DelegationStatus } from '@/components/proposals/DelegationStatus'
import { AcceptButton } from '@/components/proposals/AcceptButton'
import { ArgumentSection } from '@/components/proposals/ArgumentSection'
import { RankedVoteForm } from '@/components/proposals/RankedVoteForm'
import { countVotes } from '@/lib/voting/approval'
import { formatDate, statusLabel, getStatusVariant, getMemberDisplayName } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import type { Issue, Initiative, Opinion, VoteValue, RankedVote } from '@/lib/types'
import { Calendar, User, FileText, Trophy, Clock, CheckCircle2, FileEdit } from 'lucide-react'
import Link from 'next/link'
import { OpinionSection } from '@/components/proposals/OpinionSection'
import { TopicDiscussion } from '@/components/discussion/TopicDiscussion'
import { getAppSetting } from '@/lib/data/settings'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

type DelegationScope = 'issue' | 'area' | 'unit' | 'global'

function findEffectiveDelegation(
  delegations: any[],
  issueId: string,
  areaId: string | null,
  unitId: string | null
): { to_member: any; scope: DelegationScope; scopeLabel: string } | null {
  const check = (pred: (d: any) => boolean, scope: DelegationScope, scopeLabel: string) => {
    const d = delegations.find(pred)
    if (d) return { to_member: d.to_member, scope, scopeLabel }
    return null
  }
  return (
    check((d) => d.issue_id === issueId, 'issue', 'this topic') ??
    (areaId ? check((d) => d.area_id === areaId, 'area', 'this area') : null) ??
    (unitId ? check((d) => d.unit_id === unitId, 'unit', 'this unit') : null) ??
    check((d) => !d.issue_id && !d.area_id && !d.unit_id, 'global', 'all topics') ??
    null
  )
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default async function ProposalDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select(`
      *,
      area(*, unit(*)),
      policy(*),
      author:member!issue_author_id_fkey(*),
      initiatives:initiative(
        *,
        author:member!initiative_author_id_fkey(*),
        votes:vote(*),
        opinions:opinion(*, author:member!opinion_author_id_fkey(*)),
        arguments:argument(*, author:member!argument_author_id_fkey(*))
      )
    `)
    .eq('id', params.id)
    .single()

  if (!issue) notFound()

  const typedIssue = issue as unknown as Issue
  const areaId = typedIssue.area_id
  const unitId = typedIssue.area?.unit?.id ?? null
  const policy = typedIssue.policy
  const isSchulze = policy?.voting_method === 'schulze'

  const [topicOpinionsResult, { data: { user } }, proposalCreation] = await Promise.all([
    supabase
      .from('opinion')
      .select('*, author:member!opinion_author_id_fkey(*)')
      .eq('issue_id', params.id)
      .is('initiative_id', null)
      .order('created_at', { ascending: true }),
    supabase.auth.getUser(),
    getAppSetting('proposal_creation'),
  ])

  // User data: delegations + admin status + ranked votes
  let userDelegations: any[] = []
  let isAdmin = false
  let userRankedVotes: RankedVote[] = []
  if (user) {
    const [delegResult, memberResult, rankedResult] = await Promise.all([
      supabase
        .from('delegation')
        .select('*, to_member:member!delegation_to_member_id_fkey(id, display_name, email)')
        .eq('from_member_id', user.id),
      supabase.from('member').select('is_admin').eq('id', user.id).single(),
      isSchulze
        ? supabase
            .from('ranked_vote')
            .select('*')
            .eq('issue_id', params.id)
            .eq('member_id', user.id)
        : Promise.resolve({ data: [] }),
    ])
    userDelegations = delegResult.data ?? []
    isAdmin = memberResult.data?.is_admin ?? false
    userRankedVotes = (rankedResult.data ?? []) as RankedVote[]
  }

  const effectiveDelegation = user
    ? findEffectiveDelegation(userDelegations, typedIssue.id, areaId, unitId)
    : null

  const canSubmitProposal = user
    ? (proposalCreation ?? 'all_members') === 'all_members' || isAdmin
    : false

  const initiatives = typedIssue.initiatives ?? []
  const quorum = (typedIssue as any).policy?.quorum as number | undefined

  const acceptedId = typedIssue.accepted_initiative_id

  const votingDeadlineDays = typedIssue.status === 'voting' ? daysUntil(typedIssue.voting_at) : null

  const acceptedInitiative = acceptedId
    ? initiatives.find((i: Initiative) => i.id === acceptedId) ?? null
    : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold leading-tight">{typedIssue.title}</h1>
          <Badge variant={getStatusVariant(typedIssue.status)} className="flex-shrink-0 mt-1">
            {statusLabel(typedIssue.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-foreground/50 flex-wrap">
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
              {getMemberDisplayName(typedIssue.author)}
            </span>
          )}
          {votingDeadlineDays !== null && (
            <span className={`flex items-center gap-1 font-medium ${votingDeadlineDays <= 1 ? 'text-red-500' : 'text-amber-600'}`}>
              <Clock className="w-3.5 h-3.5" />
              {votingDeadlineDays <= 0
                ? 'Voting ends today'
                : `${votingDeadlineDays} day${votingDeadlineDays !== 1 ? 's' : ''} left to vote`}
            </span>
          )}
        </div>
      </div>

      {/* Accepted proposal banner */}
      {acceptedInitiative && (
        <div className="rounded-xl border border-auro-green/40 bg-green-50/50 px-5 py-4 space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-auro-green font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Accepted Proposal
              </div>
              <p className="font-medium">{acceptedInitiative.title}</p>
              <p className="text-xs text-foreground/50">
                by {getMemberDisplayName(acceptedInitiative.author)} · Accepted on {formatDate(typedIssue.closed_at)}
              </p>
            </div>
            <Link
              href={`/proposals/${typedIssue.id}/elaboration`}
              className="flex items-center gap-1.5 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              <FileEdit className="w-4 h-4" />
              View Elaboration
            </Link>
          </div>
        </div>
      )}

      {/* Topic-level discussion */}
      <TopicDiscussion
        issueId={typedIssue.id}
        opinions={(topicOpinionsResult.data ?? []) as unknown as Opinion[]}
        userId={user?.id ?? null}
      />

      {/* Schulze ranked voting (shown above individual proposals) */}
      {isSchulze && typedIssue.status === 'voting' && user && initiatives.length > 0 && (
        <RankedVoteForm
          issueId={typedIssue.id}
          initiatives={initiatives}
          userId={user.id}
          existingVotes={userRankedVotes}
        />
      )}
      {isSchulze && typedIssue.status === 'voting' && !user && (
        <div className="card text-center py-6 text-foreground/40 text-sm">
          Sign in to rank the proposals (Schulze voting).
        </div>
      )}

      {/* Proposals section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Proposals
            <span className="text-sm font-normal text-foreground/40">({initiatives.length})</span>
          </h2>
          {canSubmitProposal && typedIssue.status !== 'closed' && (
            <AddProposalForm issueId={typedIssue.id} userId={user!.id} />
          )}
        </div>

        {initiatives.length === 0 && (
          <div className="card text-center py-10 text-foreground/40">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No proposals yet.</p>
            {canSubmitProposal && (
              <p className="text-xs mt-1">Be the first to submit a proposal above.</p>
            )}
          </div>
        )}

        {initiatives.map((initiative: Initiative) => {
          const votes = countVotes(initiative.votes ?? [])
          const userVote = initiative.votes?.find((v) => v.member_id === user?.id)?.value as VoteValue | undefined
          const isAccepted = acceptedId === initiative.id

          return (
            <div
              key={initiative.id}
              id={`initiative-${initiative.id}`}
              className={`card space-y-6 ${isAccepted ? 'border-auro-green/40 bg-green-50/20' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{initiative.title}</h3>
                  <p className="text-xs text-foreground/40">
                    by {getMemberDisplayName(initiative.author)} · {formatDate(initiative.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAccepted && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-auro-green bg-green-100 px-2.5 py-1 rounded-full">
                      <Trophy className="w-3.5 h-3.5" />
                      Accepted
                    </div>
                  )}
                  {isAdmin && typedIssue.status === 'voting' && (
                    <AcceptButton
                      issueId={typedIssue.id}
                      initiativeId={initiative.id}
                      isAlreadyAccepted={isAccepted}
                    />
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-foreground/80">
                <ReactMarkdown>{initiative.content}</ReactMarkdown>
              </div>

              {/* Arguments (Pro/Contra) */}
              <ArgumentSection
                initiativeId={initiative.id}
                arguments={(initiative as any).arguments ?? []}
                userId={user?.id ?? null}
              />

              {/* Voting — only approval voting per-proposal; Schulze is shown at topic level */}
              {!isSchulze && (
                <div className="border-t border-sand pt-5 space-y-4">
                  <VoteBar
                    votes={votes}
                    quorum={quorum}
                    showLowResistance={typedIssue.status === 'voting'}
                  />

                  {typedIssue.status === 'voting' && (
                    <div className="space-y-3">
                      {user ? (
                        <>
                          <p className="text-sm font-medium text-foreground/70">Cast your vote:</p>
                          <VoteButton
                            initiativeId={initiative.id}
                            currentVote={userVote ?? null}
                          />
                          <DelegationStatus
                            delegation={effectiveDelegation}
                            hasDirectVote={!!userVote}
                          />
                        </>
                      ) : (
                        <p className="text-xs text-foreground/40">Sign in to vote</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Proposal-specific comments */}
              <OpinionSection
                initiativeId={initiative.id}
                opinions={initiative.opinions ?? []}
                userId={user?.id ?? null}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
