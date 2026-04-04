'use client'

// Module 40: Network Views — personal upward/downward delegation chains
import { ArrowDown, ArrowUp, Users } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'

interface SimpleDelegate {
  id: string
  display_name: string | null
  email: string
}

interface DelegationRow {
  from_member: SimpleDelegate | null
  to_member: SimpleDelegate | null
}

interface Props {
  delegations: DelegationRow[]
  currentUserId: string
}

export function DelegationPathView({ delegations, currentUserId }: Props) {
  // Who I delegate to (upward chain)
  const myOutgoing = delegations.filter((d) => d.from_member?.id === currentUserId)
  // Who delegates to me (downward — direct only)
  const myIncoming = delegations.filter((d) => d.to_member?.id === currentUserId)

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Outgoing: who I trust */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <ArrowUp className="w-4 h-4 text-accent" />
          I delegate to
        </h3>
        {myOutgoing.length === 0 ? (
          <p className="text-xs text-foreground/40">You have no global delegation.</p>
        ) : (
          <div className="space-y-2">
            {myOutgoing.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {getMemberDisplayName(d.to_member)[0]?.toUpperCase()}
                </span>
                <span className="font-medium">{getMemberDisplayName(d.to_member)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Incoming: who trusts me */}
      <div className="card space-y-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-auro-green" />
          Who delegates to me
          {myIncoming.length > 0 && (
            <span className="ml-auto text-xs font-normal text-foreground/50 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {myIncoming.length}
            </span>
          )}
        </h3>
        {myIncoming.length === 0 ? (
          <p className="text-xs text-foreground/40">No one delegates to you globally.</p>
        ) : (
          <div className="space-y-2">
            {myIncoming.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-full bg-auro-green/15 text-auro-green flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                  {getMemberDisplayName(d.from_member)[0]?.toUpperCase()}
                </span>
                <span className="font-medium">{getMemberDisplayName(d.from_member)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
