'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { formatDate, getMemberDisplayName } from '@/lib/utils'
import { History, ChevronDown, ChevronUp } from 'lucide-react'

interface Version {
  id: string
  version_num: number
  title: string
  created_at: string
  edited_by: string | null
  editor?: { display_name: string | null; email: string } | null
}

interface Props {
  initiativeId: string
}

export function VersionHistory({ initiativeId }: Props) {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<Version[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const supabase = createClient()

  async function toggle() {
    if (!open && !loaded) {
      setLoading(true)
      const { data } = await supabase
        .from('initiative_version')
        .select('*, editor:member!initiative_version_edited_by_fkey(display_name, email)')
        .eq('initiative_id', initiativeId)
        .order('version_num', { ascending: false })
      setVersions((data ?? []) as Version[])
      setLoaded(true)
      setLoading(false)
    }
    setOpen((o) => !o)
  }

  return (
    <div>
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-foreground/40 hover:text-accent transition-colors font-medium"
      >
        <History className="w-3.5 h-3.5" />
        {loading ? 'Loading…' : `History${loaded ? ` (${versions.length})` : ''}`}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-3 space-y-2 border-t border-sand pt-3">
          {versions.length === 0 ? (
            <p className="text-xs text-foreground/40">No previous versions.</p>
          ) : (
            versions.map((v) => (
              <div key={v.id} className="flex items-start gap-2 text-xs text-foreground/60">
                <span className="font-medium text-foreground/40 w-5 shrink-0">v{v.version_num}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground/70 truncate">{v.title}</p>
                  <p className="text-foreground/40">
                    {formatDate(v.created_at)}
                    {v.editor && ` · by ${getMemberDisplayName(v.editor)}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
