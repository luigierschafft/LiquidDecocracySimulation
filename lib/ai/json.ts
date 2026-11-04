/**
 * Helpers for reading JSON out of LLM responses, which often wrap the object
 * in prose or code fences, or contain raw newlines inside strings.
 */

/** Escape unescaped control characters inside JSON string values. */
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
    } else if (inString && ch === '\n') {
      result += '\\n'
    } else if (inString && ch === '\r') {
      result += '\\r'
    } else if (inString && ch === '\t') {
      result += '\\t'
    } else {
      result += ch
    }
  }
  return result
}

/**
 * Extract and parse the first `{...}` object in `raw`.
 * Returns `null` if nothing parseable is found.
 */
export function parseJsonObject<T = Record<string, unknown>>(raw: string): T | null {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(sanitizeJson(match[0])) as T
  } catch {
    return null
  }
}
