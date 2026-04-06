'use client'

// Module 69: Iteration Loops — restart discussion cycle on a closed topic
import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { RefreshCw } from 'lucide-react'

interface Props {
  issueId: string
  currentStatus: string
}

export function IterationButton({ issueId, currentStatus }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  if (!['closed', 'verification'].includes(currentStatus) || done) return null

  async function startNewCycle() {
    if (!confirm('Re-open this topic for a new discussion cycle?')) return
    setLoading(true)
    const { error } = await supabase
      .from('issue')
      .update({ status: 'discussion', discussion_at: new Date().toISOString() })
      .eq('id', issueId)
    if (!error) setDone(true)
    setLoading(false)
  }

  return (
    <button
      onClick={startNewCycle}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm font-medium text-amber-600 border border-amber-300 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Reopening…' : 'New Iteration'}
    </button>
  )
}
