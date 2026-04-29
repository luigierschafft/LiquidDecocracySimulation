import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(req: NextRequest) {
  const { context } = await req.json()
  if (!context) return NextResponse.json({ error: 'Missing context' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: `You are summarizing a community discussion for the Auroville community app.
Only use information from the discussion data provided — never invent facts.
Write in a warm, concise, community-oriented tone readable on a phone screen.`,
      },
      {
        role: 'user',
        content: `Here is the full discussion data:\n${context}\n\nWrite a clear summary (4-6 sentences) covering:
1. What the topic is about
2. Which statements were rated most positively or negatively
3. The key pro and contra arguments raised
4. Any open questions or tensions in the discussion
If something is unclear or missing, say so.
At the very end, add one friendly sentence asking if the reader would like to explore any aspect in more depth.`,
      },
    ],
  })

  const summary = completion.choices[0]?.message?.content ?? ''
  return NextResponse.json({ summary })
}
