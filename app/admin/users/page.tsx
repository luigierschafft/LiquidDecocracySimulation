import { createClient } from '@/lib/supabase/server'
import { UserActions } from '@/components/admin/UserActions'

export default async function AdminUsersPage() {
  const supabase = createClient()
  const { data: members } = await supabase
    .from('member')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Members</h1>
        <p className="text-foreground/60 mt-1">Approve new members and manage admin access</p>
      </div>
      <UserActions members={members ?? []} />
    </div>
  )
}
