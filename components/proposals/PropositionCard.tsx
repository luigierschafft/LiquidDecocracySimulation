'use client'

import { useState } from 'react'
import { EditPropositionForm } from './EditPropositionForm'
import { ForkButton } from './ForkButton'
import { VersionHistory } from './VersionHistory'
import type { Initiative } from '@/lib/types'
import { getMemberDisplayName, formatDate } from '@/lib/utils'
import { Trophy, FileEdit, GitFork } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'

interface Props {
  initiative: Initiative
  isAccepted: boolean
  isAdmin: boolean
  userId: string | null
  editingEnabled?: boolean
  draftEnabled?: boolean
  forkingEnabled?: boolean
  versioningEnabled?: boolean
  children: React.ReactNode
}

export function PropositionCard({
  initiative,
  isAccepted,
  isAdmin,
  userId,
  editingEnabled = true,
  draftEnabled = false,
  forkingEnabled = false,
  versioningEnabled = false,
  children,
}: Props) {
  const [title, setTitle] = useState(initiative.title)
  const [content, setContent] = useState(initiative.content)
  const [publishing, setPublishing] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const canEdit = editingEnabled && userId === initiative.author_id
  const isDraft = initiative.is_draft ?? false
  const canPublish = draftEnabled && isDraft && userId === initiative.author_id
  const canFork = forkingEnabled && !!userId && userId !== initiative.author_id && !isDraft

  async function handlePublish() {
    setPublishing(true)
    await supabase.from('initiative').update({ is_draft: false }).eq('id', initiative.id)
    setPublishing(false)
    router.refresh()
  }

  return (
    <div
      id={`initiative-${initiative.id}`}
      className={`card space-y-6 ${isAccepted ? 'border-auro-green/40 bg-green-50/20' : ''} ${isDraft ? 'border-dashed border-foreground/20 bg-foreground/[0.02]' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-xs text-foreground/40">
              by {getMemberDisplayName(initiative.author)} · {formatDate(initiative.created_at)}
            </p>
            {forkingEnabled && initiative.forked_from_id && (
              <span className="flex items-center gap-1 text-xs text-foreground/40">
                <GitFork className="w-3 h-3" />
                Forked
              </span>
            )}
            {canEdit && (
              <EditPropositionForm
                initiativeId={initiative.id}
                initialTitle={title}
                initialContent={content}
                onSaved={(t, c) => { setTitle(t); setContent(c) }}
                versioningEnabled={versioningEnabled}
                userId={userId}
              />
            )}
            {canFork && (
              <ForkButton
                initiativeId={initiative.id}
                issueId={initiative.issue_id}
                title={title}
                content={content}
                userId={userId!}
              />
            )}
            {versioningEnabled && (
              <VersionHistory initiativeId={initiative.id} />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {draftEnabled && isDraft && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/50 bg-foreground/10 px-2.5 py-1 rounded-full">
              <FileEdit className="w-3.5 h-3.5" />
              Draft
            </div>
          )}
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

      {canPublish && (
        <div className="flex items-center gap-3 border-t border-sand pt-4">
          <p className="text-xs text-foreground/50 flex-1">This is a draft — only you can see it.</p>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary text-sm px-4 py-1.5"
          >
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
