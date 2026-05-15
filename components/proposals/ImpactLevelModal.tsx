'use client'

import { useState } from 'react'

type ImpactLevel = 'very_directly' | 'somewhat' | 'not_directly'

const IMPACT_OPTIONS: { value: ImpactLevel; label: string }[] = [
  { value: 'very_directly', label: 'Very directly' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'not_directly', label: 'Not directly' },
]

interface Props {
  proposalId: string
  onDone: () => void
}

export function ImpactLevelModal({ proposalId, onDone }: Props) {
  const [selected, setSelected] = useState<ImpactLevel | null>(null)
  const [wantsParticipation, setWantsParticipation] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleProceed() {
    if (!selected) return
    setSubmitting(true)
    await fetch('/api/vote/impact-level', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        proposal_id: proposalId,
        impact_level: selected,
        wants_participation: wantsParticipation,
      }),
    })
    setSubmitting(false)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6 flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-gray-800">
          How directly does this affect you?
        </h2>

        <div className="flex flex-col gap-2">
          {IMPACT_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selected === opt.value
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="impact_level"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => {
                  setSelected(opt.value)
                  if (opt.value !== 'very_directly') setWantsParticipation(false)
                }}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>

        {selected === 'very_directly' && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex flex-col gap-3">
            <p className="text-xs text-amber-800 font-medium">
              Would you like to actively participate in shaping this proposal?
            </p>
            <button
              onClick={() => setWantsParticipation(true)}
              className={`text-xs px-4 py-2 rounded-lg border font-medium transition-colors ${
                wantsParticipation
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-amber-300 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {wantsParticipation ? 'Participation interest noted' : 'Yes, I want to participate'}
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleProceed}
            disabled={!selected || submitting}
            className="text-xs px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
