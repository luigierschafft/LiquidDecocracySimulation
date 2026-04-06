'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Props {
  memberId: string
  showVoteHistory: boolean
  showActivity: boolean
}

export function PrivacyForm({ memberId, showVoteHistory: initial1, showActivity: initial2 }: Props) {
  const [showVoteHistory, setShowVoteHistory] = useState(initial1)
  const [showActivity, setShowActivity] = useState(initial2)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function save() {
    await supabase
      .from('member')
      .update({ show_vote_history: showVoteHistory, show_activity: showActivity })
      .eq('id', memberId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showVoteHistory}
          onChange={(e) => setShowVoteHistory(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm">Show vote history on my profile</span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={showActivity}
          onChange={(e) => setShowActivity(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm">Show activity feed on my profile</span>
      </label>
      <div className="flex justify-end">
        <button onClick={save} className={saved ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
          {saved ? 'Saved!' : 'Save Privacy Settings'}
        </button>
      </div>
    </div>
  )
}
