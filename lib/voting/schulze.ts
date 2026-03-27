/**
 * Schulze Method (Beatpath) — Floyd-Warshall O(n³)
 * Input: pairwise preference matrix d[i][j] = number of voters who prefer i over j
 * Returns: ranking of candidate indices (best first)
 */
export function schulze(preferences: number[][]): number[] {
  const n = preferences.length
  if (n === 0) return []
  if (n === 1) return [0]

  // Build strongest path matrix
  const p: number[][] = Array.from({ length: n }, () => new Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        p[i][j] = preferences[i][j] > preferences[j][i] ? preferences[i][j] : 0
      }
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j && i !== k && j !== k) {
          p[i][j] = Math.max(p[i][j], Math.min(p[i][k], p[k][j]))
        }
      }
    }
  }

  // Calculate wins for each candidate
  const wins = new Array(n).fill(0)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && p[i][j] > p[j][i]) wins[i]++
    }
  }

  // Sort by wins descending
  return Array.from({ length: n }, (_, i) => i).sort((a, b) => wins[b] - wins[a])
}

/**
 * Build preference matrix from ranked ballots
 * ballots: array of arrays — each ballot is an ordered list of initiative indices (best first)
 */
export function buildPreferenceMatrix(ballots: number[][], candidateCount: number): number[][] {
  const d: number[][] = Array.from({ length: candidateCount }, () =>
    new Array(candidateCount).fill(0)
  )
  for (const ballot of ballots) {
    for (let i = 0; i < ballot.length; i++) {
      for (let j = i + 1; j < ballot.length; j++) {
        d[ballot[i]][ballot[j]]++
      }
    }
  }
  return d
}
