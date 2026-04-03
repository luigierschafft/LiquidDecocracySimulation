import type { VoteCount } from '@/lib/types'

interface Props {
  votes: VoteCount
}

export function AlignmentMeter({ votes }: Props) {
  const pct = votes.total > 0 ? Math.round(votes.approvalPercent) : null

  const color =
    pct === null ? '#9ca3af'
    : pct >= 70 ? '#22c55e'
    : pct >= 40 ? '#f59e0b'
    : '#ef4444'

  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = pct !== null ? circumference * (1 - pct / 100) : circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="7"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text
          x="36"
          y="36"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="700"
          fill={color}
        >
          {pct !== null ? `${pct}%` : '—'}
        </text>
      </svg>
      <p className="text-xs text-foreground/50 font-medium">alignment</p>
    </div>
  )
}
