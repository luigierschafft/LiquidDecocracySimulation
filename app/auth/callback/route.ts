import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const SUPERADMIN_EMAIL = 'lukasweick@gmail.com'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/topics'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Ensure superadmin is approved admin on all platforms
        if (user.email === SUPERADMIN_EMAIL) {
          const { data: platforms } = await supabase.from('platform').select('id')
          for (const platform of platforms ?? []) {
            await supabase.from('platform_member').upsert(
              { platform_id: platform.id, user_id: user.id, role: 'admin', status: 'approved' },
              { onConflict: 'platform_id,user_id' }
            )
          }
        }

        // Check how many approved platforms the user belongs to
        const { data: memberships } = await supabase
          .from('platform_member')
          .select('platform_id, platform:platform(slug)')
          .eq('user_id', user.id)
          .eq('status', 'approved')

        const approved = memberships ?? []

        if (approved.length === 1) {
          const slug = (approved[0] as any).platform?.slug as string | undefined
          if (slug) {
            // Auto-select the single platform and redirect
            return NextResponse.redirect(
              new URL(`/api/platform/switch?slug=${encodeURIComponent(slug)}&next=${encodeURIComponent(next)}`, request.url)
            )
          }
        }

        // 0 or multiple platforms — let user choose
        return NextResponse.redirect(
          new URL(`/platform-select?next=${encodeURIComponent(next)}`, request.url)
        )
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=auth_failed', request.url))
}
