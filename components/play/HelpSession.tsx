'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ModeAgreeDisagree } from './ModeAgreeDisagree'
import { ModeRanking } from './ModeRanking'
import { ModeProContra } from './ModeProContra'

interface Topic {
  id: string
  title: string
  createdAt: string
  statementCount: number
}

interface Props {
  topics: Topic[]
  userId: string
}

interface Session {
  topicId: string
  topicTitle: string
  topicCreatedAt: string
  mode: 1 | 2 | 3
  expiresAt: number
}

const SESSION_KEY = 'play_help_session'
const SESSION_TTL = 2 * 60 * 60 * 1000 // 2 hours

// Max items per mode per session
const MODE_LIMITS: Record<number, number> = { 1: 999, 2: 10, 3: 5 }

function pickWeightedTopic(topics: Topic[]): Topic {
  const weights = topics.map(t => 1 / (t.statementCount + 1))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < topics.length; i++) {
    r -= weights[i]
    if (r <= 0) return topics[i]
  }
  return topics[topics.length - 1]
}

function pickMode(createdAt: string): 1 | 2 | 3 {
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000
  const r = Math.random()
  if (ageDays < 30) {
    // Young topic: 10% / 10% / 80% — accumulate pro/contras
    if (r < 0.10) return 1
    if (r < 0.20) return 2
    return 3
  }
  // Mature topic: equal thirds
  if (r < 0.333) return 1
  if (r < 0.666) return 2
  return 3
}

interface ModeData {
  statements?: { id: string; text: string }[]
  pair?: [{ id: string; text: string; elo_score: number }, { id: string; text: string; elo_score: number }] | null
  statement?: { id: string; text: string } | null
  nodes?: { id: string; type: string; text: string }[]
}

type Status = 'loading' | 'active' | 'done' | 'empty'

const INSTRUCTIONS: Record<number, string> = {
  1: 'Please tell me what you think about this statement. Agree, Disagree, or Pass if you\'re not sure.',
  2: 'Please rank which of these statements is more important to you.',
  3: 'Please find a pro or contra argument for this statement.',
}

export function HelpSession({ topics, userId }: Props) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [data, setData] = useState<ModeData>({})
  const itemCount = useRef(0)

  useEffect(() => { init() }, [])

  function init() {
    if (topics.length === 0) { setStatus('empty'); return }
    // Always clear stale sessions — start fresh each page load
    localStorage.removeItem(SESSION_KEY)
    startNewSession()
  }

  function startNewSession(excludeTopicIds: string[] = []) {
    const available = excludeTopicIds.length > 0
      ? topics.filter(t => !excludeTopicIds.includes(t.id))
      : topics

    if (available.length === 0) { setStatus('done'); return }

    const topic = pickWeightedTopic(available)
    const mode = pickMode(topic.createdAt)
    const s: Session = {
      topicId: topic.id,
      topicTitle: topic.title,
      topicCreatedAt: topic.createdAt,
      mode,
      expiresAt: Date.now() + SESSION_TTL,
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    itemCount.current = 0
    setSession(s)
    fetchData(s, [])
  }

  async function fetchData(s: Session, triedTopicIds: string[]) {
    setStatus('loading')
    try {
      const res = await fetch(`/api/play/help-data?topicId=${s.topicId}&mode=${s.mode}`)
      const d: ModeData = await res.json()

      const isEmpty =
        (s.mode === 2 && !d.pair) ||
        (s.mode === 3 && !d.statement) ||
        (s.mode === 1 && (!d.statements || d.statements.length === 0))

      if (isEmpty) {
        // This topic/mode has nothing — try another topic
        const tried = [...triedTopicIds, s.topicId]
        const next = topics.find(t => !tried.includes(t.id))
        if (next) {
          const mode = pickMode(next.createdAt)
          const newSession: Session = {
            topicId: next.id,
            topicTitle: next.title,
            topicCreatedAt: next.createdAt,
            mode,
            expiresAt: Date.now() + SESSION_TTL,
          }
          localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
          itemCount.current = 0
          setSession(newSession)
          fetchData(newSession, tried)
        } else {
          localStorage.removeItem(SESSION_KEY)
          setStatus('done')
        }
        return
      }

      setData(d)
      setStatus('active')
    } catch {
      setStatus('empty')
    }
  }

  async function handleNext() {
    if (!session) return
    itemCount.current++
    if (itemCount.current >= MODE_LIMITS[session.mode]) {
      handleDone()
      return
    }
    await fetchData(session, [])
  }

  function handleDone() {
    localStorage.removeItem(SESSION_KEY)
    setStatus('done')
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 mt-10">
        <p className="text-xs text-gray-400 animate-pulse">Finding where you can help…</p>
        <Image src="/mongoose-thinking.png" alt="Mongoose" width={110} height={128}
          placeholder="empty" style={{ background: 'transparent' }} className="drop-shadow-lg" />
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <div className="flex flex-col items-center gap-3 mt-10">
        <p className="text-sm text-gray-400 text-center">No topics available right now.</p>
      </div>
    )
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-4 mt-10 text-center max-w-xs">
        <p className="text-xl font-black text-gray-800">Thank you!</p>
        <Image src="/mongoose.png" alt="Mongoose" width={120} height={140}
          placeholder="empty" style={{ background: 'transparent' }} className="drop-shadow-lg" />
        <p className="text-sm text-gray-500 leading-relaxed">
          You&apos;ve helped a lot for now.<br />Come back later to help more.
        </p>
        <button
          onClick={() => startNewSession()}
          className="mt-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-[2rem] px-6 py-3 text-sm font-bold text-gray-900 shadow-md active:scale-95 transition-transform"
        >
          Help with another topic
        </button>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="w-full max-w-xs flex flex-col items-center gap-4">

      {/* Instruction */}
      <p className="text-xs text-gray-500 text-center leading-relaxed px-2">
        {INSTRUCTIONS[session.mode]}
      </p>

      {/* Topic name */}
      <p className="text-sm font-bold text-gray-800 text-center">{session.topicTitle}</p>

      {/* Mode components */}
      {session.mode === 1 && (
        <ModeAgreeDisagree
          statements={data.statements ?? []}
          userId={userId}
          onDone={handleDone}
        />
      )}

      {session.mode === 2 && data.pair && (
        <ModeRanking
          pair={data.pair}
          issueId={session.topicId}
          onNext={handleNext}
        />
      )}

      {session.mode === 3 && data.statement && (
        <ModeProContra
          statement={data.statement}
          nodes={data.nodes ?? []}
          userId={userId}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
