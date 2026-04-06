'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Member } from '@/lib/types'
import { Trash2, Plus } from 'lucide-react'
import { getMemberDisplayName } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface Props {
  userId: string
  delegations: any[]
  members: Pick<Member, 'id' | 'display_name' | 'email'>[]
  areas: any[]
}

export function DelegationManager({ userId, delegations: initial, members, areas }: Props) {
  const [delegations, setDelegations] = useState<any[]>(initial)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ toMemberId: '', scope: 'global', areaId: '' })
  const supabase = createClient()

  async function addDelegation(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload: any = { from_member_id: userId, to_member_id: form.toMemberId }
    if (form.scope === 'area') payload.area_id = form.areaId

    const { data, error } = await supabase
      .from('delegation')
      .insert(payload)
      .select('*, to_member:member!delegation_to_member_id_fkey(*), area(*)')
      .single()

    if (!error && data) {
      setDelegations((prev) => [...prev, data])
      setShowForm(false)
      setForm({ toMemberId: '', scope: 'global', areaId: '' })
    }
    setLoading(false)
  }

  async function revoke(id: string) {
    await supabase.from('delegation').delete().eq('id', id)
    setDelegations((prev) => prev.filter((d) => d.id !== id))
  }

  function scopeLabel(d: any) {
    if (d.area) return `Area: ${d.area.name}`
    return 'Global (all topics)'
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
          <p className="text-sm text-foreground/40">No delegations set. You vote directly on all issues.</p>
        ) : (
          <div className="divide-y divide-sand">
            {delegations.map((d: any) => (
              <div key={d.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">→ {getMemberDisplayName(d.to_member)}</p>
                  <p className="text-xs text-foreground/40">{scopeLabel(d)}</p>
                </div>
                <button onClick={() => revoke(d.id)} className="text-foreground/30 hover:text-red-500 transition-colors p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
            <select
              value={form.scope}
              onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
              className="input"
            >
              <option value="global">Global (all topics)</option>
              <option value="area">Specific Area</option>
            </select>
          </div>

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
          <li>Your vote follows a chain: Issue → Area → Global</li>
          <li>If your delegate has voted, their vote counts for you too</li>
          <li>Voting directly always overrides your delegation</li>
          <li>Cycles are automatically broken</li>
        </ul>
      </div>
    </div>
  )
}
