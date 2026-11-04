import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/types'
import { DEFAULT_PLATFORM_SLUG } from './constants'

export { DEFAULT_PLATFORM_SLUG } from './constants'

/** Slug of the active platform (single-platform mode: always the default). */
export function getPlatformSlug(): string {
  return DEFAULT_PLATFORM_SLUG
}

export async function getCurrentPlatform(): Promise<Platform | null> {
  const supabase = createClient()
  const { data } = await supabase.from('platform').select('*').eq('slug', getPlatformSlug()).single()
  return data ?? null
}

export async function getCurrentPlatformId(): Promise<string | null> {
  const platform = await getCurrentPlatform()
  return platform?.id ?? null
}
