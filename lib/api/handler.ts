import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

/**
 * Shared building blocks for API route handlers.
 *
 *   export const POST = apiRoute(async (req) => {
 *     const { supabase, user } = await requireUser()
 *     const { issueId } = await readJson<{ issueId?: string }>(req)
 *     if (!issueId) throw badRequest('issueId required')
 *     return { ok: true }
 *   })
 *
 * Throw an `HttpError` anywhere to return a JSON error response; any other
 * exception is logged and returned as a 500.
 */

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export const badRequest = (message = 'Invalid input') => new HttpError(400, message)
export const unauthorized = (message = 'Unauthorized') => new HttpError(401, message)
export const forbidden = (message = 'Forbidden') => new HttpError(403, message)
export const notFound = (message = 'Not found') => new HttpError(404, message)

export function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status })
}

type Handler<C> = (req: Request, ctx: C) => Promise<Response | object>

export function apiRoute<C = unknown>(handler: Handler<C>) {
  return async (req: Request, ctx: C): Promise<Response> => {
    try {
      const result = await handler(req, ctx)
      return result instanceof Response ? result : NextResponse.json(result)
    } catch (err) {
      if (err instanceof HttpError) return jsonError(err.status, err.message)
      console.error(`[api] ${req.method} ${new URL(req.url).pathname}`, err)
      // Supabase errors are plain objects with a `message`, not Error instances
      const message =
        err && typeof err === 'object' && 'message' in err && typeof err.message === 'string'
          ? err.message
          : 'Internal server error'
      return jsonError(500, message)
    }
  }
}

/** Parse the request body as JSON, throwing a 400 on malformed input. */
export async function readJson<T = Record<string, unknown>>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T
  } catch {
    throw badRequest('Invalid JSON body')
  }
}

/** Supabase client plus the current user (or null). */
export async function getSession() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

/** Like `getSession`, but throws 401 if nobody is signed in. */
export async function requireUser(): Promise<{ supabase: ReturnType<typeof createClient>; user: User }> {
  const { supabase, user } = await getSession()
  if (!user) throw unauthorized()
  return { supabase, user }
}

/**
 * Verify a server-to-server call (Vercel Cron, webhooks) via
 * `Authorization: Bearer $CRON_SECRET`. Fails closed if the secret is unset.
 */
export function requireCronSecret(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) throw unauthorized()
}

/** Throws 403 unless the signed-in user is an admin. */
export async function requireAdmin() {
  const session = await requireUser()
  const { data: member } = await session.supabase
    .from('member')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()
  if (!member?.is_admin) throw forbidden()
  return session
}
