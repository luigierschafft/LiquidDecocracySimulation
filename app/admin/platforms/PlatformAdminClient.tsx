'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Platform {
  id: string
  slug: string
  name: string
  is_invite_only: boolean
}

interface Membership {
  id: string
  platform_id: string
  user_id: string
  role: string
  status: string
  platform?: { name: string; slug: string }
  member?: { id: string; email: string; display_name: string | null }
}

interface Props {
  platforms: Platform[]
  memberships: Membership[]
}

export function PlatformAdminClient({ platforms, memberships }: Props) {
  const [list, setList] = useState(memberships)
  const [loading, setLoading] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [invitePlatformId, setInvitePlatformId] = useState(platforms[0]?.id ?? '')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteMsg, setInviteMsg] = useState<string | null>(null)
  const supabase = createClient()

  async function updateStatus(membershipId: string, status: string) {
    setLoading(membershipId)
    await supabase.from('platform_member').update({ status }).eq('id', membershipId)
    setList((prev) => prev.map((m) => m.id === membershipId ? { ...m, status } : m))
    setLoading(null)
  }

  async function updateRole(membershipId: string, role: string) {
    setLoading(membershipId + '_role')
    await supabase.from('platform_member').update({ role }).eq('id', membershipId)
    setList((prev) => prev.map((m) => m.id === membershipId ? { ...m, role } : m))
    setLoading(null)
  }

  async function removeMember(membershipId: string) {
    setLoading(membershipId + '_del')
    await supabase.from('platform_member').delete().eq('id', membershipId)
    setList((prev) => prev.filter((m) => m.id !== membershipId))
    setLoading(null)
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteLoading(true)
    setInviteMsg(null)

    // Look up user by email
    const { data: memberData } = await supabase
      .from('member')
      .select('id, email, display_name')
      .eq('email', inviteEmail.trim().toLowerCase())
      .single()

    if (!memberData) {
      setInviteMsg('User not found. They must sign up first.')
      setInviteLoading(false)
      return
    }

    const { data: inserted, error } = await supabase
      .from('platform_member')
      .insert({ platform_id: invitePlatformId, user_id: memberData.id, role: 'member', status: 'approved' })
      .select('*, platform:platform(name, slug), member:member(id, email, display_name)')
      .single()

    if (error) {
      setInviteMsg(error.code === '23505' ? 'User is already a member of this platform.' : error.message)
    } else {
      setList((prev) => [inserted as Membership, ...prev])
      setInviteEmail('')
      setInviteMsg('User added successfully.')
    }
    setInviteLoading(false)
  }

  const byPlatform = platforms.map((p) => ({
    platform: p,
    memberships: list.filter((m) => m.platform_id === p.id),
  }))

  const statusBadge = (status: string) => {
    const cls =
      status === 'approved' ? 'bg-green-100 text-green-700' :
      status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
      'bg-red-100 text-red-700'
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{status}</span>
  }

  return (
    <div className="space-y-10">
      {/* Invite form */}
      <div className="card space-y-4">
        <h2 className="font-semibold text-lg">Add member by email</h2>
        <form onSubmit={handleInvite} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Platform</label>
            <select
              value={invitePlatformId}
              onChange={(e) => setInvitePlatformId(e.target.value)}
              className="input"
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={inviteLoading} className="btn-primary">
            {inviteLoading ? 'Adding…' : 'Add as member'}
          </button>
        </form>
        {inviteMsg && (
          <p className={`text-sm ${inviteMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {inviteMsg}
          </p>
        )}
      </div>

      {/* Members per platform */}
      {byPlatform.map(({ platform, memberships: pMembers }) => (
        <div key={platform.id} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{platform.name}</h2>
            <span className="text-xs text-foreground/40">/{platform.slug}</span>
            {platform.is_invite_only && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-sand text-foreground/50">Invite only</span>
            )}
            <span className="text-sm text-foreground/50 ml-auto">{pMembers.length} member{pMembers.length !== 1 ? 's' : ''}</span>
          </div>

          {pMembers.length === 0 ? (
            <p className="text-sm text-foreground/40 pl-1">No members yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand text-left text-foreground/50">
                    <th className="pb-2 pr-4 font-medium">User</th>
                    <th className="pb-2 pr-4 font-medium">Status</th>
                    <th className="pb-2 pr-4 font-medium">Role</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/50">
                  {pMembers.map((m) => (
                    <tr key={m.id} className="py-2">
                      <td className="py-2 pr-4">
                        <div className="font-medium">{m.member?.display_name ?? '—'}</div>
                        <div className="text-foreground/50 text-xs">{m.member?.email}</div>
                      </td>
                      <td className="py-2 pr-4">{statusBadge(m.status)}</td>
                      <td className="py-2 pr-4">
                        <select
                          value={m.role}
                          onChange={(e) => updateRole(m.id, e.target.value)}
                          disabled={loading === m.id + '_role'}
                          className="text-xs border border-sand rounded px-2 py-1 bg-background"
                        >
                          <option value="member">member</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-2">
                        <div className="flex gap-2 flex-wrap">
                          {m.status !== 'approved' && (
                            <button
                              onClick={() => updateStatus(m.id, 'approved')}
                              disabled={!!loading}
                              className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {m.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(m.id, 'rejected')}
                              disabled={!!loading}
                              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => removeMember(m.id)}
                            disabled={!!loading}
                            className="text-xs px-2 py-1 rounded bg-sand text-foreground/60 hover:bg-sand/70 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
