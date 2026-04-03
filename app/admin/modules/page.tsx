import { getAllModules } from '@/lib/modules'
import { ModuleToggleRow } from '@/components/admin/ModuleToggleRow'
import { Puzzle } from 'lucide-react'
import type { Module } from '@/lib/modules'

export const dynamic = 'force-dynamic'

export default async function AdminModulesPage() {
  const modules = await getAllModules()

  // Group by group_key
  const groups = modules.reduce<Record<string, Module[]>>((acc, m) => {
    const k = `${m.group_key} — ${m.group_name}`
    if (!acc[k]) acc[k] = []
    acc[k].push(m)
    return acc
  }, {})

  const enabledCount = modules.filter((m) => m.admin_enabled).length

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Puzzle className="w-7 h-7 text-accent" />
            Modules
          </h1>
          <p className="text-foreground/60 mt-1">
            {enabledCount} of {modules.length} modules enabled
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs text-foreground/50 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-auro-green inline-block" />
            Active (platform-wide)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent/60 inline-block" />
            User-configurable
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([groupLabel, groupModules]) => (
          <div key={groupLabel} className="card p-0 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-sand bg-sand/40">
              <h2 className="text-sm font-semibold text-foreground/70">{groupLabel}</h2>
            </div>
            <div className="divide-y divide-sand/60">
              {groupModules.map((m) => (
                <ModuleToggleRow
                  key={m.key}
                  moduleKey={m.key}
                  number={m.number}
                  name={m.name}
                  description={m.description}
                  adminEnabled={m.admin_enabled}
                  userConfigurable={m.user_configurable}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
