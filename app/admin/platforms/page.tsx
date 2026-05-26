import { createClient } from '@/lib/supabase/server'
import { PlatformAdminClient } from './PlatformAdminClient'

export const dynamic = 'force-dynamic'

export default async function AdminPlatformsPage() {
  const supabase = createClient()

  const [{ data: platforms }, { data: members }] = await Promise.all([
    supabase.from('platform').select('*').order('created_at'),
    supabase
      .from('platform_member')
      .select('*, platform:platform(name, slug), member:member(id, email, display_name)')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Platforms</h1>
        <p className="text-foreground/60 mt-1">
          Manage platforms and approve membership requests.
        </p>
      </div>
      <PlatformAdminClient
        platforms={platforms ?? []}
        memberships={members ?? []}
      />
    </div>
  )
}
