'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Statement {
  id: string
  content: string
}

interface Props {
  statements: Statement[]
  topicId: string
  topicTitle: string
}

export function StatementSwiper({ statements, topicId, topicTitle }: Props) {
  const [index, setIndex] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | 'up' | null>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const current = statements[index]
  const progress = statements.length > 0 ? (index / statements.length) : 0

  function swipe(dir: 'left' | 'right' | 'up') {
    setAnimDir(dir)
    setTimeout(() => {
      setAnimDir(null)
      setIndex((i) => Math.min(i + 1, statements.length))
    }, 300)
  }

  const swipeHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      pointerStart.current = { x: e.clientX, y: e.clientY }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!pointerStart.current) return
      const dx = e.clientX - pointerStart.current.x
      const dy = e.clientY - pointerStart.current.y
      pointerStart.current = null
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return // tap, not swipe
      if (Math.abs(dx) >= Math.abs(dy)) {
        if (dx > 50) swipe('right')
        else if (dx < -50) swipe('left')
      } else {
        if (dy < -50) swipe('up')
      }
    },
  }

  const cardStyle: React.CSSProperties = {
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transform:
      animDir === 'left'  ? 'translateX(-120%) rotate(-15deg)' :
      animDir === 'right' ? 'translateX(120%) rotate(15deg)' :
      animDir === 'up'    ? 'translateY(-120%)' :
      'none',
    opacity: animDir ? 0 : 1,
  }

  if (statements.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-sm text-gray-400 text-center">No statements yet for this topic.</p>
        <Image src="/mongoose-thinking.png" alt="Mongoose" width={140} height={160} placeholder="empty" style={{ background: 'transparent' }} />
      </div>
    )
  }

  if (index >= statements.length) {
    return (
      <div className="flex flex-col items-center gap-4 mt-8">
        <p className="text-base font-bold text-gray-700 text-center">You've seen all statements! 🎉</p>
        <Image src="/mongoose.png" alt="Mongoose" width={130} height={152} placeholder="empty" style={{ background: 'transparent' }} className="drop-shadow-lg" />
        <button onClick={() => setIndex(0)} className="mt-4 text-xs text-gray-400 underline">Start over</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs">

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Pass arrow */}
      <button onClick={() => swipe('up')} className="flex flex-col items-center mb-3 active:scale-95 transition-transform">
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] border-b-amber-400" />
        <span className="text-xs font-bold text-amber-600 mt-0.5">Pass</span>
      </button>

      {/* Statement card — swipeable */}
      <div
        {...swipeHandlers}
        style={cardStyle}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-6 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed">
          {current.content}
        </p>
        {/* Dot progress indicator */}
        <div className="mt-4 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-500" style={{ marginLeft: `${progress * 80}%` }} />
        </div>
        <div className="mt-1 w-full h-px bg-gray-200 rounded" />
      </div>

      {/* Agree / Disagree arrows */}
      <div className="flex justify-between w-full mt-4 px-4">
        <button onClick={() => swipe('left')} className="flex items-center gap-1.5 active:scale-95 transition-transform">
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-r-[22px] border-r-amber-400" />
          <span className="text-xs font-bold text-amber-600">Disagree</span>
        </button>
        <button onClick={() => swipe('right')} className="flex items-center gap-1.5 active:scale-95 transition-transform">
          <span className="text-xs font-bold text-amber-600">Agree</span>
          <div className="w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[22px] border-l-amber-400" />
        </button>
      </div>

      {/* Thinking mongoose */}
      <div className="mt-4 pointer-events-none">
        <Image
          src="/mongoose-thinking.png"
          alt="Mongoose thinking"
          width={110}
          height={128}
          placeholder="empty"
          style={{ background: 'transparent' }}
          className="drop-shadow-lg"
        />
      </div>

      {/* Write new statement */}
      <Link href={`/topics/${topicId}/discussion`} className="mt-4">
        <div className="bg-pink-200 hover:bg-pink-300 rounded-full px-6 py-2.5 text-sm font-bold text-gray-700 shadow active:scale-95 transition-transform">
          Write a new statement
        </div>
      </Link>
    </div>
  )
}
