'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionTask } from '@/lib/types/ev'
import { TaskCard } from './TaskCard'
import { Plus } from 'lucide-react'

type Status = ExecutionTask['status']

const COLUMNS: { status: Status; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'border-gray-300' },
  { status: 'in_progress', label: 'In Progress', color: 'border-blue-300' },
  { status: 'done', label: 'Done', color: 'border-green-300' },
]

interface Props {
  tasks: ExecutionTask[]
  planId: string
  userId: string | null
}

export function TaskBoard({ tasks, planId, userId }: Props) {
  const router = useRouter()
  const [addingIn, setAddingIn] = useState<Status | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAddTask(status: Status) {
    if (!newTitle.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_execution_tasks').insert({
      plan_id: planId,
      title: newTitle.trim(),
      description: newDesc.trim() || null,
      status,
      assignee_id: null,
    })
    setNewTitle('')
    setNewDesc('')
    setAddingIn(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status)
          return (
            <div
              key={col.status}
              className={`bg-gray-50 rounded-xl border-2 ${col.color} p-3 space-y-3`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {col.label}
                  <span className="ml-1.5 text-gray-400 font-normal">({colTasks.length})</span>
                </h3>
              </div>

              <div className="space-y-2">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} userId={userId} />
                ))}
              </div>

              {/* Add task form */}
              {addingIn === col.status ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddTask(col.status)}
                      disabled={loading || !newTitle.trim()}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                    >
                      {loading ? 'Saving…' : 'Add'}
                    </button>
                    <button
                      onClick={() => { setAddingIn(null); setNewTitle(''); setNewDesc('') }}
                      className="px-3 py-2 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                userId && (
                  <button
                    onClick={() => setAddingIn(col.status)}
                    className="w-full flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add task
                  </button>
                )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
