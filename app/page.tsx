import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, Vote, Users, GitBranch, Shield } from 'lucide-react'

export default async function LandingPage() {
  const supabase = createClient()
  const { count: issueCount } = await supabase.from('issue').select('*', { count: 'exact', head: true })
  const { count: memberCount } = await supabase.from('member').select('*', { count: 'exact', head: true })

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
            Liquid Democracy
            <span className="block text-accent">for Auroville</span>
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            A transparent, community-driven decision-making platform where every voice counts.
            Vote directly or delegate your trust to someone you believe in.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/proposals" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Browse Proposals
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth/login" className="btn-secondary text-base px-6 py-3">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-sand bg-white/50 py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: issueCount ?? 0, label: 'Active Proposals' },
            { value: memberCount ?? 0, label: 'Community Members' },
            { value: '4', label: 'Governance Areas' },
            { value: '100%', label: 'Transparent' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-3xl font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-foreground/60">{stat.label}</div>
            </div>
          ))}
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
                title: 'Community Proposals',
                description: 'Any approved member can submit a proposal. Initiatives pass through structured phases: admission → discussion → voting.',
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
