import { PlayBack } from './PlayBack'
import { Mascot, type MascotPose } from './Mascot'

/**
 * Shared header for playful sub-pages: back link, section label, topic title,
 * optional description and a small mascot. Keeps every page on the same sizes.
 */
export function PlayHeader({
  backHref,
  backLabel = 'Topic',
  section,
  title,
  description,
  mascot,
}: {
  backHref: string
  backLabel?: string
  section?: string
  title: string
  description?: string | null
  mascot?: MascotPose
}) {
  return (
    <header className="mb-6">
      <PlayBack href={backHref} label={backLabel} />
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {section && <p className="font-fun font-semibold text-[15px] text-sun-700">{section}</p>}
          <h1 className="font-fun font-semibold text-[1.5rem] leading-[1.2] text-gray-900">{title}</h1>
        </div>
        {mascot && <Mascot pose={mascot} size="sm" />}
      </div>
      {description && (
        <p className="mt-2 text-[15px] font-semibold text-gray-600 leading-relaxed">{description}</p>
      )}
    </header>
  )
}
