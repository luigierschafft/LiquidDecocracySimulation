'use client'

import { useState } from 'react'
import type { Platform, PlatformMember } from '@/lib/types'

interface Props {
  platforms: Platform[]
  memberships: PlatformMember[]
  next: string
}

export function PlatformSelectClient({ platforms, memberships, next }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [joined, setJoined] = useState<string[]>([])

  const membershipMap = Object.fromEntries(memberships.map((m) => [m.platform_id, m]))

  async function handleEnter(slug: string) {
    setLoading(slug)
    await fetch('/api/platform/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    window.location.href = next
  }

  async function handleJoin(platformId: string) {
    setLoading(platformId)
    await fetch('/api/platform/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platformId }),
    })
    setJoined((prev) => [...prev, platformId])
    setLoading(null)
  }

  return (
    <div className="grid gap-4">
      {platforms.map((platform) => {
        const membership = membershipMap[platform.id]
        const isApproved = membership?.status === 'approved'
        const isPending = membership?.status === 'pending' || joined.includes(platform.id)
        const isLoading = loading === platform.slug || loading === platform.id

        return (
          <div
            key={platform.id}
            className={`card flex items-center justify-between gap-4 ${
              isApproved ? 'border-auro-green/30 bg-auro-green/5' : ''
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold">{platform.name}</h2>
                {platform.is_invite_only && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sand text-foreground/50">
                    Invite only
                  </span>
                )}
                {membership?.role === 'admin' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                    Admin
                  </span>
                )}
              </div>
              {platform.description && (
                <p className="text-sm text-foreground/60 mt-0.5 line-clamp-2">
                  {platform.description}
                </p>
              )}
            </div>

            <div className="shrink-0">
              {isApproved ? (
                <button
                  onClick={() => handleEnter(platform.slug)}
                  disabled={isLoading}
                  className="btn-primary min-w-[90px]"
                >
                  {isLoading ? 'Loading…' : 'Enter'}
                </button>
              ) : isPending ? (
                <span className="text-sm text-foreground/50 px-3 py-2 rounded-lg bg-sand">
                  Pending approval
                </span>
              ) : platform.is_invite_only ? (
                <span className="text-sm text-foreground/40 px-3 py-2">
                  Ask an admin
                </span>
              ) : (
                <button
                  onClick={() => handleJoin(platform.id)}
                  disabled={isLoading}
                  className="btn-secondary min-w-[120px]"
                >
                  {isLoading ? 'Requesting…' : 'Request Access'}
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
