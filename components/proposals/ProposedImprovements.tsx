'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ProposedImprovement, ImprovementVoteValue } from '@/lib/types/ev'
import { Plus, Lightbulb } from 'lucide-react'

const VOTE_OPTIONS: { value: ImprovementVoteValue; label: string; activeClass: string; baseClass: string }[] = [
  {
    value: 'approve',
    label: 'Approve',
    activeClass: 'bg-green-600 text-white border-green-600',
    baseClass: 'border-green-200 text-green-700 hover:bg-green-50',
  },
  {
    value: 'abstain',
    label: 'Abstain',
    activeClass: 'bg-gray-500 text-white border-gray-500',
    baseClass: 'border-gray-200 text-gray-600 hover:bg-gray-50',
  },
  {
    value: 'disapprove',
    label: 'Disapprove',
    activeClass: 'bg-orange-500 text-white border-orange-500',
    baseClass: 'border-orange-200 text-orange-600 hover:bg-orange-50',
  },
  {
    value: 'strong_disapproval',
    label: 'Strong No',
    activeClass: 'bg-red-600 text-white border-red-600',
    baseClass: 'border-red-200 text-red-700 hover:bg-red-50',
  },
]

const VOTE_COLORS: Record<ImprovementVoteValue, string> = {
  approve: 'bg-green-500',
  abstain: 'bg-gray-400',
  disapprove: 'bg-orange-400',
  strong_disapproval: 'bg-red-600',
}

interface ImprovementCardProps {
  improvement: ProposedImprovement
  userId: string | null
}

function ImprovementCard({ improvement, userId }: ImprovementCardProps) {
  const router = useRouter()
  const votes = improvement.votes ?? []
  const total = votes.length
  const userVote = votes.find((v) => v.user_id === userId)?.vote ?? null
  const [selected, setSelected] = useState<ImprovementVoteValue | null>(userVote)
  const [loading, setLoading] = useState(false)

  const counts = VOTE_OPTIONS.reduce((acc, o) => {
    acc[o.value] = votes.filter((v) => v.vote === o.value).length
    return acc
  }, {} as Record<ImprovementVoteValue, number>)

  async function handleVote(value: ImprovementVoteValue) {
    if (!userId || loading) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('ev_improvement_votes').upsert(
      { improvement_id: improvement.id, user_id: userId, vote: value },
      { onConflict: 'improvement_id,user_id' }
    )
    setSelected(value)
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-3 space-y-2">
      <p className="text-sm text-gray-800">{improvement.text}</p>

      {total > 0 && (
        <div className="space-y-1">
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {VOTE_OPTIONS.filter((o) => counts[o.value] > 0).map((o) => (
              <div
                key={o.value}
                className={`${VOTE_COLORS[o.value]} transition-all`}
                style={{ width: `${(counts[o.value] / total) * 100}%` }}
                title={`${o.label}: ${counts[o.value]}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {VOTE_OPTIONS.map((o) => (
              <span key={o.value} className="text-xs text-gray-400">
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${VOTE_COLORS[o.value]}`} />
                {o.label}: {counts[o.value]}
              </span>
            ))}
          </div>
        </div>
      )}

      {userId && (
        <div className="flex flex-wrap gap-1.5">
          {VOTE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleVote(opt.value)}
              disabled={loading}
              className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                selected === opt.value ? opt.activeClass : opt.baseClass
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  proposalId: string
  userId: string | null
  improvements: ProposedImprovement[]
}

export function ProposedImprovements({ proposalId, userId, improvements }: Props) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !userId) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: insertError } = await supabase.from('ev_proposed_improvements').insert({
      proposal_id: proposalId,
      text: text.trim(),
      author_id: userId,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setText('')
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
        <Lightbulb className="w-3.5 h-3.5" />
        Improvement Suggestions
      </h4>

      {improvements.length === 0 && (
        <p className="text-xs text-gray-400">No suggestions yet.</p>
      )}

      <div className="space-y-2">
        {improvements.map((imp) => (
          <ImprovementCard key={imp.id} improvement={imp} userId={userId} />
        ))}
      </div>

      {userId && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Suggest an improvement…"
            rows={2}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="self-end bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
