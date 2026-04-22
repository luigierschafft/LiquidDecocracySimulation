'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Plus, X, ArrowRight } from 'lucide-react'

interface Topic {
  id: string
  title: string
  content: string | null
  status: string
  created_at: string
}

interface Props {
  topics: Topic[]
  userId: string | null
}

export function PlayHome({ topics: initial, userId }: Props) {
  const [topics, setTopics] = useState<Topic[]>(initial)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    setError(null)
    const res = await fetch('/api/play/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), content: content.trim() }),
    })
    if (res.ok) {
      const { topic } = await res.json()
      setTopics((prev) => [topic, ...prev])
      setTitle('')
      setContent('')
      setShowForm(false)
    } else {
      const { error: msg } = await res.json()
      setError(msg ?? 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Play Mode</span>
        {userId && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Topic
          </button>
        )}
      </div>

      {/* Mongoose + speech bubble */}
      <div className="flex flex-col items-center gap-2">
        {/* Speech bubble */}
        <div className="relative bg-white border border-amber-200 shadow-md rounded-2xl rounded-bl-none px-5 py-4 max-w-xs w-full">
          <p className="text-sm font-semibold text-gray-800">
            Hi! Great that you&apos;re here! 👋
          </p>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            What would you like to talk about today? Pick a topic below or start a new one!
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-b border-l border-amber-200 rotate-[-45deg]" />
        </div>

        {/* Mongoose image */}
        <Image
          src="/mongoose.png"
          alt="Mongoose mascot"
          width={110}
          height={130}
          className="drop-shadow-lg mt-1"
          priority
        />
      </div>

      {/* Add topic form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-amber-300 shadow-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Start a new topic</p>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic title…"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's it about? Give a short description…"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            onClick={handleAdd}
            disabled={loading || !title.trim() || !content.trim()}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Creating…' : "Let's go! 🚀"}
          </button>
        </div>
      )}

      {/* Topic list */}
      <div className="space-y-2">
        <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide px-1">
          {topics.length} topic{topics.length !== 1 ? 's' : ''} to explore
        </p>

        {topics.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No topics yet — be the first to start one!
          </div>
        )}

        {topics.map((topic) => (
          <Link key={topic.id} href={`/play/${topic.id}`}>
            <div className="bg-white rounded-2xl border border-amber-100 hover:border-amber-400 shadow-sm hover:shadow-md p-4 cursor-pointer transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                    {topic.title}
                  </h3>
                  {topic.content && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {topic.content}
                    </p>
                  )}
                  <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {topic.status}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:text-amber-600 shrink-0 mt-1 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
