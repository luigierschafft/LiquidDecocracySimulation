'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import { Plus, X } from 'lucide-react'

interface Props {
  issueId: string
  userId: string
  draftEnabled?: boolean
  structuredEnabled?: boolean
}

export function AddProposalForm({ issueId, userId, draftEnabled = false, structuredEnabled = false }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', content: '', estimated_cost: '', implementation_timeline: '', affected_areas: '' })

  async function handleSubmit(isDraft: boolean) {
    if (!form.title.trim() || !form.content.trim()) return
    setLoading(true)
    setError(null)

    const { error: err } = await supabase.from('initiative').insert({
      issue_id: issueId,
      title: form.title,
      content: form.content,
      author_id: userId,
      is_draft: isDraft,
      ...(structuredEnabled && {
        estimated_cost: form.estimated_cost.trim() || null,
        implementation_timeline: form.implementation_timeline.trim() || null,
        affected_areas: form.affected_areas.trim() ? form.affected_areas.split(',').map((s) => s.trim()).filter(Boolean) : null,
      }),
    })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    setForm({ title: '', content: '', estimated_cost: '', implementation_timeline: '', affected_areas: '' })
    setOpen(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Submit Proposition
      </button>
    )
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); handleSubmit(false) }}
      className="card space-y-4 border-accent/30"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Submit a Proposition</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Proposition Title *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Name your proposition"
          className="input"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description (Markdown) *</label>
        <textarea
          required
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={6}
          placeholder="Describe your proposition in detail. Markdown is supported."
          className="input resize-none font-mono text-sm"
        />
      </div>

      {structuredEnabled && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-sand pt-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Estimated Cost</label>
            <input
              type="text"
              value={form.estimated_cost}
              onChange={(e) => setForm((f) => ({ ...f, estimated_cost: e.target.value }))}
              placeholder="e.g. ₹50,000 / free"
              className="input text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Implementation Timeline</label>
            <input
              type="text"
              value={form.implementation_timeline}
              onChange={(e) => setForm((f) => ({ ...f, implementation_timeline: e.target.value }))}
              placeholder="e.g. 3 months"
              className="input text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5">Affected Areas <span className="text-foreground/40 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={form.affected_areas}
              onChange={(e) => setForm((f) => ({ ...f, affected_areas: e.target.value }))}
              placeholder="e.g. Housing, Water, Environment"
              className="input text-sm"
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
          Cancel
        </button>
        {draftEnabled && (
          <button
            type="button"
            disabled={loading || !form.title.trim() || !form.content.trim()}
            onClick={() => handleSubmit(true)}
            className="btn-secondary"
          >
            Save as Draft
          </button>
        )}
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </div>
    </form>
  )
}
