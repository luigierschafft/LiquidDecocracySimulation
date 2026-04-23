import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlaySummaryPage({ params }: { params: { topicId: string } }) {
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
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">
          {issue.title}<br />
          <span className="text-lg font-extrabold">Summary</span>
        </h1>
      </div>

      {/* Placeholder summary text */}
      <div className="w-full max-w-xs text-sm text-gray-700 text-center leading-relaxed mb-6 px-2">
        <p>
          This discussion is about {issue.title.toLowerCase()} in Auroville.{' '}
          Community members are sharing their thoughts and ideas about this topic.
        </p>
        <p className="mt-3 text-gray-500 italic text-xs">
          ✦ AI summary coming soon — this will automatically read the current discussion and summarize the key points, agreements and open questions.
        </p>
      </div>

      {/* Dashed chat input */}
      <div className="w-full max-w-xs border-2 border-dashed border-gray-300 rounded-2xl px-4 py-3 mb-6">
        <p className="text-xs text-gray-400 text-center">Ask me anything about this topic…</p>
      </div>

      {/* Waving mongoose + chat hint */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <p className="text-xs text-gray-500 text-center max-w-[200px] leading-relaxed">
          Chat with me if you want more information, more details, or to give a statement about this topic
        </p>
        <Image
          src="/mongoose.png"
          alt="Mongoose"
          width={120}
          height={140}
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
