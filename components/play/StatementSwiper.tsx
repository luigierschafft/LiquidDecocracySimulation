'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/browser'

interface Statement {
  id: string
  text: string
}

interface DiscussionNode {
  id: string
  statement_id: string
  type: 'pro' | 'contra'
  text: string
}

interface Props {
  statements: Statement[]
  topicId: string
  topicTitle: string
  nodes: DiscussionNode[]
}

export function StatementSwiper({ statements, topicId, nodes }: Props) {
  const [index, setIndex] = useState(0)
  const [animDir, setAnimDir] = useState<'left' | 'right' | 'up' | null>(null)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newText, setNewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [localNodes, setLocalNodes] = useState<DiscussionNode[]>([])
  const [addingType, setAddingType] = useState<'pro' | 'contra' | null>(null)
  const [addingText, setAddingText] = useState('')
  const [addingSubmitting, setAddingSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  const current = statements[index]

  const allNodes = [...nodes, ...localNodes]
  const currentNodes = current ? allNodes.filter((n) => n.statement_id === current.id) : []
  const pros = currentNodes.filter((n) => n.type === 'pro')
  const contras = currentNodes.filter((n) => n.type === 'contra')

  async function swipe(dir: 'left' | 'right' | 'up') {
    // Save vote to DB before animating (independent from importance rating)
    if (current && userId && (dir === 'right' || dir === 'left')) {
      const vote = dir === 'right' ? 'agree' : 'disagree'
      const supabase = createClient()
      supabase.from('ev_statement_ratings').upsert(
        { statement_id: current.id, user_id: userId, vote },
        { onConflict: 'statement_id,user_id' }
      )
    }
    setAnimDir(dir)
    setAddingType(null)
    setAddingText('')
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
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return
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

  async function submitNode(type: 'pro' | 'contra') {
    const text = addingText.trim()
    if (!text || !current || addingSubmitting) return
    setAddingSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('ev_discussion_nodes')
      .insert({
        statement_id: current.id,
        type,
        text,
        parent_id: null,
        source_links: [],
        author_id: user?.id ?? null,
      })
      .select('id, statement_id, type, text')
      .single()
    if (data) setLocalNodes((prev) => [...prev, data as DiscussionNode])
    setAddingText('')
    setAddingType(null)
    setAddingSubmitting(false)
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
        <p className="text-base font-bold text-gray-700 text-center">You&apos;ve seen all statements! 🎉</p>
        <Image src="/mongoose.png" alt="Mongoose" width={130} height={152} placeholder="empty" style={{ background: 'transparent' }} className="drop-shadow-lg" />
        <button onClick={() => setIndex(0)} className="mt-4 text-xs text-gray-400 underline">Start over</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs">

      {/* Write New Statement — top */}
      {!showForm && !submitted && (
        <button onClick={() => setShowForm(true)} className="w-full mb-4">
          <div className="bg-pink-200 hover:bg-pink-300 rounded-full px-6 py-2.5 text-sm font-bold text-gray-700 shadow active:scale-95 transition-transform text-center">
            Write a new statement
          </div>
        </button>
      )}

      {showForm && (
        <div className="w-full mb-4 space-y-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Write your statement… (max 200 characters)"
            maxLength={200}
            rows={3}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={async () => {
                if (!newText.trim() || submitting) return
                setSubmitting(true)
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                await supabase.from('ev_statements').insert({
                  issue_id: topicId,
                  text: newText.trim(),
                  author_id: user?.id ?? null,
                  source_links: [],
                })
                setNewText('')
                setShowForm(false)
                setSubmitted(true)
                setSubmitting(false)
              }}
              disabled={!newText.trim() || submitting}
              className="flex-1 bg-pink-400 hover:bg-pink-500 disabled:opacity-40 text-white text-sm font-bold py-2 rounded-full transition-colors"
            >
              {submitting ? 'Sending…' : 'Submit'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 text-sm text-gray-400 hover:text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {submitted && (
        <p className="mb-4 text-xs text-green-600 font-medium text-center">
          Statement submitted! It will appear in the discussion.
        </p>
      )}

      {/* Pass arrow */}
      <button onClick={() => swipe('up')} className="flex flex-col items-center mb-3 active:scale-95 transition-transform">
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[28px] border-b-amber-400" />
        <span className="text-xs font-bold text-amber-600 mt-0.5">Pass</span>
      </button>

      {/* Statement card */}
      <div
        {...swipeHandlers}
        style={cardStyle}
        className="w-full bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-6 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed">
          {current.text}
        </p>
      </div>

      {/* Agree / Disagree */}
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

      {/* Pro / Contra section */}
      <div className="w-full grid grid-cols-2 gap-3 mt-5">

        {/* Contra — Left — Red */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-red-500 text-center">Contra</span>
          {contras.map((n) => (
            <div key={n.id} className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl px-2 py-1.5 leading-snug">
              — {n.text}
            </div>
          ))}
          {addingType === 'contra' ? (
            <div className="space-y-1">
              <input
                autoFocus
                value={addingText}
                onChange={(e) => setAddingText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitNode('contra') }}
                placeholder="Add contra…"
                maxLength={120}
                className="w-full text-xs border border-red-300 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-300"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={() => submitNode('contra')}
                  disabled={!addingText.trim() || addingSubmitting}
                  className="text-xs text-red-600 font-bold disabled:opacity-40"
                >
                  ✓
                </button>
                <button onClick={() => { setAddingType(null); setAddingText('') }} className="text-xs text-gray-400">
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setAddingType('contra'); setAddingText('') }}
              className="self-center mt-0.5 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-500 font-bold text-base leading-none flex items-center justify-center transition-colors"
            >
              +
            </button>
          )}
        </div>

        {/* Pro — Right — Green */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-green-600 text-center">Pro</span>
          {pros.map((n) => (
            <div key={n.id} className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-xl px-2 py-1.5 leading-snug">
              + {n.text}
            </div>
          ))}
          {addingType === 'pro' ? (
            <div className="space-y-1">
              <input
                autoFocus
                value={addingText}
                onChange={(e) => setAddingText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitNode('pro') }}
                placeholder="Add pro…"
                maxLength={120}
                className="w-full text-xs border border-green-300 rounded-xl px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-300"
              />
              <div className="flex gap-1.5">
                <button
                  onClick={() => submitNode('pro')}
                  disabled={!addingText.trim() || addingSubmitting}
                  className="text-xs text-green-600 font-bold disabled:opacity-40"
                >
                  ✓
                </button>
                <button onClick={() => { setAddingType(null); setAddingText('') }} className="text-xs text-gray-400">
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => { setAddingType('pro'); setAddingText('') }}
              className="self-center mt-0.5 w-6 h-6 rounded-full bg-green-100 hover:bg-green-200 text-green-600 font-bold text-base leading-none flex items-center justify-center transition-colors"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* Mongoose */}
      <div className="mt-6 pointer-events-none">
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
    </div>
  )
}
