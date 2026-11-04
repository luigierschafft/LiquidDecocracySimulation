'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

// ── Texts ─────────────────────────────────────────────────────────────────────

interface AurovilleText {
  title: string
  author?: string
  type: 'bullets' | 'paragraph'
  bullets?: string[]
  paragraph?: string
}

const TEXTS: AurovilleText[] = [
  {
    title: 'The Auroville Charter',
    type: 'bullets',
    bullets: [
      'Auroville belongs to nobody in particular. Auroville belongs to humanity as a whole. But, to live in Auroville, one must be a willing servitor of the Divine Consciousness.',
      'Auroville will be the place of an unending education, of constant progress, and a youth that never ages.',
      'Auroville wants to be the bridge between the past and the future. Taking advantage of all discoveries from without and from within, Auroville will boldly spring towards future realisations.',
      'Auroville will be a site of material and spiritual researches for a living embodiment of an actual Human Unity.',
    ],
  },
  {
    title: 'The Dream',
    author: 'The Mother, 1954',
    type: 'paragraph',
    paragraph:
      'There should be somewhere upon earth a place that no nation could claim as its own, where all human beings of goodwill, sincere in their aspiration, could live freely as citizens of the world, obeying one single authority, that of the supreme Truth; a place of peace, concord, harmony, where all the fighting instincts of man would be used exclusively to conquer the causes of his sufferings and miseries, to surmount his weakness and ignorance, to triumph over his limitations and incapacities; a place where the needs of the spirit and the care for progress would take precedence over the satisfaction of desires and passions, the search for pleasures and material enjoyments. In this place, children would be able to grow and develop integrally without losing contact with their souls; education would be given not with a view to passing examinations or obtaining certificates and posts, but to enrich existing faculties and bring forth new ones. In this place, titles and positions would be replaced by opportunities to serve and organise; the bodily needs of each one would be provided for equally, and in the general organisation intellectual, moral and spiritual superiority would be expressed not by an increase in the pleasures and powers of life, but by increased duties and responsibilities. Beauty in all its artistic forms, music, painting, sculpture, literature, would be equally accessible to all; the ability to share in the refinement of taste and desire for beauty would be cultivated through education. In short, it would be a place where human relationships, ordinarily based almost exclusively on competition and strife, would be replaced by relationships of emulation in doing well, of collaboration and real brotherhood.',
  },
  {
    title: 'To be a True Aurovillian',
    author: 'The Mother',
    type: 'paragraph',
    paragraph:
      'The first thing needed to be a true Aurovillian is to recognise that Auroville is not meant for the ordinary human life. It is meant for those who want to serve the Truth. The second thing needed is a sincere aspiration, a will to progress, to advance, to better oneself, and to always be open to the Divine. One must want to work for the betterment of humanity. One must have great goodwill toward all human beings. One must want to live harmoniously — with people of all nationalities, cultures, and backgrounds. One must have a spirit of collaboration and not competition. One must be ready to give, not always wanting to receive. Auroville is for those who want to live a new kind of life — a life based on truth, on beauty, on harmony, and on the progressive manifestation of the Divine.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  enabled: boolean
}

export function AurovilleTextBanner({ enabled }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  // Start at 0 for SSR, set random after mount to avoid hydration mismatch
  const [textIndex, setTextIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTextIndex(Math.floor(Math.random() * 3))
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!enabled || dismissed) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTriggered(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [enabled, dismissed])

  const text = TEXTS[textIndex]
  const visible = triggered && !dismissed && mounted

  return (
    <>
      {/* Sentinel — always rendered so the observer can fire */}
      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />

      {/* Banner */}
      {enabled && (
        <div
          role="complementary"
          aria-label="Auroville founding text"
          className={[
            'fixed bottom-0 left-0 right-0 z-40',
            'bg-white rounded-t-3xl border-t border-line',
            'shadow-[0_-8px_32px_rgba(23,27,34,0.10)]',
            'transition-transform duration-500 ease-out',
            visible ? 'translate-y-0' : 'translate-y-full',
          ].join(' ')}
        >
          <div className="max-h-[45vh] overflow-y-auto px-6 py-5 max-w-3xl mx-auto">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-lg font-semibold text-amber-800 leading-snug">
                  {text.title}
                </h2>
                {text.author && (
                  <p className="text-xs text-amber-600 mt-0.5 font-medium tracking-wide">
                    {text.author}
                  </p>
                )}
              </div>
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss banner"
                className="flex-shrink-0 mt-0.5 rounded-full p-1.5 text-amber-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            {text.type === 'bullets' && text.bullets ? (
              <ol className="space-y-3 list-none pl-0">
                {text.bullets.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 font-serif text-amber-400 font-semibold text-base leading-relaxed select-none">
                      {i + 1}.
                    </span>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed italic">
                &ldquo;{text.paragraph}&rdquo;
              </p>
            )}

            {/* Footer flourish */}
            <p className="mt-4 text-xs text-amber-400 text-right tracking-widest uppercase select-none">
              Auroville &middot; 1968
            </p>
          </div>
        </div>
      )}
    </>
  )
}
