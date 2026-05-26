import { NextResponse } from 'next/server'

// GET: used by auth callback redirect chain
// POST: used by client-side platform switcher
export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug')
  const next = url.searchParams.get('next') ?? '/topics'

  if (!slug) {
    return NextResponse.redirect(new URL('/platform-select', request.url))
  }

  const response = NextResponse.redirect(new URL(next, request.url))
  response.cookies.set('x-platform', slug, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}

export async function POST(request: Request) {
  const { slug } = await request.json()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('x-platform', slug, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return response
}
