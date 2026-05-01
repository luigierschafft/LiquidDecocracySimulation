import Groq from 'groq-sdk'

// Shared Groq client for all AI module API routes
export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const AI_MODEL = 'llama-3.3-70b-versatile'
