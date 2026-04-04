'use client'

// Module 47: AI Proposal Improvement
// Module 53: Perspective Switch
// Module 54: Auto Debater
// Module 55: Truth Layer / Module 60: Fact Checking
// Module 56: Argument Merger
// Module 57: Bias Breaker
import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

type AiTool = 'improve' | 'perspective' | 'debate' | 'factcheck' | 'merge' | 'bias'

interface Props {
  initiativeId: string
  title: string
  content: string
  improvementEnabled?: boolean
  perspectiveEnabled?: boolean
  debateEnabled?: boolean
  factCheckEnabled?: boolean
  mergeEnabled?: boolean
  biasEnabled?: boolean
}

export function AiProposalTools({
  initiativeId, title, content,
  improvementEnabled, perspectiveEnabled, debateEnabled,
  factCheckEnabled, mergeEnabled, biasEnabled,
}: Props) {
  const [result, setResult] = useState<{ tool: AiTool; text: string } | null>(null)
  const [loading, setLoading] = useState<AiTool | null>(null)

  const tools: { key: AiTool; label: string }[] = (
    [
      { key: 'improve'     as AiTool, label: 'Improve',     enabled: improvementEnabled },
      { key: 'factcheck'   as AiTool, label: 'Fact Check',   enabled: factCheckEnabled },
      { key: 'perspective' as AiTool, label: 'Perspectives', enabled: perspectiveEnabled },
      { key: 'debate'      as AiTool, label: 'Counterargs',  enabled: debateEnabled },
      { key: 'bias'        as AiTool, label: 'Bias Check',   enabled: biasEnabled },
      { key: 'merge'       as AiTool, label: 'Merge Args',   enabled: mergeEnabled },
    ] as { key: AiTool; label: string; enabled?: boolean }[]
  ).filter((t) => t.enabled)

  if (tools.length === 0) return null

  async function run(tool: AiTool) {
    setLoading(tool)
    try {
      let url = '', body: Record<string, unknown> = {}
      if (tool === 'improve')     { url = '/api/ai/improve-proposal'; body = { title, content } }
      if (tool === 'factcheck')   { url = '/api/ai/fact-check'; body = { content } }
      if (tool === 'perspective') { url = '/api/ai/challenge'; body = { content, mode: 'perspective' } }
      if (tool === 'debate')      { url = '/api/ai/challenge'; body = { content, mode: 'debate' } }
      if (tool === 'bias')        { url = '/api/ai/challenge'; body = { content, mode: 'bias' } }
      if (tool === 'merge')       { url = '/api/ai/merge-args'; body = { initiativeId } }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResult({ tool, text: data.suggestions ?? data.result ?? '' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="border-t border-sand pt-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <span className="text-xs font-semibold text-accent">AI Tools</span>
        {tools.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => run(key)}
            disabled={loading === key}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              result?.tool === key
                ? 'bg-accent text-white border-accent'
                : 'border-accent/30 text-accent hover:bg-accent/10'
            } disabled:opacity-60`}
          >
            {loading === key ? '…' : label}
          </button>
        ))}
      </div>
      {result && (
        <div className="relative rounded-lg bg-accent/5 border border-accent/20 p-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
          <button
            onClick={() => setResult(null)}
            className="absolute top-2 right-2 text-foreground/30 hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {result.text}
        </div>
      )}
    </div>
  )
}
