'use client'

import type { Delegation } from '@/lib/types'
import { getMemberDisplayName } from '@/lib/utils'
import { ArrowRight, Users } from 'lucide-react'

interface Props {
  delegations: Delegation[]
  currentUserId: string | null
}

export function DelegationNetwork({ delegations, currentUserId }: Props) {
  if (delegations.length === 0) {
    return (
      <div className="card text-center py-12 text-foreground/40">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No global delegations yet.</p>
      </div>
    )
  }

  // Build adjacency: group by "to_member" to show who they receive from
  const toMap = new Map<string, { to: Delegation['to_member']; froms: Delegation['from_member'][] }>()

  for (const d of delegations) {
    const toId = d.to_member_id
    if (!toMap.has(toId)) {
      toMap.set(toId, { to: d.to_member, froms: [] })
    }
    toMap.get(toId)!.froms.push(d.from_member)
  }

  function MemberBadge({ member, highlight }: { member: any; highlight: boolean }) {
    const name = getMemberDisplayName(member)
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
        highlight
          ? 'bg-accent/10 border-accent/30 text-accent'
          : 'bg-sand border-sand text-foreground/70'
      }`}>
        <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px] font-bold">
          {name[0]?.toUpperCase()}
        </span>
        {name}
      </span>
    )
  }

  return (
    <div className="space-y-3">
      {Array.from(toMap.entries()).map(([toId, { to, froms }]) => (
        <div key={toId} className="card p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {froms.map((from, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <MemberBadge member={from} highlight={from?.id === currentUserId} />
                  {i < froms.length - 1 && <span className="text-foreground/20 text-xs">,</span>}
                </span>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/30 flex-shrink-0" />
            <MemberBadge member={to} highlight={to?.id === currentUserId} />
          </div>
          <p className="text-xs text-foreground/40">
            {froms.length} member{froms.length !== 1 ? 's' : ''} delegate globally to {getMemberDisplayName(to)}
          </p>
        </div>
      ))}
    </div>
  )
}
