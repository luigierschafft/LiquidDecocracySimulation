import type { VoteCount } from '@/lib/types'

interface VoteBarProps {
  votes: VoteCount
}

export function VoteBar({ votes }: VoteBarProps) {
  const { approve, oppose, abstain, total, approvalPercent } = votes
  const approvePct = total > 0 ? (approve / total) * 100 : 0
  const opposePct = total > 0 ? (oppose / total) * 100 : 0
  const abstainPct = total > 0 ? (abstain / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex h-3 rounded-full overflow-hidden bg-stone-100">
        {approvePct > 0 && (
          <div
            className="bg-auro-green transition-all"
            style={{ width: `${approvePct}%` }}
            title={`Approve: ${approve}`}
          />
        )}
        {abstainPct > 0 && (
          <div
            className="bg-stone-300 transition-all"
            style={{ width: `${abstainPct}%` }}
            title={`Abstain: ${abstain}`}
          />
        )}
        {opposePct > 0 && (
          <div
            className="bg-red-400 transition-all"
            style={{ width: `${opposePct}%` }}
            title={`Oppose: ${oppose}`}
          />
        )}
      </div>
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
      <p className="text-xs text-foreground/40">{total} vote{total !== 1 ? 's' : ''} total</p>
    </div>
  )
}
