import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/types'
import { DEFAULT_PLATFORM_SLUG, PLATFORM_COOKIE } from './constants'

export { PLATFORM_COOKIE } from './constants'

/** Slug of the active platform: the user's choice, else the public default. */
export function getPlatformSlug(): string {
  return cookies().get(PLATFORM_COOKIE)?.value ?? DEFAULT_PLATFORM_SLUG
}

export async function getCurrentPlatform(): Promise<Platform | null> {
  const slug = getPlatformSlug()
  const supabase = createClient()
  const { data } = await supabase.from('platform').select('*').eq('slug', slug).single()
  return data ?? null
}

export async function getCurrentPlatformId(): Promise<string | null> {
  const platform = await getCurrentPlatform()
  return platform?.id ?? null
}
