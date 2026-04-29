import { NextRequest, NextResponse } from 'next/server'

function extractPhrases(text: string): string[] {
  // Split only on sentence boundaries (. ! ?) followed by space+capital, or newlines
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])|[\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)
}

function similarity(a: string, b: string): number {
  const wordsA = new Set(a.split(/\s+/).filter((w) => w.length > 3))
  const wordsB = new Set(b.split(/\s+/).filter((w) => w.length > 3))
  let overlap = 0
  wordsA.forEach((w) => { if (wordsB.has(w)) overlap++ })
  return overlap / Math.max(wordsA.size, wordsB.size, 1)
}

function uniquePhrases(from: string[], against: string[], maxItems = 3): string[] {
  return from
    .filter((phrase) => !against.some((other) => similarity(phrase, other) > 0.35))
    .slice(0, maxItems)
    .map((phrase) => phrase.charAt(0).toUpperCase() + phrase.slice(1))
}

export async function POST(req: NextRequest) {
  const { current, next } = await req.json()

  if (!current || !next) {
    return NextResponse.json({ error: 'Missing texts' }, { status: 400 })
  }

  const phrasesA = extractPhrases(current)
  const phrasesB = extractPhrases(next)

  return NextResponse.json({
    only_in_a: uniquePhrases(phrasesA, phrasesB),
    only_in_b: uniquePhrases(phrasesB, phrasesA),
  })
}
