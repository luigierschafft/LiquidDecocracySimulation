import { NextResponse } from 'next/server'
import { apiRoute, badRequest, readJson } from '@/lib/api/handler'
import { PLATFORM_COOKIE, PLATFORM_COOKIE_OPTIONS } from '@/lib/platform/constants'
import { safeRedirectPath } from '@/lib/utils'

const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/

// GET: used by the auth callback redirect chain
export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  const next = safeRedirectPath(url.searchParams.get('next'))

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return NextResponse.redirect(new URL('/platform-select', request.url))
  }

  const response = NextResponse.redirect(new URL(next, request.url))
  response.cookies.set(PLATFORM_COOKIE, slug, PLATFORM_COOKIE_OPTIONS)
  return response
}

// POST: used by the client-side platform switcher
export const POST = apiRoute(async (req) => {
  const { slug } = await readJson<{ slug?: string }>(req)
  if (!slug || !SLUG_PATTERN.test(slug)) throw badRequest('Invalid platform')

  const response = NextResponse.json({ ok: true })
  response.cookies.set(PLATFORM_COOKIE, slug, PLATFORM_COOKIE_OPTIONS)
  return response
})
