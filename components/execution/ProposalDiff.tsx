'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { diffWords } from '@/lib/diff'
import type { SectionProposal } from '@/lib/types/ev'

interface Props {
  proposal: SectionProposal
  sectionContent: string
  userId: string | null
}

export function ProposalDiff({ proposal, sectionContent, userId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const diff = diffWords(proposal.old_content, proposal.new_content)
  const authorName = proposal.author?.display_name || proposal.author?.email || 'Someone'

  async function handleReview(accept: boolean) {
    if (!userId || loading) return
    setLoading(true)
    const supabase = createClient()

    if (accept) {
      // Apply the change to the section
      await supabase
        .from('ev_execution_sections')
        .update({
          content: proposal.new_content,
          updated_at: new Date().toISOString(),
          updated_by: proposal.author_id,
        })
        .eq('id', proposal.section_id)
    }

    await supabase
      .from('ev_section_proposals')
      .update({
        status: accept ? 'accepted' : 'rejected',
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', proposal.id)

    setLoading(false)
    router.refresh()
  }

  const dateStr = new Date(proposal.created_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  })

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-700 text-xs font-bold flex items-center justify-center">
            {authorName[0]?.toUpperCase()}
          </div>
          <span className="text-xs font-medium text-gray-700">{authorName}</span>
          <span className="text-xs text-gray-400">{dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleReview(true)}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
          >
            <Check className="w-3 h-3" /> Accept
          </button>
          <button
            onClick={() => handleReview(false)}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-400 text-white hover:bg-red-500 disabled:opacity-50 transition-colors font-medium"
          >
            <X className="w-3 h-3" /> Reject
          </button>
        </div>
      </div>

      {proposal.comment && (
        <p className="text-xs text-gray-600 italic">&quot;{proposal.comment}&quot;</p>
      )}

      {/* Diff view */}
      <div className="text-sm leading-relaxed bg-white rounded-lg p-3 border border-gray-100 font-mono text-xs whitespace-pre-wrap">
        {diff.map((op, i) => {
          if (op.type === 'equal') return <span key={i}>{op.text}</span>
          if (op.type === 'delete')
            return <span key={i} className="bg-red-100 text-red-700 line-through">{op.text}</span>
          return <span key={i} className="bg-green-100 text-green-700">{op.text}</span>
        })}
      </div>
    </div>
  )
}
