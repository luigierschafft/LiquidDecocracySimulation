import type { Phase, ProcessConfig } from './types'

export function getNextPhase(current: Phase, config: ProcessConfig): Phase | null {
  const idx = config.phases.indexOf(current)
  if (idx < 0 || idx >= config.phases.length - 1) return null
  return config.phases[idx + 1]
}

export function getPhaseDuration(phase: Phase, policy: Record<string, any>, config: ProcessConfig): number {
  const field = config.phaseDurationField[phase]
  if (!field) return 0
  return policy[field] ?? 0
}

export function getPhaseStart(issue: Record<string, any>, phase: Phase): string | null {
  switch (phase) {
    case 'admission':    return issue.admission_at ?? issue.created_at
    case 'discussion':   return issue.discussion_at
    case 'verification': return issue.verification_at
    case 'voting':       return issue.voting_at
    default:             return null
  }
}
