'use client'

import { useState } from 'react'
import { X, BookOpen, Loader2, RefreshCw } from 'lucide-react'

interface Props {
  proposalText: string
  topicTitle?: string
  onClose: () => void
}

interface StoryResult {
  story: string
  realisticImageUrl: string
  comicImageUrl: string
}

export function StoryModeModal({ proposalText, topicTitle, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StoryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [realisticLoaded, setRealisticLoaded] = useState(false)
  const [comicLoaded, setComicLoaded] = useState(false)

  async function generate() {
    setLoading(true)
    setError(null)
    setResult(null)
    setRealisticLoaded(false)
    setComicLoaded(false)

    try {
      const res = await fetch('/api/ai/story-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalText, topicTitle }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-semibold text-gray-900">Story Mode</h2>
            <span className="text-xs text-gray-400 font-normal">— Imagine the future</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Proposal preview */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Proposal</p>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{proposalText}</p>
          </div>

          {/* Generate button */}
          {!result && !loading && (
            <button
              onClick={generate}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Generate story &amp; images
            </button>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-8 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              <p className="text-sm">Writing your story and preparing images…</p>
              <p className="text-xs text-gray-400">This may take 15–30 seconds</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-6">

              {/* Story */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">📖</span> A day in the future
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 px-5 py-4">
                  {result.story.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm text-gray-800 leading-relaxed mb-3 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>

              {/* Realistic image */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🌿</span> Auroville — realistic vision
                </h3>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 min-h-48 flex items-center justify-center">
                  {!realisticLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <p className="text-xs">Generating image…</p>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.realisticImageUrl}
                    alt="Realistic vision of Auroville with proposal implemented"
                    className={`w-full rounded-xl transition-opacity duration-500 ${realisticLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setRealisticLoaded(true)}
                    onError={() => setRealisticLoaded(true)}
                  />
                </div>
              </div>

              {/* Comic image */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🎨</span> Key elements — illustrated
                </h3>
                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 min-h-48 flex items-center justify-center">
                  {!comicLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <p className="text-xs">Generating image…</p>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.comicImageUrl}
                    alt="Comic illustration of proposal key elements"
                    className={`w-full rounded-xl transition-opacity duration-500 ${comicLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setComicLoaded(true)}
                    onError={() => setComicLoaded(true)}
                  />
                </div>
              </div>

              {/* Regenerate */}
              <button
                onClick={generate}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-purple-600 border border-gray-200 hover:border-purple-200 rounded-xl py-2.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Generate again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
