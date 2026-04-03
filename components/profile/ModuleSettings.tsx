'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { Puzzle } from 'lucide-react'

interface ModuleEntry {
  key: string
  number: number
  name: string
  description: string
  group_name: string
  admin_enabled: boolean
  effective: boolean
}

interface Props {
  modules: ModuleEntry[]
  userId: string
}

export function ModuleSettings({ modules: initial, userId }: Props) {
  const [modules, setModules] = useState(initial)
  const [pending, startTransition] = useTransition()
  const supabase = createClient()

  function toggle(key: string, current: boolean) {
    const next = !current
    setModules((prev) =>
      prev.map((m) => (m.key === key ? { ...m, effective: next } : m))
    )
    startTransition(async () => {
      await supabase
        .from('member_module_setting')
        .upsert({ member_id: userId, module_key: key, enabled: next })
    })
  }

  async function reset(key: string, adminDefault: boolean) {
    setModules((prev) =>
      prev.map((m) => (m.key === key ? { ...m, effective: adminDefault } : m))
    )
    startTransition(async () => {
      await supabase
        .from('member_module_setting')
        .delete()
        .eq('member_id', userId)
        .eq('module_key', key)
    })
  }

  // Group by group_name
  const groups = modules.reduce<Record<string, ModuleEntry[]>>((acc, m) => {
    if (!acc[m.group_name]) acc[m.group_name] = []
    acc[m.group_name].push(m)
    return acc
  }, {})

  if (modules.length === 0) return null

  return (
    <div className="card space-y-4">
      <h2 className="font-semibold text-lg flex items-center gap-2">
        <Puzzle className="w-5 h-5 text-accent" />
        Feature Settings
      </h2>
      <p className="text-sm text-foreground/50">
        Personalise which features you see. Some features can only be changed by admins.
      </p>

      <div className="space-y-4">
        {Object.entries(groups).map(([groupName, groupModules]) => (
          <div key={groupName}>
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wide mb-2">{groupName}</p>
            <div className="divide-y divide-sand rounded-lg border border-sand overflow-hidden">
              {groupModules.map((m) => {
                const isOverridden = m.effective !== m.admin_enabled
                return (
                  <div key={m.key} className={`flex items-center gap-3 px-4 py-3 ${m.effective ? '' : 'opacity-50'}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">{m.description}</p>
                    </div>
                    {isOverridden && (
                      <button
                        onClick={() => reset(m.key, m.admin_enabled)}
                        disabled={pending}
                        className="text-[10px] text-foreground/30 hover:text-accent transition-colors"
                        title="Reset to platform default"
                      >
                        reset
                      </button>
                    )}
                    <button
                      onClick={() => toggle(m.key, m.effective)}
                      disabled={pending}
                      className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 flex-shrink-0 ${
                        m.effective ? 'bg-auro-green' : 'bg-sand border border-sand-dark'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${m.effective ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
