'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useRouter } from 'next/navigation'
import type { ElaborationEditor, Member } from '@/lib/types'
import { getMemberDisplayName } from '@/lib/utils'
import { UserPlus, X } from 'lucide-react'

interface Props {
  elaborationId: string
  editors: ElaborationEditor[]
  allMembers: Pick<Member, 'id' | 'display_name' | 'email'>[]
}

export function ManageEditors({ elaborationId, editors: initial, allMembers }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [editors, setEditors] = useState<ElaborationEditor[]>(initial)
  const [selectedId, setSelectedId] = useState('')
  const [loading, setLoading] = useState(false)

  const editorIds = new Set(editors.map((e) => e.member_id))
  const available = allMembers.filter((m) => !editorIds.has(m.id))

  async function addEditor() {
    if (!selectedId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('elaboration_editor')
      .insert({ elaboration_id: elaborationId, member_id: selectedId })
      .select('*, member:member!elaboration_editor_member_id_fkey(*)')
      .single()
    if (!error && data) {
      setEditors((prev) => [...prev, data as unknown as ElaborationEditor])
      setSelectedId('')
      router.refresh()
    }
    setLoading(false)
  }

  async function removeEditor(memberId: string) {
    await supabase
      .from('elaboration_editor')
      .delete()
      .eq('elaboration_id', elaborationId)
      .eq('member_id', memberId)
    setEditors((prev) => prev.filter((e) => e.member_id !== memberId))
    router.refresh()
  }

  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-sm">Editors</h3>

      {editors.length === 0 ? (
        <p className="text-xs text-foreground/40">No editors assigned. Only admins can edit.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {editors.map((e) => (
            <div key={e.member_id} className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
              {getMemberDisplayName(e.member)}
              <button onClick={() => removeEditor(e.member_id)} className="hover:text-red-500 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="input flex-1 text-sm py-1.5"
          >
            <option value="">Add editor…</option>
            {available.map((m) => (
              <option key={m.id} value={m.id}>{getMemberDisplayName(m)}</option>
            ))}
          </select>
          <button
            onClick={addEditor}
            disabled={!selectedId || loading}
            className="btn-primary px-3 py-1.5 flex items-center gap-1.5 text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add
          </button>
        </div>
      )}
    </div>
  )
}
