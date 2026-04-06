'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import type { VoteValue } from '@/lib/types'
import { cn } from '@/lib/utils'
import { ThumbsUp, ThumbsDown, Minus, XCircle } from 'lucide-react'

interface VoteButtonProps {
  initiativeId: string
  currentVote: VoteValue | null
  onVote?: (value: VoteValue) => void
  strongNoEnabled?: boolean
}

const baseOptions: { value: VoteValue; label: string; icon: React.ReactNode; active: string; hover: string }[] = [
  {
    value: 'approve',
    label: 'Approve',
    icon: <ThumbsUp className="w-4 h-4" />,
    active: 'bg-auro-green text-white border-auro-green',
    hover: 'hover:border-auro-green hover:text-auro-green',
  },
  {
    value: 'abstain',
    label: 'Abstain',
    icon: <Minus className="w-4 h-4" />,
    active: 'bg-stone-400 text-white border-stone-400',
    hover: 'hover:border-stone-400 hover:text-stone-500',
  },
  {
    value: 'oppose',
    label: 'Oppose',
    icon: <ThumbsDown className="w-4 h-4" />,
    active: 'bg-red-500 text-white border-red-500',
    hover: 'hover:border-red-400 hover:text-red-500',
  },
  {
    value: 'strong_no',
    label: 'Strong No',
    icon: <XCircle className="w-4 h-4" />,
    active: 'bg-red-900 text-white border-red-900',
    hover: 'hover:border-red-800 hover:text-red-900',
  },
]

export function VoteButton({ initiativeId, currentVote, onVote, strongNoEnabled = false }: VoteButtonProps) {
  const options = strongNoEnabled ? baseOptions : baseOptions.filter((o) => o.value !== 'strong_no')
  const [selected, setSelected] = useState<VoteValue | null>(currentVote)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleVote(value: VoteValue) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    const { error } = await supabase
      .from('vote')
      .upsert({ initiative_id: initiativeId, member_id: user.id, value }, { onConflict: 'initiative_id,member_id' })

    if (!error) {
      setSelected(value)
      onVote?.(value)
    }
    setLoading(false)
  }

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleVote(opt.value)}
          disabled={loading}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
            selected === opt.value ? opt.active : `border-sand bg-white text-foreground/60 ${opt.hover}`,
            'disabled:opacity-50'
          )}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
