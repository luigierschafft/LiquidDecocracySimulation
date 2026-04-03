'use client'

import { useState, useTransition } from 'react'
import { toggleModuleAdmin, toggleModuleUserConfigurable } from '@/app/admin/modules/actions'

interface Props {
  moduleKey: string
  number: number
  name: string
  description: string
  adminEnabled: boolean
  userConfigurable: boolean
}

export function ModuleToggleRow({ moduleKey, number, name, description, adminEnabled, userConfigurable }: Props) {
  const [enabled, setEnabled] = useState(adminEnabled)
  const [userConfig, setUserConfig] = useState(userConfigurable)
  const [pending, startTransition] = useTransition()

  function handleToggleEnabled() {
    const next = !enabled
    setEnabled(next)
    startTransition(async () => {
      await toggleModuleAdmin(moduleKey, next)
    })
  }

  function handleToggleUserConfig() {
    const next = !userConfig
    setUserConfig(next)
    startTransition(async () => {
      await toggleModuleUserConfigurable(moduleKey, next)
    })
  }

  return (
    <div className={`flex items-center gap-4 py-3 px-4 rounded-lg transition-colors ${enabled ? 'bg-background' : 'bg-sand/40 opacity-60'}`}>
      {/* Number */}
      <span className="text-xs text-foreground/30 font-mono w-6 flex-shrink-0 text-right">{number}</span>

      {/* Name + Description */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{name}</p>
        <p className="text-xs text-foreground/40 mt-0.5 truncate">{description}</p>
      </div>

      {/* User Configurable toggle */}
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <span className="text-[10px] text-foreground/40 leading-none">User</span>
        <button
          onClick={handleToggleUserConfig}
          disabled={pending}
          title={userConfig ? 'Users can toggle this' : 'Admin only'}
          className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${
            userConfig ? 'bg-accent/60' : 'bg-sand border border-sand-dark'
          }`}
        >
          <span className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${userConfig ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Admin Enabled toggle */}
      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
        <span className="text-[10px] text-foreground/40 leading-none">Active</span>
        <button
          onClick={handleToggleEnabled}
          disabled={pending}
          title={enabled ? 'Enabled — click to disable' : 'Disabled — click to enable'}
          className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5 ${
            enabled ? 'bg-auro-green' : 'bg-sand border border-sand-dark'
          }`}
        >
          <span className={`w-3 h-3 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
    </div>
  )
}
