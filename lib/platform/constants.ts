/** Platform selection is stored in this cookie (slug of the active platform). */
export const PLATFORM_COOKIE = 'x-platform'

export const PLATFORM_COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax' as const,
}
