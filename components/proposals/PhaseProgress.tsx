import { CheckCircle2, Circle } from 'lucide-react'

const PHASES = [
  { key: 'admission',    label: 'Discussion' },
  { key: 'discussion',   label: 'Proposition' },
  { key: 'voting',       label: 'Voting' },
  { key: 'closed',       label: 'Closed' },
  { key: 'elaboration',  label: 'Elaboration' },
] as const

type PhaseKey = (typeof PHASES)[number]['key']

const PHASE_ORDER: PhaseKey[] = ['admission', 'discussion', 'voting', 'closed', 'elaboration']

interface Props {
  currentStatus: string
  hasElaboration: boolean
}

export function PhaseProgress({ currentStatus, hasElaboration }: Props) {
  const currentIdx = PHASE_ORDER.indexOf(
    currentStatus === 'verification' ? 'discussion' : (currentStatus as PhaseKey)
  )
  // If closed and has an elaboration document, treat elaboration as current
  const effectiveIdx = currentStatus === 'closed' && hasElaboration
    ? PHASE_ORDER.indexOf('elaboration')
    : currentIdx

  const visiblePhases = hasElaboration || currentStatus === 'closed'
    ? PHASES
    : PHASES.filter((p) => p.key !== 'elaboration')

  return (
    <div className="flex items-center gap-0 overflow-x-auto">
      {visiblePhases.map((phase, i) => {
        const phaseIdx = PHASE_ORDER.indexOf(phase.key)
        const isPast    = phaseIdx < effectiveIdx
        const isCurrent = phaseIdx === effectiveIdx
        const isFuture  = phaseIdx > effectiveIdx

        return (
          <div key={phase.key} className="flex items-center">
            {/* Step */}
            <div className="flex flex-col items-center gap-1 min-w-[70px]">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 transition-colors ${
                isCurrent
                  ? 'bg-accent border-accent text-white'
                  : isPast
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-transparent border-foreground/20 text-foreground/30'
              }`}>
                {isPast
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <Circle className={`w-3.5 h-3.5 ${isCurrent ? 'fill-white' : ''}`} />
                }
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${
                isCurrent
                  ? 'text-accent'
                  : isPast
                  ? 'text-foreground/50'
                  : 'text-foreground/25'
              }`}>
                {phase.label}
              </span>
            </div>

            {/* Connector line (not after last item) */}
            {i < visiblePhases.length - 1 && (
              <div className={`h-0.5 w-8 mb-4 flex-shrink-0 ${
                phaseIdx < effectiveIdx ? 'bg-accent/40' : 'bg-foreground/10'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
