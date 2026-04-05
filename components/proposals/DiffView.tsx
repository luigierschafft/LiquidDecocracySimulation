'use client'

import { diffWords } from '@/lib/diff'

interface Props {
  oldText: string
  newText: string
  label?: string
}

export function DiffView({ oldText, newText, label }: Props) {
  const ops = diffWords(oldText, newText)

  const added = ops.filter((o) => o.type === 'insert').length
  const removed = ops.filter((o) => o.type === 'delete').length

  return (
    <div className="rounded-lg border border-sand bg-sand/20 p-3 space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground/60">{label}</p>
          <span className="text-[11px] text-foreground/40">
            {added > 0 && <span className="text-green-600 font-medium">+{added}</span>}
            {added > 0 && removed > 0 && ' · '}
            {removed > 0 && <span className="text-red-500 font-medium">−{removed}</span>}
            {added === 0 && removed === 0 && <span>No changes</span>}
          </span>
        </div>
      )}
      <p className="text-sm leading-relaxed break-words font-mono whitespace-pre-wrap">
        {ops.map((op, i) => {
          if (op.type === 'equal') return <span key={i}>{op.text}</span>
          if (op.type === 'insert') return (
            <mark key={i} className="bg-green-100 text-green-800 rounded px-0.5 no-underline">
              {op.text}
            </mark>
          )
          if (op.type === 'delete') return (
            <del key={i} className="bg-red-100 text-red-600 rounded px-0.5 line-through opacity-70">
              {op.text}
            </del>
          )
        })}
      </p>
    </div>
  )
}
