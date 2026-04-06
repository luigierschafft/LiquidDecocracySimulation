import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { DelegationManager } from '@/components/delegation/DelegationManager'
import Link from 'next/link'
import { Network } from 'lucide-react'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function DelegationPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const modules = await getEffectiveModules(user.id)
  if (!modules.delegation) notFound()

  const [{ data: delegations }, { data: members }, { data: areas }] = await Promise.all([
    supabase.from('delegation').select('*, to_member:member!delegation_to_member_id_fkey(*), area(*), issue(title)').eq('from_member_id', user.id),
    supabase.from('member').select('id, display_name, email').neq('id', user.id).eq('is_approved', true),
    supabase.from('area').select('*').order('name'),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Delegations</h1>
          <p className="text-foreground/60 mt-1">
            Delegate your vote to a trusted community member for specific topics.
            You can always override or revoke.
          </p>
        </div>
        <Link
          href="/delegation/network"
          className="flex items-center gap-1.5 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/5 px-3 py-2 rounded-lg transition-colors flex-shrink-0 mt-1"
        >
          <Network className="w-4 h-4" />
          View Network
        </Link>
      </div>
      <DelegationManager
        userId={user.id}
        delegations={delegations ?? []}
        members={members ?? []}
        areas={areas ?? []}
      />
    </div>
  )
}
