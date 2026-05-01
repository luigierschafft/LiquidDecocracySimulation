'use client'

import { ArrowDown, ArrowRight, ArrowUp, Users } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'

interface Member {
  id: string
  display_name: string | null
  email: string
  avatar_url?: string | null
}

interface DelegationRow {
  from_member_id: string
  to_member_id: string
  from_member: Member | null
  to_member: Member | null
  area: { id: string; name: string } | null
  issue: { id: string; title: string } | null
}

interface Props {
  delegations: DelegationRow[]
  currentUserId: string
}

// A single step in a chain: the person + which delegation scope got them here
type ChainStep = { member: Member; scope: string }

function Initial({ member }: { member: Member | null }) {
  const name = getMemberDisplayName(member)
  return (
    <div className="w-7 h-7 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[11px] font-bold flex-shrink-0">
      {name[0]?.toUpperCase()}
    </div>
  )
}

function scopeLabel(d: DelegationRow): string {
  if (d.issue) return `Topic: ${d.issue.title}`
  if (d.area) return `Area: ${d.area.name}`
  return 'Global'
}

function ScopeBadge({ label }: { label: string }) {
  const isArea = label.startsWith('Area')
  const isTopic = label.startsWith('Topic')
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
      isTopic ? 'bg-purple-100 text-purple-700' :
      isArea  ? 'bg-blue-100 text-blue-700' :
                'bg-sand text-foreground/50'
    }`}>
      {label}
    </span>
  )
}

// Build transitive chains, carrying scope info per link
function buildChain(
  startId: string,
  delegations: DelegationRow[],
  visited = new Set<string>()
): ChainStep[][] {
  if (visited.has(startId)) return []
  const next = new Set(visited)
  next.add(startId)

  const outgoing = delegations.filter((d) => d.from_member_id === startId)
  if (outgoing.length === 0) return []

  const chains: ChainStep[][] = []
  for (const d of outgoing) {
    if (!d.to_member) continue
    const step: ChainStep = { member: d.to_member, scope: scopeLabel(d) }
    const sub = buildChain(d.to_member_id, delegations, next)
    if (sub.length === 0) {
      chains.push([step])
    } else {
      for (const s of sub) {
        chains.push([step, ...s])
      }
    }
  }
  return chains
}

export function DelegationPathView({ delegations, currentUserId }: Props) {
  const myOutgoing = delegations.filter((d) => d.from_member_id === currentUserId)
  const myIncoming = delegations.filter((d) => d.to_member_id === currentUserId)
  const chains = buildChain(currentUserId, delegations)

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Outgoing */}
        <div className="card space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <ArrowUp className="w-4 h-4 text-accent" />
            I delegate to
          </h3>
          {myOutgoing.length === 0 ? (
            <p className="text-xs text-foreground/40">You have no delegations.</p>
          ) : (
            <div className="space-y-2.5">
              {myOutgoing.map((d, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Initial member={d.to_member} />
                  <div>
                    <p className="text-sm font-medium">{getMemberDisplayName(d.to_member)}</p>
                    <ScopeBadge label={scopeLabel(d)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming */}
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
            <p className="text-xs text-foreground/40">No one delegates to you.</p>
          ) : (
            <div className="space-y-2.5">
              {myIncoming.map((d, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Initial member={d.from_member} />
                  <div>
                    <p className="text-sm font-medium">{getMemberDisplayName(d.from_member)}</p>
                    <ScopeBadge label={scopeLabel(d)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Delegation Chain — grouped by first-hop scope */}
      {chains.length > 0 && (() => {
        // Group chains by the scope of the first delegation (from "You")
        const groups = new Map<string, ChainStep[][]>()
        for (const chain of chains) {
          const key = chain[0]?.scope ?? 'Global'
          if (!groups.has(key)) groups.set(key, [])
          groups.get(key)!.push(chain)
        }
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-accent" />
              My Delegation Chain
            </h3>
            {Array.from(groups.entries()).map(([scopeKey, groupChains]) => (
              <div key={scopeKey} className="card space-y-3">
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
                  {scopeKey}
                </p>
                <div className="space-y-3">
                  {groupChains.map((chain, i) => (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">You</span>
                      {chain.map((step, j) => (
                        <span key={j} className="flex items-center gap-1.5">
                          <span className="flex flex-col items-center gap-0.5">
                            <ArrowRight className="w-3 h-3 text-foreground/30" />
                            {j > 0 && <ScopeBadge label={step.scope} />}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Initial member={step.member} />
                            <span className="text-sm font-medium">{getMemberDisplayName(step.member)}</span>
                          </span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      })()}
    </div>
  )
}
