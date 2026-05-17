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

async function generateImage(prompt: string, seed: number): Promise<string> {
  const res = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
          seed,
        },
      }),
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`HuggingFace error ${res.status}: ${errText.slice(0, 200)}`)
  }

  const buffer = await res.arrayBuffer()
  const base64 = Buffer.from(buffer).toString('base64')
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  return `data:${contentType};base64,${base64}`
}

export async function POST(req: NextRequest) {
  try {
    const { proposalText, topicTitle } = await req.json()

    if (!proposalText) {
      return NextResponse.json({ error: 'No proposal text' }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a storytelling AI for Auroville. ${AUROVILLE_CONTEXT}

You will receive a governance proposal and must return a JSON object with:
1. "story": A vivid 3-4 paragraph narrative written from the perspective of an Auroville resident living in the future (5-10 years) where this proposal has been implemented. Write in first person, present tense. Describe daily life, the benefits, sensory details (the warmth, the sounds, the colors of the tropics), and how this specific proposal changed things. Include details from the proposal itself.

2. "realisticPrompt": An image prompt (50-70 words MAX) for a PHOTOREALISTIC photo of Auroville with this proposal implemented. Describe: specific visual elements from the proposal, Auroville tropical setting (red earth, palm trees, earth buildings), golden hour lighting, diverse people, cinematic photography style. No generic phrases. Be specific about what is visually shown.

3. "comicPrompt": An image prompt (50-70 words MAX) for a COMIC BOOK ILLUSTRATION of this proposal in Auroville. Style keywords MUST be included: "flat design comic illustration, bold outlines, vibrant saturated colors, cartoon style, 2D art". Describe the main scene with 2-3 specific visual elements from the proposal in a fun illustrated style. Auroville tropical backdrop.

Return ONLY valid JSON, no markdown.`,
        },
        {
          role: 'user',
          content: `Topic: ${topicTitle || 'Auroville Governance'}\n\nProposal:\n${proposalText}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'

    let parsed: { story: string; realisticPrompt: string; comicPrompt: string }
    try {
      parsed = JSON.parse(sanitizeJson(raw))
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(sanitizeJson(match[0]))
        } catch {
          return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
        }
      } else {
        return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
      }
    }

    const seed = Math.floor(Math.random() * 99999)

    const realisticImageUrl = await generateImage(parsed.realisticPrompt, seed)
    const comicImageUrl = await generateImage(parsed.comicPrompt, seed + 1)

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
