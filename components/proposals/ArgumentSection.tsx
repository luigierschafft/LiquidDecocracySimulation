'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { Argument } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { ThumbsUp, ThumbsDown, Plus, Star } from 'lucide-react'

interface Props {
  initiativeId: string
  arguments: Argument[]
  userId: string | null
  weightingEnabled?: boolean
}

export function ArgumentSection({ initiativeId, arguments: initial, userId, weightingEnabled = false }: Props) {
  const [args, setArgs] = useState<Argument[]>(initial)
  const [stance, setStance] = useState<'pro' | 'contra'>('pro')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  // Module 42: sort by author reputation when weighting enabled
  function sortByWeight(list: Argument[]) {
    if (!weightingEnabled) return list
    return [...list].sort((a, b) => {
      const repA = (a.author as any)?.reputation_score ?? 0
      const repB = (b.author as any)?.reputation_score ?? 0
      return repB - repA
    })
  }

  const pros = sortByWeight(args.filter((a) => a.stance === 'pro'))
  const contras = sortByWeight(args.filter((a) => a.stance === 'contra'))

  async function addArgument(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim() || !userId) return
    setLoading(true)

    const { data, error } = await supabase
      .from('argument')
      .insert({ initiative_id: initiativeId, author_id: userId, stance, content: content.trim() })
      .select('*, author:member!argument_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setArgs((prev) => [...prev, data as unknown as Argument])
      setContent('')
      setShowForm(false)
    }
    setLoading(false)
  }

  function ArgCard({ arg }: { arg: Argument }) {
    const rep = (arg.author as any)?.reputation_score as number | undefined
    const isHighRep = weightingEnabled && rep != null && rep >= 50
    return (
      <div className={`rounded-lg border bg-background p-3 space-y-1.5 ${isHighRep ? 'border-accent/30' : 'border-sand'}`}>
        {isHighRep && (
          <div className="flex items-center gap-1 text-[10px] text-accent font-medium">
            <Star className="w-3 h-3 fill-accent" />
            High rep · {rep}
          </div>
        )}
        <p className="text-sm text-foreground/80 leading-relaxed">{arg.content}</p>
        <p className="text-xs text-foreground/40">
          {getMemberDisplayName(arg.author)} · {formatDate(arg.created_at)}
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-sand pt-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground/70">Arguments</h3>
        {userId && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Argument
          </button>
        )}
      </div>

      {/* Add argument form */}
      {showForm && userId && (
        <form onSubmit={addArgument} className="rounded-lg border border-accent/20 bg-accent/5 p-3 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStance('pro')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                stance === 'pro'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-sand text-foreground/50 hover:bg-green-50 border border-transparent'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Pro
            </button>
            <button
              type="button"
              onClick={() => setStance('contra')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                stance === 'contra'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-sand text-foreground/50 hover:bg-red-50 border border-transparent'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Contra
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Write a ${stance} argument…`}
            className="input w-full text-sm py-1.5 resize-none"
            rows={2}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); setContent('') }}
              className="text-xs text-foreground/50 hover:text-foreground transition-colors px-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pro column */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
            <ThumbsUp className="w-3.5 h-3.5" />
            Pro ({pros.length})
          </div>
          {pros.length === 0 ? (
            <p className="text-xs text-foreground/30 italic">No pro arguments yet.</p>
          ) : (
            pros.map((a) => <ArgCard key={a.id} arg={a} />)
          )}
        </div>

        {/* Contra column */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <ThumbsDown className="w-3.5 h-3.5" />
            Contra ({contras.length})
          </div>
          {contras.length === 0 ? (
            <p className="text-xs text-foreground/30 italic">No contra arguments yet.</p>
          ) : (
            contras.map((a) => <ArgCard key={a.id} arg={a} />)
          )}
        </div>
      </div>

      {!userId && (
        <p className="text-xs text-foreground/40">Sign in to add arguments.</p>
      )}
    </div>
  )
}
