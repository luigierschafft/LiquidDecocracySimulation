import type { ProcessConfig } from './types'

export const V1_CONFIG: ProcessConfig = {
  phases: ['admission', 'discussion', 'verification', 'voting', 'closed'],
  phaseDurationField: {
    admission:    'admission_days',
    discussion:   'discussion_days',
    verification: 'verification_days',
    voting:       'voting_days',
    closed:       null,
  },
  timestampField: {
    admission:    'admission_at',
    discussion:   'discussion_at',
    verification: 'verification_at',
    voting:       'voting_at',
    closed:       'closed_at',
  },
  votingMethod: 'approval',
}

export const V2_CONFIG: ProcessConfig = {
  ...V1_CONFIG,
  phases: ['admission', 'discussion', 'voting', 'closed'],
  phaseDurationField: {
    ...V1_CONFIG.phaseDurationField,
    verification: null,
  },
}

export function getActiveConfig(): ProcessConfig {
  return process.env.GOVERNANCE_MODE === 'v2' ? V2_CONFIG : V1_CONFIG
}
