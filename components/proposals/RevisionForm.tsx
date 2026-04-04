'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

interface Props {
  initiativeId: string
  currentContent: string
  userId: string
}

export function RevisionForm({ initiativeId, currentContent, userId }: Props) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState(currentContent)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    // Save current version first
    const { data: versions } = await supabase
      .from('initiative_version')
      .select('version_num')
      .eq('initiative_id', initiativeId)
      .order('version_num', { ascending: false })
      .limit(1)

    const nextVersion = ((versions?.[0]?.version_num ?? 0) + 1)
    await supabase.from('initiative_version').insert({
      initiative_id: initiativeId,
      version_num: nextVersion,
      title: '',
      content: currentContent,
      edited_by: userId,
    })

    await supabase.from('initiative').update({ content: content.trim() }).eq('id', initiativeId)
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-accent border border-accent/30 hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Submit Revision
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="card space-y-3 border-amber-200 bg-amber-50/30">
      <p className="text-sm font-medium text-amber-700">Submit a revision during review phase</p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="input w-full text-sm resize-none"
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-foreground/50 px-3 py-1.5">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn-primary text-xs px-4 py-1.5">
          {loading ? 'Submitting…' : 'Submit Revision'}
        </button>
      </div>
    </form>
  )
}
