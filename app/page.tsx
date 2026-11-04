import Link from 'next/link'
import { Mascot } from '@/components/play/Mascot'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-dawn">
      <section className="px-5 pt-24 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-[2.6rem] sm:text-5xl font-extrabold text-gray-900 leading-[1.05] text-balance">
            Autopoietic Agora
            <span className="block text-accent">Auroville</span>
          </h1>
          <p className="mt-4 text-[17px] text-gray-600 leading-relaxed">
            Raise topics, discuss ideas, shape proposals and vote — directly, or by trusting someone to vote for you.
          </p>

          <div className="mt-10 grid gap-4">
            <Link
              href="/playful"
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl px-6 py-5 min-h-[112px] shadow-cushion active:translate-y-[3px] active:shadow-none transition-transform"
              style={{ background: 'linear-gradient(180deg, #FFCB6B 0%, #FF9F43 100%)' }}
            >
              <div className="flex-1">
                <p className="font-fun font-semibold text-2xl text-sun-900">Playful</p>
                <p className="font-playful font-bold text-[15px] text-sun-900/75 mt-0.5">Light, guided and fun</p>
              </div>
              <Mascot pose="wave" size="md" className="-my-3 -mr-2" />
            </Link>

            <Link
              href="/topics"
              className="group flex items-center gap-4 rounded-3xl bg-white border border-line px-6 py-5 min-h-[112px] shadow-soft hover:shadow-lift transition-shadow"
            >
              <div className="flex-1">
                <p className="text-2xl font-extrabold text-gray-900">Classic</p>
                <p className="text-[15px] text-gray-500 mt-0.5">Every topic, statement and vote in detail</p>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-gray-400 transition-transform group-hover:translate-x-0.5">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          <Link href="/how-to-use" className="mt-8 inline-flex items-center min-h-[44px] text-[15px] font-semibold text-gray-500 hover:text-accent underline underline-offset-4 transition-colors">
            How does this work?
          </Link>
        </div>
      </section>
    </div>
  )
}
