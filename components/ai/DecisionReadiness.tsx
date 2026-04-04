'use client'

// Module 58: Decision Readiness — show how ready a topic is for a vote
import { useState } from 'react'
import { Sparkles, TrendingUp } from 'lucide-react'

interface Props {
  issueId: string
}

interface Readiness {
  score: number
  assessment: string
  missing: string
}

export function DecisionReadiness({ issueId }: Props) {
  const [data, setData] = useState<Readiness | null>(null)
  const [loading, setLoading] = useState(false)

  async function check() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/decision-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId }),
      })
      setData(await res.json())
    } finally {
      setLoading(false)
    }
  }

  const color = data
    ? data.score >= 70 ? 'text-auro-green' : data.score >= 40 ? 'text-amber-600' : 'text-red-500'
    : ''

  const barColor = data
    ? data.score >= 70 ? 'bg-auro-green' : data.score >= 40 ? 'bg-amber-400' : 'bg-red-400'
    : 'bg-accent'

  return (
    <div className="card space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Decision Readiness
        </h3>
        <button
          onClick={check}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/20 hover:bg-accent/5 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-60"
        >
          <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Checking…' : data ? 'Refresh' : 'Check'}
        </button>
      </div>

      {data && (
        <>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/50">Readiness score</span>
              <span className={`text-2xl font-bold ${color}`}>{data.score}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${barColor}`}
                style={{ width: `${data.score}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-foreground/70">{data.assessment}</p>
          {data.missing && (
            <p className="text-xs text-foreground/50 border-t border-sand pt-2">
              <span className="font-medium">Still needed:</span> {data.missing}
            </p>
          )}
        </>
      )}
    </div>
  )
}
