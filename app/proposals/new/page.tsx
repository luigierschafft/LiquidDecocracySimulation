'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import type { Area, Unit } from '@/lib/types'

export default function NewProposalPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedUnit, setSelectedUnit] = useState('')
  const [form, setForm] = useState({
    title: '',
    initiativeTitle: '',
    content: '',
    areaId: '',
  })

  useEffect(() => {
    supabase.from('unit').select('*').order('name').then(({ data }) => setUnits(data ?? []))
  }, [])

  useEffect(() => {
    if (!selectedUnit) { setAreas([]); return }
    supabase.from('area').select('*').eq('unit_id', selectedUnit).order('name').then(({ data }) => setAreas(data ?? []))
  }, [selectedUnit])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    // Create issue
    const { data: issue, error: issueErr } = await supabase
      .from('issue')
      .insert({
        title: form.title,
        author_id: user.id,
        area_id: form.areaId || null,
        status: 'admission',
      })
      .select()
      .single()

    if (issueErr || !issue) {
      setError(issueErr?.message ?? 'Failed to create proposal')
      setLoading(false)
      return
    }

    // Create first initiative
    const { error: initErr } = await supabase.from('initiative').insert({
      issue_id: issue.id,
      title: form.initiativeTitle || form.title,
      content: form.content,
      author_id: user.id,
    })

    if (initErr) {
      setError(initErr.message)
      setLoading(false)
      return
    }

    router.push(`/proposals/${issue.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Proposal</h1>
        <p className="text-foreground/60 mt-1">Submit a proposal for the community to discuss and vote on.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Issue Title *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="What should the community decide?"
            className="input"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Area (optional)</label>
            <select
              value={selectedUnit}
              onChange={(e) => { setSelectedUnit(e.target.value); setForm((f) => ({ ...f, areaId: '' })) }}
              className="input"
            >
              <option value="">Select unit…</option>
              {units.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          {areas.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Sub-area</label>
              <select
                value={form.areaId}
                onChange={(e) => setForm((f) => ({ ...f, areaId: e.target.value }))}
                className="input"
              >
                <option value="">Select area…</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <hr className="border-sand" />

        <div>
          <label className="block text-sm font-medium mb-1.5">Initiative Title</label>
          <input
            type="text"
            value={form.initiativeTitle}
            onChange={(e) => setForm((f) => ({ ...f, initiativeTitle: e.target.value }))}
            placeholder="Your specific proposal (defaults to issue title)"
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description (Markdown) *</label>
          <textarea
            required
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={8}
            placeholder="Describe your proposal in detail. Markdown is supported."
            className="input resize-none font-mono text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <Button type="submit" loading={loading}>
            Submit Proposal
          </Button>
        </div>
      </form>
    </div>
  )
}
