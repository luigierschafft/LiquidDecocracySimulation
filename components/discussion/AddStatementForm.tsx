'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Plus, Link as LinkIcon } from 'lucide-react'
import { useMeditation } from '@/components/meditation/MeditationProvider'
import { CelebrationAnimation } from '@/components/ui/CelebrationAnimation'

interface ExistingStatement {
  id: string
  text: string
}

interface DuplicateCheckResult {
  isDuplicate: boolean
  matchedId: string | null
}

interface Props {
  topicId: string
  duplicateDetectionEnabled?: boolean
}

export function AddStatementForm({ topicId, duplicateDetectionEnabled = false }: Props) {
  const router = useRouter()
  const { requestWrite } = useMeditation()
  const [text, setText] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [showUrl, setShowUrl] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingStatements, setExistingStatements] = useState<ExistingStatement[]>([])
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [duplicateCheck, setDuplicateCheck] = useState<DuplicateCheckResult | null>(null)
  const skipDuplicateCheckRef = useRef(false)
  const [showAnimation, setShowAnimation] = useState(false)

  const remaining = 200 - text.length

  // Fetch existing statements for duplicate detection
  useEffect(() => {
    if (!duplicateDetectionEnabled) return
    const supabase = createClient()
    supabase
      .from('ev_statements')
      .select('id, text')
      .eq('issue_id', topicId)
      .then(({ data }) => {
        if (data) setExistingStatements(data)
      })
  }, [topicId, duplicateDetectionEnabled])

  async function doSubmit() {
    setLoading(true)
    setError(null)

    // Duplicate check (unless explicitly skipping)
    if (duplicateDetectionEnabled && !skipDuplicateCheckRef.current && existingStatements.length > 0) {
      setCheckingDuplicate(true)
      try {
        const res = await fetch('/api/ai/check-duplicate-statement', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newText: text.trim(), existingStatements }),
        })
        const data = await res.json()
        if (data.isDuplicate && data.matchedId) {
          setDuplicateCheck({ isDuplicate: true, matchedId: data.matchedId })
          setCheckingDuplicate(false)
          setLoading(false)
          return // Stop here — wait for user decision
        }
      } catch {
        // On error, proceed with normal submit
      }
      setCheckingDuplicate(false)
    }

    // Reset the skip flag for future calls
    skipDuplicateCheckRef.current = false

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
    setDuplicateCheck(null)
    setShowAnimation(true)
    router.refresh()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    requestWrite(() => doSubmit())
  }

  function handleScrollToExisting() {
    if (!duplicateCheck?.matchedId) return
    setDuplicateCheck(null)
    setText('')
    setSourceUrl('')
    setShowUrl(false)
    document.getElementById('statement-' + duplicateCheck.matchedId)?.scrollIntoView({ behavior: 'smooth' })
  }

  function handlePostAnyway() {
    setDuplicateCheck(null)
    skipDuplicateCheckRef.current = true
    requestWrite(() => doSubmit())
  }

  const matchedStatement = duplicateCheck?.matchedId
    ? existingStatements.find((s) => s.id === duplicateCheck.matchedId)
    : null

  return (
    <>
      {showAnimation && <CelebrationAnimation size="medium" onComplete={() => setShowAnimation(false)} />}

      {/* Duplicate Warning Modal */}
      {duplicateCheck?.isDuplicate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-900">Similar statement found</h3>
            <p className="text-sm text-gray-600">
              We found a similar statement already in the discussion.
            </p>
            {matchedStatement && (
              <blockquote className="bg-gray-50 border-l-4 border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 italic">
                {matchedStatement.text}
              </blockquote>
            )}
            <p className="text-sm text-gray-700 font-medium">
              Is this the same as what you wanted to say?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleScrollToExisting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Yes, scroll to it
              </button>
              <button
                onClick={handlePostAnyway}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                No, post mine anyway
              </button>
            </div>
          </div>
        </div>
      )}

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
              disabled={loading || checkingDuplicate || !text.trim()}
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
            {checkingDuplicate && (
              <span className="text-xs text-gray-400 italic">Checking for similar statements…</span>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
