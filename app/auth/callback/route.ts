import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { safeRedirectPath } from '@/lib/utils'
import { AUTH_NEXT_COOKIE } from '@/lib/auth/constants'
import { getCurrentPlatformId } from '@/lib/platform'
import { createAdminClient } from '@/lib/supabase/admin'

const UNIQUE_VIOLATION = '23505' // already a member

async function ensurePlatformMembership(supabase: ReturnType<typeof createClient>, userId: string) {
  const platformId = await getCurrentPlatformId()
  if (!platformId) return
  const { error } = await supabase
    .from('platform_member')
    .insert({ platform_id: platformId, user_id: userId, role: 'member', status: 'approved' })
  if (error && error.code !== UNIQUE_VIOLATION) {
    console.error('[auth/callback] could not add platform membership:', error.message)
  }
}

/** Comma-separated emails that are auto-approved as admin on every platform. */
function isSuperadmin(email: string | undefined): boolean {
  if (!email) return false
  const list = (process.env.SUPERADMIN_EMAILS ?? '').split(',').map((e) => e.trim().toLowerCase())
  return list.includes(email.toLowerCase())
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  // Set by Supabase/Google when the provider rejected the login
  const providerError = url.searchParams.get('error_description') ?? url.searchParams.get('error')
  // `next` comes from the query (magic link) or a cookie (Google login)
  const nextCookie = cookies().get(AUTH_NEXT_COOKIE)?.value
  const next = safeRedirectPath(url.searchParams.get('next') ?? nextCookie ?? null) // cookies() already returns the decoded value)
  if (nextCookie) cookies().delete(AUTH_NEXT_COOKIE)

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) console.error('[auth/callback] code exchange failed:', error.message)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Ensure superadmin is approved admin on all platforms
        if (isSuperadmin(user.email)) {
          // RLS does not let a not-yet-admin grant themselves admin, so use the service role
          if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('[auth/callback] SUPABASE_SERVICE_ROLE_KEY missing — cannot grant superadmin rights')
          } else {
            const admin = createAdminClient()
            const { data: platforms } = await admin.from('platform').select('id')
            const rows = (platforms ?? []).map((p) => ({ platform_id: p.id, user_id: user.id, role: 'admin', status: 'approved' }))
            const { error: upsertError } = rows.length
              ? await admin.from('platform_member').upsert(rows, { onConflict: 'platform_id,user_id' })
              : { error: null }
            if (upsertError) console.error('[auth/callback] superadmin upsert failed:', upsertError.message)
          }
        }

        // Single-platform mode: every member joins the default platform automatically
        await ensurePlatformMembership(supabase, user.id)
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('error', providerError ?? 'auth_failed')
  loginUrl.searchParams.set('next', next)
  return NextResponse.redirect(loginUrl)
}
