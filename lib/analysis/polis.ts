// Polis-style discussion analysis
// Implements: participation stats, PCA (opinion map), k-means clustering,
// consensus/divisive statement detection — pure TypeScript, no dependencies.

export interface Rating {
  user_id: string
  statement_id: string
  rating: number
}

export interface Statement {
  id: string
  text: string
}

export interface StatementStat {
  id: string
  text: string
  avgRating: number
  stdDev: number
  voteCount: number
}

export interface ScatterPoint {
  x: number
  y: number
  group: number
}

export interface OpinionGroup {
  id: number
  size: number
  color: string
  // statements this group rates notably high or low vs overall avg
  distinctHigh: { text: string; groupAvg: number; overallAvg: number }[]
  distinctLow:  { text: string; groupAvg: number; overallAvg: number }[]
}

export interface AnalysisResult {
  participants: number
  totalVotes: number
  statements: StatementStat[]
  // sorted by avgRating desc — top agreements
  consensus: StatementStat[]
  // sorted by stdDev desc — most contested
  divisive: StatementStat[]
  // scatter plot points (one per participant), empty if < 3 participants
  scatter: ScatterPoint[]
  groups: OpinionGroup[]
}

const GROUP_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e']

export function analyze(ratings: Rating[], statements: Statement[]): AnalysisResult {
  const userIds   = Array.from(new Set(ratings.map((r) => r.user_id)))
  const statIds   = statements.map((s) => s.id)
  const n = userIds.length
  const m = statIds.length

  // ── Matrix: users × statements (null = not rated) ─────────────────────────
  const matrix: (number | null)[][] = userIds.map((uid) =>
    statIds.map((sid) => {
      const r = ratings.find((r) => r.user_id === uid && r.statement_id === sid)
      return r?.rating ?? null
    })
  )

  // ── Per-statement stats ────────────────────────────────────────────────────
  const statementStats: StatementStat[] = statements.map((s, j) => {
    const vals = matrix.map((row) => row[j]).filter((v): v is number => v !== null)
    const avg  = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    const std  = vals.length > 1
      ? Math.sqrt(vals.reduce((a, b) => a + (b - avg) ** 2, 0) / vals.length)
      : 0
    return { id: s.id, text: s.text, avgRating: avg, stdDev: std, voteCount: vals.length }
  }).filter((s) => s.voteCount > 0)

  const consensus = [...statementStats].sort((a, b) => b.avgRating - a.avgRating)
  const divisive  = [...statementStats].sort((a, b) => b.stdDev - a.stdDev)

  // ── PCA + clustering ───────────────────────────────────────────────────────
  let scatter: ScatterPoint[] = []
  let groups:  OpinionGroup[] = []

  if (n >= 3 && m >= 2) {
    const points = pcaProject(matrix, m)
    const k      = n >= 6 ? 2 : 1
    const labels = k > 1 ? kmeans(points, k) : points.map(() => 0)

    // Normalise points to [-1, 1] for display
    const xs = points.map((p) => p[0])
    const ys = points.map((p) => p[1])
    const xRange = Math.max(...xs) - Math.min(...xs) || 1
    const yRange = Math.max(...ys) - Math.min(...ys) || 1
    const xMin   = Math.min(...xs)
    const yMin   = Math.min(...ys)

    scatter = points.map((p, i) => ({
      x: ((p[0] - xMin) / xRange) * 2 - 1,
      y: ((p[1] - yMin) / yRange) * 2 - 1,
      group: labels[i],
    }))

    // Per-group stats
    for (let g = 0; g < k; g++) {
      const memberIdxs  = userIds.map((_, i) => i).filter((i) => labels[i] === g)
      const groupMatrix = memberIdxs.map((i) => matrix[i])

      const groupStmtStats = statements.map((s, j) => {
        const vals      = groupMatrix.map((row) => row[j]).filter((v): v is number => v !== null)
        const groupAvg  = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null
        const overall   = statementStats.find((ss) => ss.id === s.id)
        return { text: s.text, groupAvg, overallAvg: overall?.avgRating ?? 0 }
      }).filter((s) => s.groupAvg !== null) as { text: string; groupAvg: number; overallAvg: number }[]

      const sorted       = [...groupStmtStats].sort((a, b) => b.groupAvg - a.groupAvg)
      const distinctHigh = sorted.filter((s) => s.groupAvg - s.overallAvg > 0.5).slice(0, 3)
      const distinctLow  = [...sorted].reverse().filter((s) => s.overallAvg - s.groupAvg > 0.5).slice(0, 3)

      groups.push({
        id:    g,
        size:  memberIdxs.length,
        color: GROUP_COLORS[g] ?? '#6b7280',
        distinctHigh,
        distinctLow,
      })
    }
  }

  return {
    participants: n,
    totalVotes:   ratings.length,
    statements:   statementStats,
    consensus,
    divisive,
    scatter,
    groups,
  }
}

// ── PCA helpers ──────────────────────────────────────────────────────────────

function prepareMatrix(matrix: (number | null)[][], m: number): number[][] {
  const colMeans = Array.from({ length: m }, (_, j) => {
    const vals = matrix.map((row) => row[j]).filter((v): v is number => v !== null)
    return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 5
  })
  return matrix.map((row) => row.map((v, j) => (v ?? colMeans[j]) - colMeans[j]))
}

function pcaProject(matrix: (number | null)[][], m: number): [number, number][] {
  const M = prepareMatrix(matrix, m)
  const n = M.length
  if (n === 0 || m === 0) return M.map(() => [0, 0])

  // Covariance matrix: C = M^T M / n  (m × m)
  const C: number[][] = Array.from({ length: m }, (_, a) =>
    Array.from({ length: m }, (_, b) => {
      let s = 0
      for (let i = 0; i < n; i++) s += M[i][a] * M[i][b]
      return s / n
    })
  )

  const ev1      = powerIter(C, m)
  const deflated = deflate(C, ev1, m)
  const ev2      = powerIter(deflated, m)

  return M.map((row) => [
    row.reduce((s, v, j) => s + v * ev1[j], 0),
    row.reduce((s, v, j) => s + v * ev2[j], 0),
  ])
}

function powerIter(C: number[][], n: number, iters = 80): number[] {
  // deterministic seed: start with all-ones normalised
  let v = new Array(n).fill(1 / Math.sqrt(n))
  for (let iter = 0; iter < iters; iter++) {
    const next = new Array(n).fill(0)
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        next[i] += C[i][j] * v[j]
    const norm = Math.sqrt(next.reduce((s, x) => s + x * x, 0)) || 1
    v = next.map((x) => x / norm)
  }
  return v
}

function deflate(C: number[][], v: number[], n: number): number[][] {
  const lambda = v.reduce(
    (s, vi, i) => s + vi * v.reduce((ss, vj, j) => ss + C[i][j] * vj, 0),
    0
  )
  return C.map((row, i) => row.map((val, j) => val - lambda * v[i] * v[j]))
}

// ── K-means ──────────────────────────────────────────────────────────────────

function kmeans(points: [number, number][], k: number, maxIters = 100): number[] {
  // deterministic init: spread evenly across sorted x
  const sorted  = [...points].map((p, i) => ({ p, i })).sort((a, b) => a.p[0] - b.p[0])
  let centroids: [number, number][] = Array.from({ length: k }, (_, g) => {
    const idx = Math.floor((g + 0.5) * (sorted.length / k))
    return sorted[Math.min(idx, sorted.length - 1)].p
  })

  let labels = points.map(() => 0)

  for (let iter = 0; iter < maxIters; iter++) {
    const newLabels = points.map((p) => {
      let best = 0, bestDist = Infinity
      centroids.forEach(([cx, cy], g) => {
        const d = (p[0] - cx) ** 2 + (p[1] - cy) ** 2
        if (d < bestDist) { bestDist = d; best = g }
      })
      return best
    })

    if (newLabels.every((l, i) => l === labels[i])) break
    labels = newLabels

    centroids = Array.from({ length: k }, (_, g) => {
      const pts = points.filter((_, i) => labels[i] === g)
      if (pts.length === 0) return centroids[g]
      return [
        pts.reduce((s, p) => s + p[0], 0) / pts.length,
        pts.reduce((s, p) => s + p[1], 0) / pts.length,
      ]
    })
  }

  return labels
}
