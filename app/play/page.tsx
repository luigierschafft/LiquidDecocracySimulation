import { createClient } from '@/lib/supabase/server'
import { PlayHome } from '@/components/play/PlayHome'

export const dynamic = 'force-dynamic'

export default async function PlayPage() {
  const supabase = createClient()
  const [
    { data: { user } },
    { data: issues },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('issue')
      .select('id, title, content, status, created_at')
      .order('created_at', { ascending: false }),
  ])

  return <PlayHome topics={issues ?? []} userId={user?.id ?? null} />
}
