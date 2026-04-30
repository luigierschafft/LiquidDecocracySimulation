'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

interface Props {
  currentText: string
  nextText: string | null
}

interface DiffResult {
  only_in_a: string[]
  only_in_b: string[]
}

export function AiDiffPanel({ currentText, nextText }: Props) {
  const [result, setResult] = useState<DiffResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!nextText || loaded) return
    setLoading(true)
    fetch('/api/ev/diff-proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: currentText, next: nextText }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResult(data)
        setLoaded(true)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [currentText, nextText, loaded])

  if (!nextText) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400 text-center">This is the most recent proposal.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        Key differences to next proposal
      </h3>

      {loading && (
        <p className="text-xs text-gray-400 animate-pulse">Analysing…</p>
      )}

      {result && (
        <div className="space-y-3">
          {result.only_in_a.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Only in this proposal</p>
              <ul className="space-y-1">
                {result.only_in_a.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-green-600 font-bold mt-0.5">+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.only_in_b.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Only in next proposal</p>
              <ul className="space-y-1">
                {result.only_in_b.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                    <span className="text-red-500 font-bold mt-0.5">−</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.only_in_a.length === 0 && result.only_in_b.length === 0 && (
            <p className="text-xs text-gray-400">No significant differences found.</p>
          )}
        </div>
      )}
    </div>
  )
}
