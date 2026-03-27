'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'

interface ProfileFormProps {
  memberId: string
  currentName: string
}

export function ProfileForm({ memberId, currentName }: ProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('member').update({ display_name: name }).eq('id', memberId)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="flex gap-3 items-end border-t border-sand pt-4">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1.5">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input"
        />
      </div>
      <Button type="submit" loading={loading} variant={saved ? 'secondary' : 'primary'}>
        {saved ? 'Saved!' : 'Save'}
      </Button>
    </form>
  )
}
