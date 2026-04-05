'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function publishDraft(issueId: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: issue } = await supabase
    .from('issue')
    .select('author_id, status')
    .eq('id', issueId)
    .single()

  if (!issue || issue.status !== 'draft') return

  const { data: member } = await supabase
    .from('member')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (issue.author_id !== user.id && !member?.is_admin) return

  await supabase
    .from('issue')
    .update({ status: 'admission' })
    .eq('id', issueId)

  revalidatePath(`/proposals/${issueId}`)
}
