import Link from 'next/link'
import { Mascot } from '@/components/play/Mascot'

const ACTIONS = [
  { href: '/playful/topics', title: 'Choose a topic', sub: 'Speak, listen and sense' },
  { href: '/playful/help', title: 'Help where I can', sub: 'Rate a few statements' },
  { href: '/playful/delegation', title: 'My delegation', sub: 'Who votes with my trust' },
]

export default function PlayPage() {
  return (
    <div className="mx-auto w-full max-w-sm pb-16">
      {/* Greeting with the mongoose waving beside it */}
      <div className="flex items-end justify-between gap-2 mb-8">
        <h1 className="font-fun font-semibold text-[1.75rem] leading-[1.15] text-gray-900 pb-3">
          Hello, thank you for being here!
          <span className="block mt-2 font-playful font-bold text-lg text-gray-600 leading-snug">
            What would you like to do today?
          </span>
        </h1>
        <Mascot pose="wave" size="lg" priority className="-mr-3" />
      </div>

      <nav className="flex flex-col gap-4" aria-label="Playful actions">
        {ACTIONS.map((a) => (
          <Link key={a.href} href={a.href} className="play-btn-sun">
            {a.title}
            <span className="block font-playful font-bold text-[0.9rem] text-sun-900/70 mt-0.5">{a.sub}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
