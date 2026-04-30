import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const { context, history, question } = await req.json()
  if (!context || !question) return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    {
      role: 'system',
      content: `You are a helpful assistant for the Auroville community app answering questions about a specific topic discussion.

RULES:
- Answer ONLY based on the discussion data below — never invent or assume facts
- If the question is about something not mentioned in the discussion, clearly say: "This hasn't been discussed yet in this topic."
- Do not answer questions unrelated to this topic
- Be concise and friendly
- Always end your answer by suggesting 1-2 specific follow-up questions the user might want to explore

DISCUSSION DATA:
${context}`,
    },
  ]

  for (const msg of history ?? []) {
    messages.push({ role: msg.role, content: msg.text })
  }
  messages.push({ role: 'user', content: question })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 350,
    messages,
  })

  const answer = completion.choices[0]?.message?.content ?? 'Sorry, I could not answer that.'
  return NextResponse.json({ answer })
}
