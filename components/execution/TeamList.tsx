'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionTeamMember } from '@/lib/types/ev'
import { Users, UserPlus, Crown, Plus, Check, X } from 'lucide-react'

interface Props {
  team: ExecutionTeamMember[]
  planId: string
  userId: string | null
}

const STATUS_STYLES: Record<ExecutionTeamMember['status'], string> = {
  active: 'bg-green-100 text-green-700',
  interested: 'bg-yellow-100 text-yellow-700',
}

const STATUS_LABELS: Record<ExecutionTeamMember['status'], string> = {
  active: 'Active',
  interested: 'Interested',
}

export function TeamList({ team, planId, userId }: Props) {
  const router = useRouter()
  const [joining, setJoining] = useState(false)
  const [roleText, setRoleText] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [allMembers, setAllMembers] = useState<{ id: string; display_name: string | null; email: string }[]>([])
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [addRole, setAddRole] = useState('')
  const [adding, setAdding] = useState(false)
  const [togglingLead, setTogglingLead] = useState<string | null>(null)

  const isAlreadyMember = userId ? team.some((m) => m.user_id === userId) : false
  const isLead = userId ? team.some((m) => m.user_id === userId && m.is_lead) : false
  const hasLead = team.some((m) => m.is_lead)
  const activeMembers = team.filter((m) => m.status === 'active')
  const pendingRequests = team.filter((m) => m.status === 'interested')

  async function toggleLead(memberId: string, currentlyLead: boolean) {
    setTogglingLead(memberId)
    const supabase = createClient()
    await supabase
      .from('ev_execution_team')
      .update({ is_lead: !currentlyLead })
      .eq('id', memberId)
    setTogglingLead(null)
    router.refresh()
  }

  // Load all members for the add-member dropdown (only when lead opens it)
  useEffect(() => {
    if (!showAddMember) return
    const supabase = createClient()
    supabase.from('member').select('id, display_name, email').then(({ data }) => {
      const existing = new Set(team.map((m) => m.user_id))
      setAllMembers((data ?? []).filter((m) => !existing.has(m.id)))
    })
  }, [showAddMember, team])

  async function handleJoin(asLead: boolean) {
    if (!userId) return
    setJoining(true)
    const supabase = createClient()
    await supabase.from('ev_execution_team').insert({
      plan_id: planId,
      user_id: userId,
      role: roleText.trim() || null,
      status: asLead ? 'active' : 'interested',
      is_lead: asLead,
    })
    setJoining(false)
    setShowForm(false)
    setRoleText('')
    router.refresh()
  }

  async function handleApprove(memberId: string) {
    const supabase = createClient()
    await supabase.from('ev_execution_team').update({ status: 'active' }).eq('id', memberId)
    router.refresh()
  }

  async function handleRemove(memberId: string) {
    const supabase = createClient()
    await supabase.from('ev_execution_team').delete().eq('id', memberId)
    router.refresh()
  }

  async function handleAddMember() {
    if (!selectedMemberId || adding) return
    setAdding(true)
    const supabase = createClient()
    await supabase.from('ev_execution_team').insert({
      plan_id: planId,
      user_id: selectedMemberId,
      role: addRole.trim() || null,
      status: 'active',
      is_lead: false,
    })
    setAdding(false)
    setShowAddMember(false)
    setSelectedMemberId('')
    setAddRole('')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-700">Team</h3>
        <span className="text-xs text-gray-400">({team.length})</span>
      </div>

      {activeMembers.length === 0 && (
        <p className="text-xs text-gray-400">No team members yet. Be the first to join as Team Lead.</p>
      )}

      <div className="space-y-2">
        {activeMembers.map((member) => {
          const name = member.member?.display_name || member.member?.email || member.user_id
          return (
            <div key={member.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                {member.is_lead && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {name}
                    {member.is_lead && <span className="ml-1.5 text-xs text-amber-600 font-normal">Lead</span>}
                  </p>
                  {member.role && <p className="text-xs text-gray-400">{member.role}</p>}
                </div>
              </div>
              {isLead && member.user_id !== userId && (
                <button
                  onClick={() => toggleLead(member.id, member.is_lead)}
                  disabled={togglingLead === member.id}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                    member.is_lead
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-amber-100 hover:text-amber-700'
                  }`}
                >
                  {member.is_lead ? 'Remove Lead' : 'Make Lead'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Pending requests — only visible to lead */}
      {isLead && pendingRequests.length > 0 && (
        <div className="pt-2 border-t border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Anfragen ({pendingRequests.length})</p>
          {pendingRequests.map((member) => {
            const name = member.member?.display_name || member.member?.email || member.user_id
            return (
              <div key={member.id} className="flex items-center justify-between gap-2 py-1">
                <div>
                  <p className="text-sm text-gray-800">{name}</p>
                  {member.role && <p className="text-xs text-gray-400">{member.role}</p>}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleApprove(member.id)}
                    className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="Annehmen"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemove(member.id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Ablehnen"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Join team */}
      {userId && !isAlreadyMember && (
        <div className="pt-2 border-t border-gray-100">
          {showForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={roleText}
                onChange={(e) => setRoleText(e.target.value)}
                placeholder="Your role (optional)…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                {!hasLead && (
                  <button
                    onClick={() => handleJoin(true)}
                    disabled={joining}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    {joining ? '…' : 'Als Lead beitreten'}
                  </button>
                )}
                <button
                  onClick={() => handleJoin(false)}
                  disabled={joining}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {joining ? '…' : 'Anfrage senden'}
                </button>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Join team
            </button>
          )}
        </div>
      )}

      {/* Lead can add members */}
      {isLead && (
        <div className="pt-2 border-t border-gray-100">
          {showAddMember ? (
            <div className="space-y-2">
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a member…</option>
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.display_name || m.email}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={addRole}
                onChange={(e) => setAddRole(e.target.value)}
                placeholder="Their role (optional)…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMember}
                  disabled={adding || !selectedMemberId}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                >
                  {adding ? 'Adding…' : 'Add to Team'}
                </button>
                <button
                  onClick={() => { setShowAddMember(false); setSelectedMemberId(''); setAddRole('') }}
                  className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add team member
            </button>
          )}
        </div>
      )}
    </div>
  )
}
