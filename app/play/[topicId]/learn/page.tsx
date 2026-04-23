import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlayLearnPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, status')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs relative mb-4">
        <Link
          href={`/topics/${issue.id}`}
          className="absolute top-0 right-0 z-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-md leading-tight text-center"
        >
          Tradi­<br />tional
        </Link>
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">{issue.title}</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-[80px]" />

      {/* AI placeholder box */}
      <div className="w-full max-w-xs border-2 border-dashed border-gray-300 rounded-2xl px-5 py-6 text-center mb-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Learn more about the topic with a specialized AI
        </p>
        <p className="text-xs text-gray-400 mt-3 italic">
          ✦ AI chat coming soon — ask anything about this topic and get informed, balanced answers.
        </p>
      </div>

      {/* Waving mongoose */}
      <div className="pointer-events-none">
        <Image
          src="/mongoose.png"
          alt="Mongoose"
          width={130}
          height={152}
          placeholder="empty"
          style={{ background: 'transparent' }}
          className="drop-shadow-lg"
        />
      </div>

      <Link href={`/play/${issue.id}`} className="mt-6 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
