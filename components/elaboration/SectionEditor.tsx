'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { ElaborationSection, ElaborationComment } from '@/lib/types'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { Pencil, Check, X, MessageSquare, Send } from 'lucide-react'

interface Props {
  section: ElaborationSection
  comments: ElaborationComment[]
  canEdit: boolean
  userId: string | null
}

export function SectionEditor({ section, comments: initialComments, canEdit, userId }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(section.content)
  const [saving, setSaving] = useState(false)

  const [comments, setComments] = useState<ElaborationComment[]>(initialComments)
  const [commentText, setCommentText] = useState('')
  const [commenting, setCommenting] = useState(false)

  async function saveSection() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase
      .from('elaboration_section')
      .update({ content: draft, updated_by: user?.id, updated_at: new Date().toISOString() })
      .eq('id', section.id)
    setEditing(false)
    setSaving(false)
    router.refresh()
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim() || !userId) return
    setCommenting(true)

    const { data, error } = await supabase
      .from('elaboration_comment')
      .insert({ section_id: section.id, author_id: userId, content: commentText.trim() })
      .select('*, author:member!elaboration_comment_author_id_fkey(*)')
      .single()

    if (!error && data) {
      setComments((prev) => [...prev, data as unknown as ElaborationComment])
      setCommentText('')
    }
    setCommenting(false)
  }

  return (
    <div className="card space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-base">{section.title}</h3>
        {canEdit && !editing && (
          <button
            onClick={() => { setDraft(section.content); setEditing(true) }}
            className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors px-2 py-1 rounded"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {/* Content / Editor */}
      {editing ? (
        <div className="space-y-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="input resize-none font-mono text-sm w-full"
            placeholder="Write in Markdown…"
            autoFocus
          />
          <div className="flex items-center gap-2 text-xs text-foreground/40">
            <span>Markdown supported</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveSection}
              disabled={saving}
              className="flex items-center gap-1.5 btn-primary text-sm py-1.5 px-3"
            >
              <Check className="w-3.5 h-3.5" />
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 btn-secondary text-sm py-1.5 px-3"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[60px]">
          {section.content ? (
            <div className="prose prose-sm max-w-none text-foreground/80">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-foreground/30 italic">
              {canEdit ? 'Click Edit to add content…' : 'No content yet.'}
            </p>
          )}
          {section.updated_at && (
            <p className="text-xs text-foreground/30 mt-2">
              Last edited {formatDate(section.updated_at)}
            </p>
          )}
        </div>
      )}

      {/* Comments */}
      <div className="border-t border-sand pt-4 space-y-3">
        <h4 className="text-xs font-medium text-foreground/50 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Comments & Suggestions ({comments.length})
        </h4>

        {comments.length > 0 && (
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2.5">
                <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {getMemberDisplayName(c.author)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-medium">{getMemberDisplayName(c.author)}</span>
                    <span className="text-xs text-foreground/30">{formatDate(c.created_at)}</span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-0.5 break-words">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {userId ? (
          <form onSubmit={addComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment or suggestion…"
              className="input flex-1 text-sm py-1.5"
            />
            <button
              type="submit"
              disabled={commenting || !commentText.trim()}
              className="btn-primary px-3 py-1.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <p className="text-xs text-foreground/40">Sign in to comment.</p>
        )}
      </div>
    </div>
  )
}
