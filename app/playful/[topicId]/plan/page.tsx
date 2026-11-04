import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PlayHeader } from '@/components/play/PlayHeader'
import { Mascot } from '@/components/play/Mascot'

export const dynamic = 'force-dynamic'

export default async function PlayPlanPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const [{ data: issue }, { data: proposals }] = await Promise.all([
    supabase.from('issue').select('id, title').eq('id', params.topicId).single(),
    supabase
      .from('ev_topic_proposals')
      .select(`
        id, text, created_at,
        author:member(display_name, email),
        votes:ev_proposal_votes(*),
        arguments:ev_proposal_arguments(id, type),
        improvements:ev_proposed_improvements(id)
      `)
      .eq('issue_id', params.topicId)
      .order('created_at', { ascending: true }),
  ])

  if (!issue) notFound()

  const list = proposals ?? []

  const stepColors = [
    { dot: '#F5AE3A', badge: 'bg-gray-100 text-gray-700' },
    { dot: '#4C95DB', badge: 'bg-gray-100 text-gray-700' },
    { dot: '#6DBA4A', badge: 'bg-gray-100 text-gray-700' },
    { dot: '#E866A6', badge: 'bg-gray-100 text-gray-700' },
    { dot: '#33B4C6', badge: 'bg-gray-100 text-gray-700' },
  ]

  return (
    <div className="pb-16">
      <div className="max-w-xl mx-auto space-y-5">

        {/* Header */}
        <PlayHeader backHref={`/playful/${params.topicId}`} section="Plans" title={issue.title} />

        {list.length === 0 ? (
          <div className="play-card px-6 py-10 flex flex-col items-center text-center">
            <Mascot pose="thinking" size="md" />
            <p className="mt-3 font-fun font-semibold text-lg text-gray-800">Nothing to plan yet</p>
            <p className="text-[15px] font-semibold text-gray-500">Plans start from proposals.</p>
            <Link
              href={`/playful/${params.topicId}/proposals`}
              className="mt-4 play-btn-sun !w-auto !min-h-[48px] !py-2.5 !text-base"
            >
              Go to proposals first
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {list.map((p: any, i: number) => {
              const color = stepColors[i % stepColors.length]
              const votes: any[] = p.votes ?? []
              const args: any[] = p.arguments ?? []
              const improvements: any[] = p.improvements ?? []
              const totalVotes = votes.length
              const approveCount = votes.filter((v) => v.vote === 'approve').length
              const disapproveCount = votes.filter((v) => v.vote === 'disapprove').length
              const abstainCount = votes.filter((v) => v.vote === 'abstain').length
              const strongNoCount = votes.filter((v) => v.vote === 'strong_disapproval').length
              const proCount = args.filter((a) => a.type === 'pro').length
              const contraCount = args.filter((a) => a.type === 'contra').length
              const author = p.author?.display_name || p.author?.email || 'Anonymous'

              return (
                <div key={p.id} className="bg-white rounded-3xl shadow-cushion-white overflow-hidden">
                  {/* Colored header */}
                  <div className="px-5 pt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-7 min-w-[28px] px-2 rounded-full text-white font-fun font-semibold text-sm inline-flex items-center justify-center" style={{ background: color.dot }}>{i + 1}</span>
                      <span className="font-fun font-semibold text-[15px] text-gray-500">Proposal</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-500 truncate">{author}</span>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Full proposal text */}
                    <p className="text-base font-semibold text-gray-800 leading-relaxed">{p.text}</p>

                    {/* Vote bar */}
                    {totalVotes > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                          {approveCount > 0 && (
                            <div className="bg-green-400 transition-all" style={{ width: `${(approveCount / totalVotes) * 100}%` }} />
                          )}
                          {abstainCount > 0 && (
                            <div className="bg-gray-300 transition-all" style={{ width: `${(abstainCount / totalVotes) * 100}%` }} />
                          )}
                          {disapproveCount > 0 && (
                            <div className="bg-orange-400 transition-all" style={{ width: `${(disapproveCount / totalVotes) * 100}%` }} />
                          )}
                          {strongNoCount > 0 && (
                            <div className="bg-red-500 transition-all" style={{ width: `${(strongNoCount / totalVotes) * 100}%` }} />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                          {approveCount > 0 && <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />{approveCount} approve</span>}
                          {abstainCount > 0 && <span><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />{abstainCount} abstain</span>}
                          {disapproveCount > 0 && <span><span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1" />{disapproveCount} disapprove</span>}
                          {strongNoCount > 0 && <span><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />{strongNoCount} strong no</span>}
                        </div>
                      </div>
                    )}
                    {totalVotes === 0 && (
                      <p className="text-xs text-gray-400">No votes yet</p>
                    )}

                    {/* Stats row */}
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${color.badge}`}>
                        {proCount} pro
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${color.badge}`}>
                        {contraCount} contra
                      </span>
                      <span className={`text-sm font-bold px-3 py-1 rounded-full ${color.badge}`}>
                        {improvements.length} improvements
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/playful/${params.topicId}/plan/${p.id}`}
                      className="play-btn-sun !min-h-[52px] !py-3 !text-base"
                    >
                      See the full plan
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
