'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ExecutionTask, TaskComment } from '@/lib/types/ev'
import { ChevronDown, ChevronRight, MessageSquare, Plus } from 'lucide-react'

const STATUS_OPTIONS: { value: ExecutionTask['status']; label: string; color: string }[] = [
  { value: 'todo', label: 'To Do', color: 'bg-gray-100 text-gray-600' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'done', label: 'Done', color: 'bg-green-100 text-green-700' },
]

interface Props {
  task: ExecutionTask
  userId: string | null
}

export function TaskCard({ task, userId }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const comments: TaskComment[] = task.comments ?? []
  const assigneeName = task.assignee?.display_name || task.assignee?.email || null

  async function changeStatus(status: ExecutionTask['status']) {
    if (statusLoading) return
    setStatusLoading(true)
    const supabase = createClient()
    await supabase.from('ev_execution_tasks').update({ status }).eq('id', task.id)
    setStatusLoading(false)
    router.refresh()
  }

  async function addComment() {
    if (!commentText.trim() || !userId) return
    setCommentLoading(true)
    const supabase = createClient()
    await supabase.from('ev_task_comments').insert({
      task_id: task.id,
      text: commentText.trim(),
      author_id: userId,
    })
    setCommentText('')
    setCommentLoading(false)
    router.refresh()
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === task.status)!

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-2">
      {/* Title row */}
      <div className="flex items-start gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{task.title}</p>
          {assigneeName && <span className="text-xs text-gray-400">{assigneeName}</span>}
        </div>
        {comments.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MessageSquare className="w-3 h-3" />
            {comments.length}
          </span>
        )}
      </div>

      {/* Status buttons */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => changeStatus(opt.value)}
            disabled={statusLoading || task.status === opt.value}
            className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${
              task.status === opt.value ? opt.color + ' font-bold' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Expanded: description + comments */}
      {expanded && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {task.description && (
            <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
          )}

          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Kommentare</h5>
            {comments.length === 0 && (
              <p className="text-xs text-gray-400">No comments yet.</p>
            )}
            {comments.map((c) => {
              const author = c.author?.display_name || c.author?.email || 'Anonymous'
              return (
                <div key={c.id} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-800">{c.text}</p>
                  <span className="text-xs text-gray-400">{author}</span>
                </div>
              )
            })}
            {userId && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addComment()}
                  placeholder="Kommentar hinzufügen…"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addComment}
                  disabled={commentLoading || !commentText.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-2 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
