import Anthropic from '@anthropic-ai/sdk'

// Shared Anthropic client for all AI module API routes
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const AI_MODEL = 'claude-haiku-4-5-20251001'
