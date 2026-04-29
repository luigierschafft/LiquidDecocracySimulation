'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface Statement { id: string; text: string }
interface Node { id: string; type: string; text: string }

interface Props {
  statement: Statement
  nodes: Node[]
  userId: string
  onNext: () => void
}

export function ModeProContra({ statement, nodes, userId, onNext }: Props) {
  const [argType, setArgType] = useState<'pro' | 'contra' | null>(null)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [justSaved, setJustSaved] = useState(false)
  const [localNodes, setLocalNodes] = useState<Node[]>([])
  const supabase = createClient()

  // Reset when statement changes
  useEffect(() => {
    setArgType(null)
    setText('')
    setJustSaved(false)
    setLocalNodes([])
  }, [statement.id])

  const allNodes = [...nodes, ...localNodes]
  const pros = allNodes.filter(n => n.type === 'pro')
  const contras = allNodes.filter(n => n.type === 'contra')

  async function submit() {
    if (!text.trim() || !argType || submitting) return
    setSubmitting(true)
    const savedType = argType
    const savedText = text.trim()

    await supabase.from('ev_discussion_nodes').insert({
      statement_id: statement.id,
      parent_id: null,
      type: savedType,
      text: savedText,
      author_id: userId,
    })

    setLocalNodes(prev => [...prev, { id: `local-${Date.now()}`, type: savedType, text: savedText }])
    setSubmitting(false)
    setJustSaved(true)
    setText('')
    setArgType(null)
    setTimeout(() => setJustSaved(false), 1200)
  }

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Statement */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl px-5 py-4">
        <p className="text-sm font-semibold text-gray-800 text-center leading-relaxed">
          {statement.text}
        </p>
      </div>

      {/* All pro/contras (existing + newly added) */}
      {(pros.length > 0 || contras.length > 0) && (
        <div className="flex gap-2">
          {pros.length > 0 && (
            <div className="flex-1 space-y-1">
              {pros.map(n => (
                <div key={n.id}
                  className={`text-xs rounded-xl px-3 py-1.5 leading-relaxed ${
                    n.id.startsWith('local-')
                      ? 'text-green-800 bg-green-100 border border-green-300'
                      : 'text-green-700 bg-green-50'
                  }`}>
                  + {n.text}
                </div>
              ))}
            </div>
          )}
          {contras.length > 0 && (
            <div className="flex-1 space-y-1">
              {contras.map(n => (
                <div key={n.id}
                  className={`text-xs rounded-xl px-3 py-1.5 leading-relaxed ${
                    n.id.startsWith('local-')
                      ? 'text-red-800 bg-red-100 border border-red-300'
                      : 'text-red-700 bg-red-50'
                  }`}>
                  − {n.text}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {justSaved && (
        <p className="text-xs text-green-600 font-medium text-center">Argument added!</p>
      )}

      {/* Pro / Contra toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setArgType(argType === 'pro' ? null : 'pro')}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
            argType === 'pro'
              ? 'bg-green-400 text-white'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          + Pro
        </button>
        <button
          onClick={() => setArgType(argType === 'contra' ? null : 'contra')}
          className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-colors ${
            argType === 'contra'
              ? 'bg-red-400 text-white'
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          − Contra
        </button>
      </div>

      {/* Text input */}
      {argType && (
        <div className="flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Write a ${argType} argument… (max 150 chars)`}
            maxLength={150}
            rows={3}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={!text.trim() || submitting}
              className="flex-1 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-white text-sm font-bold py-2 rounded-full transition-colors"
            >
              {submitting ? 'Saving…' : 'Submit'}
            </button>
            <button
              onClick={() => { setArgType(null); setText('') }}
              className="px-4 text-sm text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Next statement */}
      {!argType && (
        <button onClick={onNext} className="text-xs text-gray-400 underline text-center">
          Go to the next statement
        </button>
      )}
    </div>
  )
}
