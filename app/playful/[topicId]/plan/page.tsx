import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

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
    { border: 'border-violet-200', header: 'from-violet-400 to-violet-500', badge: 'bg-violet-100 text-violet-700' },
    { border: 'border-blue-200', header: 'from-blue-400 to-blue-500', badge: 'bg-blue-100 text-blue-700' },
    { border: 'border-cyan-200', header: 'from-cyan-400 to-cyan-500', badge: 'bg-cyan-100 text-cyan-700' },
    { border: 'border-teal-200', header: 'from-teal-400 to-teal-500', badge: 'bg-teal-100 text-teal-700' },
    { border: 'border-green-200', header: 'from-green-400 to-green-500', badge: 'bg-green-100 text-green-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 pt-6 pb-16">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <Link href={`/playful/${params.topicId}`} className="text-xs text-gray-400 underline">
            ← Back
          </Link>
          <h1 className="text-xl font-black text-gray-900 leading-tight mt-2">{issue.title}</h1>
          <p className="text-sm text-amber-600 font-semibold mt-0.5">Plans</p>
        </div>

        {list.length === 0 ? (
          <div className="bg-white/80 rounded-[1.5rem] border border-amber-200 shadow-sm px-6 py-12 text-center">
            <div className="text-4xl mb-3">🗺️</div>
            <p className="text-gray-500 text-sm">No proposals to plan yet.</p>
            <Link
              href={`/playful/${params.topicId}/proposals`}
              className="mt-3 inline-block text-xs text-amber-600 underline underline-offset-2"
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
                <div key={p.id} className={`bg-white rounded-[1.5rem] border ${color.border} shadow-md overflow-hidden`}>
                  {/* Colored header */}
                  <div className={`bg-gradient-to-r ${color.header} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-black text-sm">#{i + 1}</span>
                      <span className="text-white/70 text-xs">Proposal</span>
                    </div>
                    <span className="text-white/70 text-xs">{author}</span>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Full proposal text */}
                    <p className="text-sm text-gray-800 leading-relaxed">{p.text}</p>

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
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.badge}`}>
                        👍 {proCount} pro
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.badge}`}>
                        👎 {contraCount} contra
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color.badge}`}>
                        ✏️ {improvements.length} improvements
                      </span>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/playful/${params.topicId}/plan/${p.id}`}
                      className="flex items-center justify-between bg-gradient-to-r from-amber-400 to-orange-400 rounded-[1.2rem] px-5 py-3 active:scale-95 transition-transform shadow-sm"
                    >
                      <span className="text-sm font-bold text-gray-900">See full project plan</span>
                      <span className="text-gray-900 text-lg">→</span>
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
