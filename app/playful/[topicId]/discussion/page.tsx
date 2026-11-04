import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PlayBack } from '@/components/play/PlayBack'
import { Mascot } from '@/components/play/Mascot'
import { StatementList } from '@/components/discussion/StatementList'
import { AddStatementForm } from '@/components/discussion/AddStatementForm'
import { getEffectiveModules } from '@/lib/modules'

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
    <div className="mx-auto w-full max-w-sm pb-16">
      <PlayBack href={`/playful/${params.topicId}`} label="Topic" />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-fun font-semibold text-sm text-sun-700">Discussion</p>
            <h1 className="font-fun font-semibold text-[1.5rem] leading-[1.2] text-gray-900">{issue.title}</h1>
          </div>
          <Mascot pose="thinking" size="sm" />
        </div>
        {issue.description && (
          <p className="text-[15px] font-semibold text-gray-600 mt-2 leading-relaxed">{issue.description}</p>
        )}

        {/* Timeline */}
        <div className="mt-4 bg-white/80 rounded-3xl px-5 py-3.5">
          {isForever ? (
            <p className="text-sm font-bold text-gray-500 text-center">Open forever</p>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                    style={{ width: `${percentUsed}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap font-bold">{daysRemaining} days left</span>
              </div>
            </div>
          )}
          <p className="text-sm font-bold text-gray-500 mt-1.5 text-center">
            <span className="text-sun-700">{statementsWithAvg.length}</span> statements
          </p>
        </div>
      </div>

      {/* Add statement form */}
      {user && (
        <div className="mb-4">
          <AddStatementForm
            topicId={params.topicId}
            duplicateDetectionEnabled={modules.ai_duplicate_detection ?? false}
            hateSpeechFilterEnabled={modules.hate_speech_filter ?? false}
          />
        </div>
      )}

      {/* Statement list */}
      <div>
        <StatementList
          statements={statementsWithAvg}
          userId={user?.id ?? null}
          topicId={params.topicId}
        />
      </div>

    </div>
  )
}
