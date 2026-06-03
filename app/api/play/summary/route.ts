import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { context } = await req.json()
  if (!context) return NextResponse.json({ error: 'Missing context' }, { status: 400 })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: `You are summarizing a community discussion for the Auroville community app.
STRICT RULE: Only use information explicitly provided in the data below — never invent, guess or add facts.
If there is no discussion data, say so clearly and warmly.
Write in a warm, concise, community-oriented tone readable on a phone screen.`,
      },
      {
        role: 'user',
        content: `Here is the full discussion data:\n\n${context}\n\nIf no statements or proposals exist, write 1-2 warm sentences saying the discussion hasn't started yet and inviting the reader to be the first to contribute.

Otherwise write a clear summary (4-6 sentences) covering only what is in the data:
1. What the topic is about (use the description if available)
2. Which statements were rated most positively (only if ratings exist)
3. The key pro and contra arguments raised (only if they exist)
4. Any proposals from the community (only if they exist)
At the very end, add one friendly sentence asking if the reader would like to explore any aspect in more depth.`,
      },
    ],
  })

  const summary = completion.choices[0]?.message?.content ?? ''
  return NextResponse.json({ summary })
}
