import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type { Platform } from '@/lib/types'
import { PLATFORM_COOKIE } from './constants'

export { PLATFORM_COOKIE } from './constants'

export function getPlatformSlug(): string | null {
  return cookies().get(PLATFORM_COOKIE)?.value ?? null
}

export async function getCurrentPlatform(): Promise<Platform | null> {
  const slug = getPlatformSlug()
  if (!slug) return null
  const supabase = createClient()
  const { data } = await supabase.from('platform').select('*').eq('slug', slug).single()
  return data ?? null
}

export async function getCurrentPlatformId(): Promise<string | null> {
  const platform = await getCurrentPlatform()
  return platform?.id ?? null
}
