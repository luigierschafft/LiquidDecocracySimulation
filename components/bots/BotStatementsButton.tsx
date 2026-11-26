'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Test Platform only: lets a few persona bots add new statements to the topic.
export function BotStatementsButton({ topicId }: { topicId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<string | null>(null)

  async function run() {
    setLoading(true)
    setNote(null)
    try {
      const res = await fetch('/api/bots/statements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      })
      const data = await res.json()
      if (!res.ok) setNote(data.error ?? 'Bots could not post.')
      else setNote(data.posted?.length ? `${data.posted.map((p: { persona: string }) => p.persona).join(', ')} added statements.` : 'The bots had nothing new to add.')
      router.refresh()
    } catch {
      setNote('Bots could not post.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-purple-50 border border-purple-100 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-purple-800">🤖 Test bots</p>
        <p className="text-xs text-purple-600">
          {loading ? 'Bots are writing statements…' : note ?? 'Fictional residents discuss with you on this test platform.'}
        </p>
      </div>
      <button
        onClick={run}
        disabled={loading}
        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 shrink-0"
      >
        Bots add statements
      </button>
    </div>
  )
}
