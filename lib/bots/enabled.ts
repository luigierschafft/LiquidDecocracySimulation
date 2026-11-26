import { createClient } from '@/lib/supabase/server'
import { BOT_PLATFORM_SLUG } from './personas'

/** True if this topic lives on the Test Platform, where test bots may join the discussion. */
export async function botsEnabledForTopic(issueId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('issue')
    .select('platform:platform_id(slug)')
    .eq('id', issueId)
    .single()
  return (data as any)?.platform?.slug === BOT_PLATFORM_SLUG
}
