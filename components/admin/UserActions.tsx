'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Member } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface Props {
  members: Member[]
  moderatorEnabled?: boolean
  verificationEnabled?: boolean
}

export function UserActions({ members: initial, moderatorEnabled = false, verificationEnabled = false }: Props) {
  const [members, setMembers] = useState<Member[]>(initial)
  const supabase = createClient()

  async function toggleApproved(id: string, current: boolean) {
    const { error } = await supabase.from('member').update({ is_approved: !current }).eq('id', id)
    if (!error) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, is_approved: !current } : m))
    }
  }

  async function toggleAdmin(id: string, current: boolean) {
    const { error } = await supabase.from('member').update({ is_admin: !current }).eq('id', id)
    if (!error) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, is_admin: !current } : m))
    }
  }

  async function toggleModerator(id: string, current: boolean) {
    const { error } = await supabase.from('member').update({ is_moderator: !current }).eq('id', id)
    if (!error) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, is_moderator: !current } : m))
    }
  }

  async function toggleVerified(id: string, current: boolean) {
    const updates = current
      ? { is_verified: false, verified_at: null }
      : { is_verified: true, verified_at: new Date().toISOString() }
    const { error } = await supabase.from('member').update(updates).eq('id', id)
    if (!error) {
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m))
    }
  }

  return (
    <div className="card overflow-hidden p-0">
      <table className="w-full">
        <thead className="bg-sand/50 text-xs text-foreground/60 uppercase">
          <tr>
            <th className="px-4 py-3 text-left">Member</th>
            <th className="px-4 py-3 text-left">Joined</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sand">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-sand/20">
              <td className="px-4 py-3">
                <div className="font-medium text-sm">{m.display_name ?? '—'}</div>
                <div className="text-xs text-foreground/50">{m.email}</div>
              </td>
              <td className="px-4 py-3 text-sm text-foreground/60">{formatDate(m.created_at)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-1.5 flex-wrap">
                  {m.is_approved ? (
                    <Badge variant="green">Approved</Badge>
                  ) : (
                    <Badge variant="sand">Pending</Badge>
                  )}
                  {m.is_admin && <Badge>Admin</Badge>}
                  {moderatorEnabled && m.is_moderator && <Badge variant="sand">Moderator</Badge>}
                  {verificationEnabled && (m as any).is_verified && <Badge variant="green">Verified</Badge>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleApproved(m.id, m.is_approved)}
                    className="text-xs px-2.5 py-1 rounded-md border border-sand hover:bg-sand/50 transition-colors"
                  >
                    {m.is_approved ? 'Revoke' : 'Approve'}
                  </button>
                  <button
                    onClick={() => toggleAdmin(m.id, m.is_admin)}
                    className="text-xs px-2.5 py-1 rounded-md border border-sand hover:bg-sand/50 transition-colors"
                  >
                    {m.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                  {moderatorEnabled && (
                    <button
                      onClick={() => toggleModerator(m.id, m.is_moderator ?? false)}
                      className="text-xs px-2.5 py-1 rounded-md border border-sand hover:bg-sand/50 transition-colors"
                    >
                      {m.is_moderator ? 'Remove Mod' : 'Set Moderator'}
                    </button>
                  )}
                  {verificationEnabled && (
                    <button
                      onClick={() => toggleVerified(m.id, (m as any).is_verified ?? false)}
                      className="text-xs px-2.5 py-1 rounded-md border border-sand hover:bg-sand/50 transition-colors"
                    >
                      {(m as any).is_verified ? 'Unverify' : 'Verify'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
