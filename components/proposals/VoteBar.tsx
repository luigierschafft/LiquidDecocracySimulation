import type { VoteCount } from '@/lib/types'
import { CheckCircle2 } from 'lucide-react'

interface VoteBarProps {
  votes: VoteCount
  quorum?: number
  showLowResistance?: boolean
}

export function VoteBar({ votes, quorum, showLowResistance }: VoteBarProps) {
  const { approve, oppose, abstain, total, approvalPercent } = votes
  const approvePct = total > 0 ? (approve / total) * 100 : 0
  const opposePct = total > 0 ? (oppose / total) * 100 : 0
  const abstainPct = total > 0 ? (abstain / total) * 100 : 0

  const quorumMet = quorum !== undefined && total >= quorum
  const lowResistance = showLowResistance && total > 0 && opposePct < 20 && approvePct > 50

  return (
    <div className="space-y-2">
      {/* Low resistance indicator */}
      {lowResistance && (
        <div className="flex items-center gap-1.5 text-xs text-auro-green font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Low resistance — broad consensus forming
        </div>
      )}

      {/* Vote bar */}
      <div className="flex h-3 rounded-full overflow-hidden bg-stone-100">
        {approvePct > 0 && (
          <div className="bg-auro-green transition-all" style={{ width: `${approvePct}%` }} title={`Approve: ${approve}`} />
        )}
        {abstainPct > 0 && (
          <div className="bg-stone-300 transition-all" style={{ width: `${abstainPct}%` }} title={`Abstain: ${abstain}`} />
        )}
        {opposePct > 0 && (
          <div className="bg-red-400 transition-all" style={{ width: `${opposePct}%` }} title={`Oppose: ${oppose}`} />
        )}
      </div>

      {/* Stats row */}
      <div className="flex justify-between text-xs text-foreground/50">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-auro-green inline-block" />
          {approve} approve ({approvalPercent}%)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-stone-300 inline-block" />
          {abstain} abstain
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
          {oppose} oppose
        </span>
      </div>

      {/* Quorum indicator */}
      {quorum !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${quorumMet ? 'bg-auro-green' : 'bg-amber-400'}`}
              style={{ width: `${Math.min((total / quorum) * 100, 100)}%` }}
            />
          </div>
          <span className={quorumMet ? 'text-auro-green font-medium' : 'text-foreground/40'}>
            {total} / {quorum} quorum {quorumMet ? '✓' : ''}
          </span>
        </div>
      )}
    </div>
  )
}
