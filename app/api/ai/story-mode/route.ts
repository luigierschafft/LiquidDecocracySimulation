import { generateText } from '@/lib/ai/client'
import { parseJsonObject } from '@/lib/ai/json'
import { AUROVILLE_CONTEXT } from '@/lib/ai/context'
import { apiRoute, badRequest, HttpError, readJson, requireUser } from '@/lib/api/handler'

export const maxDuration = 120

function buildImageUrl(prompt: string, seed: number): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=512&seed=${seed}`
}

const SYSTEM_PROMPT = `You are a storytelling AI for Auroville. ${AUROVILLE_CONTEXT}

You will receive a governance proposal. Return a JSON object with exactly these three keys:

"story": A vivid 3-4 paragraph narrative from the perspective of an Auroville resident living 10 years in the future where this proposal has been implemented. First person, present tense. Include sensory details of the tropical setting (red earth, palm trees, warm sun, sounds of birds). Show concretely how this proposal changed daily life.

"realisticPrompt": Image prompt (max 60 words) for a photorealistic photograph. Include: specific visual elements from the proposal, Auroville red-earth paths and tropical greenery, golden hour sunlight, diverse international community members, architectural details. End with: "photorealistic, cinematic photography, 8k, golden hour".

"comicPrompt": Image prompt (max 60 words) for a comic illustration. Include: specific visual elements from the proposal, Auroville tropical backdrop with palm trees and earth buildings, cheerful community members. End with: "flat design illustration, bold outlines, vibrant colors, cartoon style, 2D art".`

export const POST = apiRoute(async (req) => {
  await requireUser()
  const { proposalText, topicTitle } = await readJson<{ proposalText?: string; topicTitle?: string }>(req)
  if (!proposalText) throw badRequest('No proposal text')

  const raw = await generateText({
    system: SYSTEM_PROMPT,
    prompt: `Topic: ${topicTitle || 'Auroville Governance'}\n\nProposal:\n${proposalText}`,
    json: true,
    temperature: 0.8,
    maxTokens: 2000,
  })

  const parsed = parseJsonObject<{ story?: string; realisticPrompt?: string; comicPrompt?: string }>(raw)
  if (!parsed?.story || !parsed.realisticPrompt || !parsed.comicPrompt) {
    throw new HttpError(500, 'AI response missing required fields')
  }

  // Return URLs — the browser loads the images itself (no server timeout)
  const seed = Math.floor(Math.random() * 99999)
  return {
    story: parsed.story,
    realisticImageUrl: buildImageUrl(parsed.realisticPrompt, seed),
    comicImageUrl: buildImageUrl(parsed.comicPrompt, seed + 1),
  }
})
