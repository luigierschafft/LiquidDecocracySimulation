'use client'

import { useState, useRef, useEffect } from 'react'
import { Mascot } from '@/components/play/Mascot'

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
    <div className="w-full space-y-4">

      {/* Chat history */}
      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-3 mt-4">
          <p className="text-[15px] font-semibold text-gray-600 text-center max-w-[260px] leading-relaxed">
            Ask me anything — about this topic, the community discussion, or anything related you want to learn about.
          </p>
          <Mascot pose="wave" size="md" />
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-3xl px-4 py-2.5 text-[15px] font-semibold leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky text-white rounded-br-lg'
                  : 'bg-white text-gray-700 shadow-cushion-white rounded-bl-lg'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-3xl px-4 py-2.5 text-[15px] font-semibold text-gray-400 animate-pulse">
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
          className="flex-1 min-w-0 h-12 bg-white rounded-full px-5 text-base font-semibold shadow-cushion-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-sun-300/50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="h-12 px-5 rounded-full font-fun font-semibold text-base text-sun-900 bg-gradient-to-b from-sun-300 to-sun-500 shadow-cushion active:translate-y-[2px] active:shadow-none disabled:opacity-40 transition-transform"
        >
          →
        </button>
      </div>
    </div>
  )
}
