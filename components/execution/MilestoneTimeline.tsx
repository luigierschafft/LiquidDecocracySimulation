'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionMilestone } from '@/lib/types/ev'
import { Flag, Plus } from 'lucide-react'

interface Props {
  milestones: ExecutionMilestone[]
  planId: string
  userId: string | null
}

export function MilestoneTimeline({ milestones, planId, userId }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)

  const sorted = [...milestones].sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date.localeCompare(b.date)
  })

  async function handleAdd() {
    if (!title.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_execution_milestones').insert({
      plan_id: planId,
      title: title.trim(),
      date: date || null,
    })
    setTitle('')
    setDate('')
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Flag className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-700">Milestones</h3>
      </div>

      {sorted.length === 0 && (
        <p className="text-xs text-gray-400">No milestones yet.</p>
      )}

      <div className="relative">
        {sorted.length > 0 && (
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-purple-100" />
        )}
        <div className="space-y-4">
          {sorted.map((ms) => {
            const dateStr = ms.date
              ? new Date(ms.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
              : null
            return (
              <div key={ms.id} className="flex items-start gap-4 pl-6 relative">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-purple-600 border-2 border-white shadow-sm" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{ms.title}</p>
                  {dateStr && <p className="text-xs text-gray-400">{dateStr}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {userId && (
        <div className="pt-2 border-t border-gray-100">
          {showForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Milestone title…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={loading || !title.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Saving…' : 'Add'}
                </button>
                <button
                  onClick={() => { setShowForm(false); setTitle(''); setDate('') }}
                  className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Add milestone
            </button>
          )}
        </div>
      )}
    </div>
  )
}
