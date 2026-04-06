import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Flag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ResolveReportButton } from './ResolveReportButton'
import { getEffectiveModules } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [memberResult, modules] = await Promise.all([
    supabase.from('member').select('is_admin, is_moderator').eq('id', user.id).single(),
    getEffectiveModules(user.id),
  ])

  const member = memberResult.data
  // Admins always have access; moderators get access when roles_permissions module is on
  const canAccess = member?.is_admin || (modules.roles_permissions && member?.is_moderator)
  if (!canAccess) notFound()

  const { data: reports } = await supabase
    .from('content_report')
    .select(`
      *,
      reporter:member!content_report_reporter_id_fkey(display_name, email)
    `)
    .eq('resolved', false)
    .order('created_at', { ascending: false })

  const rows = reports ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flag className="w-7 h-7 text-accent" />
            Content Reports
          </h1>
          <p className="text-foreground/60 mt-0.5">{rows.length} unresolved report{rows.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card text-center py-12 text-foreground/40">
          <Flag className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No unresolved reports.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r: any) => (
            <div key={r.id} className="card space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full capitalize">
                      {r.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-foreground/40">
                      {r.opinion_id ? 'Opinion' : r.argument_id ? 'Argument' : 'Initiative'} ·{' '}
                      reported by {r.reporter?.display_name ?? r.reporter?.email ?? 'Unknown'} ·{' '}
                      {formatDate(r.created_at)}
                    </span>
                  </div>
                  {r.notes && <p className="text-sm text-foreground/70">{r.notes}</p>}
                </div>
                <ResolveReportButton reportId={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
