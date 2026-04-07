'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionTeamMember } from '@/lib/types/ev'
import { Users, UserPlus } from 'lucide-react'

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
  active: 'Aktiv',
  interested: 'Interessiert',
}

export function TeamList({ team, planId, userId }: Props) {
  const router = useRouter()
  const [joining, setJoining] = useState(false)
  const [roleText, setRoleText] = useState('')
  const [showForm, setShowForm] = useState(false)

  const isAlreadyMember = userId ? team.some((m) => m.user_id === userId) : false

  async function handleJoin() {
    if (!userId) return
    setJoining(true)
    const supabase = createClient()
    await supabase.from('ev_execution_team').insert({
      plan_id: planId,
      user_id: userId,
      role: roleText.trim() || null,
      status: 'interested',
    })
    setJoining(false)
    setShowForm(false)
    setRoleText('')
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
        <p className="text-xs text-gray-400">No team members yet.</p>
      )}

      <div className="space-y-2">
        {team.map((member) => {
          const name = member.member?.display_name || member.member?.email || member.user_id
          return (
            <div key={member.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-800">{name}</p>
                {member.role && <p className="text-xs text-gray-400">{member.role}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[member.status]}`}>
                {STATUS_LABELS[member.status]}
              </span>
            </div>
          )
        })}
      </div>

      {userId && !isAlreadyMember && (
        <div className="pt-2">
          {showForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={roleText}
                onChange={(e) => setRoleText(e.target.value)}
                placeholder="Deine Rolle (optional)…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                >
                  {joining ? 'Beitreten…' : 'Beitreten'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Team beitreten
            </button>
          )}
        </div>
      )}
    </div>
  )
}
