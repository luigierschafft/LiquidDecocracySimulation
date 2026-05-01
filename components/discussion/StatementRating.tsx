'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Props {
  statementId: string
  userId: string
  currentRating: number | null
  currentVote: 'agree' | 'pass' | 'disagree' | null
  avgRating: number | null
  ratings: any[]
  onRatingChange: (rating: number | null, newAvg: number | null) => void
  onVoteChange?: (vote: 'agree' | 'pass' | 'disagree' | null) => void
}

function interpolateColor(t: number): string {
  // t in [0,1]: white -> purple (#7c3aed)
  const r = Math.round(255 + (124 - 255) * t)
  const g = Math.round(255 + (58 - 255) * t)
  const b = Math.round(255 + (237 - 255) * t)
  return `rgb(${r},${g},${b})`
}

export function StatementRating({ statementId, userId, currentRating, currentVote, avgRating, ratings, onRatingChange, onVoteChange }: Props) {
  const [selectedRating, setSelectedRating] = useState<number | null>(currentRating)
  const [selectedVote, setSelectedVote] = useState<'agree' | 'pass' | 'disagree' | null>(currentVote)
  const [loadingRating, setLoadingRating] = useState(false)
  const [loadingVote, setLoadingVote] = useState(false)

  // ── Vote buttons (agree / pass / disagree) — with liquid democracy ───────
  async function handleVote(vote: 'agree' | 'pass' | 'disagree') {
    if (loadingVote) return
    const next = vote === selectedVote ? null : vote
    setLoadingVote(true)
    if (next !== null) {
      // Use API route so delegation proxy votes are applied
      await fetch('/api/vote/statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statement_id: statementId, vote: next }),
      })
    } else {
      // Toggle off: clear this user's vote directly
      const supabase = createClient()
      await supabase.from('ev_statement_ratings')
        .update({ vote: null })
        .eq('statement_id', statementId)
        .eq('user_id', userId)
    }
    setSelectedVote(next)
    onVoteChange?.(next)
    setLoadingVote(false)
  }

  // ── Importance slider (0–10) — independent from vote buttons ────────────
  async function handleRatingClick(value: number) {
    if (loadingRating) return
    const next = value === selectedRating ? null : value
    setLoadingRating(true)
    const supabase = createClient()
    if (next === null) {
      await supabase.from('ev_statement_ratings')
        .update({ rating: null })
        .eq('statement_id', statementId)
        .eq('user_id', userId)
    } else {
      await supabase.from('ev_statement_ratings').upsert(
        { statement_id: statementId, user_id: userId, rating: next },
        { onConflict: 'statement_id,user_id' }
      )
    }
    setSelectedRating(next)
    setLoadingRating(false)

    const updatedRatings = next === null
      ? ratings.filter((r: any) => r.user_id !== userId)
      : (() => {
          const existingIdx = ratings.findIndex((r: any) => r.user_id === userId)
          return existingIdx >= 0
            ? ratings.map((r: any, i: number) => (i === existingIdx ? { ...r, rating: next } : r))
            : [...ratings, { user_id: userId, rating: next }]
        })()
    const avg = updatedRatings.filter((r: any) => r.rating != null).length > 0
      ? updatedRatings.filter((r: any) => r.rating != null).reduce((sum: number, r: any) => sum + r.rating, 0) / updatedRatings.filter((r: any) => r.rating != null).length
      : null
    onRatingChange(next, avg)
  }

  return (
    <div className="space-y-2">
      {/* Vote buttons — completely independent from slider */}
      <div className="flex items-center gap-1.5">
        {(['disagree', 'pass', 'agree'] as const).map((v) => {
          const active = selectedVote === v
          const styles = {
            disagree: active ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-500 hover:bg-red-50',
            pass:     active ? 'bg-gray-300 border-gray-400 text-gray-700' : 'border-gray-200 text-gray-400 hover:bg-gray-50',
            agree:    active ? 'bg-green-500 border-green-500 text-white' : 'border-green-200 text-green-600 hover:bg-green-50',
          }
          return (
            <button
              key={v}
              onClick={() => handleVote(v)}
              disabled={loadingVote}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all capitalize ${styles[v]}`}
            >
              {v}
            </button>
          )
        })}
      </div>

      {/* Importance slider — completely independent from vote buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 shrink-0">Not important</span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 11 }, (_, i) => i).map((val) => {
            const t = val / 10
            const bg = interpolateColor(t)
            const isSelected = selectedRating === val
            return (
              <button
                key={val}
                onClick={() => handleRatingClick(val)}
                title={`${val}/10`}
                disabled={loadingRating}
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
        <span className="text-xs text-gray-400 shrink-0">Very important</span>
        {avgRating !== null && (
          <span className="text-xs text-gray-500 ml-2">
            avg: <span className="font-semibold text-purple-700">{avgRating.toFixed(1)}</span>
          </span>
        )}
      </div>
    </div>
  )
}
