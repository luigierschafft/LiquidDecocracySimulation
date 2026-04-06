export type Phase = 'admission' | 'discussion' | 'verification' | 'voting' | 'closed'
export type VotingMethod = 'approval' | 'schulze'

export interface ProcessConfig {
  phases: Phase[]
  phaseDurationField: Record<Phase, string | null>
  timestampField: Record<Phase, string>
  votingMethod: VotingMethod
}
