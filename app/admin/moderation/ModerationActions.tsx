'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

interface Props {
  statementId: string
}

export function ModerationActions({ statementId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handle(action: 'approve' | 'reject') {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/moderate/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement_id: statementId, action }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
        setLoading(false)
        return
      }
      setDone(true)
      router.refresh()
    } catch {
      setError('Network error')
      setLoading(false)
    }
  }

  if (done) {
    return <span className="text-xs text-foreground/40 italic">Done</span>
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <button
        disabled={loading}
        onClick={() => handle('approve')}
        className="flex items-center gap-1 bg-auro-green/10 hover:bg-auro-green/20 text-auro-green text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <Check className="w-3.5 h-3.5" />
        Approve
      </button>
      <button
        disabled={loading}
        onClick={() => handle('reject')}
        className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
        Reject
      </button>
    </div>
  )
}
