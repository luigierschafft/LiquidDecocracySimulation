import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlatformSelectClient } from './PlatformSelectClient'
import type { Platform, PlatformMember } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: { next?: string; choose?: string }
}

export default async function PlatformSelectPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const next = searchParams.next ?? '/topics'

  const [{ data: allPlatforms }, { data: myMemberships }] = await Promise.all([
    supabase.from('platform').select('*').order('created_at'),
    supabase
      .from('platform_member')
      .select('*')
      .eq('user_id', user.id),
  ])

  const platforms = (allPlatforms ?? []) as Platform[]
  const memberships = (myMemberships ?? []) as PlatformMember[]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose your platform</h1>
          <p className="text-foreground/60">
            Select which community platform you want to work on.
          </p>
        </div>
        <PlatformSelectClient
          platforms={platforms}
          memberships={memberships}
          next={next}
        />
      </div>
    </div>
  )
}
