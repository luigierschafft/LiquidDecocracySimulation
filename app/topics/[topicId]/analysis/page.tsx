import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { analyze } from '@/lib/analysis/polis'

export const dynamic = 'force-dynamic'

// ── Scatter plot (inline SVG) ─────────────────────────────────────────────────

function ScatterPlot({
  points,
  groups,
}: {
  points: { x: number; y: number; group: number }[]
  groups: { id: number; color: string; size: number }[]
}) {
  const SIZE = 220
  const PAD  = 20
  const area = SIZE - PAD * 2

  function toSvg(v: number) {
    return PAD + ((v + 1) / 2) * area
  }

  return (
    <svg width={SIZE} height={SIZE} className="mx-auto block">
      {/* Axis lines */}
      <line x1={PAD} y1={SIZE / 2} x2={SIZE - PAD} y2={SIZE / 2} stroke="#e5e7eb" strokeWidth={1} />
      <line x1={SIZE / 2} y1={PAD} x2={SIZE / 2} y2={SIZE - PAD} stroke="#e5e7eb" strokeWidth={1} />

      {/* Points */}
      {points.map((p, i) => {
        const color = groups.find((g) => g.id === p.group)?.color ?? '#6b7280'
        return (
          <circle
            key={i}
            cx={toSvg(p.x)}
            cy={toSvg(-p.y)}
            r={5}
            fill={color}
            fillOpacity={0.8}
            stroke="white"
            strokeWidth={1}
          />
        )
      })}
    </svg>
  )
}

// ── Bar for statement rating ──────────────────────────────────────────────────

function RatingBar({ value, max = 10, color = '#8b5cf6' }: { value: number; max?: number; color?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-2 rounded-full bg-gray-100 flex-1 min-w-0">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-gray-500 w-8 text-right flex-shrink-0">
        {value.toFixed(1)}
      </span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AnalysisPage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()

  const { data: issue } = await supabase
    .from('issue')
    .select('id, title')
    .eq('id', params.topicId)
    .single()

  if (!issue) notFound()

  const { data: stmts } = await supabase
    .from('ev_statements')
    .select('id, text')
    .eq('issue_id', params.topicId)
    .order('created_at', { ascending: true })

  const stmtIds = (stmts ?? []).map((s) => s.id)

  const { data: ratingsRaw } = stmtIds.length > 0
    ? await supabase
        .from('ev_statement_ratings')
        .select('statement_id, user_id, rating')
        .in('statement_id', stmtIds)
    : { data: [] }

  const result = analyze(ratingsRaw ?? [], stmts ?? [])

  const noData = result.participants === 0

  return (
    <div className="space-y-6 pb-12">

      {/* ── Participation ── */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-base">Participation</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Participants', value: result.participants },
            { label: 'Votes cast',   value: result.totalVotes },
            { label: 'Statements',   value: result.statements.length },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-sand/40 px-3 py-3 text-center">
              <p className="text-2xl font-bold text-accent">{s.value}</p>
              <p className="text-xs text-foreground/50 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {noData && (
          <p className="text-sm text-foreground/40 text-center pt-2">
            No votes yet — analysis will appear once participants start rating statements.
          </p>
        )}
      </div>

      {!noData && (
        <>
          {/* ── Statement ranking ── */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-base">Statement Ratings</h2>
            <p className="text-xs text-foreground/50">Sorted by average importance rating (0–10)</p>
            <div className="space-y-3">
              {result.consensus.map((s) => (
                <div key={s.id} className="space-y-1">
                  <p className="text-sm text-gray-800 leading-snug">{s.text}</p>
                  <div className="flex items-center gap-3">
                    <RatingBar value={s.avgRating} />
                    <span className="text-xs text-foreground/40 flex-shrink-0">{s.voteCount} votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divisive ── */}
          {result.divisive.some((s) => s.stdDev > 1.5) && (
            <div className="card space-y-4">
              <h2 className="font-semibold text-base">Most Contested</h2>
              <p className="text-xs text-foreground/50">
                Statements with the highest disagreement (standard deviation)
              </p>
              <div className="space-y-3">
                {result.divisive.filter((s) => s.stdDev > 1.5).slice(0, 5).map((s) => (
                  <div key={s.id} className="space-y-1">
                    <p className="text-sm text-gray-800 leading-snug">{s.text}</p>
                    <div className="flex items-center gap-3">
                      <RatingBar value={s.avgRating} color="#f59e0b" />
                      <span className="text-xs text-amber-600 flex-shrink-0 font-medium">
                        ±{s.stdDev.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Opinion map + groups ── */}
          {result.scatter.length >= 3 && (
            <div className="card space-y-4">
              <h2 className="font-semibold text-base">Opinion Map</h2>
              <p className="text-xs text-foreground/50">
                Each dot is a participant. Similar voting patterns cluster together.
              </p>

              <ScatterPlot points={result.scatter} groups={result.groups} />

              {result.groups.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {result.groups.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl border p-4 space-y-2"
                      style={{ borderColor: g.color + '55' }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: g.color }} />
                        <span className="text-sm font-semibold text-gray-800">
                          Group {g.id + 1}
                          <span className="ml-1.5 text-xs font-normal text-foreground/50">
                            {g.size} {g.size === 1 ? 'person' : 'people'}
                          </span>
                        </span>
                      </div>

                      {g.distinctHigh.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-green-600 mb-1">Rates higher than average</p>
                          <ul className="space-y-1">
                            {g.distinctHigh.map((s, i) => (
                              <li key={i} className="text-xs text-gray-700 leading-snug">
                                <span className="text-green-500 mr-1">+{(s.groupAvg - s.overallAvg).toFixed(1)}</span>
                                {s.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {g.distinctLow.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-red-500 mb-1">Rates lower than average</p>
                          <ul className="space-y-1">
                            {g.distinctLow.map((s, i) => (
                              <li key={i} className="text-xs text-gray-700 leading-snug">
                                <span className="text-red-400 mr-1">{(s.groupAvg - s.overallAvg).toFixed(1)}</span>
                                {s.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {g.distinctHigh.length === 0 && g.distinctLow.length === 0 && (
                        <p className="text-xs text-foreground/40">No strong deviations from average</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
