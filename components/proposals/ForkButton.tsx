'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { GitFork } from 'lucide-react'

interface Props {
  initiativeId: string
  issueId: string
  title: string
  content: string
  userId: string
}

export function ForkButton({ initiativeId, issueId, title, content, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleFork() {
    setLoading(true)
    const { error } = await supabase.from('initiative').insert({
      issue_id: issueId,
      title: `Fork: ${title}`,
      content,
      author_id: userId,
      forked_from_id: initiativeId,
    })
    setLoading(false)
    if (!error) {
      window.location.reload()
    }
  }

  return (
    <button
      onClick={handleFork}
      disabled={loading}
      className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
      title="Fork this proposition"
    >
      <GitFork className="w-3.5 h-3.5" />
      {loading ? 'Forking…' : 'Fork'}
    </button>
  )
}
