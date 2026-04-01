'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import type { Area, Unit } from '@/lib/types'

export function NewProposalForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [units, setUnits] = useState<Unit[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [selectedUnit, setSelectedUnit] = useState('')
  const [form, setForm] = useState({ title: '', areaId: '' })

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
      setError(issueErr?.message ?? 'Failed to create topic')
      setLoading(false)
      return
    }

    router.push(`/proposals/${issue.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Topic</h1>
        <p className="text-foreground/60 mt-1">Start a discussion for the community. You can add proposals after creating the topic.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Topic Title *</label>
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
            <label className="block text-sm font-medium mb-1.5">Unit (optional)</label>
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
              <label className="block text-sm font-medium mb-1.5">Area</label>
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

        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
          <Button type="submit" loading={loading}>
            Create Topic
          </Button>
        </div>
      </form>
    </div>
  )
}
