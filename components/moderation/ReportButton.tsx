'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Flag } from 'lucide-react'

type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'off_topic' | 'other'

type TargetType = 'opinion' | 'argument' | 'initiative'

interface Props {
  targetType: TargetType
  targetId: string
  userId: string
}

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Spam' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'misinformation', label: 'Misinformation' },
  { value: 'off_topic', label: 'Off topic' },
  { value: 'other', label: 'Other' },
]

export function ReportButton({ targetType, targetId, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function submit(reason: ReportReason) {
    setLoading(true)
    const payload: Record<string, unknown> = {
      reporter_id: userId,
      reason,
    }
    if (targetType === 'opinion') payload.opinion_id = targetId
    else if (targetType === 'argument') payload.argument_id = targetId
    else payload.initiative_id = targetId

    await supabase.from('content_report').insert(payload)
    setSubmitted(true)
    setOpen(false)
    setLoading(false)
  }

  if (submitted) {
    return (
      <span className="flex items-center gap-1 text-xs text-foreground/30 font-medium">
        <Flag className="w-3 h-3" />
        Reported
      </span>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-foreground/30 hover:text-red-400 transition-colors font-medium"
        title="Report this content"
      >
        <Flag className="w-3 h-3" />
        Report
      </button>

      {open && (
        <div className="absolute left-0 top-5 z-10 bg-white border border-sand rounded-lg shadow-lg py-1 min-w-[140px]">
          {REASONS.map((r) => (
            <button
              key={r.value}
              onClick={() => submit(r.value)}
              disabled={loading}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-sand transition-colors text-foreground/70"
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="w-full text-left px-3 py-1.5 text-xs text-foreground/30 hover:bg-sand transition-colors border-t border-sand mt-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
