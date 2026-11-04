/** Platform selection is stored in this cookie (slug of the active platform). */
export const PLATFORM_COOKIE = 'x-platform'

export const PLATFORM_COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax' as const,
}

/**
 * Platform shown to visitors who have not chosen one yet (e.g. not signed in).
 * Without this fallback, topic lists would mix all platforms — including
 * invite-only ones.
 */
export const DEFAULT_PLATFORM_SLUG = 'auroville'
