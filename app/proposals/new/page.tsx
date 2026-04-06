import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAppSetting } from '@/lib/data/settings'
import { NewProposalForm } from './NewProposalForm'

export const dynamic = 'force-dynamic'

export default async function NewProposalPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const topicCreation = await getAppSetting('topic_creation') ?? 'all_members'

  if (topicCreation === 'admin_only') {
    const { data: member } = await supabase
      .from('member')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!member?.is_admin) redirect('/')
  }

  return <NewProposalForm />
}
