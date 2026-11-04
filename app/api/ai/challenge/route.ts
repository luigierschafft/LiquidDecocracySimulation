import { generateText } from '@/lib/ai/client'
import { apiRoute, badRequest, readJson, requireUser } from '@/lib/api/handler'

// Module 53: Perspective Switch — show alternative viewpoints
// Module 54: Auto Debater — generate counterarguments
// Module 57: Bias Breaker — challenge user bias
const PROMPTS: Record<string, (content: string) => string> = {
  perspective: (c) => `Someone wrote: "${c}"\n\nPresent 2-3 alternative perspectives that someone with a different background or values might hold on this topic. Be empathetic and fair to each perspective. Keep it brief.`,
  debate: (c) => `Someone wrote: "${c}"\n\nGenerate 3 strong counterarguments to this position. Be intellectually honest — the goal is to help the person stress-test their reasoning, not to attack them.`,
  bias: (c) => `Analyze this statement for potential cognitive biases or assumptions: "${c}"\n\nIdentify 2-3 possible biases (e.g. confirmation bias, availability heuristic, in-group favoritism) and briefly explain how they might be influencing this view. Be respectful and educational.`,
}

export const POST = apiRoute(async (req) => {
  await requireUser()
  const { content, mode } = await readJson<{ content?: string; mode?: string }>(req)
  if (!content?.trim()) throw badRequest('content required')
  const build = mode ? PROMPTS[mode] : undefined
  if (!build) throw badRequest(`Unknown mode: ${mode}`)

  const result = await generateText({ prompt: build(content), maxTokens: 400 })
  return { result }
})
