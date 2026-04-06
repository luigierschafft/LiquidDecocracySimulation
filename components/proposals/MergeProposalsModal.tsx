'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Merge, X, Sparkles, Loader2, Check } from 'lucide-react'
import type { Initiative } from '@/lib/types'

interface Props {
  issueId: string
  initiatives: Initiative[]
  userId: string
}

type Step = 'select' | 'preview' | 'done'

export function MergeProposalsModal({ issueId, initiatives, userId }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [idA, setIdA] = useState('')
  const [idB, setIdB] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [merged, setMerged] = useState({ title: '', content: '' })

  const pubInitiatives = initiatives.filter((i) => !(i as any).is_draft)

  function reset() {
    setStep('select')
    setIdA('')
    setIdB('')
    setMerged({ title: '', content: '' })
    setError(null)
  }

  function close() {
    setOpen(false)
    reset()
  }

  async function generateMerge() {
    if (!idA || !idB || idA === idB) return
    setLoading(true)
    setError(null)

    const res = await fetch('/api/ai/merge-proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initiativeId1: idA, initiativeId2: idB }),
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }

    setMerged({ title: data.title, content: data.content })
    setStep('preview')
    setLoading(false)
  }

  async function saveMerged() {
    if (!merged.title.trim() || !merged.content.trim()) return
    setSaving(true)

    const initA = initiatives.find((i) => i.id === idA)
    const initB = initiatives.find((i) => i.id === idB)
    const sourceNote = `\n\n---\n*Merged from: "${initA?.title}" + "${initB?.title}"*`

    const { error: err } = await supabase.from('initiative').insert({
      issue_id: issueId,
      author_id: userId,
      title: merged.title.trim(),
      content: merged.content.trim() + sourceNote,
      is_draft: false,
    })

    if (err) {
      setError(err.message)
      setSaving(false)
      return
    }

    setStep('done')
    setSaving(false)
    router.refresh()
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-foreground/50 hover:text-accent border border-sand hover:border-accent/40 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Merge className="w-3.5 h-3.5" />
        Merge proposals
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand">
          <h2 className="font-semibold flex items-center gap-2">
            <Merge className="w-4 h-4 text-accent" />
            {step === 'select' && 'Merge Two Proposals with AI'}
            {step === 'preview' && 'Review Merged Proposal'}
            {step === 'done' && 'Merge Complete'}
          </h2>
          <button onClick={close} className="text-foreground/40 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1: Select */}
          {step === 'select' && (
            <>
              <p className="text-sm text-foreground/60">
                Select two proposals to merge. Claude will synthesise them into a single unified proposal for you to review and edit.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Proposal A</label>
                  <select
                    value={idA}
                    onChange={(e) => setIdA(e.target.value)}
                    className="input w-full text-sm"
                  >
                    <option value="">Select proposal…</option>
                    {pubInitiatives.map((i) => (
                      <option key={i.id} value={i.id} disabled={i.id === idB}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Proposal B</label>
                  <select
                    value={idB}
                    onChange={(e) => setIdB(e.target.value)}
                    className="input w-full text-sm"
                  >
                    <option value="">Select proposal…</option>
                    {pubInitiatives.map((i) => (
                      <option key={i.id} value={i.id} disabled={i.id === idA}>
                        {i.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={close} className="btn-secondary text-sm">Cancel</button>
                <button
                  onClick={generateMerge}
                  disabled={!idA || !idB || idA === idB || loading}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    : <><Sparkles className="w-4 h-4" /> Generate with AI</>
                  }
                </button>
              </div>
            </>
          )}

          {/* Step 2: Preview & edit */}
          {step === 'preview' && (
            <>
              <p className="text-sm text-foreground/60">
                Claude has generated a merged proposal. Review and edit before publishing.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title</label>
                  <input
                    type="text"
                    value={merged.title}
                    onChange={(e) => setMerged((m) => ({ ...m, title: e.target.value }))}
                    className="input w-full text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Content (Markdown)</label>
                  <textarea
                    value={merged.content}
                    onChange={(e) => setMerged((m) => ({ ...m, content: e.target.value }))}
                    rows={12}
                    className="input w-full text-sm font-mono resize-y"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <div className="flex justify-between gap-3 pt-2">
                <button onClick={() => setStep('select')} className="btn-secondary text-sm">← Back</button>
                <button
                  onClick={saveMerged}
                  disabled={saving || !merged.title.trim() || !merged.content.trim()}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  {saving
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <><Check className="w-4 h-4" /> Publish Merged Proposal</>
                  }
                </button>
              </div>
            </>
          )}

          {/* Step 3: Done */}
          {step === 'done' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-green-100 text-auro-green flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-semibold">Merged proposal published!</p>
              <p className="text-sm text-foreground/50">The original proposals are still visible. You can archive them manually.</p>
              <button onClick={close} className="btn-primary text-sm px-6">Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
