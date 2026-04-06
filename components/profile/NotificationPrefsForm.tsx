'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Props {
  memberId: string
  prefs: Record<string, boolean>
}

const NOTIF_TYPES: { key: string; label: string }[] = [
  { key: 'new_opinion', label: 'New comments on topics you follow' },
  { key: 'phase_change', label: 'Topic phase changes (e.g. voting starts)' },
  { key: 'reply', label: 'Replies to your comments' },
  { key: 'mention', label: 'Mentions (@you) in comments' },
]

export function NotificationPrefsForm({ memberId, prefs: initial }: Props) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(initial)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  function toggle(key: string) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  }

  async function save() {
    await supabase
      .from('member')
      .update({ notification_preferences: prefs })
      .eq('id', memberId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-3">
      {NOTIF_TYPES.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={prefs[key] !== false}
            onChange={() => toggle(key)}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">{label}</span>
        </label>
      ))}
      <div className="flex justify-end">
        <button onClick={save} className={saved ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  )
}
