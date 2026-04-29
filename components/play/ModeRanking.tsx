'use client'

import { useState, useEffect } from 'react'

interface Statement { id: string; text: string; elo_score: number }

interface Props {
  pair: [Statement, Statement]
  issueId: string
  onNext: () => void
}

export function ModeRanking({ pair, issueId, onNext }: Props) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Reset when pair changes
  useEffect(() => {
    setChosen(null)
    setSaving(false)
  }, [pair[0].id, pair[1].id])

  async function choose(winnerId: string) {
    if (chosen || saving) return
    const loserId = pair.find(s => s.id !== winnerId)!.id
    setChosen(winnerId)
    setSaving(true)

    await fetch('/api/play/comparison', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId, loserId, issueId }),
    })

    setTimeout(() => {
      setSaving(false)
      onNext()
    }, 700)
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">

      {/* Two cards side by side */}
      <div className="flex gap-3 w-full">
        {pair.map((stmt) => {
          const isWinner = chosen === stmt.id
          const isLoser = chosen !== null && chosen !== stmt.id
          return (
            <button
              key={stmt.id}
              onClick={() => choose(stmt.id)}
              disabled={!!chosen}
              className={`flex-1 rounded-2xl px-4 py-5 text-xs font-semibold text-gray-800 text-left leading-relaxed border-2 transition-all duration-300 active:scale-95 ${
                isWinner
                  ? 'border-amber-400 bg-amber-50 scale-[1.03] shadow-lg'
                  : isLoser
                  ? 'border-gray-200 bg-gray-50 opacity-40 scale-[0.97]'
                  : 'border-dashed border-gray-300 hover:border-amber-300 hover:bg-amber-50/30'
              }`}
            >
              {stmt.text}
              {isWinner && (
                <div className="mt-3 text-amber-500 font-bold text-xs text-center">
                  ✓ More important
                </div>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-xs text-gray-400">Tap the statement that matters more to you</p>
    </div>
  )
}
