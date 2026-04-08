import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const FLOW_STEPS = [
  { n: 1, label: 'Start a Topic' },
  { n: 2, label: 'Discuss' },
  { n: 3, label: 'Propose Initiatives' },
  { n: 4, label: 'Improve Together' },
  { n: 5, label: 'Vote' },
  { n: 6, label: 'Approve' },
  { n: 7, label: 'Elaborate' },
]

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand/40 to-background">
      <section className="py-24 px-4">
        <div className="max-w-sm mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Flow Democracy
            <span className="block text-accent">for Auroville</span>
          </h1>

          <Link href="/topics" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
            Browse Topics
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Flow steps vertical */}
          <div className="flex flex-col items-center gap-0 pt-2">
            {FLOW_STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-col items-center">
                <div className="flex items-center justify-center bg-white border border-accent/25 rounded-lg shadow-sm px-6 py-3 w-56 text-center">
                  <span className="text-sm font-semibold text-foreground/80">{s.n}. {s.label}</span>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <ArrowDown className="w-5 h-5 text-accent/40 my-1" />
                )}
              </div>
            ))}
          </div>

          {/* Platform description */}
          <div className="text-left space-y-3 pt-4 border-t border-sand">
            <p className="text-sm text-foreground/60 leading-relaxed">
              Flow Democracy is Auroville&apos;s participatory governance platform. Every community member can raise topics, discuss ideas, submit proposals and vote — directly or by delegating their vote to someone they trust.
            </p>
            <p className="text-sm text-foreground/60 leading-relaxed">
              Each topic moves through a structured process:
            </p>
            <ol className="text-sm text-foreground/60 space-y-1 list-none">
              {FLOW_STEPS.map((s) => (
                <li key={s.n} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0">{s.n}</span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  )
}
