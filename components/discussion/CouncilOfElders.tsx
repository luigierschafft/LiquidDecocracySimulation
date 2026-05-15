'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  message: string
}

export function CouncilOfElders({ message }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛</span>
          <div>
            <p className="text-base font-semibold text-amber-900">Council of Elders</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-5 h-5 text-amber-600 flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-amber-600 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-amber-200">
          <div className="mt-4 bg-white/70 rounded-xl px-5 py-4 border border-amber-100">
            <p className="text-sm text-gray-700 leading-relaxed italic">"{message}"</p>
          </div>
          <p className="mt-3 text-xs text-amber-600/60 text-right">— The 12 Elders of Auroville</p>
        </div>
      )}
    </div>
  )
}
