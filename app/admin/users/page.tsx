import { createClient } from '@/lib/supabase/server'
import { UserActions } from '@/components/admin/UserActions'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [membersResult, modules] = await Promise.all([
    supabase.from('member').select('*').order('created_at', { ascending: false }),
    getEffectiveModules(user?.id),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-foreground/60 mt-1">Approve new members and manage admin access</p>
      </div>
      {/* Module 93: Anti-Bot notice */}
      {modules.anti_bot && (
        <div className="rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-foreground/70">
          <span className="font-semibold text-accent">Anti-Bot:</span> Manual member approval is active. Review each new member below before granting access.
        </div>
      )}
      <UserActions
        members={membersResult.data ?? []}
        moderatorEnabled={modules.roles_permissions}
        verificationEnabled={modules.verification}
      />
    </div>
  )
}
