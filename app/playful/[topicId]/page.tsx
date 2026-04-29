import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PlayTopicPage({ params }: { params: { topicId: string } }) {
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

        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">{issue.title}</h1>
      </div>

      {/* Ball mongoose */}
      <div className="pointer-events-none mb-4">
        <Image
          src="/mongoose-ball.png"
          alt="Mongoose"
          width={156}
          height={156}
          placeholder="empty"
          style={{ background: 'transparent' }}
          className="drop-shadow-lg"
        />
      </div>

      {/* 3 action buttons */}
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Link href={`/playful/${issue.id}/summary`} className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            Get a summary about<br />the current discussion
          </div>
        </Link>

        <Link href={`/playful/${issue.id}/statement`} className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            See the different statements<br />and pros and cons
          </div>
        </Link>

        <Link href={`/playful/${issue.id}/learn`} className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            Learn more about the topic<br />with a specialized AI
          </div>
        </Link>

        <Link href={`/topics/${issue.id}/proposals`} className="block">
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform">
            Proposals
          </div>
        </Link>
      </div>

      <Link href="/playful/topics" className="mt-8 text-xs text-gray-400 underline">
        ← Back to topics
      </Link>
    </div>
  )
}
