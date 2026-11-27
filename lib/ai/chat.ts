import type { ChatMessage } from './client'

/** Chat history as sent by the playful-mode chat components. */
export interface ClientChatMessage {
  role: 'user' | 'assistant'
  text: string
}

/** Convert client history to provider messages, dropping anything malformed. */
export function toChatMessages(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return []
  return history
    .filter((m): m is ClientChatMessage =>
      !!m && (m.role === 'user' || m.role === 'assistant') && typeof m.text === 'string')
    .map((m) => ({ role: m.role, content: m.text }))
}
