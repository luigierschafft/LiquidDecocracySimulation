'use client'

interface Props {
  currentText: string
  nextText: string | null
}

type DiffPart = { text: string; type: 'same' | 'added' | 'removed' }

function computeWordDiff(a: string, b: string): DiffPart[] {
  const wordsA = a.split(/(\s+)/)
  const wordsB = b.split(/(\s+)/)

  // LCS-based simple diff
  const m = wordsA.length
  const n = wordsB.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsA[i - 1] === wordsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack
  const parts: DiffPart[] = []
  let i = m,
    j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      parts.unshift({ text: wordsA[i - 1], type: 'same' })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      parts.unshift({ text: wordsB[j - 1], type: 'added' })
      j--
    } else {
      parts.unshift({ text: wordsA[i - 1], type: 'removed' })
      i--
    }
  }

  // Merge consecutive same parts for readability
  const merged: DiffPart[] = []
  for (const part of parts) {
    const last = merged[merged.length - 1]
    if (last && last.type === part.type) {
      last.text += part.text
    } else {
      merged.push({ ...part })
    }
  }
  return merged
}

export function AiDiffPanel({ currentText, nextText }: Props) {
  if (!nextText) {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 h-full flex items-center justify-center">
        <p className="text-xs text-gray-400 text-center">Dies ist der aktuellste Proposal.</p>
      </div>
    )
  }

  const parts = computeWordDiff(currentText, nextText)
  const hasChanges = parts.some((p) => p.type !== 'same')

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Unterschiede zum nächsten Proposal
      </h3>
      {!hasChanges ? (
        <p className="text-xs text-gray-400">Keine Unterschiede.</p>
      ) : (
        <p className="text-sm leading-relaxed">
          {parts.map((part, i) => {
            if (part.type === 'same') {
              return <span key={i} className="text-gray-700">{part.text}</span>
            }
            if (part.type === 'added') {
              return (
                <span key={i} className="bg-green-100 text-green-800 rounded px-0.5">
                  {part.text}
                </span>
              )
            }
            return (
              <span key={i} className="bg-red-100 text-red-700 line-through rounded px-0.5">
                {part.text}
              </span>
            )
          })}
        </p>
      )}
    </div>
  )
}
