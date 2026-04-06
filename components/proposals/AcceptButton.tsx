'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

interface Props {
  issueId: string
  initiativeId: string
  isAlreadyAccepted: boolean
}

export function AcceptButton({ issueId, initiativeId, isAlreadyAccepted }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleAccept() {
    if (!confirm('Accept this proposal and close the topic?')) return
    setLoading(true)

    const res = await fetch('/api/admin/accept-initiative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ issueId, initiativeId }),
    })

    if (res.ok) {
      router.refresh()
    } else {
      const { error } = await res.json()
      alert(error ?? 'Failed to accept proposal')
    }
    setLoading(false)
  }

  if (isAlreadyAccepted) return null

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-medium text-auro-green border border-auro-green/40 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      <CheckCircle2 className="w-3.5 h-3.5" />
      {loading ? 'Accepting…' : 'Accept this proposal'}
    </button>
  )
}
