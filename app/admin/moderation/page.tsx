import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { ModerationActions } from './ModerationActions'

export const dynamic = 'force-dynamic'

export default async function AdminModerationPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const { data: member } = await supabase
    .from('member')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!member?.is_admin) notFound()

  // Fetch pending statements with author display_name
  const { data: statements } = await supabase
    .from('ev_statements')
    .select(`
      id,
      text,
      created_at,
      issue_id,
      author:member!ev_statements_author_id_fkey(display_name, email)
    `)
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: true })

  const rows = statements ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-foreground/40 hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-accent" />
            Content Moderation
          </h1>
          <p className="text-foreground/60 mt-0.5">
            {rows.length} statement{rows.length !== 1 ? 's' : ''} pending review
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="card text-center py-12 text-foreground/40">
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No statements pending review.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((s: any) => {
            const author = s.author
            const authorLabel = author?.display_name ?? author?.email ?? 'Unknown'
            const postedAt = new Date(s.created_at).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })

            return (
              <div key={s.id} className="card space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">{s.text}</p>
                    <p className="text-xs text-foreground/40">
                      by {authorLabel} · {postedAt}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <ModerationActions statementId={s.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
