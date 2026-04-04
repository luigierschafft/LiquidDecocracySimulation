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
import { PropositionCard } from '@/components/proposals/PropositionCard'
import { countVotes } from '@/lib/voting/approval'
import { formatDate, statusLabel, getStatusVariant, getMemberDisplayName } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import type { Issue, Initiative, Opinion, VoteValue, RankedVote } from '@/lib/types'
import { Calendar, User, FileText, Clock, CheckCircle2, FileEdit } from 'lucide-react'
import Link from 'next/link'
import { OpinionSection } from '@/components/proposals/OpinionSection'
import { ScaleVoteBar } from '@/components/proposals/ScaleVoteBar'
import { AlignmentMeter } from '@/components/proposals/AlignmentMeter'
import { TagList } from '@/components/proposals/TagList'
import { TopicDiscussion } from '@/components/discussion/TopicDiscussion'
import { PhaseProgress } from '@/components/proposals/PhaseProgress'
import { getAppSetting } from '@/lib/data/settings'
import { getEffectiveModules } from '@/lib/modules'

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
      initiatives:initiative!initiative_issue_id_fkey(
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

  const modules = await getEffectiveModules(user?.id)

  // Tags — Module 62
  let issueTags: { id: string; name: string; color: string }[] = []
  if (modules.tagging_system) {
    const { data: tagRows } = await supabase
      .from('issue_tag')
      .select('tag:tag(*)')
      .eq('issue_id', params.id)
    issueTags = (tagRows ?? []).map((r: any) => r.tag).filter(Boolean)
  }

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

  // Scale votes — Module 32
  type ScaleVoteMap = Record<string, { userScore: number | null; average: number | null; count: number }>
  let scaleVoteMap: ScaleVoteMap = {}
  if (modules.scale_voting && initiatives.length > 0) {
    const initiativeIds = initiatives.map((i: Initiative) => i.id)
    const { data: scaleRows } = await supabase
      .from('scale_vote')
      .select('initiative_id, member_id, score')
      .in('initiative_id', initiativeIds)
    const rows = scaleRows ?? []
    for (const init of initiatives) {
      const iRows = rows.filter((r: any) => r.initiative_id === init.id)
      const scores = iRows.map((r: any) => r.score as number)
      const avg = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : null
      const userScore = user ? (iRows.find((r: any) => r.member_id === user.id)?.score ?? null) : null
      scaleVoteMap[init.id] = { userScore, average: avg, count: scores.length }
    }
  }

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

      {/* Tags — Module 62 */}
      {modules.tagging_system && (
        <TagList
          issueId={typedIssue.id}
          initialTags={issueTags}
          canEdit={isAdmin || typedIssue.author_id === user?.id}
        />
      )}

      {/* Phase progress — Module 68 */}
      {modules.phase_system && (
        <div className="card py-4 px-5">
          <PhaseProgress
            currentStatus={typedIssue.status}
            hasElaboration={!!acceptedId}
          />
        </div>
      )}

      {/* Accepted proposal banner */}
      {acceptedInitiative && (
        <div className="rounded-xl border border-auro-green/40 bg-green-50/50 px-5 py-4 space-y-2">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-auro-green font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Accepted Proposition
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

      {/* Topic-level discussion — Module 8/11/13/15 */}
      {modules.comments_replies && (
        <TopicDiscussion
          issueId={typedIssue.id}
          opinions={(topicOpinionsResult.data ?? []) as unknown as Opinion[]}
          userId={user?.id ?? null}
          postVotingEnabled={modules.post_voting}
          intentEnabled={modules.intention_display}
          questionsTaggingEnabled={modules.questions_tagging}
          referencingEnabled={modules.referencing}
          reportingEnabled={modules.reporting_system}
          verificationEnabled={modules.verification}
          anonymityEnabled={modules.anonymity}
        />
      )}

      {/* Schulze ranked voting — Module 27 */}
      {modules.ranking_voting && isSchulze && typedIssue.status === 'voting' && user && initiatives.length > 0 && (
        <RankedVoteForm
          issueId={typedIssue.id}
          initiatives={initiatives}
          userId={user.id}
          existingVotes={userRankedVotes}
        />
      )}
      {modules.ranking_voting && isSchulze && typedIssue.status === 'voting' && !user && (
        <div className="card text-center py-6 text-foreground/40 text-sm">
          Sign in to rank the propositions (Schulze voting).
        </div>
      )}

      {/* Propositions section — Module 16 */}
      {modules.thread_system && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Propositions
              <span className="text-sm font-normal text-foreground/40">({initiatives.length})</span>
            </h2>
            {modules.proposal_creation && canSubmitProposal && typedIssue.status !== 'closed' && (
              <AddProposalForm issueId={typedIssue.id} userId={user!.id} draftEnabled={modules.proposal_status} />
            )}
          </div>

          {initiatives.length === 0 && (
            <div className="card text-center py-10 text-foreground/40">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No propositions yet.</p>
              {modules.proposal_creation && canSubmitProposal && (
                <p className="text-xs mt-1">Be the first to submit a proposition above.</p>
              )}
            </div>
          )}

          {initiatives
            .filter((initiative: Initiative) => {
              if (!modules.proposal_status) return true
              if (!initiative.is_draft) return true
              return initiative.author_id === user?.id
            })
            .map((initiative: Initiative) => {
            const votes = countVotes(initiative.votes ?? [])
            const userVote = initiative.votes?.find((v) => v.member_id === user?.id)?.value as VoteValue | undefined
            const isAccepted = acceptedId === initiative.id

            return (
              <PropositionCard
                key={initiative.id}
                initiative={initiative}
                isAccepted={isAccepted}
                isAdmin={isAdmin}
                userId={user?.id ?? null}
                editingEnabled={modules.proposal_editing}
                draftEnabled={modules.proposal_status}
                forkingEnabled={modules.forking}
                versioningEnabled={modules.versioning}
              >
                {/* Admin accept button */}
                {isAdmin && typedIssue.status === 'voting' && (
                  <div className="flex justify-end -mt-4">
                    <AcceptButton
                      issueId={typedIssue.id}
                      initiativeId={initiative.id}
                      isAlreadyAccepted={isAccepted}
                    />
                  </div>
                )}

                {/* Arguments — Module 10 */}
                {modules.pro_contra_arguments && (
                  <ArgumentSection
                    initiativeId={initiative.id}
                    arguments={(initiative as any).arguments ?? []}
                    userId={user?.id ?? null}
                  />
                )}

                {/* Voting — Modules 25/26/28/30/31 */}
                {!isSchulze && (modules.results_display || modules.basic_voting) && (() => {
                  const showVotingUi = typedIssue.status === 'voting' ||
                    (modules.continuous_voting && typedIssue.status === 'discussion')
                  const isIndicative = showVotingUi && typedIssue.status !== 'voting'
                  return (
                    <div className="border-t border-sand pt-5 space-y-4">
                      {modules.results_display && (
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <VoteBar
                              votes={votes}
                              quorum={quorum}
                              showLowResistance={typedIssue.status === 'voting'}
                            />
                          </div>
                          {modules.alignment_meter && <AlignmentMeter votes={votes} />}
                        </div>
                      )}

                      {modules.basic_voting && showVotingUi && (
                        <div className="space-y-3">
                          {user ? (
                            <>
                              <p className="text-sm font-medium text-foreground/70">
                                {isIndicative ? 'Indicative vote (discussion phase)' : 'Cast your vote:'}
                              </p>
                              <VoteButton
                                initiativeId={initiative.id}
                                currentVote={userVote ?? null}
                              />
                              {modules.delegation && !isIndicative && (
                                <DelegationStatus
                                  delegation={effectiveDelegation}
                                  hasDirectVote={!!userVote}
                                />
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-foreground/40">Sign in to vote</p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Scale voting — Module 32 */}
                {modules.scale_voting && (
                  <div className="border-t border-sand pt-5">
                    <p className="text-sm font-medium text-foreground/70 mb-3">Rate this proposition (1-10):</p>
                    <ScaleVoteBar
                      initiativeId={initiative.id}
                      userId={user?.id ?? null}
                      initialData={scaleVoteMap[initiative.id] ?? { userScore: null, average: null, count: 0 }}
                    />
                  </div>
                )}

                {/* Proposition comments — Module 19 */}
                {modules.proposal_feedback && (
                  <OpinionSection
                    initiativeId={initiative.id}
                    opinions={initiative.opinions ?? []}
                    userId={user?.id ?? null}
                    postVotingEnabled={modules.post_voting}
                    reportingEnabled={modules.reporting_system}
                  />
                )}
              </PropositionCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
