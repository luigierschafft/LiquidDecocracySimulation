'use client'

// Module 59: Guided Exploration — AI guide for understanding a topic
import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

const QUICK_QUESTIONS = [
  'What is this topic about?',
  'How does the voting work?',
  'What happens after a vote?',
  'Can I change my vote?',
]

interface Props {
  issueTitle: string
}

export function GuidedExploration({ issueTitle }: Props) {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function ask(q?: string) {
    const text = (q ?? question).trim()
    if (!text) return
    setLoading(true)
    setAnswer(null)
    try {
      const res = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueTitle, question: text }),
      })
      const data = await res.json()
      setAnswer(data.answer)
    } finally {
      setLoading(false)
      setQuestion('')
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Ask AI Guide
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-accent flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Guide
        </span>
        <button onClick={() => setOpen(false)} className="text-xs text-foreground/40 hover:text-foreground">close</button>
      </div>

      {/* Quick questions */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => ask(q)}
            disabled={loading}
            className="text-xs px-2.5 py-1 rounded-full border border-accent/20 text-accent hover:bg-accent/10 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Custom question */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Ask anything about this topic…"
          className="input flex-1 text-sm py-1.5"
        />
        <button
          onClick={() => ask()}
          disabled={loading || !question.trim()}
          className="btn-primary px-3 py-1.5 disabled:opacity-60"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {(loading || answer) && (
        <div className="text-sm text-foreground/80 leading-relaxed bg-white/60 rounded-lg p-3">
          {loading ? <span className="text-accent animate-pulse">Thinking…</span> : answer}
        </div>
      )}
    </div>
  )
}
