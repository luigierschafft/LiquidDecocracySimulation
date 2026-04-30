export interface TopicMeta {
  issue_id: string
  about: string
  scope: string
  created_at: string
}

export interface Statement {
  id: string
  issue_id: string
  text: string
  author_id: string
  source_links: string[]
  created_at: string
  author?: { display_name: string | null; email: string }
  ratings?: StatementRating[]
  avg_rating?: number | null
}

export interface StatementRating {
  id: string
  statement_id: string
  user_id: string
  rating: number
  created_at: string
}

export interface DiscussionNode {
  id: string
  statement_id: string
  parent_id: string | null
  type: 'pro' | 'contra' | 'question' | 'statement'
  text: string
  source_links: string[]
  author_id: string
  created_at: string
  author?: { display_name: string | null; email: string }
  children?: DiscussionNode[]
}

export interface TopicProposal {
  id: string
  issue_id: string
  text: string
  author_id: string
  created_at: string
  author?: { display_name: string | null; email: string }
  votes?: ProposalVote[]
  arguments?: ProposalArgument[]
  improvements?: ProposedImprovement[]
}

export interface ProposalVote {
  id: string
  proposal_id: string
  user_id: string
  vote: 'approve' | 'abstain' | 'disapprove' | 'strong_disapproval'
  created_at: string
}

export interface ProposalArgument {
  id: string
  proposal_id: string
  type: 'pro' | 'contra'
  text: string
  author_id: string
  created_at: string
  author?: { display_name: string | null; email: string }
}

export interface ProposedImprovement {
  id: string
  proposal_id: string
  text: string
  author_id: string
  created_at: string
  author?: { display_name: string | null; email: string }
  votes?: ImprovementVote[]
}

export type ImprovementVoteValue = 'approve' | 'abstain' | 'disapprove' | 'strong_disapproval'

export interface ImprovementVote {
  id: string
  improvement_id: string
  user_id: string
  vote: ImprovementVoteValue
  created_at: string
}

export interface ExecutionComment {
  id: string
  plan_id: string
  author_id: string
  text: string
  created_at: string
  author?: { display_name: string | null; email: string } | null
}

export interface ExecutionPlan {
  id: string
  issue_id: string
  goal: string | null
  costs: string | null
  duration: string | null
  proposal_text: string | null
  created_at: string
  tasks?: ExecutionTask[]
  milestones?: ExecutionMilestone[]
  team?: ExecutionTeamMember[]
  comments?: ExecutionComment[]
}

export interface ExecutionTask {
  id: string
  plan_id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  assignee_id: string | null
  created_at: string
  assignee?: { display_name: string | null; email: string }
  comments?: TaskComment[]
}

export interface TaskComment {
  id: string
  task_id: string
  text: string
  author_id: string
  created_at: string
  author?: { display_name: string | null; email: string }
}

export interface ExecutionMilestone {
  id: string
  plan_id: string
  title: string
  date: string | null
  created_at: string
}

export interface ExecutionTeamMember {
  id: string
  plan_id: string
  user_id: string
  role: string | null
  status: 'active' | 'interested'
  created_at: string
  member?: { display_name: string | null; email: string }
}

export interface ExecutionSuggestion {
  id: string
  plan_id: string
  section: 'goal' | 'costs' | 'duration' | 'milestone'
  proposed_value: string
  author_id: string
  upvotes: number
  adopted: boolean
  created_at: string
  author?: { display_name: string | null; email: string }
}
