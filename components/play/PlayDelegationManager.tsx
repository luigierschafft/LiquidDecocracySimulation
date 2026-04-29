'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'

interface Member {
  id: string
  display_name: string | null
  email: string | null
}

interface Area {
  id: string
  name: string
}

interface Issue {
  id: string
  title: string
}

interface Delegation {
  id: string
  to_member: { id: string; display_name: string | null; email: string | null } | null
  area: { id: string; name: string } | null
  issue: { id: string; title: string } | null
}

interface Props {
  userId: string
  delegations: Delegation[]
  members: Member[]
  areas: Area[]
  issues: Issue[]
}

function memberName(m: { display_name: string | null; email: string | null } | null) {
  if (!m) return '?'
  return m.display_name || m.email || '?'
}

function delegationLabel(d: Delegation) {
  if (d.issue) return `Topic: ${d.issue.title}`
  if (d.area) return `Area: ${d.area.name}`
  return 'Global (all topics)'
}

export function PlayDelegationManager({ userId, delegations: initial, members, areas, issues }: Props) {
  const [delegations, setDelegations] = useState<Delegation[]>(initial)
  const [toMemberId, setToMemberId] = useState('')
  const [scope, setScope] = useState<'global' | 'area' | 'topic'>('global')
  const [areaId, setAreaId] = useState('')
  const [issueId, setIssueId] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  function resetForm() {
    setToMemberId('')
    setScope('global')
    setAreaId('')
    setIssueId('')
    setShowForm(false)
  }

  async function addDelegation() {
    if (!toMemberId || loading) return
    if (scope === 'area' && !areaId) return
    if (scope === 'topic' && !issueId) return
    setLoading(true)

    const payload: any = { from_member_id: userId, to_member_id: toMemberId }
    if (scope === 'area') payload.area_id = areaId
    if (scope === 'topic') payload.issue_id = issueId

    const { data, error } = await supabase
      .from('delegation')
      .insert(payload)
      .select('id, to_member:member!delegation_to_member_id_fkey(id, display_name, email), area(id, name), issue(id, title)')
      .single()

    if (!error && data) {
      setDelegations((prev) => [...prev, data as any])
      resetForm()
    }
    setLoading(false)
  }

  async function revoke(id: string) {
    await supabase.from('delegation').delete().eq('id', id)
    setDelegations((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="w-full max-w-xs flex flex-col gap-5">

      {/* Active delegations */}
      {delegations.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Active delegations</p>
          {delegations.map((d) => (
            <div key={d.id} className="flex items-center justify-between border-2 border-dashed border-amber-200 rounded-2xl px-4 py-3">
              <div>
                <p className="text-sm font-bold text-gray-800">→ {memberName(d.to_member)}</p>
                <p className="text-xs text-gray-400">{delegationLabel(d)}</p>
              </div>
              <button
                onClick={() => revoke(d.id)}
                className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded-full hover:bg-red-50 transition-colors"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}

      {delegations.length === 0 && !showForm && (
        <div className="flex flex-col items-center gap-3 mt-2">
          <Image
            src="/mongoose-handstand.png"
            alt="Mongoose"
            width={100}
            height={120}
            placeholder="empty"
            style={{ background: 'transparent' }}
          />
          <p className="text-xs text-gray-400 text-center">
            No delegations yet. You vote directly on all topics.
          </p>
        </div>
      )}

      {/* Add form */}
      {showForm ? (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">New delegation</p>

          {/* Person */}
          <select
            value={toMemberId}
            onChange={(e) => setToMemberId(e.target.value)}
            className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-white outline-none"
          >
            <option value="">— Select a person —</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{memberName(m)}</option>
            ))}
          </select>

          {/* Scope */}
          <select
            value={scope}
            onChange={(e) => { setScope(e.target.value as any); setAreaId(''); setIssueId('') }}
            className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-white outline-none"
          >
            <option value="global">Global (all topics)</option>
            <option value="area">Specific Area</option>
            <option value="topic">Specific Topic</option>
          </select>

          {/* Area picker */}
          {scope === 'area' && (
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-white outline-none"
            >
              <option value="">— Select an area —</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}

          {/* Topic picker */}
          {scope === 'topic' && (
            <select
              value={issueId}
              onChange={(e) => setIssueId(e.target.value)}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-white outline-none"
            >
              <option value="">— Select a topic —</option>
              {issues.map((i) => (
                <option key={i.id} value={i.id}>{i.title}</option>
              ))}
            </select>
          )}

          <div className="flex gap-2">
            <button
              onClick={addDelegation}
              disabled={
                !toMemberId || loading ||
                (scope === 'area' && !areaId) ||
                (scope === 'topic' && !issueId)
              }
              className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 disabled:opacity-40 rounded-[2rem] py-3 text-sm font-bold text-gray-900 shadow-md active:scale-95 transition-transform"
            >
              {loading ? 'Saving…' : 'Save delegation'}
            </button>
            <button
              onClick={resetForm}
              className="px-4 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-4 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform"
        >
          + Add delegation
        </button>
      )}
    </div>
  )
}
