'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Member } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

interface Props {
  members: Member[]
}

export function UserActions({ members: initial }: Props) {
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
                <div className="flex gap-1.5">
                  {m.is_approved ? (
                    <Badge variant="green">Approved</Badge>
                  ) : (
                    <Badge variant="sand">Pending</Badge>
                  )}
                  {m.is_admin && <Badge>Admin</Badge>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
