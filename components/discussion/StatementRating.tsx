'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Props {
  statementId: string
  userId: string
  currentRating: number | null
  avgRating: number | null
  ratings: any[]
  onRatingChange: (rating: number, newAvg: number) => void
}

function interpolateColor(t: number): string {
  // t in [0,1]: white -> purple (#7c3aed)
  const r = Math.round(255 + (124 - 255) * t)
  const g = Math.round(255 + (58 - 255) * t)
  const b = Math.round(255 + (237 - 255) * t)
  return `rgb(${r},${g},${b})`
}

export function StatementRating({ statementId, userId, currentRating, avgRating, ratings, onRatingChange }: Props) {
  const [selected, setSelected] = useState<number | null>(currentRating)
  const [loading, setLoading] = useState(false)

  async function handleClick(value: number) {
    if (loading) return
    setLoading(true)
    const supabase = createClient()

    await supabase.from('ev_statement_ratings').upsert(
      { statement_id: statementId, user_id: userId, rating: value },
      { onConflict: 'statement_id,user_id' }
    )

    setSelected(value)
    setLoading(false)

    const existingIdx = ratings.findIndex((r: any) => r.user_id === userId)
    const updatedRatings = existingIdx >= 0
      ? ratings.map((r: any, i: number) => (i === existingIdx ? { ...r, rating: value } : r))
      : [...ratings, { user_id: userId, rating: value }]
    const avg = updatedRatings.reduce((sum: number, r: any) => sum + r.rating, 0) / updatedRatings.length
    onRatingChange(value, avg)
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 shrink-0">Not so important</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 11 }, (_, i) => i).map((val) => {
            const t = val / 10
            const bg = interpolateColor(t)
            const isSelected = selected === val
            return (
              <button
                key={val}
                onClick={() => handleClick(val)}
                title={`${val}/10`}
                disabled={loading}
                style={{ backgroundColor: bg }}
                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all border-2 ${
                  isSelected ? 'border-purple-700 scale-110 shadow-md' : 'border-transparent hover:border-purple-400'
                }`}
              >
                {isSelected && (
                  <span className={val >= 6 ? 'text-white' : 'text-purple-900'}>{val}</span>
                )}
              </button>
            )
          })}
        </div>
        <span className="text-xs text-gray-400 shrink-0">Important</span>
        {avgRating !== null && (
          <span className="text-xs text-gray-500 ml-2">
            Importance average: <span className="font-semibold text-purple-700">{avgRating.toFixed(1)}</span>
          </span>
        )}
      </div>
    </div>
  )
}
