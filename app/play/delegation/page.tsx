import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlayDelegationPage() {
  const supabase = createClient()

  const [{ data: members }, { data: issues }] = await Promise.all([
    supabase.from('member').select('id, name').order('name'),
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

      <div className="w-full max-w-xs flex flex-col gap-5 mt-6">

        {/* Person to delegate to */}
        <div className="flex flex-col gap-2">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3">
            <p className="text-xs text-gray-500 text-center mb-2">
              Choose the person you want to delegate your vote to
            </p>
          </div>
          <select className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-transparent outline-none">
            <option value="">— Select a person —</option>
            {members?.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Area or topic */}
        <div className="flex flex-col gap-2">
          <div className="border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3">
            <p className="text-xs text-gray-500 text-center mb-2">
              Please select an area or specific topic you want to delegate your vote for
            </p>
          </div>
          <select className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-700 bg-transparent outline-none">
            <option value="">— Select a topic —</option>
            {issues?.map((i) => (
              <option key={i.id} value={i.id}>{i.title}</option>
            ))}
          </select>
        </div>

        {/* Save button */}
        <button className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-4 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
          Save delegation
        </button>
      </div>

      <Link href="/play" className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
