'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Props {
  memberId: string
  currentLimit: number | null
}

export function DelegationLimitForm({ memberId, currentLimit }: Props) {
  const [unlimited, setUnlimited] = useState(currentLimit === null)
  const [limit, setLimit] = useState(currentLimit ?? 10)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function save() {
    await supabase
      .from('member')
      .update({ max_incoming_delegations: unlimited ? null : limit })
      .eq('id', memberId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/60">
        Set a maximum number of members who can delegate to you. Leave unlimited to accept all delegations.
      </p>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={unlimited}
          onChange={(e) => setUnlimited(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm">Unlimited incoming delegations</span>
      </label>
      {!unlimited && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Maximum delegations</label>
          <input
            type="number"
            min={0}
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 0)}
            className="input w-32"
          />
        </div>
      )}
      <div className="flex justify-end">
        <button onClick={save} className={saved ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
          {saved ? 'Saved!' : 'Save Limit'}
        </button>
      </div>
    </div>
  )
}
