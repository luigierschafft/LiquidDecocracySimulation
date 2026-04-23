import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlayTopicsPage() {
  const supabase = createClient()
  const { data: issues } = await supabase
    .from('issue')
    .select('id, title, status')
    .neq('status', 'draft')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs relative mb-6">
        <h1 className="text-2xl font-black text-gray-900 text-center">Topics</h1>

        {/* Handstand mongoose – top left */}
        <div className="absolute -left-4 top-6 pointer-events-none">
          <Image
            src="/mongoose-handstand.png"
            alt="Mongoose"
            width={90}
            height={110}
            placeholder="empty"
            style={{ background: 'transparent' }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center max-w-[200px] mb-6 leading-relaxed">
        Here are all the different topics you can discuss. Sense and feel into them and learn from them. Just select one
      </p>

      {/* Topic list */}
      <div className="w-full max-w-xs flex flex-col gap-3">
        {issues?.map((issue) => (
          <Link key={issue.id} href={`/play/${issue.id}`} className="block">
            <div className="bg-gradient-to-r from-violet-400 via-blue-400 to-teal-400 rounded-[1.5rem] px-5 py-4 text-center font-bold text-white shadow-md active:scale-95 transition-transform text-sm">
              {issue.title}
            </div>
          </Link>
        ))}
        {(!issues || issues.length === 0) && (
          <p className="text-center text-gray-400 text-sm mt-8">No topics yet.</p>
        )}
      </div>

      {/* Back */}
      <Link href="/play" className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
