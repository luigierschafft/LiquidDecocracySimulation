'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Plus, Link as LinkIcon } from 'lucide-react'
import { useMeditation } from '@/components/meditation/MeditationProvider'

interface Props {
  topicId: string
}

export function AddStatementForm({ topicId }: Props) {
  const router = useRouter()
  const { requestWrite } = useMeditation()
  const [text, setText] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remaining = 200 - text.length

  async function doSubmit() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in.')
      setLoading(false)
      return
    }

    const source_links: string[] = []
    if (sourceUrl.trim()) source_links.push(sourceUrl.trim())

    const { error: insertError } = await supabase.from('ev_statements').insert({
      issue_id: topicId,
      text: text.trim(),
      author_id: user.id,
      source_links,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setText('')
    setSourceUrl('')
    setShowUrl(false)
    setLoading(false)
    router.refresh()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    requestWrite(() => doSubmit())
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Statement</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 200))}
              placeholder="Your statement (max. 200 characters)..."
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
            />
            <span
              className={`absolute bottom-2 right-3 text-xs font-mono ${
                remaining <= 10 ? 'text-red-500' : 'text-gray-400'
              }`}
            >
              {remaining}
            </span>
          </div>
        </div>

        {showUrl && (
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://source.org/link"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Saving…' : 'Add Statement'}
          </button>
          <button
            type="button"
            onClick={() => setShowUrl(!showUrl)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            {showUrl ? 'Remove source' : 'Add source'}
          </button>
        </div>
      </form>
    </div>
  )
}
