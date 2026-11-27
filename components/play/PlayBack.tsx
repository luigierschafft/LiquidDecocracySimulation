import Link from 'next/link'

/** Clearly visible back button at the top of playful pages. */
export function PlayBack({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <div className="w-full max-w-sm mb-4">
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/90 border border-amber-200 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-white active:scale-95 transition-transform"
      >
        <span aria-hidden="true">←</span> {label}
      </Link>
    </div>
  )
}
