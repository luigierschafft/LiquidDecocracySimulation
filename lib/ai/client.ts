import Groq from 'groq-sdk'

/**
 * Central AI access point. All AI features call `generateText` instead of
 * talking to the provider SDK directly, so model choice, defaults and error
 * handling live in one place.
 */

export const AI_MODELS = {
  /** High-quality model for analysis, drafting and structured output. */
  default: 'llama-3.3-70b-versatile',
  /** Cheap, fast model for conversational chat in playful mode. */
  fast: 'llama-3.1-8b-instant',
} as const

export type AiModel = keyof typeof AI_MODELS

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GenerateOptions {
  /** Single user prompt. Ignored if `messages` is given. */
  prompt?: string
  /** Optional system prompt, prepended to the conversation. */
  system?: string
  /** Full conversation (use instead of `prompt` for chats). */
  messages?: ChatMessage[]
  model?: AiModel
  maxTokens?: number
  temperature?: number
  /** Ask the provider to return a JSON object. */
  json?: boolean
}

let client: Groq | null = null

function getClient(): Groq {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured')
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return client
}

export async function generateText(options: GenerateOptions): Promise<string> {
  const { prompt, system, model = 'default', maxTokens = 500, temperature, json } = options

  const messages: ChatMessage[] = []
  if (system) messages.push({ role: 'system', content: system })
  if (options.messages) messages.push(...options.messages)
  else if (prompt) messages.push({ role: 'user', content: prompt })

  const completion = await getClient().chat.completions.create({
    model: AI_MODELS[model],
    max_tokens: maxTokens,
    messages,
    ...(temperature !== undefined ? { temperature } : {}),
    ...(json ? { response_format: { type: 'json_object' as const } } : {}),
  })

  return completion.choices[0]?.message?.content ?? ''
}
