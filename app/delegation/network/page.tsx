import { createClient } from '@/lib/supabase/server'
import { DelegationNetwork } from '@/components/delegation/DelegationNetwork'
import { DelegationGraph } from '@/components/delegation/DelegationGraph'
import { DelegationPathView } from '@/components/delegation/DelegationPathView'
import Link from 'next/link'
import { ArrowLeft, Network } from 'lucide-react'
import { getEffectiveModules } from '@/lib/modules'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DelegationNetworkPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const modules = await getEffectiveModules(user?.id)
  if (!modules.delegation_network) notFound()

  // Fetch ALL delegations (topic, area, and any global)
  const { data: delegations } = await supabase
    .from('delegation')
    .select(`
      id,
      from_member_id,
      to_member_id,
      area_id,
      issue_id,
      from_member:member!delegation_from_member_id_fkey(id, display_name, email, avatar_url),
      to_member:member!delegation_to_member_id_fkey(id, display_name, email, avatar_url),
      area(id, name),
      issue(id, title)
    `)
    .order('created_at', { ascending: true })

  const rows = (delegations ?? []) as unknown as Array<{
    id: string
    from_member_id: string
    to_member_id: string
    area_id: string | null
    issue_id: string | null
    from_member: { id: string; display_name: string | null; email: string; avatar_url?: string | null } | null
    to_member: { id: string; display_name: string | null; email: string; avatar_url?: string | null } | null
    area: { id: string; name: string } | null
    issue: { id: string; title: string } | null
  }>

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
          <p className="text-foreground/60 mt-0.5">All delegations across topics and areas</p>
        </div>
      </div>

      {user && (
        <DelegationPathView
          delegations={rows}
          currentUserId={user.id}
        />
      )}

      <DelegationGraph
        delegations={rows}
        currentUserId={user?.id ?? null}
      />

      <DelegationNetwork
        delegations={rows}
        currentUserId={user?.id ?? null}
      />
    </div>
  )
}
