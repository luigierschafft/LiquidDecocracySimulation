'use client'

import { useState } from 'react'
import { EditPropositionForm } from './EditPropositionForm'
import type { Initiative } from '@/lib/types'
import { getMemberDisplayName, formatDate } from '@/lib/utils'
import { CheckCircle2, Trophy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Props {
  initiative: Initiative
  isAccepted: boolean
  isAdmin: boolean
  userId: string | null
  editingEnabled?: boolean
  children: React.ReactNode
}

export function PropositionCard({ initiative, isAccepted, isAdmin, userId, editingEnabled = true, children }: Props) {
  const [title, setTitle] = useState(initiative.title)
  const [content, setContent] = useState(initiative.content)

  const canEdit = editingEnabled && userId === initiative.author_id

  return (
    <div
      id={`initiative-${initiative.id}`}
      className={`card space-y-6 ${isAccepted ? 'border-auro-green/40 bg-green-50/20' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs text-foreground/40">
              by {getMemberDisplayName(initiative.author)} · {formatDate(initiative.created_at)}
            </p>
            {canEdit && (
              <EditPropositionForm
                initiativeId={initiative.id}
                initialTitle={title}
                initialContent={content}
                onSaved={(t, c) => { setTitle(t); setContent(c) }}
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAccepted && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-auro-green bg-green-100 px-2.5 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5" />
              Accepted
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-foreground/80">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {children}
    </div>
  )
}
