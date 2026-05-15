'use client'

import { useState } from 'react'

interface Props {
  proposalId: string
  voteValue: string
  onDone: () => void
}

export function PositionPaperModal({ proposalId, voteValue, onDone }: Props) {
  const [coreValues, setCoreValues] = useState('')
  const [proArguments, setProArguments] = useState('')
  const [contraArguments, setContraArguments] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    setSubmitting(true)
    await fetch('/api/vote/position-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proposal_id: proposalId,
        vote_value: voteValue,
        core_values: coreValues.trim(),
        pro_arguments: proArguments.trim(),
        contra_arguments: contraArguments.trim(),
      }),
    })
    setSubmitting(false)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Share your position</h2>
          <p className="text-xs text-gray-500 mt-1">Optional — all fields can be left blank.</p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            What are your 3 core values you&apos;re defending with this vote?
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            rows={3}
            placeholder="Your core values…"
            value={coreValues}
            onChange={(e) => setCoreValues(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            What are for you the most important pro arguments?
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
            rows={3}
            placeholder="Key pro arguments…"
            value={proArguments}
            onChange={(e) => setProArguments(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">
            What are for you the most important contra arguments?
          </label>
          <textarea
            className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
            rows={3}
            placeholder="Key contra arguments…"
            value={contraArguments}
            onChange={(e) => setContraArguments(e.target.value)}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onDone}
            className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Pass
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-xs px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Saving…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}
