'use client'

import { useState } from 'react'
import { X, BookOpen, Loader2, RefreshCw, ImageOff } from 'lucide-react'

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

type ImageState = 'loading' | 'loaded' | 'error'

function StoryImage({ src, alt, seed }: { src: string; alt: string; seed: number }) {
  const [state, setState] = useState<ImageState>('loading')
  const [imgSrc, setImgSrc] = useState(src)

  function handleError() {
    if (!imgSrc.includes('picsum.photos')) {
      setImgSrc(`https://picsum.photos/seed/${seed}/768/512`)
    } else {
      setState('error')
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 min-h-52 flex items-center justify-center">
      {state === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 px-6 text-center z-10 bg-gray-100">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          </div>
          <p className="text-xs font-medium text-gray-500">AI is rendering the image…</p>
          <p className="text-xs text-gray-400">This can take up to 60 seconds</p>
          <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-purple-400 rounded-full animate-[shimmer_2s_ease-in-out_infinite]" style={{ width: '60%', animation: 'pulse 2s ease-in-out infinite' }} />
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="flex flex-col items-center gap-2 text-gray-400 py-10">
          <ImageOff className="w-8 h-8" />
          <p className="text-xs">Image could not be loaded</p>
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full rounded-xl transition-opacity duration-500 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setState('loaded')}
        onError={handleError}
      />
    </div>
  )
}

export function StoryModeModal({ proposalText, topicTitle, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StoryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  async function generate() {
    setLoading(true)
    setError(null)
    setResult(null)

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

          {/* Loading story */}
          {loading && (
            <div className="flex flex-col items-center gap-3 py-10 text-gray-500">
              <Loader2 className="w-9 h-9 animate-spin text-purple-500" />
              <p className="text-sm font-medium">Writing your story…</p>
              <p className="text-xs text-gray-400">Takes about 5–10 seconds</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
              <button onClick={generate} className="ml-3 underline text-red-500 hover:text-red-700">Try again</button>
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
                <StoryImage
                  src={result.realisticImageUrl}
                  alt="Realistic vision of Auroville with proposal implemented"
                  seed={1}
                />
              </div>

              {/* Comic image */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-lg">🎨</span> Key elements — illustrated
                </h3>
                <StoryImage
                  src={result.comicImageUrl}
                  alt="Comic illustration of proposal key elements"
                  seed={2}
                />
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
