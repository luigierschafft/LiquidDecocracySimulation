import { groq, AI_MODEL } from '@/lib/ai/client'
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
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

2. "realisticPrompt": A detailed image generation prompt (150-200 words) for a PHOTOREALISTIC image showing Auroville with this proposal implemented. Must include: tropical Tamil Nadu setting, red earth, lush green vegetation, warm golden sunlight, specific elements from the proposal, real architectural style of Auroville, people of diverse nationalities. Style: cinematic photography, golden hour lighting, high detail.

3. "comicPrompt": A detailed image generation prompt (150-200 words) for a COMIC/INFOGRAPHIC style illustration showing the key elements of this proposal in Auroville. Must include: comic book style, flat design illustration, labeled elements with short text annotations pointing to key features, Auroville tropical backdrop, the 3-5 most important points from the proposal shown as visual elements with small caption labels. Style: clean vector illustration, vibrant colors, informational diagram style.

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
    parsed = JSON.parse(raw)
  } catch {
    // Try to extract JSON from the response
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      parsed = JSON.parse(match[0])
    } else {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }
  }

  // Build Pollinations.ai image URLs (free, no API key needed)
  const realisticUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(parsed.realisticPrompt)}&width=1024&height=768&model=flux&nologo=true&seed=${Math.floor(Math.random() * 99999)}`
  const comicUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(parsed.comicPrompt)}&width=1024&height=768&model=flux&nologo=true&seed=${Math.floor(Math.random() * 99999)}`

  return NextResponse.json({
    story: parsed.story,
    realisticImageUrl: realisticUrl,
    comicImageUrl: comicUrl,
  })
}
