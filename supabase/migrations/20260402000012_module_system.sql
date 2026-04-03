-- ============================================================
-- MODULE SYSTEM
-- ============================================================
-- module: registry of all 96 platform modules
-- member_module_setting: per-user overrides for user_configurable modules

CREATE TABLE public.module (
  key               TEXT PRIMARY KEY,
  number            SMALLINT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  group_key         TEXT NOT NULL,   -- e.g. 'A', 'B', 'C' ...
  group_name        TEXT NOT NULL,   -- e.g. 'User & Identity'
  admin_enabled     BOOLEAN NOT NULL DEFAULT TRUE,
  user_configurable BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE public.member_module_setting (
  member_id  UUID REFERENCES public.member(id) ON DELETE CASCADE,
  module_key TEXT REFERENCES public.module(key) ON DELETE CASCADE,
  enabled    BOOLEAN NOT NULL,
  PRIMARY KEY (member_id, module_key)
);

-- RLS
ALTER TABLE public.module ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_module_setting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modules_read_all"  ON public.module FOR SELECT USING (true);
CREATE POLICY "modules_admin_write" ON public.module FOR ALL
  USING (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "member_module_setting_own" ON public.member_module_setting FOR ALL
  USING (member_id = auth.uid());
CREATE POLICY "member_module_setting_admin" ON public.member_module_setting FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.member WHERE id = auth.uid() AND is_admin = true));

-- ============================================================
-- SEED: All 96 modules
-- ============================================================

INSERT INTO public.module (key, number, name, description, group_key, group_name, admin_enabled, user_configurable) VALUES

-- A — User & Identity
('user_accounts',        1,  'User Accounts',          'Create, authenticate and manage user accounts',             'A', 'User & Identity', true,  false),
('user_profiles',        2,  'User Profiles',          'Store bio, interests and personal metadata',                'A', 'User & Identity', true,  false),
('verification',         3,  'Verification',           'Optional identity verification system',                     'A', 'User & Identity', false, false),
('reputation_system',    4,  'Reputation System',      'Trust score based on activity and participation',           'A', 'User & Identity', false, false),
('activity_tracking',    5,  'Activity Tracking',      'Track user interactions and contributions',                 'A', 'User & Identity', false, false),
('roles_permissions',    6,  'Roles & Permissions',    'Admin, moderator, and user role management',                'A', 'User & Identity', true,  false),

-- B — Discussion
('thread_system',        7,  'Thread System',          'Create structured discussions around topics',               'B', 'Discussion', true,  false),
('comments_replies',     8,  'Comments & Replies',     'Allow nested replies within discussions',                   'B', 'Discussion', true,  false),
('nested_discussions',   9,  'Nested Discussions',     'Hierarchical conversation structure',                       'B', 'Discussion', true,  false),
('pro_contra_arguments', 10, 'Pro/Contra Arguments',   'Structure arguments into support/opposition',               'B', 'Discussion', true,  false),
('questions_tagging',    11, 'Questions Tagging',      'Mark uncertainties or open questions',                      'B', 'Discussion', true,  true),
('argument_map',         12, 'Argument Map',           'Visual mapping of arguments (Kialo-style)',                 'B', 'Discussion', false, false),
('post_voting',          13, 'Post Voting',            'Upvote/downvote contributions',                             'B', 'Discussion', true,  true),
('referencing',          14, 'Referencing',            'Quote and link arguments',                                  'B', 'Discussion', true,  false),
('intention_display',    15, 'Intention Display',      'Show intent behind comments',                               'B', 'Discussion', true,  true),

-- C — Proposals
('proposal_creation',    16, 'Proposal Creation',      'Create structured proposals',                               'C', 'Proposals', true,  false),
('proposal_editing',     17, 'Proposal Editing',       'Edit proposals collaboratively',                            'C', 'Proposals', true,  false),
('versioning',           18, 'Versioning',             'Track proposal history',                                    'C', 'Proposals', false, false),
('proposal_feedback',    19, 'Proposal Feedback',      'Comment and give structured feedback',                      'C', 'Proposals', true,  false),
('forking',              20, 'Forking',                'Duplicate and modify proposals',                            'C', 'Proposals', false, false),
('merging',              21, 'Merging',                'Combine proposals',                                         'C', 'Proposals', false, false),
('diff_view',            22, 'Diff View',              'Compare changes between proposal versions',                 'C', 'Proposals', false, false),
('proposal_status',      23, 'Proposal Status',        'Draft, active, voted states',                              'C', 'Proposals', true,  false),
('structured_proposals', 24, 'Structured Proposals',   'Include costs, subtopics, sub-discussions',                 'C', 'Proposals', false, false),

-- D — Voting
('basic_voting',              25, 'Basic Voting',             'Yes/No/Abstain/Strong No',                           'D', 'Voting', true,  false),
('multiple_choice_voting',    26, 'Multiple Choice Voting',   'Select multiple options',                            'D', 'Voting', true,  false),
('ranking_voting',            27, 'Ranking Voting',           'Rank preferences (Schulze method)',                  'D', 'Voting', true,  false),
('quorum_system',             28, 'Quorum System',            'Minimum participation thresholds',                   'D', 'Voting', true,  false),
('timed_voting',              29, 'Timed Voting',             'Voting deadlines',                                   'D', 'Voting', true,  false),
('results_display',           30, 'Results Display',          'Show voting results',                                'D', 'Voting', true,  false),
('continuous_voting',         31, 'Continuous Voting',        'Vote during discussion phase',                       'D', 'Voting', false, false),
('scale_voting',              32, 'Scale Voting',             '1–10 scoring system',                                'D', 'Voting', false, false),
('alignment_meter',           33, 'Alignment Meter',          'Visual consensus indicator',                         'D', 'Voting', true,  true),
('low_resistance_indicator',  34, 'Low Resistance Indicator', 'Highlight minimal opposition solutions',             'D', 'Voting', true,  true),

-- E — Delegation
('delegation',           35, 'Delegation',            'Transfer voting power to another member',                    'E', 'Delegation', true,  false),
('thematic_delegation',  36, 'Thematic Delegation',   'Delegate by topic, area, or unit',                          'E', 'Delegation', true,  false),
('delegation_network',   37, 'Delegation Network',    'Visualize delegation relationships',                         'E', 'Delegation', true,  false),
('revoke_delegation',    38, 'Revoke Delegation',     'Withdraw delegation',                                        'E', 'Delegation', true,  false),
('delegation_limits',    39, 'Delegation Limits',     'Restrict delegation chain length',                           'E', 'Delegation', false, false),
('network_views',        40, 'Network Views',         'Upward/downward delegation views',                           'E', 'Delegation', false, false),
('vote_weighting',       41, 'Vote Weighting',        'Weight votes via reputation or delegation',                  'E', 'Delegation', true,  false),
('argument_weighting',   42, 'Argument Weighting',    'Weight arguments, not just votes',                           'E', 'Delegation', false, false),

-- F — AI Features (all off by default, require configuration)
('ai_summaries',             43, 'AI Summaries',             'Summarize discussions automatically',                 'F', 'AI Features', false, false),
('argument_extraction',      44, 'Argument Extraction',      'Identify key points from discussions',               'F', 'AI Features', false, false),
('pro_con_detection',        45, 'Pro/Con Detection',        'Classify arguments automatically',                   'F', 'AI Features', false, false),
('gap_detection',            46, 'Gap Detection',            'Identify missing perspectives',                      'F', 'AI Features', false, false),
('ai_proposal_improvement',  47, 'AI Proposal Improvement',  'Suggest proposal improvements',                      'F', 'AI Features', false, false),
('ai_moderation',            48, 'AI Moderation',            'Auto-moderate content',                              'F', 'AI Features', false, false),
('opinion_clustering',       49, 'Opinion Clustering',       'Group similar views automatically',                  'F', 'AI Features', false, false),
('consensus_suggestions',    50, 'Consensus Suggestions',    'Generate compromise proposals',                      'F', 'AI Features', false, false),
('argument_journey_mode',    51, 'Argument Journey Mode',    'Guide users through discussion',                     'F', 'AI Features', false, false),
('consensus_heatmap',        52, 'Consensus Heatmap',        'Visualize agreement across members',                 'F', 'AI Features', false, true),
('perspective_switch',       53, 'Perspective Switch',       'Show alternative viewpoints',                        'F', 'AI Features', false, false),
('auto_debater',             54, 'Auto Debater',             'AI generates counterarguments',                      'F', 'AI Features', false, false),
('truth_layer',              55, 'Truth Layer',              'Fact validation layer',                              'F', 'AI Features', false, false),
('argument_merger',          56, 'Argument Merger',          'Merge similar arguments',                            'F', 'AI Features', false, false),
('bias_breaker_mode',        57, 'Bias Breaker Mode',        'Challenge user bias',                                'F', 'AI Features', false, false),
('decision_readiness',       58, 'Decision Readiness',       'Show readiness level for a decision',               'F', 'AI Features', false, false),
('guided_exploration',       59, 'Guided Exploration',       'Assist user navigation through topics',             'F', 'AI Features', false, false),
('fact_checking',            60, 'Fact Checking',            'Validate claims in proposals',                       'F', 'AI Features', false, false),

-- G — Organization & Governance
('categories',           61, 'Categories',            'Organize topics into units and areas',                      'G', 'Organization & Governance', true,  false),
('tagging_system',       62, 'Tagging System',        'Flexible labeling for topics and proposals',               'G', 'Organization & Governance', false, false),
('governance_rules',     63, 'Governance Rules',      'Define system rules',                                       'G', 'Organization & Governance', true,  false),
('voting_rules_per_group',64,'Voting Rules per Group','Custom voting settings per group',                          'G', 'Organization & Governance', true,  false),
('access_control',       65, 'Access Control',        'Granular permissions system',                               'G', 'Organization & Governance', true,  false),
('posting_rights',       66, 'Posting Rights',        'Control who can create topics',                             'G', 'Organization & Governance', true,  false),
('custom_governance',    67, 'Custom Governance',     'Flexible governance mode configurations',                   'G', 'Organization & Governance', false, false),

-- H — Process & Lifecycle
('phase_system',         68, 'Phase System',          'Discussion → voting flow with phases',                      'H', 'Process & Lifecycle', true,  false),
('iteration_loops',      69, 'Iteration Loops',       'Feedback cycles between phases',                            'H', 'Process & Lifecycle', false, false),
('deadlines',            70, 'Deadlines',             'Time constraints per phase',                                'H', 'Process & Lifecycle', true,  false),
('voting_cycles',        71, 'Voting Cycles',         'Scheduled automatic votes',                                 'H', 'Process & Lifecycle', true,  false),
('review_phase',         72, 'Review Phase',          'Final review before voting',                                'H', 'Process & Lifecycle', true,  false),
('revision_rounds',      73, 'Revision Rounds',       'Iterative proposal improvements',                           'H', 'Process & Lifecycle', false, false),

-- I — Moderation
('community_moderation', 74, 'Community Moderation',  'User-driven moderation',                                    'I', 'Moderation', false, false),
('reporting_system',     75, 'Reporting System',      'Report inappropriate content',                              'I', 'Moderation', false, false),
('content_flagging',     76, 'Content Flagging',      'Mark problematic content',                                  'I', 'Moderation', false, false),
('moderation_tools',     77, 'Moderation Tools',      'Edit/delete tools for moderators',                         'I', 'Moderation', true,  false),
('ai_moderation_advanced',78,'AI Moderation Advanced','Automated moderation layer',                                'I', 'Moderation', false, false),

-- J — Analytics & Transparency
('participation_analytics',79,'Participation Analytics','Track engagement metrics',                                'J', 'Analytics & Transparency', false, false),
('voting_analytics',     80, 'Voting Analytics',      'Analyze voting results',                                    'J', 'Analytics & Transparency', true,  false),
('argument_quality_score',81,'Argument Quality Score','Evaluate contribution quality',                             'J', 'Analytics & Transparency', false, false),
('user_activity_metrics',82, 'User Activity Metrics', 'Track user behavior',                                       'J', 'Analytics & Transparency', false, false),
('transparency_dashboard',83,'Transparency Dashboard','Public system insights',                                    'J', 'Analytics & Transparency', false, false),

-- K — Notifications
('notifications',              84, 'Notifications',              'Alerts system',                                  'K', 'Notifications', false, false),
('user_notification_settings', 85, 'Notification Settings',      'User-controlled notification preferences',       'K', 'Notifications', false, true),
('admin_notifications',        86, 'Admin Notifications',        'Admin-targeted alerts',                          'K', 'Notifications', false, false),
('mentions',                   87, 'Mentions',                   '@user tagging in discussions',                   'K', 'Notifications', false, false),
('reminders',                  88, 'Reminders',                  'Deadline reminders',                             'K', 'Notifications', false, false),

-- L — Infrastructure & Platform
('time_module',           89, 'Time Module',           'Automated scheduling',                                     'L', 'Infrastructure & Platform', true,  false),
('authentication',        90, 'Authentication',        'Secure login (Supabase Auth)',                             'L', 'Infrastructure & Platform', true,  false),
('privacy_settings',      91, 'Privacy Settings',      'User data control',                                        'L', 'Infrastructure & Platform', true,  true),
('anonymity',             92, 'Anonymity',             'Optional anonymous participation',                          'L', 'Infrastructure & Platform', false, true),
('anti_bot_system',       93, 'Anti-Bot System',       'Prevent abuse',                                            'L', 'Infrastructure & Platform', false, false),
('plugin_system',         94, 'Plugin System',         'Enable/disable modules dynamically',                       'L', 'Infrastructure & Platform', true,  false),
('auto_translation',      95, 'Auto Translation',      'Translate content automatically',                          'L', 'Infrastructure & Platform', false, true),
('external_integration',  96, 'External Integration',  'Import topics from other platforms',                       'L', 'Infrastructure & Platform', false, false);
