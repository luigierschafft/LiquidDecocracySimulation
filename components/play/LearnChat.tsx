'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface Props {
  context: string
}

export function LearnChat({ context }: Props) {
  const [history, setHistory] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function handleSend() {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    const newHistory: Message[] = [...history, { role: 'user', text: q }]
    setHistory(newHistory)
    setLoading(true)

    try {
      const res = await fetch('/api/play/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, history, question: q }),
      })
      const data = await res.json()
      setHistory([...newHistory, { role: 'assistant', text: data.answer ?? 'Sorry, something went wrong.' }])
    } catch {
      setHistory([...newHistory, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-xs space-y-4">

      {/* Chat history */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-3 mt-4">
          <p className="text-xs text-gray-500 text-center max-w-[220px] leading-relaxed">
            Ask me anything — about this topic, the community discussion, or anything related you want to learn about.
          </p>
          <Image
            src="/mongoose.png"
            alt="Mongoose"
            width={110}
            height={128}
            placeholder="empty"
            style={{ background: 'transparent' }}
            className="drop-shadow-lg"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-amber-50 border border-amber-200 text-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2 text-xs text-gray-400 animate-pulse">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
          placeholder="Ask me anything…"
          className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-2xl font-bold transition-colors"
        >
          →
        </button>
      </div>
    </div>
  )
}
