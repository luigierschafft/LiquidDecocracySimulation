'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Statement { id: string; text: string }

interface Props {
  statements: Statement[]
  userId: string
  onDone: () => void
}

export function ModeAgreeDisagree({ statements, userId, onDone }: Props) {
  const [index, setIndex] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | 'up' | null>(null)
  const supabase = createClient()

  const current = statements[index]
  const progress = statements.length > 0 ? index / statements.length : 0

  async function vote(rating: number | null) {
    if (!current) return
    if (rating !== null) {
      await supabase.from('ev_statement_ratings').upsert(
        { statement_id: current.id, user_id: userId, rating },
        { onConflict: 'statement_id,user_id' }
      )
    }
    const dir = rating === null ? 'up' : rating >= 5 ? 'right' : 'left'
    setAnimDir(dir)
    setTimeout(() => {
      setAnimDir(null)
      const next = index + 1
      if (next >= statements.length) onDone()
      else setIndex(next)
    }, 300)
  }

  if (!current) return null

  const cardStyle: React.CSSProperties = {
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transform:
      animDir === 'left'  ? 'translateX(-120%) rotate(-15deg)' :
      animDir === 'right' ? 'translateX(120%) rotate(15deg)' :
      animDir === 'up'    ? 'translateY(-120%)' : 'none',
    opacity: animDir ? 0 : 1,
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Pass */}
      <button onClick={() => vote(null)} className="flex flex-col items-center active:scale-95 transition-transform">
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] border-b-amber-400" />
        <span className="text-xs font-bold text-amber-600 mt-0.5">Pass</span>
      </button>

      {/* Card */}
      <div style={cardStyle}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-6 select-none">
        <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed">{current.text}</p>
        <div className="mt-4 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-500" style={{ marginLeft: `${progress * 80}%` }} />
        </div>
        <div className="mt-1 w-full h-px bg-gray-200 rounded" />
      </div>

      {/* Agree / Disagree */}
      <div className="flex justify-between w-full px-4">
        <button onClick={() => vote(2)} className="flex items-center gap-1.5 active:scale-95 transition-transform">
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[22px] border-r-amber-400" />
          <span className="text-xs font-bold text-amber-600">Disagree</span>
        </button>
        <button onClick={() => vote(8)} className="flex items-center gap-1.5 active:scale-95 transition-transform">
          <span className="text-xs font-bold text-amber-600">Agree</span>
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[22px] border-l-amber-400" />
        </button>
      </div>
    </div>
  )
}
