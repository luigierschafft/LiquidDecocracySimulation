'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

export function ResolveReportButton({ reportId }: { reportId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function resolve() {
    setLoading(true)
    await supabase.from('content_report').update({ resolved: true }).eq('id', reportId)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={resolve}
      disabled={loading}
      className="btn-secondary flex items-center gap-1.5 text-sm flex-shrink-0"
    >
      <CheckCircle2 className="w-4 h-4" />
      {loading ? 'Resolving…' : 'Resolve'}
    </button>
  )
}
