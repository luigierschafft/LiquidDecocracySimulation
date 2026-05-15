import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand/40 to-background">
      <section className="py-24 px-4">
        <div className="max-w-sm mx-auto text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Autopoietic Agora
            <span className="block text-accent">Auroville</span>
          </h1>

          <div className="flex gap-3 w-full">
            <Link href="/topics" className="btn-primary inline-flex items-center justify-center text-lg px-6 py-5 flex-1 font-bold">
              Classic
            </Link>
            <Link href="/playful" className="inline-flex items-center justify-center text-lg px-6 py-5 flex-1 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-gray-900 shadow-md hover:brightness-105 transition-all">
              Playful
            </Link>
          </div>

          <p className="text-sm text-foreground/60 leading-relaxed">
            Autopoietic Agora is Auroville&apos;s participatory governance platform. Every community member can raise topics, discuss ideas, submit proposals and vote — directly or by delegating their vote to someone they trust.
          </p>

          <Link href="/how-to-use" className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-accent transition-colors underline underline-offset-4">
            How to use this
          </Link>
        </div>
      </section>
    </div>
  )
}
