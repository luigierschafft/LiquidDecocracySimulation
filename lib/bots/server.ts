import { createAdminClient } from '@/lib/supabase/admin'
import { groq, AI_MODEL } from '@/lib/ai/client'
import { BOT_PLATFORM_SLUG, BOT_RULES, type BotPersona } from './personas'

type Admin = ReturnType<typeof createAdminClient>

/** Returns the issue if it belongs to the Test Platform, otherwise null. */
export async function getTestIssue(admin: Admin, issueId: string) {
  const { data: issue } = await admin
    .from('issue')
    .select('id, title, description, platform:platform_id(slug)')
    .eq('id', issueId)
    .single()
  const slug = (issue as any)?.platform?.slug
  if (!issue || slug !== BOT_PLATFORM_SLUG) return null
  return issue as unknown as { id: string; title: string; description: string | null }
}

/** Ask the model to act as a persona and return parsed JSON (or null on failure). */
export async function askPersona<T>(persona: BotPersona, task: string): Promise<T | null> {
  try {
    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.9,
      max_tokens: 400,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${BOT_RULES}\n\nYOUR CHARACTER:\n${persona.prompt}` },
        { role: 'user', content: task },
      ],
    })
    const raw = completion.choices[0]?.message?.content ?? ''
    return JSON.parse(raw) as T
  } catch (err) {
    console.error(`[bots] ${persona.name} failed:`, err)
    return null
  }
}

export function clamp(text: unknown, max: number): string {
  const s = typeof text === 'string' ? text.trim().replace(/^["']|["']$/g, '') : ''
  return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s
}
