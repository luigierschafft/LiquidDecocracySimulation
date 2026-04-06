'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ProposedImprovement } from '@/lib/types/ev'
import { Plus, Lightbulb } from 'lucide-react'

interface Props {
  proposalId: string
  userId: string | null
  improvements: ProposedImprovement[]
}

export function ProposedImprovements({ proposalId, userId, improvements }: Props) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase.schema('ev').from('proposed_improvements').insert({
      proposal_id: proposalId,
      text: text.trim(),
      author_id: userId,
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
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
        <Lightbulb className="w-3.5 h-3.5" />
        Verbesserungsvorschläge
      </h4>

      {improvements.length === 0 && (
        <p className="text-xs text-gray-400">Noch keine Verbesserungsvorschläge.</p>
      )}

      <div className="space-y-2">
        {improvements.map((imp) => {
          const authorName = imp.author?.display_name || imp.author?.email || 'Anonym'
          return (
            <div key={imp.id} className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
              <p className="text-sm text-gray-800">{imp.text}</p>
              <span className="text-xs text-gray-400">{authorName}</span>
            </div>
          )
        })}
      </div>

      {userId && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Verbesserungsvorschlag hinzufügen…"
            rows={2}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
