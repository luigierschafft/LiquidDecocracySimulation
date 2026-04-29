'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Opinion } from '@/lib/types'
import { ThumbsUp, ThumbsDown, Plus, Send } from 'lucide-react'
import { PostVoteButton } from './PostVoteButton'

function interpolateColor(t: number): string {
  const r = Math.round(255 + (124 - 255) * t)
  const g = Math.round(255 + (58 - 255) * t)
  const b = Math.round(255 + (237 - 255) * t)
  return `rgb(${r},${g},${b})`
}

function MiniScale({ opinionId, userId }: { opinionId: string; userId: string | null }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!userId || initialized) return
    const supabase = createClient()
    supabase
      .from('opinion_ratings')
      .select('rating')
      .eq('opinion_id', opinionId)
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSelected(data.rating)
        setInitialized(true)
      })
  }, [opinionId, userId, initialized])

  async function handleClick(val: number) {
    if (loading) return
    const next = val === selected ? null : val
    setSelected(next)
    if (!userId) return
    setLoading(true)
    const supabase = createClient()
    if (next === null) {
      await supabase.from('opinion_ratings').delete().eq('opinion_id', opinionId).eq('user_id', userId)
    } else {
      await supabase.from('opinion_ratings').upsert(
        { opinion_id: opinionId, user_id: userId, rating: next },
        { onConflict: 'opinion_id,user_id' }
      )
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 11 }, (_, i) => i).map((val) => (
        <button
          key={val}
          onClick={() => handleClick(val)}
          title={`${val}/10`}
          disabled={loading}
          style={{ backgroundColor: interpolateColor(val / 10) }}
          className={`w-3.5 h-3.5 rounded-sm transition-all border flex items-center justify-center ${
            selected === val ? 'border-purple-700 scale-110' : 'border-transparent hover:border-purple-400'
          }`}
        >
          {selected === val && (
            <span className={`text-[8px] font-bold leading-none ${val >= 6 ? 'text-white' : 'text-purple-900'}`}>{val}</span>
          )}
        </button>
      ))}
    </div>
  )
}

interface Props {
  issueId: string
  opinions: Opinion[]
  userId: string | null
  postVotingEnabled?: boolean
}

export function ProContraSection({ issueId, opinions: initial, userId, postVotingEnabled = false }: Props) {
  const [opinions, setOpinions] = useState<Opinion[]>(initial)
  const [addingSide, setAddingSide] = useState<'support' | 'concern' | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const pros = opinions.filter((o) => o.intent === 'support' && !o.parent_id)
  const cons = opinions.filter((o) => o.intent === 'concern' && !o.parent_id)

  async function addArgument() {
    if (!text.trim() || !userId || !addingSide) return
    setLoading(true)

    const { data, error } = await supabase
      .from('opinion')
      .insert({
        issue_id: issueId,
        author_id: userId,
        content: text.trim(),
        intent: addingSide,
      })
      .select('*, author:member!opinion_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setOpinions((prev) => [...prev, data as unknown as Opinion])
      setText('')
      setAddingSide(null)
    }
    setLoading(false)
  }

  function ArgumentCard({ op }: { op: Opinion }) {
    return (
      <div className="bg-background rounded-lg border border-sand p-3 space-y-1.5">
        <p className="text-sm text-foreground/85 leading-snug">{op.content}</p>
        <div className="flex items-center justify-between gap-2">
          <MiniScale opinionId={op.id} userId={userId} />
          {postVotingEnabled && (
            <PostVoteButton
              targetType="opinion"
              targetId={op.id}
              initialCount={(op as any)._vote_count ?? 0}
              initialVoted={(op as any)._user_voted ?? false}
              userId={userId}
            />
          )}
        </div>
      </div>
    )
  }

  function AddForm({ side }: { side: 'support' | 'concern' }) {
    const active = addingSide === side
    const color = side === 'support' ? 'text-auro-green' : 'text-red-500'
    const label = side === 'support' ? 'Add Pro argument' : 'Add Contra argument'

    if (!active) {
      return (
        <button
          onClick={() => { setAddingSide(side); setText('') }}
          className={`flex items-center gap-1.5 text-xs font-medium ${color} opacity-60 hover:opacity-100 transition-opacity mt-1`}
        >
          <Plus className="w-3.5 h-3.5" />
          {label}
        </button>
      )
    }

    return (
      <div className="flex gap-1.5 mt-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`${side === 'support' ? 'Pro' : 'Contra'}: why?`}
          className="input flex-1 text-sm py-1.5"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addArgument() }
            if (e.key === 'Escape') setAddingSide(null)
          }}
        />
        <button
          onClick={addArgument}
          disabled={loading || !text.trim()}
          className="btn-primary px-2.5 py-1.5"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="font-semibold text-base flex items-center gap-2 mb-4">
        <ThumbsUp className="w-4 h-4 text-auro-green" />
        Pro / Contra
        <ThumbsDown className="w-4 h-4 text-red-400 ml-0.5" />
        <span className="text-sm font-normal text-foreground/40 ml-1">
          {pros.length} pro · {cons.length} contra
        </span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PRO */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-auro-green font-semibold text-sm">
            <ThumbsUp className="w-3.5 h-3.5" />
            Pro
          </div>
          {pros.length === 0 && (
            <p className="text-xs text-foreground/30 italic">No pro arguments yet.</p>
          )}
          {pros.map((op) => <ArgumentCard key={op.id} op={op} />)}
          {userId && <AddForm side="support" />}
        </div>

        {/* CONTRA */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-red-500 font-semibold text-sm">
            <ThumbsDown className="w-3.5 h-3.5" />
            Contra
          </div>
          {cons.length === 0 && (
            <p className="text-xs text-foreground/30 italic">No contra arguments yet.</p>
          )}
          {cons.map((op) => <ArgumentCard key={op.id} op={op} />)}
          {userId && <AddForm side="concern" />}
        </div>
      </div>
    </div>
  )
}
