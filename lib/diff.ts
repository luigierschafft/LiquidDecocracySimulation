export type DiffOp = { type: 'equal' | 'insert' | 'delete'; text: string }

/** Word-level LCS diff between two text strings */
export function diffWords(oldText: string, newText: string): DiffOp[] {
  const a = oldText.split(/(\s+)/).filter((s) => s.length > 0)
  const b = newText.split(/(\s+)/).filter((s) => s.length > 0)
  const m = a.length
  const n = b.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])

  // Traceback
  const rev: DiffOp[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      rev.push({ type: 'equal', text: a[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      rev.push({ type: 'insert', text: b[j - 1] })
      j--
    } else {
      rev.push({ type: 'delete', text: a[i - 1] })
      i--
    }
  }

  return rev.reverse()
}
