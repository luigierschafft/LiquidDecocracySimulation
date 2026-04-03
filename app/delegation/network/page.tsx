import { createClient } from '@/lib/supabase/server'
import { DelegationNetwork } from '@/components/delegation/DelegationNetwork'
import Link from 'next/link'
import { ArrowLeft, Network } from 'lucide-react'
import type { Delegation } from '@/lib/types'
import { getEffectiveModules } from '@/lib/modules'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DelegationNetworkPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const modules = await getEffectiveModules(user?.id)
  if (!modules.delegation_network) notFound()

  // Fetch only global delegations (no unit/area/issue scope)
  const { data: delegations } = await supabase
    .from('delegation')
    .select('*, from_member:member!delegation_from_member_id_fkey(id, display_name, email), to_member:member!delegation_to_member_id_fkey(id, display_name, email)')
    .is('unit_id', null)
    .is('area_id', null)
    .is('issue_id', null)
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/delegation" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Network className="w-7 h-7 text-accent" />
            Delegation Network
          </h1>
          <p className="text-foreground/60 mt-0.5">Global delegations across the community</p>
        </div>
      </div>

      <DelegationNetwork
        delegations={(delegations ?? []) as unknown as Delegation[]}
        currentUserId={user?.id ?? null}
      />
    </div>
  )
}
