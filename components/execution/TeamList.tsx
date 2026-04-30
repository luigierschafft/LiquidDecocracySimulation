'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionTeamMember } from '@/lib/types/ev'
import { Users, UserPlus, Crown, Plus } from 'lucide-react'

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

  const isAlreadyMember = userId ? team.some((m) => m.user_id === userId) : false
  const isLead = userId ? team.some((m) => m.user_id === userId && m.is_lead) : false
  const hasLead = team.some((m) => m.is_lead)

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
      status: 'active',
      is_lead: asLead,
    })
    setJoining(false)
    setShowForm(false)
    setRoleText('')
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

      {team.length === 0 && (
        <p className="text-xs text-gray-400">No team members yet. Be the first to join as Team Lead.</p>
      )}

      <div className="space-y-2">
        {team.map((member) => {
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
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[member.status]}`}>
                {STATUS_LABELS[member.status]}
              </span>
            </div>
          )
        })}
      </div>

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
                    {joining ? 'Joining…' : 'Join as Lead'}
                  </button>
                )}
                <button
                  onClick={() => handleJoin(false)}
                  disabled={joining}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                >
                  {joining ? 'Joining…' : 'Join as Member'}
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
