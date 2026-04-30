import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PlayDelegationManager } from '@/components/play/PlayDelegationManager'

export const dynamic = 'force-dynamic'

export default async function PlayDelegationPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: delegations }, { data: members }, { data: areas }, { data: issues }] = await Promise.all([
    supabase
      .from('delegation')
      .select('id, to_member:member!delegation_to_member_id_fkey(id, display_name, email), area(id, name), issue(id, title)')
      .eq('from_member_id', user.id),
    supabase
      .from('member')
      .select('id, display_name, email')
      .neq('id', user.id)
      .eq('is_approved', true)
      .order('display_name'),
    supabase.from('area').select('id, name').order('name'),
    supabase.from('issue').select('id, title').neq('status', 'draft').order('title'),
  ])

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header + handstand mongoose */}
      <div className="w-full max-w-xs relative mb-2">
        <h1 className="text-2xl font-black text-gray-900 text-center">Delegation</h1>
        <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
          Here you can choose who you want to delegate your vote to.
        </p>
        <div className="absolute -right-4 top-0 pointer-events-none">
          <Image
            src="/mongoose-handstand.png"
            alt="Mongoose handstand"
            width={90}
            height={110}
            placeholder="empty"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>

      <div className="mt-6">
        <PlayDelegationManager
          userId={user.id}
          delegations={(delegations ?? []) as any}
          members={members ?? []}
          areas={areas ?? []}
          issues={issues ?? []}
        />
      </div>

      <Link href="/play" className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
