'use client'

import { useState, useEffect, useRef } from 'react'
import { Mascot } from '@/components/play/Mascot'

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
    <div className="w-full space-y-4">

      {/* Summary box */}
      <div className="play-card">
        {summaryLoading && (
          <p className="text-[15px] font-semibold text-gray-400 animate-pulse text-center">Reading the discussion…</p>
        )}
        {summaryError && (
          <p className="text-[15px] font-semibold text-contra text-center">Could not generate summary right now.</p>
        )}
        {summary && (
          <div className="text-[15px] font-semibold text-gray-700 leading-relaxed space-y-3">
            {summary.split('\n').map((line, i) => {
              const trimmed = line.trim()
              if (!trimmed) return null
              if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                return <p key={i} className="font-fun font-semibold text-gray-900 text-lg mt-2">{trimmed.replace(/\*\*/g, '')}</p>
              }
              if (/^\d+\./.test(trimmed)) {
                return <p key={i} className="ml-3">• {trimmed.replace(/^\d+\.\s*/, '')}</p>
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('+ ')) {
                return <p key={i} className="ml-3 text-gray-600">· {trimmed.slice(2)}</p>
              }
              if (trimmed === 'For:' || trimmed === 'Against:') {
                return <p key={i} className="font-semibold text-gray-800">{trimmed}</p>
              }
              return <p key={i}>{trimmed}</p>
            })}
          </div>
        )}
      </div>

      {/* Chat history */}
      {history.length > 0 && (
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
          {chatLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-3xl px-4 py-2.5 text-[15px] font-semibold text-gray-400 animate-pulse">
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
          className="play-btn-white !min-h-[52px] !py-3 !text-base"
        >
          Yes, tell me more! →
        </button>
      )}

      {/* Mongoose + hint */}
      {history.length === 0 && !summaryLoading && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-[15px] font-semibold text-gray-600 text-center max-w-[260px] leading-relaxed">
            Ask me anything about this discussion — I&apos;ll only answer based on what the community has shared.
          </p>
          <Mascot pose="wave" size="md" />
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
            className="flex-1 min-w-0 h-12 bg-white rounded-full px-5 text-base font-semibold shadow-cushion-white placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-sun-300/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || chatLoading}
            className="h-12 px-5 rounded-full font-fun font-semibold text-base text-sun-900 bg-gradient-to-b from-sun-300 to-sun-500 shadow-cushion active:translate-y-[2px] active:shadow-none disabled:opacity-40 transition-transform"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
