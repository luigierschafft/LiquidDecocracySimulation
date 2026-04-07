'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionPlan, ExecutionTask } from '@/lib/types/ev'
import { Target, DollarSign, Clock, Edit3, Check, X } from 'lucide-react'

interface Props {
  plan: ExecutionPlan & { tasks?: ExecutionTask[] }
}

export function ProjectHeader({ plan }: Props) {
  const router = useRouter()
  const tasks = plan.tasks ?? []
  const done = tasks.filter((t) => t.status === 'done').length
  const total = tasks.length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const [editingGoal, setEditingGoal] = useState(false)
  const [goalText, setGoalText] = useState(plan.goal ?? '')
  const [saving, setSaving] = useState(false)

  async function saveGoal() {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('ev_execution_plans')
      .update({ goal: goalText.trim() || null })
      .eq('id', plan.id)
    setSaving(false)
    setEditingGoal(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Goal */}
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Goal</h3>
          {editingGoal ? (
            <div className="flex gap-2">
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                rows={3}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={saveGoal}
                  disabled={saving}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setEditingGoal(false); setGoalText(plan.goal ?? '') }}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-800 flex-1">
                {plan.goal ?? <span className="text-gray-400 italic">No goal defined yet.</span>}
              </p>
              <button
                onClick={() => setEditingGoal(true)}
                className="text-gray-400 hover:text-purple-600 transition-colors"
                title="Ziel bearbeiten"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Costs + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium text-gray-800">{plan.costs ?? '–'}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-800">{plan.duration ?? '–'}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Progress</span>
            <span>{done}/{total} tasks completed ({progress}%)</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
