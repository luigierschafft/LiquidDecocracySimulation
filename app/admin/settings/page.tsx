import { getAppSetting, setAppSetting } from '@/lib/data/settings'
import type { TopicCreationSetting, ProposalCreationSetting } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const [topicCreation, proposalCreation] = await Promise.all([
    getAppSetting('topic_creation').then((v) => (v ?? 'all_members') as TopicCreationSetting),
    getAppSetting('proposal_creation').then((v) => (v ?? 'all_members') as ProposalCreationSetting),
  ])

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
    </div>
  )
}
