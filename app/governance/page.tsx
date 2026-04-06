import { createClient } from '@/lib/supabase/server'
import { getAppSetting } from '@/lib/data/settings'
import { getEffectiveModules } from '@/lib/modules'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function GovernancePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const modules = await getEffectiveModules(user?.id)
  if (!modules.governance_rules) notFound()

  const rules = await getAppSetting('governance_rules') ?? ''

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-accent" />
          Governance Rules
        </h1>
        <p className="text-foreground/60 mt-1">Platform rules and decision-making guidelines</p>
      </div>

      {rules ? (
        <div className="card prose prose-sm max-w-none">
          <ReactMarkdown>{rules}</ReactMarkdown>
        </div>
      ) : (
        <div className="card text-center py-10 text-foreground/40">
          <p>No governance rules have been published yet.</p>
        </div>
      )}
    </div>
  )
}
