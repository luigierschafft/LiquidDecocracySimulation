import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DelegationManager } from '@/components/delegation/DelegationManager'

export default async function DelegationPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: delegations }, { data: members }, { data: units }] = await Promise.all([
    supabase.from('delegation').select('*, to_member:member!delegation_to_member_id_fkey(*), unit(*), area(*), issue(title)').eq('from_member_id', user.id),
    supabase.from('member').select('id, display_name, email').neq('id', user.id).eq('is_approved', true),
    supabase.from('unit').select('*, areas:area(*)').order('name'),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Delegations</h1>
        <p className="text-foreground/60 mt-1">
          Delegate your vote to a trusted community member for specific topics.
          You can always override or revoke.
        </p>
      </div>
      <DelegationManager
        userId={user.id}
        delegations={delegations ?? []}
        members={members ?? []}
        units={units ?? []}
      />
    </div>
  )
}
