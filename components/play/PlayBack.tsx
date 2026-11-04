import Link from 'next/link'

/** Back link shown at the top of playful sub-pages (44px tall touch target). */
export function PlayBack({ href, label = 'Back' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 h-11 -ml-1 pr-3 mb-2 font-fun font-semibold text-[15px] text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12.5 4.5L7 10l5.5 5.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  )
}
