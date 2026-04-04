'use client'

// Module 51: Argument Journey Mode — guides user through the discussion step by step
import { useState } from 'react'
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

interface Step {
  title: string
  prompt: string
  placeholder: string
}

const STEPS: Step[] = [
  {
    title: 'What do you think?',
    prompt: 'Before reading others\' arguments, write your initial reaction to this topic.',
    placeholder: 'My initial take is…',
  },
  {
    title: 'What are the strongest arguments FOR?',
    prompt: 'Set aside your opinion for a moment. What are the best reasons someone might support this?',
    placeholder: 'The best arguments in favor are…',
  },
  {
    title: 'What are the strongest arguments AGAINST?',
    prompt: 'Now consider: what are the best reasons to oppose or question this?',
    placeholder: 'The best arguments against are…',
  },
  {
    title: 'What information is missing?',
    prompt: 'What additional facts, data, or perspectives would help the community decide?',
    placeholder: 'We still need to know…',
  },
  {
    title: 'Has your view changed?',
    prompt: 'After this reflection, has your position shifted? What\'s your considered view now?',
    placeholder: 'After reflecting, I think…',
  },
]

interface Props {
  onPost: (content: string) => void
}

export function ArgumentJourney({ onPost }: Props) {
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(STEPS.length).fill(''))
  const [done, setDone] = useState(false)

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else setDone(true)
  }

  function postSummary() {
    const summary = answers
      .map((a, i) => a.trim() ? `**${STEPS[i].title}**\n${a.trim()}` : null)
      .filter(Boolean)
      .join('\n\n')
    onPost(summary)
    setActive(false)
    setStep(0)
    setAnswers(Array(STEPS.length).fill(''))
    setDone(false)
  }

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-accent border border-accent/20 hover:bg-accent/5 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" />
        Guided Journey
      </button>
    )
  }

  const current = STEPS[step]

  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Argument Journey ({step + 1}/{STEPS.length})
        </span>
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < step ? 'bg-accent' : i === step ? 'bg-accent/60' : 'bg-sand'}`} />
          ))}
        </div>
      </div>

      {!done ? (
        <>
          <div>
            <p className="font-medium text-sm">{current.title}</p>
            <p className="text-xs text-foreground/60 mt-0.5">{current.prompt}</p>
          </div>
          <textarea
            value={answers[step]}
            onChange={(e) => setAnswers((prev) => prev.map((a, i) => i === step ? e.target.value : a))}
            placeholder={current.placeholder}
            className="input w-full text-sm py-2 resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex justify-between">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : setActive(false)}
              className="text-xs text-foreground/50 hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {step === 0 ? 'Cancel' : 'Back'}
            </button>
            <button onClick={next} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
              {step < STEPS.length - 1 ? 'Next' : 'Finish'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-auro-green font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Journey complete!
          </div>
          <p className="text-xs text-foreground/60">You can post your full reflection as a structured comment, or just close.</p>
          <div className="flex gap-2">
            <button onClick={() => setActive(false)} className="btn-secondary text-xs py-1.5 px-3">Discard</button>
            <button onClick={postSummary} className="btn-primary text-xs py-1.5 px-3">Post reflection</button>
          </div>
        </div>
      )}
    </div>
  )
}
