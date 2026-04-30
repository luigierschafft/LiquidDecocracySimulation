'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

interface Props {
  context: string
  topicId: string
}

export function SummaryChat({ context }: Props) {
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(false)
  const [history, setHistory] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/play/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.summary) setSummary(data.summary)
        else setSummaryError(true)
      })
      .catch(() => setSummaryError(true))
      .finally(() => setSummaryLoading(false))
  }, [context])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, chatLoading])

  async function sendMessage(q: string) {
    if (!q || chatLoading) return
    const newHistory: Message[] = [...history, { role: 'user', text: q }]
    setHistory(newHistory)
    setChatLoading(true)

    try {
      const res = await fetch('/api/play/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, history, question: q }),
      })
      const data = await res.json()
      setHistory([...newHistory, { role: 'assistant', text: data.answer ?? 'Sorry, I could not answer that.' }])
    } catch {
      setHistory([...newHistory, { role: 'assistant', text: 'Something went wrong. Please try again.' }])
    } finally {
      setChatLoading(false)
    }
  }

  function handleSend() {
    const q = input.trim()
    setInput('')
    sendMessage(q)
  }

  return (
    <div className="w-full max-w-xs space-y-4">

      {/* Summary box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4">
        {summaryLoading && (
          <p className="text-xs text-gray-400 animate-pulse text-center">Reading the discussion…</p>
        )}
        {summaryError && (
          <p className="text-xs text-red-400 text-center">Could not generate summary right now.</p>
        )}
        {summary && (
          <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
        )}
      </div>

      {/* Chat history */}
      {history.length > 0 && (
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
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-3 py-2 text-xs text-gray-400 animate-pulse">
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Quick reply after summary loaded */}
      {summary && history.length === 0 && (
        <button
          onClick={() => sendMessage('Yes, tell me more!')}
          className="w-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 text-sm font-medium py-2 px-4 rounded-2xl transition-colors text-center"
        >
          Yes, tell me more! →
        </button>
      )}

      {/* Mongoose + hint */}
      {history.length === 0 && !summaryLoading && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500 text-center max-w-[200px] leading-relaxed">
            Ask me anything about this discussion — I&apos;ll only answer based on what the community has shared.
          </p>
          <Image
            src="/mongoose.png"
            alt="Mongoose"
            width={100}
            height={120}
            placeholder="empty"
            style={{ background: 'transparent' }}
            className="drop-shadow-lg"
          />
        </div>
      )}

      {/* Chat input */}
      {!summaryLoading && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Ask about this topic…"
            className="flex-1 border border-gray-300 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm px-4 py-2 rounded-2xl font-medium transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
