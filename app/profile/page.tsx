import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { getEffectiveModules } from '@/lib/modules'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { VerifiedBadge } from '@/components/profile/VerifiedBadge'
import { MapPin, Shield, Star } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: member } = await supabase.from('member').select('*').eq('id', user.id).single()

  const modules = await getEffectiveModules(user.id)
  const userProfilesEnabled = modules.user_profiles === true
  const rolesEnabled = modules.roles_permissions === true
  const verificationEnabled = modules.verification === true
  const reputationEnabled = modules.reputation_system === true

  // Fetch all activity data in parallel
  const [
    { data: proposalVotes },
    { data: improvementVotes },
    { data: statements },
    { data: discussionNodes },
    { data: proposals },
    { data: improvements },
  ] = await Promise.all([
    supabase
      .from('vote')
      .select('id, value, created_at, initiative:initiative(id, title, issue:issue(id, title))')
      .eq('member_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('ev_improvement_votes')
      .select('id, vote, created_at')
      .eq('user_id', user.id),
    supabase
      .from('ev_statements')
      .select('id, text, created_at, issue:issue(id, title)')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('ev_discussion_nodes')
      .select('id, type, created_at')
      .eq('author_id', user.id)
      .in('type', ['pro', 'contra']),
    supabase
      .from('initiative')
      .select('id, title, created_at, issue:issue(id, title)')
      .eq('author_id', user.id)
      .eq('is_draft', false)
      .order('created_at', { ascending: false }),
    supabase
      .from('ev_proposed_improvements')
      .select('id, text, created_at, proposal:ev_topic_proposals(id, title, issue:issue(id, title))')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  // Stats
  const totalVotes = (proposalVotes?.length ?? 0) + (improvementVotes?.length ?? 0)
  const statementsCount = statements?.length ?? 0
  const proCount = discussionNodes?.filter((n) => n.type === 'pro').length ?? 0
  const contraCount = discussionNodes?.filter((n) => n.type === 'contra').length ?? 0

  const allVoteValues = [
    ...(proposalVotes ?? []).map((v) => v.value),
    ...(improvementVotes ?? []).map((v) => v.vote),
  ]
  const approveCount = allVoteValues.filter((v) => v === 'approve').length
  const disapproveCount = allVoteValues.filter((v) => v === 'disapprove' || v === 'strong_disapproval' || v === 'oppose').length
  const abstainCount = allVoteValues.filter((v) => v === 'abstain').length
  const improvementsCount = improvements?.length ?? 0

  // Timeline entries
  type TimelineItem = { kind: string; label: string; text: string; date: string; link?: string }
  const timeline: TimelineItem[] = []

  for (const s of statements ?? []) {
    timeline.push({
      kind: 'Statement',
      label: (s as any).issue?.title ?? 'Unknown topic',
      text: s.text,
      date: s.created_at,
      link: (s as any).issue?.id ? `/topics/${(s as any).issue.id}/discussion` : undefined,
    })
  }
  for (const p of proposals ?? []) {
    timeline.push({
      kind: 'Proposal',
      label: (p as any).issue?.title ?? 'Unknown topic',
      text: p.title,
      date: p.created_at,
      link: (p as any).issue?.id ? `/topics/${(p as any).issue.id}/proposals` : undefined,
    })
  }
  for (const imp of improvements ?? []) {
    timeline.push({
      kind: 'Improvement',
      label: (imp as any).proposal?.title ?? 'Unknown proposal',
      text: imp.text,
      date: imp.created_at,
    })
  }
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const kindColor: Record<string, string> = {
    Statement: 'bg-blue-50 text-blue-700',
    Proposal: 'bg-violet-50 text-violet-700',
    Improvement: 'bg-amber-50 text-amber-700',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-foreground/60 mt-1">{user.email}</p>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-xl font-semibold text-accent">
            {getMemberDisplayName(member ?? { email: user.email })[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{member?.display_name ?? 'No display name set'}</p>
              {verificationEnabled && member?.is_verified && <VerifiedBadge />}
            </div>
            {userProfilesEnabled && member?.location && (
              <p className="text-sm text-foreground/50 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {member.location}
              </p>
            )}
            <div className="flex gap-2 mt-1 flex-wrap">
              {member?.is_approved ? (
                <Badge variant="green">Approved</Badge>
              ) : (
                <Badge variant="sand">Pending approval</Badge>
              )}
              {member?.is_admin && <Badge>Admin</Badge>}
              {rolesEnabled && member?.is_moderator && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  <Shield className="w-3 h-3" />
                  Moderator
                </span>
              )}
              {reputationEnabled && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  {member?.reputation_score ?? 0} pts
                </span>
              )}
            </div>
          </div>
        </div>

        {userProfilesEnabled && member?.bio && (
          <p className="text-sm text-foreground/70 leading-relaxed">{member.bio}</p>
        )}

        {userProfilesEnabled && member?.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {member.interests.map((interest: string) => (
              <span key={interest} className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                {interest}
              </span>
            ))}
          </div>
        )}

        <ProfileForm
          memberId={user.id}
          currentName={member?.display_name ?? ''}
          currentBio={member?.bio}
          currentInterests={member?.interests}
          currentLocation={member?.location}
          userProfilesEnabled={userProfilesEnabled}
        />
      </div>

      {/* Activity Stats */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Activity</h2>

        {/* Top stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total votes', value: totalVotes },
            { label: 'Statements written', value: statementsCount },
            { label: 'Pro arguments', value: proCount },
            { label: 'Contra arguments', value: contraCount },
            { label: 'Improvement suggestions', value: improvementsCount },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-sand/40 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{stat.label}</p>
            </div>
          ))}
          <div className="rounded-lg bg-sand/40 px-4 py-3 text-center">
            <p className="text-sm font-bold text-accent leading-snug">
              {approveCount}✓ / {disapproveCount}✗ / {abstainCount}–
            </p>
            <p className="text-xs text-foreground/50 mt-0.5">Approve / Disapprove / Abstain</p>
          </div>
        </div>

        {/* Timeline */}
        {timeline.length === 0 ? (
          <p className="text-sm text-foreground/40">No contributions yet.</p>
        ) : (
          <div className="divide-y divide-sand">
            {timeline.map((item, i) => (
              <div key={i} className="py-3 flex items-start gap-3">
                <span className={`mt-0.5 flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${kindColor[item.kind] ?? 'bg-gray-100 text-gray-600'}`}>
                  {item.kind}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground/40 truncate">{item.label}</p>
                  {item.link ? (
                    <Link href={item.link} className="text-sm font-medium hover:text-accent transition-colors line-clamp-2 block">
                      {item.text}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium line-clamp-2">{item.text}</p>
                  )}
                  <p className="text-xs text-foreground/30 mt-0.5">{formatDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
