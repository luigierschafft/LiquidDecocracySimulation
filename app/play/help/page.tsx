import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

// Pick random variant server-side via Math.random (re-runs on each request due to force-dynamic)
function randomVariant(): 1 | 2 | 3 {
  const r = Math.random()
  if (r < 0.333) return 1
  if (r < 0.666) return 2
  return 3
}

export default async function PlayHelpPage() {
  const supabase = createClient()

  // Fetch two random opinions from any issue
  const { data: opinions } = await supabase
    .from('opinion')
    .select('id, content, issue_id, issue:issue!opinion_issue_id_fkey(title)')
    .is('parent_id', null)
    .limit(20)

  const shuffled = (opinions ?? []).sort(() => Math.random() - 0.5)
  const statementA = shuffled[0] ?? null
  const statementB = shuffled[1] ?? null

  const variant = randomVariant()

  const topicTitle = (statementA?.issue as { title?: string } | null)?.title ?? 'this topic'

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-xs mb-4">
        <h1 className="text-xl font-black text-gray-900 text-center">{topicTitle}</h1>
        <p className="text-xs text-gray-500 text-center mt-1">
          Thank you so much for helping!<br />We need your help in these certain ways.
        </p>
      </div>

      {/* Variant content */}
      {variant === 1 && statementA && (
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-gray-700 text-center">
            Please let me know what you think about this topic
          </p>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-5 text-center">
            <p className="text-sm text-gray-800 font-medium">{statementA.content}</p>
          </div>
          <div className="flex gap-3 mt-2">
            <button className="bg-gradient-to-r from-amber-400 to-orange-400 rounded-[1.5rem] px-5 py-2.5 text-sm font-bold text-gray-900 shadow active:scale-95 transition-transform">
              Agree
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 rounded-[1.5rem] px-5 py-2.5 text-sm font-bold text-gray-600 shadow active:scale-95 transition-transform">
              Disagree
            </button>
          </div>
        </div>
      )}

      {variant === 2 && statementA && (
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-gray-700 text-center">
            Please find some pro or con arguments for this statement
          </p>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-5 text-center">
            <p className="text-sm text-gray-800 font-medium">{statementA.content}</p>
          </div>
          <div className="flex gap-3 mt-2 w-full">
            <Link
              href={statementA.issue_id ? `/topics/${statementA.issue_id}/discussion` : '#'}
              className="flex-1"
            >
              <div className="bg-green-400 hover:bg-green-500 rounded-2xl py-4 text-center text-base font-bold text-white shadow active:scale-95 transition-transform">
                Pro
              </div>
            </Link>
            <Link
              href={statementA.issue_id ? `/topics/${statementA.issue_id}/discussion` : '#'}
              className="flex-1"
            >
              <div className="bg-red-400 hover:bg-red-500 rounded-2xl py-4 text-center text-base font-bold text-white shadow active:scale-95 transition-transform">
                Con
              </div>
            </Link>
          </div>
        </div>
      )}

      {variant === 3 && statementA && statementB && (
        <div className="w-full max-w-xs flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-gray-700 text-center">
            Please rank which one is more important to you
          </p>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-5 text-center">
            <p className="text-sm text-gray-800 font-medium">{statementA.content}</p>
          </div>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-5 py-5 text-center">
            <p className="text-sm text-gray-800 font-medium">{statementB.content}</p>
          </div>
        </div>
      )}

      {!statementA && (
        <p className="text-sm text-gray-400 text-center mt-8">No statements available yet.</p>
      )}

      {/* Thinking mongoose */}
      <div className="mt-6 pointer-events-none">
        <Image
          src="/mongoose-thinking.png"
          alt="Mongoose thinking"
          width={130}
          height={152}
          placeholder="empty"
          style={{ background: 'transparent' }}
          className="drop-shadow-lg"
        />
      </div>

      <Link href="/play" className="mt-6 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
