'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Plus } from 'lucide-react'

interface Props {
  topicId: string
}

export function AddTopicProposalForm({ topicId }: Props) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Du musst eingeloggt sein.')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('ev_topic_proposals').insert({
      issue_id: topicId,
      text: text.trim(),
      author_id: user.id,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setText('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Proposal einreichen</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Beschreibe deinen konkreten Vorschlag…"
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {loading ? 'Wird gespeichert…' : 'Proposal einreichen'}
        </button>
      </form>
    </div>
  )
}
