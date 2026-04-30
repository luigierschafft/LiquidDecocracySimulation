import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const CUTOFF = '2026-04-30'

export default async function PlayTopicPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, status, created_at')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  const isNew = issue.created_at >= CUTOFF

  const btnClass = 'bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-gray-900 shadow-md active:scale-95 transition-transform'
  const btnGrayClass = 'bg-gradient-to-r from-gray-300 to-gray-400 rounded-[2rem] px-6 py-5 text-center text-base font-bold text-white/70 shadow-sm cursor-not-allowed'

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      <div className="w-full max-w-xs relative mb-4">
        <h1 className="text-xl font-black text-gray-900 pr-16 leading-tight">{issue.title}</h1>
        {!isNew && (
          <span className="text-xs text-gray-400 font-medium">Demo topic</span>
        )}
      </div>

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

      <div className="w-full max-w-xs flex flex-col gap-4">

        {/* Summary — AI, only for new topics */}
        {isNew ? (
          <Link href={`/playful/${issue.id}/summary`} className="block">
            <div className={btnClass}>
              Get a summary about<br />the current discussion
            </div>
          </Link>
        ) : (
          <div className={btnGrayClass}>
            Get a summary about<br />the current discussion
          </div>
        )}

        {/* Statements — available for all */}
        <Link href={`/playful/${issue.id}/statement`} className="block">
          <div className={btnClass}>
            See the different statements<br />and pros and cons
          </div>
        </Link>

        {/* Learn — AI, only for new topics */}
        {isNew ? (
          <Link href={`/playful/${issue.id}/learn`} className="block">
            <div className={btnClass}>
              Learn more about the topic<br />with a specialized AI
            </div>
          </Link>
        ) : (
          <div className={btnGrayClass}>
            Learn more about the topic<br />with a specialized AI
          </div>
        )}

        {/* Proposals — available for all */}
        <Link href={`/topics/${issue.id}/proposals`} className="block">
          <div className={btnClass}>
            Proposals
          </div>
        </Link>
      </div>

      {!isNew && (
        <p className="mt-4 text-xs text-gray-400 text-center max-w-[200px]">
          AI features are only available for new topics
        </p>
      )}

      <Link href="/playful/topics" className="mt-8 text-xs text-gray-400 underline">
        ← Back to topics
      </Link>
    </div>
  )
}
