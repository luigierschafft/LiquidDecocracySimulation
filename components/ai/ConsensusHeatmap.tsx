'use client'

// Module 52: Consensus Heatmap — visualize member agreement per initiative
import { Flame } from 'lucide-react'

interface Initiative {
  id: string
  title: string
  votes?: { value: string; member_id: string }[]
}

interface Props {
  initiatives: Initiative[]
  currentUserId: string | null
}

export function ConsensusHeatmap({ initiatives, currentUserId }: Props) {
  if (initiatives.length === 0) return null

  function getCell(votes: { value: string; member_id: string }[] = []) {
    const total = votes.length
    if (total === 0) return { pct: 0, label: '—' }
    const approve = votes.filter((v) => v.value === 'approve').length
    const pct = Math.round((approve / total) * 100)
    return { pct, label: `${pct}%` }
  }

  return (
    <div className="card space-y-3">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Flame className="w-4 h-4 text-accent" />
        Consensus Heatmap
      </h3>
      <p className="text-xs text-foreground/50">Approval rate per proposition.</p>
      <div className="space-y-2">
        {initiatives.map((init) => {
          const { pct, label } = getCell(init.votes as any)
          const bg = pct >= 70
            ? 'bg-auro-green/20 border-auro-green/30'
            : pct >= 40
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200'
          const textColor = pct >= 70 ? 'text-auro-green' : pct >= 40 ? 'text-amber-700' : 'text-red-600'
          return (
            <div key={init.id} className={`rounded-lg border px-3 py-2 flex items-center justify-between gap-3 ${bg}`}>
              <p className="text-sm font-medium truncate">{init.title}</p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-20 h-2 bg-white/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 70 ? 'bg-auro-green' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className={`text-xs font-bold w-8 text-right ${textColor}`}>{label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
