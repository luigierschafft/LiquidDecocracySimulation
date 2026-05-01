'use client'

import { getMemberDisplayName } from '@/lib/utils'
import { ArrowRight, Users } from 'lucide-react'

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
  currentUserId: string | null
}

function Avatar({ member, size = 5 }: { member: Member | null; size?: number }) {
  const name = getMemberDisplayName(member)
  if (member?.avatar_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.avatar_url} alt={name} className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`} />
  }
  return (
    <div className={`w-${size} h-${size} rounded-full bg-accent/15 text-accent flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
      {name[0]?.toUpperCase()}
    </div>
  )
}

function scopeLabel(d: DelegationRow): string {
  if (d.issue) return `Topic: ${d.issue.title}`
  if (d.area) return `Area: ${d.area.name}`
  return 'Global'
}

function MemberBadge({ member, highlight }: { member: Member | null; highlight: boolean }) {
  const name = getMemberDisplayName(member)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
      highlight
        ? 'bg-accent/10 border-accent/30 text-accent'
        : 'bg-sand border-sand text-foreground/70'
    }`}>
      <Avatar member={member} size={4} />
      {name}
    </span>
  )
}

export function DelegationNetwork({ delegations, currentUserId }: Props) {
  if (delegations.length === 0) {
    return (
      <div className="card text-center py-12 text-foreground/40">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No delegations yet.</p>
      </div>
    )
  }

  // Group by to_member + scope label so same-target same-scope delegations are merged
  type Entry = { to: Member | null; froms: Member[]; scope: string }
  const toMap = new Map<string, Entry>()

  for (const d of delegations) {
    const label = scopeLabel(d)
    const key = `${d.to_member_id}::${label}`
    if (!toMap.has(key)) {
      toMap.set(key, { to: d.to_member, froms: [], scope: label })
    }
    if (d.from_member) toMap.get(key)!.froms.push(d.from_member)
  }

  return (
    <div className="space-y-3">
      <h2 className="font-semibold text-sm text-foreground/70">All Delegations</h2>
      {Array.from(toMap.entries()).map(([key, { to, froms, scope }]) => (
        <div key={key} className="card p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {froms.map((from, i) => (
                <span key={i} className="flex items-center gap-1">
                  <MemberBadge member={from} highlight={from?.id === currentUserId} />
                  {i < froms.length - 1 && <span className="text-foreground/20 text-xs">,</span>}
                </span>
              ))}
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/30 flex-shrink-0" />
            <MemberBadge member={to} highlight={to?.id === currentUserId} />
          </div>
          <p className="text-xs text-foreground/40">
            {froms.length} member{froms.length !== 1 ? 's' : ''} &rarr; {getMemberDisplayName(to)} &mdash; {scope}
          </p>
        </div>
      ))}
    </div>
  )
}
