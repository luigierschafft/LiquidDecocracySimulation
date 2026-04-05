import Link from 'next/link'
import { ArrowRight, Vote, Users, GitBranch, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

const FLOW_STEPS = [
  { step: '1', label: 'Start a Topic',       desc: 'Raise a question or challenge the community should address together.' },
  { step: '2', label: 'Discuss',             desc: 'Members share perspectives, ask questions, and refine the problem.' },
  { step: '3', label: 'Propose Initiatives', desc: 'Anyone can submit a concrete initiative as a possible solution.' },
  { step: '4', label: 'Improve Together',    desc: 'Initiatives are debated, compared and strengthened collectively.' },
  { step: '5', label: 'Vote',                desc: 'Members vote for the initiative they support most.' },
  { step: '6', label: 'Approve',             desc: 'The winning initiative is accepted by the community.' },
  { step: '7', label: 'Elaborate',           desc: 'The accepted initiative is worked out into a concrete plan together.' },
]

export default async function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand/40 to-background py-24 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-medium px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Participatory Governance
          </div>
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Flow Democracy
            <span className="block text-accent">for Auroville</span>
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            A transparent, community-driven decision-making platform where every voice counts.
            Vote directly or delegate your trust to someone you believe in.
          </p>

          {/* Flow steps */}
          <div className="relative flex justify-between items-start pt-4 px-2">
            {/* Connecting line behind the circles */}
            <div className="absolute top-[30px] left-6 right-6 h-px bg-accent/20" />
            {FLOW_STEPS.map((s) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center gap-2" style={{ width: `${100 / FLOW_STEPS.length}%` }}>
                <div className="w-9 h-9 rounded-full bg-sand border-2 border-accent/30 text-accent text-sm font-bold flex items-center justify-center shadow-sm">
                  {s.step}
                </div>
                <span className="text-[11px] font-medium text-foreground/65 text-center leading-tight px-0.5">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Link href="/proposals" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Browse Topics
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Vote className="w-6 h-6 text-accent" />,
                title: 'Direct Voting',
                description: 'Vote on proposals with Approve, Oppose, or Abstain. Your voice shapes the community decisions directly.',
              },
              {
                icon: <GitBranch className="w-6 h-6 text-accent" />,
                title: 'Liquid Delegation',
                description: "Delegate your vote to someone you trust for specific topics. Revoke or override anytime.",
              },
              {
                icon: <Users className="w-6 h-6 text-accent" />,
                title: 'Community Topics',
                description: 'Any approved member can open a topic. It passes through structured phases: Discussion → Proposition → Voting → Elaboration.',
              },
              {
                icon: <Shield className="w-6 h-6 text-accent" />,
                title: 'Transparent Process',
                description: 'All votes and delegations are visible to the community. Full accountability, no hidden decisions.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to participate?</h2>
          <p className="text-white/80">
            Join the Auroville community governance platform. Sign in with your email — no password needed.
          </p>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-white text-accent font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors mt-4">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
