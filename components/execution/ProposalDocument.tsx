'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { FileText, Edit3, Check, X } from 'lucide-react'

interface Props {
  planId: string
  proposalText: string | null
  userId: string | null
}

export function ProposalDocument({ planId, proposalText, userId }: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(proposalText ?? '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('ev_execution_plans')
      .update({ proposal_text: text.trim() || null })
      .eq('id', planId)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-700">Project Proposal</h3>
        </div>
        {userId && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-gray-400 hover:text-purple-600 transition-colors"
            title="Edit proposal"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={24}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write the project proposal here. Markdown is supported (# headings, **bold**, - lists)."
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setEditing(false); setText(proposalText ?? '') }}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
          </div>
        </div>
      ) : text ? (
        <div className="prose prose-sm max-w-none text-gray-800">
          {text.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-4 mb-1 first:mt-0">{line.slice(2)}</h2>
            if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-semibold text-gray-800 mt-3 mb-1">{line.slice(3)}</h3>
            if (line.startsWith('### ')) return <h4 key={i} className="text-sm font-medium text-gray-700 mt-2 mb-0.5">{line.slice(4)}</h4>
            if (line.startsWith('- ') || line.startsWith('* ')) return (
              <div key={i} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-purple-400 shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
              </div>
            )
            if (line.trim() === '') return <div key={i} className="h-2" />
            return <p key={i} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">
          No proposal document yet.{userId ? ' Click the edit icon to start writing.' : ''}
        </p>
      )}
    </div>
  )
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}
