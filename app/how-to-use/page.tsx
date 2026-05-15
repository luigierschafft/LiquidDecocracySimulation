import Link from 'next/link'

export const metadata = { title: 'How to use — Autopoietic Agora' }

const phases = [
  {
    n: 1,
    label: 'Start a Topic',
    color: 'bg-violet-100 text-violet-700 border-violet-200',
    dot: 'bg-violet-400',
    description: 'Any community member can open a topic — a question, a problem, an idea. This is the seed of every decision.',
  },
  {
    n: 2,
    label: 'Discuss',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dot: 'bg-blue-400',
    description: 'Everyone can share opinions, ask questions, post arguments for and against. The conversation shapes what matters.',
  },
  {
    n: 3,
    label: 'Propose Initiatives',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    dot: 'bg-cyan-400',
    description: 'Concrete proposals emerge from the discussion. Anyone can write one — clear, structured, actionable.',
  },
  {
    n: 4,
    label: 'Improve Together',
    color: 'bg-teal-100 text-teal-700 border-teal-200',
    dot: 'bg-teal-400',
    description: 'Proposals can be forked, merged, refined. AI tools help find common ground and surface new insights.',
  },
  {
    n: 5,
    label: 'Vote',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-400',
    description: 'Members vote directly — or delegate their vote to someone they trust. Delegation flows through the network automatically.',
  },
  {
    n: 6,
    label: 'Approve',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    description: 'When a proposal reaches enough support, it is approved. The result is transparent and traceable for everyone.',
  },
  {
    n: 7,
    label: 'Elaborate',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-400',
    description: 'After a decision, the community reflects: what worked, what did not. This feeds the next cycle of improvement.',
  },
]

const features = [
  {
    icon: '💬',
    title: 'Discuss freely',
    text: 'Post opinions, questions and arguments. React to others. Build on each other\'s ideas.',
  },
  {
    icon: '📝',
    title: 'Write proposals',
    text: 'Turn ideas into structured proposals with context, cost and timeline.',
  },
  {
    icon: '🔀',
    title: 'Delegate your vote',
    text: 'Not an expert on a topic? Delegate to someone you trust. Your voice still counts.',
  },
  {
    icon: '🤖',
    title: 'AI assistance',
    text: 'AI summarises discussions, checks facts, challenges arguments and helps merge proposals.',
  },
  {
    icon: '🗳️',
    title: 'Vote your way',
    text: 'Simple yes/no, ranked choice, scale voting — the format fits the decision.',
  },
  {
    icon: '🌐',
    title: 'Transparent by design',
    text: 'Every vote, delegation and decision is visible. Nothing happens behind closed doors.',
  },
]

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand/30 to-background">
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-16">

        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="text-sm text-foreground/40 hover:text-foreground/70 transition-colors">
            ← Back
          </Link>
          <h1 className="text-4xl font-bold text-foreground mt-4">How it works</h1>
          <p className="text-foreground/60 text-lg leading-relaxed">
            Autopoietic Agora is a living space for collective decision-making.<br />
            Every voice matters. Every idea has a path.
          </p>
        </div>

        {/* Process flow */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground/80 text-center">The Process</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-violet-300 via-green-300 to-orange-300 rounded-full" />

            <div className="space-y-3">
              {phases.map((phase) => (
                <div key={phase.n} className="flex gap-4 items-start">
                  {/* Dot */}
                  <div className={`w-12 h-12 rounded-full ${phase.dot} flex items-center justify-center shrink-0 shadow-sm z-10`}>
                    <span className="text-white font-bold text-sm">{phase.n}</span>
                  </div>
                  {/* Card */}
                  <div className={`flex-1 border rounded-xl px-4 py-3 ${phase.color}`}>
                    <div className="font-semibold text-sm">{phase.label}</div>
                    <div className="text-xs mt-0.5 opacity-80 leading-relaxed">{phase.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground/80 text-center">What you can do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-sand rounded-xl px-4 py-4 space-y-1 shadow-sm">
                <div className="text-2xl">{f.icon}</div>
                <div className="font-semibold text-sm text-foreground">{f.title}</div>
                <div className="text-xs text-foreground/60 leading-relaxed">{f.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delegation explainer */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl px-6 py-6 space-y-3">
          <h2 className="text-lg font-semibold text-accent">Liquid Democracy — what is delegation?</h2>
          <p className="text-sm text-foreground/70 leading-relaxed">
            You can vote on every topic yourself — or you can delegate your vote to someone you trust on specific topics.
            That person can in turn delegate further. If you ever want to vote yourself, your vote always takes priority.
          </p>
          <div className="flex items-center gap-2 flex-wrap text-xs text-foreground/50">
            <span className="bg-white border border-sand rounded-full px-3 py-1">You</span>
            <span>→</span>
            <span className="bg-white border border-sand rounded-full px-3 py-1">Trusted member</span>
            <span>→</span>
            <span className="bg-white border border-sand rounded-full px-3 py-1">Their delegate</span>
            <span>→</span>
            <span className="bg-accent/10 border border-accent/30 text-accent rounded-full px-3 py-1 font-medium">Vote counted</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 pb-8">
          <p className="text-foreground/50 text-sm">Ready to participate?</p>
          <div className="flex gap-3 justify-center">
            <Link href="/topics" className="btn-primary px-6 py-3 font-semibold">
              Browse Topics
            </Link>
            <Link href="/auth/login" className="btn-secondary px-6 py-3 font-semibold">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
