import { NextResponse } from 'next/server'
import { anthropic, AI_MODEL } from '@/lib/ai/client'
import { createClient } from '@/lib/supabase/server'

// Module 56: Argument Merger — find and suggest merging duplicate/similar arguments
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { initiativeId } = await request.json()
  if (!initiativeId) return NextResponse.json({ error: 'initiativeId required' }, { status: 400 })

  const { data: args } = await supabase
    .from('argument')
    .select('id, stance, content')
    .eq('initiative_id', initiativeId)
    .limit(30)

  if (!args || args.length < 3) {
    return NextResponse.json({ result: 'Not enough arguments to find duplicates (need at least 3).' })
  }

  const numbered = args.map((a, i) => `${i + 1}. [${a.stance}] ${a.content}`).join('\n')

  const message = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Review these arguments for a community proposal and identify any that are very similar or redundant. For each group of similar arguments, suggest a merged version that captures all their points concisely.\n\nArguments:\n${numbered}`,
    }],
  })

  return NextResponse.json({ result: (message.content[0] as any).text ?? '' })
}
