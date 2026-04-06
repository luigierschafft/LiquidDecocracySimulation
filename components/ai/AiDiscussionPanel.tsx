'use client'

// Module 44: Argument Extraction
// Module 45: Pro/Con Detection
// Module 46: Gap Detection
// Module 49: Opinion Clustering
// Module 50: Consensus Suggestions
import { useState } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'

type Mode = 'extract' | 'proCon' | 'gaps' | 'cluster' | 'consensus'

interface Props {
  issueId: string
  extractionEnabled?: boolean
  proConEnabled?: boolean
  gapDetectionEnabled?: boolean
  clusteringEnabled?: boolean
  consensusEnabled?: boolean
}

const MODE_CONFIG: Record<Mode, { label: string; apiPath: string; bodyExtra?: Record<string, unknown> }> = {
  extract:   { label: 'Key Arguments', apiPath: '/api/ai/analyze', bodyExtra: { mode: 'extract' } },
  proCon:    { label: 'Pro/Con Split', apiPath: '/api/ai/analyze', bodyExtra: { mode: 'proCon' } },
  gaps:      { label: 'Missing Perspectives', apiPath: '/api/ai/analyze', bodyExtra: { mode: 'gaps' } },
  cluster:   { label: 'Cluster Opinions', apiPath: '/api/ai/cluster', bodyExtra: { mode: 'cluster' } },
  consensus: { label: 'Suggest Compromise', apiPath: '/api/ai/cluster', bodyExtra: { mode: 'consensus' } },
}

export function AiDiscussionPanel({
  issueId,
  extractionEnabled,
  proConEnabled,
  gapDetectionEnabled,
  clusteringEnabled,
  consensusEnabled,
}: Props) {
  const [activeMode, setActiveMode] = useState<Mode | null>(null)
  const [results, setResults] = useState<Partial<Record<Mode, string>>>({})
  const [loading, setLoading] = useState<Mode | null>(null)

  const available: Mode[] = [
    ...(extractionEnabled ? ['extract' as Mode] : []),
    ...(proConEnabled ? ['proCon' as Mode] : []),
    ...(gapDetectionEnabled ? ['gaps' as Mode] : []),
    ...(clusteringEnabled ? ['cluster' as Mode] : []),
    ...(consensusEnabled ? ['consensus' as Mode] : []),
  ]

  if (available.length === 0) return null

  async function run(mode: Mode) {
    if (results[mode]) { setActiveMode(mode); return }
    setLoading(mode)
    setActiveMode(mode)
    const cfg = MODE_CONFIG[mode]
    try {
      const res = await fetch(cfg.apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueId, ...cfg.bodyExtra }),
      })
      const data = await res.json()
      setResults((prev) => ({ ...prev, [mode]: data.result }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-accent/10 flex-wrap">
        <Sparkles className="w-4 h-4 text-accent flex-shrink-0" />
        <span className="text-xs font-semibold text-accent mr-1">AI Analysis</span>
        {available.map((mode) => (
          <button
            key={mode}
            onClick={() => run(mode)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              activeMode === mode
                ? 'bg-accent text-white border-accent'
                : 'border-accent/30 text-accent hover:bg-accent/10'
            }`}
          >
            {MODE_CONFIG[mode].label}
          </button>
        ))}
      </div>
      {activeMode && (
        <div className="px-4 py-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-line min-h-[3rem]">
          {loading === activeMode ? (
            <span className="text-accent animate-pulse">Analyzing…</span>
          ) : (
            results[activeMode] ?? ''
          )}
        </div>
      )}
    </div>
  )
}
