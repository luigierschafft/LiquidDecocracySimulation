'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import { Trash2, Plus, Pencil } from 'lucide-react'

interface FieldDef {
  key: string
  label: string
  required?: boolean
  type?: 'text' | 'number' | 'select'
  options?: { value: string; label: string }[]
}

interface Props {
  table: string
  items: any[]
  fields: FieldDef[]
  displayKey?: string
}

export function CrudTable({ table, items: initial, fields, displayKey }: Props) {
  const [items, setItems] = useState<any[]>(initial)
  const [editing, setEditing] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  function initForm(item?: any) {
    const init: Record<string, any> = {}
    fields.forEach((f) => { init[f.key] = item?.[f.key] ?? (f.type === 'number' ? 0 : '') })
    setForm(init)
  }

  async function handleSave() {
    setLoading(true)
    if (editing) {
      const { error } = await supabase.from(table).update(form).eq('id', editing)
      if (!error) {
        setItems((prev) => prev.map((i) => i.id === editing ? { ...i, ...form } : i))
        setEditing(null)
      }
    } else {
      const { data, error } = await supabase.from(table).insert(form).select().single()
      if (!error && data) {
        setItems((prev) => [...prev, data])
        setShowNew(false)
        setForm({})
      }
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this item?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (!error) setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function renderField(f: FieldDef) {
    if (f.type === 'select' && f.options) {
      return (
        <select
          key={f.key}
          value={form[f.key] ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
          className="input text-sm"
          required={f.required}
        >
          <option value="">Select…</option>
          {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    }
    return (
      <input
        key={f.key}
        type={f.type === 'number' ? 'number' : 'text'}
        value={form[f.key] ?? ''}
        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
        placeholder={f.label}
        required={f.required}
        className="input text-sm"
      />
    )
  }

  const editForm = (
    <div className="card space-y-3 border-accent/30">
      <h3 className="font-medium text-sm">{editing ? 'Edit' : 'New item'}</h3>
      {fields.map((f) => (
        <div key={f.key}>
          <label className="block text-xs text-foreground/60 mb-1">{f.label}</label>
          {renderField(f)}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-1">
        <Button size="sm" variant="secondary" onClick={() => { setEditing(null); setShowNew(false) }}>Cancel</Button>
        <Button size="sm" loading={loading} onClick={handleSave}>Save</Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => { initForm(); setShowNew(true); setEditing(null) }}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      {showNew && !editing && editForm}

      <div className="card divide-y divide-sand p-0 overflow-hidden">
        {items.length === 0 && (
          <p className="text-sm text-foreground/40 px-4 py-6 text-center">No items yet.</p>
        )}
        {items.map((item) => (
          <div key={item.id}>
            {editing === item.id ? (
              <div className="px-4 py-3">{editForm}</div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 hover:bg-sand/20">
                <span className="text-sm font-medium">
                  {displayKey ? item[displayKey] : item.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { initForm(item); setEditing(item.id); setShowNew(false) }}
                    className="p-1.5 rounded hover:bg-sand text-foreground/40 hover:text-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded hover:bg-red-50 text-foreground/40 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
