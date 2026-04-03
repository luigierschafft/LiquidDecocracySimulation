'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Pencil, X, Check } from 'lucide-react'

interface Props {
  initiativeId: string
  initialTitle: string
  initialContent: string
  onSaved: (title: string, content: string) => void
  versioningEnabled?: boolean
  userId?: string | null
}

export function EditPropositionForm({ initiativeId, initialTitle, initialContent, onSaved, versioningEnabled = false, userId }: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function save() {
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError(null)

    if (versioningEnabled && userId) {
      const { data: versions } = await supabase
        .from('initiative_version')
        .select('version_num')
        .eq('initiative_id', initiativeId)
        .order('version_num', { ascending: false })
        .limit(1)

      const nextVersion = ((versions?.[0]?.version_num ?? 0) + 1) as number

      await supabase.from('initiative_version').insert({
        initiative_id: initiativeId,
        version_num: nextVersion,
        title: initialTitle,
        content: initialContent,
        edited_by: userId,
      })
    }

    const { error } = await supabase
      .from('initiative')
      .update({ title: title.trim(), content: content.trim() })
      .eq('id', initiativeId)

    if (error) {
      setError('Failed to save changes.')
    } else {
      onSaved(title.trim(), content.trim())
      setEditing(false)
    }
    setLoading(false)
  }

  function cancel() {
    setTitle(initialTitle)
    setContent(initialContent)
    setEditing(false)
    setError(null)
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
        title="Edit proposition"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit
      </button>
    )
  }

  return (
    <div className="space-y-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Proposition title"
        className="input w-full text-sm font-semibold"
        autoFocus
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Proposition content (Markdown supported)"
        className="input w-full text-sm py-2 resize-none"
        rows={6}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors px-2 py-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
        <button
          onClick={save}
          disabled={loading || !title.trim() || !content.trim()}
          className="btn-primary flex items-center gap-1 text-xs px-3 py-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
