import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { StatementList } from '@/components/discussion/StatementList'
import { AddStatementForm } from '@/components/discussion/AddStatementForm'
import { getEffectiveModules } from '@/lib/modules'
import { botsEnabledForTopic } from '@/lib/bots/enabled'
import { BotStatementsButton } from '@/components/bots/BotStatementsButton'

export const dynamic = 'force-dynamic'

function getTimelineInfo(issue: any) {
  if (!issue.duration || issue.duration === 'forever' || !issue.closes_at) {
    return { isForever: true, percentUsed: 0, daysRemaining: null }
  }
  const created = new Date(issue.created_at).getTime()
  const closes = new Date(issue.closes_at).getTime()
  const now = Date.now()
  const total = closes - created
  const elapsed = now - created
  const percentUsed = Math.min(100, Math.max(0, (elapsed / total) * 100))
  const daysRemaining = Math.max(0, Math.ceil((closes - now) / (1000 * 60 * 60 * 24)))
  return { isForever: false, percentUsed, daysRemaining }
}

export default async function PlayfulDiscussionPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)

  const { data: issue } = await supabase
    .from('issue')
    .select('*')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()
  const botsEnabled = await botsEnabledForTopic(params.topicId)

  const { data: statements } = await supabase
    .from('ev_statements')
    .select('*, author:member(display_name, email), ratings:ev_statement_ratings(*)')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: false })

  const statementsWithAvg = (statements ?? []).map((s) => {
    const ratedEntries = (s.ratings ?? []).filter((r: any) => r.rating != null)
    return {
      ...s,
      avg_rating: ratedEntries.length > 0
        ? ratedEntries.reduce((sum: number, r: any) => sum + r.rating, 0) / ratedEntries.length
        : null,
      user_rating: s.ratings?.find((r: any) => r.user_id === user?.id)?.rating ?? null,
    }
  })

  const { isForever, percentUsed, daysRemaining } = getTimelineInfo(issue)

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">

      {/* Header */}
      <div className="w-full max-w-sm mb-6">
        <h1 className="text-xl font-black text-gray-900 leading-tight text-center">{issue.title}</h1>
        {issue.description && (
          <p className="text-xs text-gray-400 mt-1 text-center leading-relaxed">{issue.description}</p>
        )}

        {/* Timeline */}
        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3">
          {isForever ? (
            <p className="text-xs text-gray-400 text-center">Open forever</p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap font-medium">{daysRemaining} days left</span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1.5 text-center">
            <span className="text-orange-500 font-bold">{statementsWithAvg.length}</span> statements
          </p>
        </div>
      </div>

      {/* Add statement form */}
      {user && (
        <div className="w-full max-w-sm mb-4">
          <AddStatementForm
            topicId={params.topicId}
            duplicateDetectionEnabled={modules.ai_duplicate_detection ?? false}
            hateSpeechFilterEnabled={modules.hate_speech_filter ?? false}
          />
        </div>
      )}

      {/* Statement list */}
      <div className="w-full max-w-sm space-y-4">
        {user && botsEnabled && <BotStatementsButton topicId={params.topicId} />}
        <StatementList
          statements={statementsWithAvg}
          userId={user?.id ?? null}
          topicId={params.topicId}
          botsEnabled={botsEnabled}
        />
      </div>

      {/* Back */}
      <Link href={`/playful/${params.topicId}`} className="mt-8 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
