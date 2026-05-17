'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

const VOTE_LABELS: Record<string, string> = {
  approve: 'Approve',
  abstain: 'Abstain',
  disapprove: 'Disapprove',
  strong_disapproval: 'Strong No',
}

const MAX_CHARS = 500

interface Props {
  proposalId: string
  voteValue: string
  onDone: () => void
}

export function EmpathyModal({ proposalId, voteValue, onDone }: Props) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [thanked, setThanked] = useState(false)

  const voteLabel = VOTE_LABELS[voteValue] ?? voteValue
  const charsLeft = MAX_CHARS - text.length

  async function handleSubmit() {
    if (submitting || text.trim().length === 0) return
    setSubmitting(true)
    await fetch('/api/vote/empathy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proposal_id: proposalId,
        vote_value: voteValue,
        response: text,
      }),
    })
    setSubmitting(false)
    setThanked(true)
    setTimeout(() => onDone(), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 flex flex-col gap-5">
        {thanked ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <Heart className="w-8 h-8 text-indigo-500 fill-indigo-100" />
            <p className="text-sm font-medium text-indigo-700">
              Thank you for your reflection
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">
                A moment of empathy
              </h2>
            </div>

            {/* Subtext */}
            <p className="text-xs text-gray-500 leading-relaxed -mt-1">
              You voted{' '}
              <span className="font-medium text-indigo-600">{voteLabel}</span>.
              What do you think are the core values of people who voted differently?
            </p>

            {/* Textarea */}
            <div className="flex flex-col gap-1">
              <textarea
                value={text}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) setText(e.target.value)
                }}
                placeholder="They might value…"
                rows={4}
                className="w-full rounded-lg border border-indigo-200 bg-indigo-50/40 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 resize-none transition"
              />
              <p className={`text-right text-xs ${charsLeft <= 50 ? 'text-orange-500' : 'text-gray-400'}`}>
                {charsLeft} / {MAX_CHARS}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-1">
              <button
                onClick={onDone}
                className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || text.trim().length === 0}
                className="text-xs px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? 'Sharing…' : 'Share my reflection'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
