'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { MessageCircle, Send } from 'lucide-react'

interface Comment {
  id: string
  text: string
  created_at: string
  author?: { display_name: string | null; email: string } | null
}

interface Props {
  planId: string
  userId: string | null
  comments: Comment[]
}

export function ExecutionComments({ planId, userId, comments: initial }: Props) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!text.trim() || !userId) return
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('ev_execution_comments')
      .insert({ plan_id: planId, author_id: userId, text: text.trim() })
      .select('*, author:member(display_name, email)')
      .single()
    if (data) setComments((c) => [...c, data])
    setText('')
    setLoading(false)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-4 h-4 text-purple-600" />
        <h3 className="text-sm font-semibold text-gray-700">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-xs font-normal text-gray-400">{comments.length}</span>
          )}
        </h3>
      </div>

      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 italic">No comments yet. Be the first to add one.</p>
        )}

        {comments.map((c) => {
          const name = c.author?.display_name || c.author?.email || 'Anonymous'
          return (
            <div key={c.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                {name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <span className="text-xs font-medium text-gray-700">{name}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">{c.text}</p>
              </div>
            </div>
          )
        })}

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {userId ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
                placeholder="Kommentar schreiben… (Ctrl+Enter zum Senden)"
                rows={2}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={submit}
                disabled={loading || !text.trim()}
                className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">Bitte einloggen um einen Kommentar zu schreiben.</p>
          )}
        </div>
      </div>
    </div>
  )
}
