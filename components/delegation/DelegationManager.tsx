'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Member } from '@/lib/types'
import { Trash2, Plus, MapPin, FileText } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Props {
  userId: string
  delegations: any[]
  members: (Pick<Member, 'id' | 'display_name' | 'email'> & { avatar_url?: string | null })[]
  areas: any[]
  issues: { id: string; title: string }[]
}

function Avatar({ name, avatarUrl, size = 8 }: { name: string; avatarUrl?: string | null; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full object-cover flex-shrink-0`
  if (avatarUrl) return <img src={avatarUrl} alt={name} className={cls} /> // eslint-disable-line @next/next/no-img-element
  return (
    <div className={`w-${size} h-${size} rounded-full bg-accent/15 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0`}>
      {name[0]?.toUpperCase()}
    </div>
  )
}

export function DelegationManager({ userId, delegations: initial, members, areas, issues }: Props) {
  const [delegations, setDelegations] = useState<any[]>(initial)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ toMemberId: '', scope: 'topic', areaId: '', issueId: '' })
  const supabase = createClient()

  async function addDelegation(e: React.FormEvent) {
    e.preventDefault()
    if (!form.toMemberId) return
    if (form.scope === 'area' && !form.areaId) return
    if (form.scope === 'topic' && !form.issueId) return
    setLoading(true)

    const payload: any = { from_member_id: userId, to_member_id: form.toMemberId }
    if (form.scope === 'area') payload.area_id = form.areaId
    if (form.scope === 'topic') payload.issue_id = form.issueId

    const { data, error } = await supabase
      .from('delegation')
      .insert(payload)
      .select('*, to_member:member!delegation_to_member_id_fkey(*), area(*), issue(id, title)')
      .single()

    if (!error && data) {
      setDelegations((prev) => [...prev, data])
      setShowForm(false)
      setForm({ toMemberId: '', scope: 'topic', areaId: '', issueId: '' })
    }
    setLoading(false)
  }

  async function revoke(id: string) {
    await supabase.from('delegation').delete().eq('id', id)
    setDelegations((prev) => prev.filter((d) => d.id !== id))
  }

  function scopeLabel(d: any) {
    if (d.issue) return d.issue.title
    if (d.area) return `Area: ${d.area.name}`
    return 'Global'
  }

  function ScopeIcon({ d }: { d: any }) {
    if (d.issue) return <FileText className="w-3 h-3 text-foreground/40" />
    if (d.area) return <MapPin className="w-3 h-3 text-foreground/40" />
    return null
  }

  return (
    <div className="space-y-6">
      {/* Active delegations */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Active Delegations</h2>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {delegations.length === 0 ? (
          <p className="text-sm text-foreground/40">No delegations yet. You vote directly on all topics.</p>
        ) : (
          <div className="divide-y divide-sand">
            {delegations.map((d: any) => {
              const name = getMemberDisplayName(d.to_member)
              return (
                <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} avatarUrl={d.to_member?.avatar_url} size={8} />
                    <div>
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-foreground/40 flex items-center gap-1">
                        <ScopeIcon d={d} />
                        {scopeLabel(d)}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => revoke(d.id)} className="text-foreground/30 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addDelegation} className="card space-y-4">
          <h3 className="font-semibold">New Delegation</h3>

          <div>
            <label className="block text-sm font-medium mb-1.5">Delegate to</label>
            <select
              required
              value={form.toMemberId}
              onChange={(e) => setForm((f) => ({ ...f, toMemberId: e.target.value }))}
              className="input"
            >
              <option value="">Select member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{getMemberDisplayName(m)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Scope</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, scope: 'topic' }))}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  form.scope === 'topic'
                    ? 'bg-accent text-white border-accent'
                    : 'border-sand text-foreground/60 hover:bg-sand/40'
                }`}
              >
                <FileText className="w-4 h-4" />
                Topic
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, scope: 'area' }))}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  form.scope === 'area'
                    ? 'bg-accent text-white border-accent'
                    : 'border-sand text-foreground/60 hover:bg-sand/40'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Area
              </button>
            </div>
          </div>

          {form.scope === 'topic' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Topic</label>
              <select
                required
                value={form.issueId}
                onChange={(e) => setForm((f) => ({ ...f, issueId: e.target.value }))}
                className="input"
              >
                <option value="">Select topic…</option>
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>{issue.title}</option>
                ))}
              </select>
            </div>
          )}

          {form.scope === 'area' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Area</label>
              <select
                required
                value={form.areaId}
                onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
                className="input"
              >
                <option value="">Select area…</option>
                {areas.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit" loading={loading}>Save Delegation</Button>
          </div>
        </form>
      )}

      <div className="card bg-sand/30 text-sm text-foreground/60 space-y-1">
        <p className="font-medium text-foreground/70">How delegation works:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Choose a topic or area and a person you trust</li>
          <li>When your delegate votes, their vote also counts for you</li>
          <li>Voting directly always overrides your delegation</li>
          <li>Delegation chains are resolved automatically</li>
        </ul>
      </div>
    </div>
  )
}
