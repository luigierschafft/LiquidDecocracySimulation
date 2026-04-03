'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Tag, Plus, X } from 'lucide-react'

interface TagItem {
  id: string
  name: string
  color: string
}

interface Props {
  issueId: string
  initialTags: TagItem[]
  canEdit: boolean
}

export function TagList({ issueId, initialTags, canEdit }: Props) {
  const [tags, setTags] = useState<TagItem[]>(initialTags)
  const [adding, setAdding] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function addTag() {
    const name = newTag.trim()
    if (!name || loading) return
    setLoading(true)

    let tagId: string

    const { data: existing } = await supabase
      .from('tag')
      .select('id, name, color')
      .eq('name', name)
      .single()

    if (existing) {
      tagId = existing.id
    } else {
      const { data: created, error } = await supabase
        .from('tag')
        .insert({ name })
        .select('id, name, color')
        .single()
      if (error || !created) { setLoading(false); return }
      tagId = created.id
    }

    await supabase.from('issue_tag').upsert({ issue_id: issueId, tag_id: tagId })

    const { data: tagData } = await supabase
      .from('tag')
      .select('id, name, color')
      .eq('id', tagId)
      .single()

    if (tagData && !tags.find((t) => t.id === tagId)) {
      setTags((prev) => [...prev, tagData as TagItem])
    }

    setNewTag('')
    setAdding(false)
    setLoading(false)
  }

  async function removeTag(tagId: string) {
    await supabase.from('issue_tag').delete().eq('issue_id', issueId).eq('tag_id', tagId)
    setTags((prev) => prev.filter((t) => t.id !== tagId))
  }

  if (tags.length === 0 && !canEdit) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Tag className="w-3.5 h-3.5 text-foreground/30 shrink-0" />
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
          {canEdit && (
            <button onClick={() => removeTag(tag.id)} className="opacity-70 hover:opacity-100">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      {canEdit && !adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs text-foreground/40 hover:text-accent transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add tag
        </button>
      )}
      {adding && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag name"
            className="input text-xs py-0.5 px-2 w-28"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addTag() }
              if (e.key === 'Escape') { setAdding(false); setNewTag('') }
            }}
          />
          <button
            onClick={addTag}
            disabled={loading || !newTag.trim()}
            className="btn-primary text-xs px-2 py-0.5"
          >
            {loading ? '…' : 'Add'}
          </button>
          <button
            onClick={() => { setAdding(false); setNewTag('') }}
            className="text-foreground/40 hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
