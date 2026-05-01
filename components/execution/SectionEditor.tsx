'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import { Edit3, Check, X, Send, ChevronDown, ChevronUp, ImagePlus, Trash2 } from 'lucide-react'
import type { ExecutionSection, SectionProposal } from '@/lib/types/ev'
import { ProposalDiff } from './ProposalDiff'

interface Props {
  section: ExecutionSection
  isLead: boolean
  isMember: boolean
  userId: string | null
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function RenderedContent({ text }: { text: string }) {
  if (!text) return <p className="text-sm text-gray-400 italic">No content yet.</p>
  return (
    <div className="prose prose-sm max-w-none text-gray-800">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="text-sm font-medium text-gray-700 mt-2 mb-0.5">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-semibold text-gray-800 mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-4 mb-1">{line.slice(2)}</h2>
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
  )
}

export function SectionEditor({ section, isLead, isMember, userId }: Props) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(section.content)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [photos, setPhotos] = useState<string[]>(() => {
    try { return JSON.parse(section.photos ?? '[]') } catch { return [] }
  })
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!userId || !section.id) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const path = `${userId}/${section.id}/${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage.from('section-photos').upload(path, file)
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('section-photos').getPublicUrl(data.path)
      const newPhotos = [...photos, urlData.publicUrl]
      setPhotos(newPhotos)
      await supabase.from('ev_execution_sections')
        .update({ photos: JSON.stringify(newPhotos) })
        .eq('id', section.id)
      router.refresh()
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handlePhotoDelete(url: string) {
    if (!userId || !section.id) return
    const supabase = createClient()
    const newPhotos = photos.filter((p) => p !== url)
    setPhotos(newPhotos)
    await supabase.from('ev_execution_sections')
      .update({ photos: JSON.stringify(newPhotos) })
      .eq('id', section.id)
    router.refresh()
  }

  const pendingProposals = (section.proposals ?? []).filter((p) => p.status === 'pending')

  async function handleDirectSave() {
    if (!userId) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('ev_execution_sections')
      .update({ content: editText, updated_at: new Date().toISOString(), updated_by: userId })
      .eq('id', section.id)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  async function handleSuggestEdit() {
    if (!userId || editText === section.content) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('ev_section_proposals').insert({
      section_id: section.id,
      author_id: userId,
      old_content: section.content,
      new_content: editText,
      comment: comment.trim() || null,
    })
    setSaving(false)
    setEditing(false)
    setComment('')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
        <div className="flex items-center gap-2">
          {pendingProposals.length > 0 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {pendingProposals.length} pending
            </span>
          )}
          {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-5 pb-5 space-y-4">
          {/* Content or Editor */}
          {editing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={12}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Write content here. Markdown supported (# headings, **bold**, - lists)."
              />
              {!isLead && (
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Reason for this change (optional)…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              )}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setEditing(false); setEditText(section.content); setComment('') }}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                {isLead ? (
                  <button
                    onClick={handleDirectSave}
                    disabled={saving || editText === section.content}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> {saving ? 'Saving…' : 'Save'}
                  </button>
                ) : (
                  <button
                    onClick={handleSuggestEdit}
                    disabled={saving || editText === section.content}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" /> {saving ? 'Sending…' : 'Suggest Edit'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div>
              <RenderedContent text={section.content} />
              {(isLead || isMember) && userId && (
                <button
                  onClick={() => { setEditing(true); setEditText(section.content) }}
                  className="mt-3 flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isLead ? 'Edit' : 'Suggest Edit'}
                </button>
              )}
            </div>
          )}

          {/* Photo attachments */}
          {(photos.length > 0 || ((isLead || isMember) && userId && section.id)) && (
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Photos</p>
                {(isLead || isMember) && userId && section.id && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      {uploading ? 'Uploading…' : 'Add Photo'}
                    </button>
                  </>
                )}
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {photos.map((url) => (
                    <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt="" className="w-full h-32 object-cover" />
                      {(isLead || isMember) && userId && (
                        <button
                          onClick={() => handlePhotoDelete(url)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pending proposals — visible to lead */}
          {isLead && pendingProposals.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Pending Suggestions</p>
              {pendingProposals.map((p) => (
                <ProposalDiff key={p.id} proposal={p} sectionContent={section.content} userId={userId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
