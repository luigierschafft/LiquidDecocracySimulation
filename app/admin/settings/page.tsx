import { getAppSetting, setAppSetting } from '@/lib/data/settings'
import type { TopicCreationSetting, ProposalCreationSetting } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const [topicCreation, proposalCreation] = await Promise.all([
    getAppSetting('topic_creation').then((v) => (v ?? 'all_members') as TopicCreationSetting),
    getAppSetting('proposal_creation').then((v) => (v ?? 'all_members') as ProposalCreationSetting),
  ])

  const governanceMode = process.env.GOVERNANCE_MODE ?? 'v1'

  async function updateSettings(formData: FormData) {
    'use server'
    const tc = formData.get('topic_creation') as string
    const pc = formData.get('proposal_creation') as string
    await Promise.all([
      (tc === 'all_members' || tc === 'admin_only') ? setAppSetting('topic_creation', tc) : Promise.resolve(),
      (pc === 'all_members' || pc === 'admin_only') ? setAppSetting('proposal_creation', pc) : Promise.resolve(),
    ])
    revalidatePath('/admin/settings')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platform Settings</h1>
        <p className="text-foreground/60 mt-1">Configure platform-wide behaviour</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        {/* Topic Creation */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Topic Creation</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="topic_creation" value="all_members"
                defaultChecked={topicCreation === 'all_members'} className="mt-0.5" />
              <div>
                <p className="font-medium">All Members</p>
                <p className="text-sm text-foreground/50">Any approved member can create new topics</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="topic_creation" value="admin_only"
                defaultChecked={topicCreation === 'admin_only'} className="mt-0.5" />
              <div>
                <p className="font-medium">Admins Only</p>
                <p className="text-sm text-foreground/50">Only admins can create new topics</p>
              </div>
            </label>
          </div>
        </div>

        {/* Proposal Submission */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-lg">Proposal Submission</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="proposal_creation" value="all_members"
                defaultChecked={proposalCreation === 'all_members'} className="mt-0.5" />
              <div>
                <p className="font-medium">All Members</p>
                <p className="text-sm text-foreground/50">Any approved member can submit proposals to a topic</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="proposal_creation" value="admin_only"
                defaultChecked={proposalCreation === 'admin_only'} className="mt-0.5" />
              <div>
                <p className="font-medium">Admins Only</p>
                <p className="text-sm text-foreground/50">Only admins can submit proposals</p>
              </div>
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary">Save Settings</button>
      </form>

      {/* Governance Mode Info */}
      <div className="card space-y-3 border-accent/20 bg-accent/5">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-accent" />
          Governance Mode
        </h2>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            governanceMode === 'v2'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {governanceMode === 'v2' ? 'V2 — Simplified' : 'V1 — Full Process'}
          </span>
          <p className="text-sm text-foreground/60">
            {governanceMode === 'v2'
              ? 'Verification phase is skipped. Phases: Admission → Discussion → Voting → Closed.'
              : 'Full 4-phase process. Phases: Admission → Discussion → Verification → Voting → Closed.'}
          </p>
        </div>
        <p className="text-xs text-foreground/40">
          To change the governance mode, set the <code className="bg-sand px-1 rounded">GOVERNANCE_MODE</code> environment variable to <code className="bg-sand px-1 rounded">v1</code> or <code className="bg-sand px-1 rounded">v2</code> and redeploy.
        </p>
      </div>
    </div>
  )
}
