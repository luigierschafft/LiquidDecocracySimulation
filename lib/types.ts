export type IssueStatus = 'admission' | 'discussion' | 'verification' | 'voting' | 'closed'
export type VoteValue = 'approve' | 'oppose' | 'abstain'

export interface Member {
  id: string
  email: string
  display_name: string | null
  is_admin: boolean
  is_approved: boolean
  created_at: string
}

export interface Unit {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Area {
  id: string
  unit_id: string
  name: string
  description: string | null
  created_at: string
  unit?: Unit
}

export interface Policy {
  id: string
  name: string
  admission_days: number
  discussion_days: number
  verification_days: number
  voting_days: number
  quorum: number
  created_at: string
}

export interface Issue {
  id: string
  title: string
  status: IssueStatus
  area_id: string | null
  policy_id: string | null
  author_id: string
  admission_at: string | null
  discussion_at: string | null
  verification_at: string | null
  voting_at: string | null
  closed_at: string | null
  created_at: string
  area?: Area
  policy?: Policy
  author?: Member
  initiatives?: Initiative[]
}

export interface Initiative {
  id: string
  issue_id: string
  title: string
  content: string
  author_id: string
  created_at: string
  author?: Member
  votes?: Vote[]
  opinions?: Opinion[]
  _vote_count?: VoteCount
}

export interface Vote {
  id: string
  initiative_id: string
  member_id: string
  value: VoteValue
  created_at: string
  member?: Member
}

export interface Opinion {
  id: string
  initiative_id: string
  author_id: string
  content: string
  created_at: string
  author?: Member
}

export interface Supporter {
  initiative_id: string
  member_id: string
  created_at: string
}

export interface Delegation {
  id: string
  from_member_id: string
  to_member_id: string
  unit_id: string | null
  area_id: string | null
  issue_id: string | null
  created_at: string
  from_member?: Member
  to_member?: Member
}

export interface VoteCount {
  approve: number
  oppose: number
  abstain: number
  total: number
  approvalPercent: number
}
