'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'

interface ProfileFormProps {
  memberId: string
  currentName: string
  currentBio?: string | null
  currentInterests?: string[] | null
  currentLocation?: string | null
  userProfilesEnabled?: boolean
}

export function ProfileForm({
  memberId,
  currentName,
  currentBio,
  currentInterests,
  currentLocation,
  userProfilesEnabled = false,
}: ProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [bio, setBio] = useState(currentBio ?? '')
  const [interests, setInterests] = useState((currentInterests ?? []).join(', '))
  const [location, setLocation] = useState(currentLocation ?? '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const updates: Record<string, unknown> = { display_name: name }

    if (userProfilesEnabled) {
      updates.bio = bio || null
      updates.interests = interests
        ? interests.split(',').map((s) => s.trim()).filter(Boolean)
        : null
      updates.location = location || null
    }

    await supabase.from('member').update(updates).eq('id', memberId)
    setSaved(true)
    setLoading(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4 border-t border-sand pt-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Display Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="input"
        />
      </div>

      {userProfilesEnabled && (
        <>
          <div>
            <label className="block text-sm font-medium mb-1.5">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Auroville, India"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short description about yourself"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Interests</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. ecology, education, governance (comma-separated)"
              className="input"
            />
            <p className="text-xs text-foreground/40 mt-1">Separate interests with commas</p>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={loading} variant={saved ? 'secondary' : 'primary'}>
          {saved ? 'Saved!' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
