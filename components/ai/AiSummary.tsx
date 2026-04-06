'use client'

// Module 43: AI Summaries
import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  issueId: string
}

export function AiSummary({ issueId }: Props) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId }),
      })
      const data = await res.json()
      setSummary(data.summary)
    } finally {
      setLoading(false)
    }
  }

  if (!summary) {
    return (
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center gap-1.5 text-sm font-medium text-accent border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
      >
        <Sparkles className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
        {loading ? 'Summarizing…' : 'AI Summary'}
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-accent hover:bg-accent/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Summary
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          {summary}
          <div className="mt-3 pt-3 border-t border-accent/10">
            <button
              onClick={generate}
              disabled={loading}
              className="text-xs text-accent hover:underline disabled:opacity-60"
            >
              {loading ? 'Refreshing…' : 'Refresh summary'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
