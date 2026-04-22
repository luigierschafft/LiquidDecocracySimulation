import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PlayTopicPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: issue } = await supabase
    .from('issue')
    .select('id, title, content, status, created_at')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">
      {/* Back */}
      <Link href="/play" className="inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to topics
      </Link>

      {/* Mongoose + speech bubble */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative bg-white border border-amber-200 shadow-md rounded-2xl rounded-bl-none px-5 py-4 max-w-xs w-full">
          <p className="text-sm font-semibold text-gray-800">
            Great choice! Let&apos;s explore this together 🧐
          </p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            &ldquo;{issue.title}&rdquo;
          </p>
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-l border-amber-200 rotate-[-45deg]" />
        </div>
        <Image
          src="/mongoose.png"
          alt="Mongoose mascot"
          width={110}
          height={130}
          className="drop-shadow-lg mt-1"
          priority
        />
      </div>

      {/* Topic card */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4 space-y-2">
        <h2 className="font-bold text-gray-900 text-base">{issue.title}</h2>
        {issue.content && (
          <p className="text-sm text-gray-600 leading-relaxed">{issue.content}</p>
        )}
        <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
          {issue.status}
        </span>
      </div>

      {/* Actions — more features coming here */}
      <div className="grid grid-cols-2 gap-3">
        <Link href={`/topics/${issue.id}/discussion`}>
          <div className="bg-white rounded-2xl border border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md p-4 text-center cursor-pointer transition-all">
            <div className="text-2xl mb-1">💬</div>
            <p className="text-xs font-semibold text-gray-700">Discuss</p>
            <p className="text-xs text-gray-400 mt-0.5">Arguments & ideas</p>
          </div>
        </Link>
        <Link href={`/topics/${issue.id}/proposals`}>
          <div className="bg-white rounded-2xl border border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md p-4 text-center cursor-pointer transition-all">
            <div className="text-2xl mb-1">🗳️</div>
            <p className="text-xs font-semibold text-gray-700">Proposals</p>
            <p className="text-xs text-gray-400 mt-0.5">Vote & decide</p>
          </div>
        </Link>
      </div>

      <p className="text-xs text-amber-600 text-center">
        More guided features coming soon! 🚀
      </p>
    </div>
  )
}
