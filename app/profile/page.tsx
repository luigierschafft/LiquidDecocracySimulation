import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { ModuleSettings } from '@/components/profile/ModuleSettings'
import { getUserConfigurableModules, getEffectiveModules } from '@/lib/modules'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: member } = await supabase.from('member').select('*').eq('id', user.id).single()

  const [configurableModules, modules, votesResult] = await Promise.all([
    getUserConfigurableModules(user.id),
    getEffectiveModules(user.id),
    supabase
      .from('vote')
      .select('*, initiative:initiative(title, issue:issue(id, title))')
      .eq('member_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const votes = votesResult.data
  const userProfilesEnabled = modules.user_profiles === true

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
            <p className="font-medium">{member?.display_name ?? 'No display name set'}</p>
            {userProfilesEnabled && member?.location && (
              <p className="text-sm text-foreground/50 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {member.location}
              </p>
            )}
            <div className="flex gap-2 mt-1">
              {member?.is_approved ? (
                <Badge variant="green">Approved</Badge>
              ) : (
                <Badge variant="sand">Pending approval</Badge>
              )}
              {member?.is_admin && <Badge>Admin</Badge>}
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

      {/* User-configurable module settings */}
      {configurableModules.length > 0 && (
        <ModuleSettings modules={configurableModules} userId={user.id} />
      )}

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
    </div>
  )
}
