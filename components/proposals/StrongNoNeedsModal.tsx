'use client'

import { useState } from 'react'

interface Props {
  proposalId: string
  onDone: () => void
}

export function StrongNoNeedsModal({ proposalId, onDone }: Props) {
  const [need, setNeed] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!need.trim()) return
    setSubmitting(true)
    await fetch('/api/vote/strong-no-needs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposal_id: proposalId, need: need.trim() }),
    })
    setSubmitting(false)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-800">
          What would you need?
        </h2>
        <p className="text-xs text-gray-500">
          Describe what would need to change for you to support this proposal.
        </p>
        <textarea
          className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
          rows={4}
          placeholder="What would need to change…"
          value={need}
          onChange={(e) => setNeed(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onDone}
            className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !need.trim()}
            className="text-xs px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
