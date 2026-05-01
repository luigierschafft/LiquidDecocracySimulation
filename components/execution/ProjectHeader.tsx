'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionPlan, ExecutionTask } from '@/lib/types/ev'
import { Target, DollarSign, Clock, Edit3, Check, X } from 'lucide-react'

interface Props {
  plan: ExecutionPlan & { tasks?: ExecutionTask[] }
}

function InlineEdit({
  value,
  onSave,
  placeholder,
  multiline = false,
}: {
  value: string
  onSave: (v: string) => Promise<void>
  placeholder: string
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(value)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await onSave(text.trim())
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex gap-2 items-start">
        {multiline ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}
        <div className="flex flex-col gap-1">
          <button onClick={save} disabled={saving} className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => { setEditing(false); setText(value) }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      <p className="text-sm text-gray-800 flex-1">
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </p>
      <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-purple-600 transition-colors" title="Edit">
        <Edit3 className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ProjectHeader({ plan }: Props) {
  const router = useRouter()
  const tasks = plan.tasks ?? []
  const done = tasks.filter((t) => t.status === 'done').length
  const total = tasks.length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  async function save(field: string, value: string) {
    const supabase = createClient()
    await supabase.from('ev_execution_plans').update({ [field]: value || null }).eq('id', plan.id)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Goal */}
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Goal</h3>
          <InlineEdit
            value={plan.goal ?? ''}
            onSave={(v) => save('goal', v)}
            placeholder="No goal defined yet. Click to add."
            multiline
          />
        </div>
      </div>

      {/* Budget + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500 font-medium">Budget</p>
          </div>
          <InlineEdit
            value={plan.costs ?? ''}
            onSave={(v) => save('costs', v)}
            placeholder="Click to add budget…"
          />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-xs text-gray-500 font-medium">Duration</p>
          </div>
          <InlineEdit
            value={plan.duration ?? ''}
            onSave={(v) => save('duration', v)}
            placeholder="Click to add duration…"
          />
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
            <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
