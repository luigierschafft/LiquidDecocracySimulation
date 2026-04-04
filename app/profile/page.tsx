import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ModuleSettings } from '@/components/profile/ModuleSettings'
import { getUserConfigurableModules, getEffectiveModules } from '@/lib/modules'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { VerifiedBadge } from '@/components/profile/VerifiedBadge'
import { MapPin, Shield, Star, Clock, Activity, Bell } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: member } = await supabase.from('member').select('*').eq('id', user.id).single()

  const [configurableModules, modules] = await Promise.all([
    getUserConfigurableModules(user.id),
    getEffectiveModules(user.id),
  ])

  const userProfilesEnabled = modules.user_profiles === true
  const rolesEnabled = modules.roles_permissions === true
  const verificationEnabled = modules.verification === true
  const reputationEnabled = modules.reputation_system === true
  const activityEnabled = modules.activity_tracking === true
  const privacyEnabled = modules.privacy_settings === true
  const delegationLimitsEnabled = modules.delegation_limits === true
  const notificationsEnabled = modules.notifications === true
  const userNotifSettingsEnabled = modules.user_notification_settings === true

  // Show vote history unless privacy says no
  const showVoteHistory = !privacyEnabled || (member?.show_vote_history !== false)

  // Queries that depend on modules
  const votesQuery = showVoteHistory
    ? supabase
        .from('vote')
        .select('*, initiative:initiative(title, issue:issue(id, title))')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
    : Promise.resolve({ data: [] })

  // Activity: unified feed of recent actions from existing tables
  const activityQuery = activityEnabled
    ? Promise.all([
        supabase
          .from('vote')
          .select('id, created_at, value, initiative:initiative(title, issue:issue(id, title))')
          .eq('member_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('opinion')
          .select('id, created_at, content, issue:issue(id, title)')
          .eq('author_id', user.id)
          .is('initiative_id', null)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('initiative')
          .select('id, created_at, title, issue:issue(id, title)')
          .eq('author_id', user.id)
          .eq('is_draft', false)
          .order('created_at', { ascending: false })
          .limit(10),
      ])
    : Promise.resolve(null)

  const [votesResult, activityResult] = await Promise.all([votesQuery, activityQuery])
  const votes = (votesResult as any).data ?? []

  // Build unified activity feed
  let activityFeed: { type: string; label: string; sub: string; date: string; link?: string }[] = []
  if (activityEnabled && activityResult) {
    const [vRes, oRes, iRes] = activityResult as any[]
    for (const v of vRes?.data ?? []) {
      activityFeed.push({
        type: 'vote',
        label: `Voted ${v.value} on "${v.initiative?.issue?.title ?? '?'}"`,
        sub: v.initiative?.title ?? '',
        date: v.created_at,
        link: v.initiative?.issue?.id ? `/proposals/${v.initiative.issue.id}` : undefined,
      })
    }
    for (const o of oRes?.data ?? []) {
      activityFeed.push({
        type: 'opinion',
        label: `Commented on "${(o as any).issue?.title ?? '?'}"`,
        sub: String(o.content).slice(0, 60) + (String(o.content).length > 60 ? '…' : ''),
        date: o.created_at,
        link: (o as any).issue?.id ? `/proposals/${(o as any).issue.id}` : undefined,
      })
    }
    for (const i of iRes?.data ?? []) {
      activityFeed.push({
        type: 'initiative',
        label: `Submitted proposition "${i.title}"`,
        sub: (i as any).issue?.title ?? '',
        date: i.created_at,
        link: (i as any).issue?.id ? `/proposals/${(i as any).issue.id}` : undefined,
      })
    }
    activityFeed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    activityFeed = activityFeed.slice(0, 20)
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

        {/* Bio — shown when user_profiles module is on */}
        {userProfilesEnabled && member?.bio && (
          <p className="text-sm text-foreground/70 leading-relaxed">{member.bio}</p>
        )}

        {/* Interests — shown when user_profiles module is on */}
        {userProfilesEnabled && member?.interests && member.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {member.interests.map((interest: string) => (
              <span
                key={interest}
                className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium"
              >
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

      {/* Delegation limit setting — Module 39 */}
      {delegationLimitsEnabled && (
        <DelegationLimitSection memberId={user.id} currentLimit={member?.max_incoming_delegations ?? null} />
      )}

      {/* Privacy settings — Module 91 */}
      {privacyEnabled && (
        <PrivacySection
          memberId={user.id}
          showVoteHistory={member?.show_vote_history !== false}
          showActivity={member?.show_activity !== false}
        />
      )}

      {/* User notification settings — Module 85 */}
      {userNotifSettingsEnabled && (
        <NotificationPrefsSection
          memberId={user.id}
          prefs={member?.notification_preferences ?? { new_opinion: true, phase_change: true, reply: true, mention: true }}
        />
      )}

      {/* User-configurable module settings */}
      {configurableModules.length > 0 && (
        <ModuleSettings modules={configurableModules} userId={user.id} />
      )}

      {/* Recent Activity — Module 5 */}
      {activityEnabled && (!privacyEnabled || member?.show_activity !== false) && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Recent Activity
          </h2>
          {activityFeed.length === 0 ? (
            <p className="text-sm text-foreground/40">No activity yet.</p>
          ) : (
            <div className="divide-y divide-sand">
              {activityFeed.map((item, i) => (
                <div key={i} className="py-3 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-foreground/30 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {item.link ? (
                      <Link href={item.link} className="text-sm font-medium hover:text-accent transition-colors truncate block">
                        {item.label}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium truncate">{item.label}</p>
                    )}
                    {item.sub && <p className="text-xs text-foreground/40 truncate">{item.sub}</p>}
                    <p className="text-xs text-foreground/30">{formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vote History */}
      {showVoteHistory && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Vote History</h2>
          {votes && votes.length > 0 ? (
            <div className="divide-y divide-sand">
              {votes.map((v: any) => (
                <div key={v.id} className="py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{v.initiative?.issue?.title}</p>
                    <p className="text-xs text-foreground/40">{formatDate(v.created_at)}</p>
                  </div>
                  <Badge variant={v.value === 'approve' ? 'green' : v.value === 'oppose' ? 'default' : 'sand'}>
                    {v.value}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-foreground/40">No votes yet.</p>
          )}
        </div>
      )}

      {/* Notification link — Module 84 */}
      {notificationsEnabled && (
        <div className="card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <span className="font-medium">Notifications</span>
          </div>
          <Link href="/profile/notifications" className="btn-secondary text-sm py-1.5">
            View All
          </Link>
        </div>
      )}
    </div>
  )
}

// --- Inline server components for privacy/delegation/notification prefs ---

function PrivacySection({
  memberId,
  showVoteHistory,
  showActivity,
}: {
  memberId: string
  showVoteHistory: boolean
  showActivity: boolean
}) {
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-lg">Privacy Settings</h2>
      <PrivacyForm memberId={memberId} showVoteHistory={showVoteHistory} showActivity={showActivity} />
    </div>
  )
}

function DelegationLimitSection({ memberId, currentLimit }: { memberId: string; currentLimit: number | null }) {
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-lg">Delegation Limits</h2>
      <DelegationLimitForm memberId={memberId} currentLimit={currentLimit} />
    </div>
  )
}

function NotificationPrefsSection({
  memberId,
  prefs,
}: {
  memberId: string
  prefs: Record<string, boolean>
}) {
  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-lg">Notification Preferences</h2>
      <NotificationPrefsForm memberId={memberId} prefs={prefs} />
    </div>
  )
}

// Client components imported below
import { PrivacyForm } from '@/components/profile/PrivacyForm'
import { DelegationLimitForm } from '@/components/profile/DelegationLimitForm'
import { NotificationPrefsForm } from '@/components/profile/NotificationPrefsForm'
