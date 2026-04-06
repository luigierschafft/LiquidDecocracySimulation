export type IssueStatus = 'draft' | 'admission' | 'discussion' | 'verification' | 'voting' | 'closed'
export type VoteValue = 'approve' | 'oppose' | 'abstain' | 'strong_no'
export type TopicCreationSetting = 'all_members' | 'admin_only'
export type ProposalCreationSetting = 'all_members' | 'admin_only'

export interface Member {
  id: string
  email: string
  display_name: string | null
  is_admin: boolean
  is_approved: boolean
  created_at: string
  bio?: string | null
  interests?: string[] | null
  location?: string | null
  avatar_url?: string | null
  is_moderator?: boolean
  is_verified?: boolean
  verified_at?: string | null
  reputation_score?: number
  show_vote_history?: boolean
  show_activity?: boolean
  max_incoming_delegations?: number | null
  notification_preferences?: Record<string, boolean> | null
}

export interface Unit {
  id: string
  name: string
  description: string | null
  created_at: string
  default_policy_id?: string | null
}

export interface Area {
  id: string
  unit_id: string
  name: string
  description: string | null
  created_at: string
  unit?: Unit
  default_policy_id?: string | null
}

export interface Policy {
  id: string
  name: string
  admission_days: number
  discussion_days: number
  verification_days: number
  voting_days: number
  quorum: number
  voting_method: 'approval' | 'schulze'
  close_by_quorum: boolean
  close_by_consensus: boolean
  consensus_threshold: number
  created_at: string
}

export interface Issue {
  id: string
  title: string
  status: IssueStatus
  area_id: string | null
  policy_id: string | null
  accepted_initiative_id: string | null
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
  is_draft?: boolean
  forked_from_id?: string | null
  estimated_cost?: string | null
  implementation_timeline?: string | null
  affected_areas?: string[] | null
  author?: Member
  votes?: Vote[]
  opinions?: Opinion[]
  arguments?: Argument[]
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

export type OpinionIntent = 'support' | 'concern' | 'question' | 'info'

export interface Opinion {
  id: string
  initiative_id: string | null
  issue_id: string | null
  parent_id: string | null
  referenced_opinion_id?: string | null
  referenced_opinion?: Pick<Opinion, 'id' | 'content' | 'author'> | null
  author_id: string
  content: string
  intent?: OpinionIntent | null
  is_anonymous?: boolean
  created_at: string
  author?: Member
  replies?: Opinion[]
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

export interface Elaboration {
  id: string
  issue_id: string
  created_by: string
  created_at: string
  sections?: ElaborationSection[]
  editors?: ElaborationEditor[]
}

export interface ElaborationSection {
  id: string
  elaboration_id: string
  title: string
  content: string
  sort_order: number
  updated_by: string | null
  updated_at: string | null
  created_at: string
  updater?: Member
}

export interface ElaborationEditor {
  elaboration_id: string
  member_id: string
  created_at: string
  member?: Member
}

export interface ElaborationComment {
  id: string
  section_id: string
  author_id: string
  content: string
  created_at: string
  author?: Member
}

export interface VoteCount {
  approve: number
  oppose: number
  abstain: number
  strong_no: number
  total: number
  approvalPercent: number
}

export interface Argument {
  id: string
  initiative_id: string
  author_id: string
  stance: 'pro' | 'contra'
  content: string
  created_at: string
  author?: Member
}

export interface RankedVote {
  issue_id: string
  initiative_id: string
  member_id: string
  rank: number
  created_at: string
}
