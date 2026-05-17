import { groq, AI_MODEL } from '@/lib/ai/client'
import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 120

const AUROVILLE_CONTEXT = `
Auroville is an experimental township in Tamil Nadu, South India, near Pondicherry.
Key facts about Auroville:
- Located in Tamil Nadu, tropical climate, always warm (25-35°C year-round)
- Lush tropical vegetation: banyan trees, bougainvillea, coconut palms, red earth
- International community of ~3,500 people from 60+ nations
- Built around the Matrimandir (a golden sphere meditation center)
- Focused on sustainability, solar energy, organic farming, conscious living
- Circular city design surrounded by a green belt / forest
- Architecture: earth buildings, bamboo structures, solar-powered facilities
- Community values: human unity, sustainability, spiritual growth
`

// Escape unescaped control characters inside JSON string values
function sanitizeJson(raw: string): string {
  let inString = false
  let escaped = false
  let result = ''
  for (const ch of raw) {
    if (escaped) {
      result += ch
      escaped = false
    } else if (ch === '\\' && inString) {
      result += ch
      escaped = true
    } else if (ch === '"') {
      result += ch
      inString = !inString
    } else if (inString && (ch === '\n' || ch === '\r' || ch === '\t')) {
      if (ch === '\n') result += '\\n'
      else if (ch === '\r') result += '\\r'
      else result += '\\t'
    } else {
      result += ch
    }
  }
  return result
}

function buildImageUrl(prompt: string, seed: number): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=512&seed=${seed}`
}

export async function POST(req: NextRequest) {
  try {
    const { proposalText, topicTitle } = await req.json()

    if (!proposalText) {
      return NextResponse.json({ error: 'No proposal text' }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a storytelling AI for Auroville. ${AUROVILLE_CONTEXT}

You will receive a governance proposal. Return a JSON object with exactly these three keys:

"story": A vivid 3-4 paragraph narrative from the perspective of an Auroville resident living 10 years in the future where this proposal has been implemented. First person, present tense. Include sensory details of the tropical setting (red earth, palm trees, warm sun, sounds of birds). Show concretely how this proposal changed daily life.

"realisticPrompt": Image prompt (max 60 words) for a photorealistic photograph. Include: specific visual elements from the proposal, Auroville red-earth paths and tropical greenery, golden hour sunlight, diverse international community members, architectural details. End with: "photorealistic, cinematic photography, 8k, golden hour".

"comicPrompt": Image prompt (max 60 words) for a comic illustration. Include: specific visual elements from the proposal, Auroville tropical backdrop with palm trees and earth buildings, cheerful community members. End with: "flat design illustration, bold outlines, vibrant colors, cartoon style, 2D art".`,
        },
        {
          role: 'user',
          content: `Topic: ${topicTitle || 'Auroville Governance'}\n\nProposal:\n${proposalText}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    // With response_format: json_object, Groq always returns valid JSON
    const raw = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(sanitizeJson(raw)) as { story: string; realisticPrompt: string; comicPrompt: string }

    if (!parsed.story || !parsed.realisticPrompt || !parsed.comicPrompt) {
      return NextResponse.json({ error: 'AI response missing required fields' }, { status: 500 })
    }

    const seed = Math.floor(Math.random() * 99999)

    // Return URLs — browser loads images with spinner (no server timeout)
    const realisticImageUrl = buildImageUrl(parsed.realisticPrompt, seed)
    const comicImageUrl = buildImageUrl(parsed.comicPrompt, seed + 1)

    return NextResponse.json({
      story: parsed.story,
      realisticImageUrl,
      comicImageUrl,
    })
  } catch (e: any) {
    console.error('[story-mode]', e)
    return NextResponse.json({ error: e?.message ?? 'Internal server error' }, { status: 500 })
  }
}
