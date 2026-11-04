/**
 * The app currently runs a single platform. All topics are scoped to it and
 * every member joins it automatically at sign-in (see /auth/callback).
 *
 * Multi-platform support (platform + platform_member tables) still exists in
 * the database; to bring platform switching back, store the chosen slug in a
 * cookie and read it in `getPlatformSlug()`.
 */
export const DEFAULT_PLATFORM_SLUG = 'auroville'
