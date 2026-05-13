'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Rocket } from 'lucide-react'

interface Props {
  topicId: string
  proposalId: string
}

export function CreateWorkspaceButton({ topicId, proposalId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Create execution plan
    const { data: plan } = await supabase
      .from('ev_execution_plans')
      .insert({ issue_id: topicId, proposal_id: proposalId })
      .select('id')
      .single()

    if (!plan) { setLoading(false); return }

    // Add creator as team lead
    await supabase.from('ev_execution_team').insert({
      plan_id: plan.id,
      user_id: user.id,
      role: 'Team Lead',
      status: 'active',
      is_lead: true,
    })

    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors shadow-sm"
    >
      <Rocket className="w-4 h-4" />
      {loading ? 'Creating…' : 'Start Workspace'}
    </button>
  )
}
