import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HelpSession } from '@/components/play/HelpSession'

export const dynamic = 'force-dynamic'

export default async function PlayHelpPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const [{ data: issues }, { data: stmts }] = await Promise.all([
    supabase
      .from('issue')
      .select('id, title, created_at')
      .neq('status', 'draft')
      .order('created_at', { ascending: true }),
    supabase.from('ev_statements').select('issue_id'),
  ])

  const countMap = new Map<string, number>()
  for (const s of stmts ?? []) {
    countMap.set(s.issue_id, (countMap.get(s.issue_id) ?? 0) + 1)
  }

  const topics = (issues ?? []).map(issue => ({
    id: issue.id,
    title: issue.title,
    createdAt: issue.created_at as string,
    statementCount: countMap.get(issue.id) ?? 0,
  }))

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-12">
      <HelpSession topics={topics} userId={user.id} />
      <Link href="/playful" className="mt-10 text-xs text-gray-400 underline">
        ← Back
      </Link>
    </div>
  )
}
