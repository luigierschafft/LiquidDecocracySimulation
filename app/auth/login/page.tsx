'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { Button } from '@/components/ui/Button'
import { safeRedirectPath } from '@/lib/utils'
import { AUTH_NEXT_COOKIE } from '@/lib/auth/constants'
import { REQUIRE_MEMBER_APPROVAL } from '@/lib/config/membership'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

/** Turn the `?error=` set by /auth/callback into a message users can act on. */
function describeAuthError(code: string | null): string | null {
  if (!code) return null
  if (code === 'auth_failed') {
    return 'Sign-in could not be completed. Please try again — and open the link in the same browser you started in.'
  }
  return `Sign-in failed: ${code}`
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next = safeRedirectPath(searchParams.get('next'))
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(() => describeAuthError(searchParams.get('error')))
  const supabase = createClient()

  async function handleGoogle() {
    setGoogleLoading(true)
    // Keep the redirect URL free of query params so it matches the Supabase
    // allow-list exactly; the target page travels in a short-lived cookie instead.
    document.cookie = `${AUTH_NEXT_COOKIE}=${encodeURIComponent(next)}; path=/; max-age=600; samesite=lax`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) setError(error.message)
    setGoogleLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
    if (error) setError(error.message)
    else setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-start sm:items-center justify-center px-4 pt-24 pb-10 bg-dawn">
        <div className="card max-w-sm w-full text-center space-y-4 !p-7">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-foreground/60 text-sm">
            We sent a magic link to <strong>{email}</strong>.<br />
            Click it to sign in.
          </p>
          <button onClick={() => { setSubmitted(false); setEmail('') }} className="text-sm text-accent hover:underline">
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-start sm:items-center justify-center px-4 pt-24 pb-10 bg-dawn">
      <div className="card max-w-sm w-full space-y-6 !p-7">
        <div className="text-center space-y-1">
          <h1 className="text-[1.75rem] font-extrabold text-gray-900">Sign in</h1>
          <p className="text-[15px] text-gray-500">Join the Auroville community platform</p>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 h-12 bg-white border border-gray-300 rounded-xl px-4 text-[15px] font-semibold text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <GoogleIcon />
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        <div className="flex items-center gap-3">
          <hr className="flex-1 border-line" />
          <span className="text-sm text-gray-400">or</span>
          <hr className="flex-1 border-line" />
        </div>

        {/* Magic Link */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email (magic link)
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="input"
            />
          </div>
          {error && <p className="text-sm text-contra bg-contra-soft px-4 py-2.5 rounded-xl">{error}</p>}
          <Button type="submit" loading={loading} className="w-full">
            Send magic link
          </Button>
        </form>

        {REQUIRE_MEMBER_APPROVAL && (
          <p className="text-xs text-center text-foreground/40">
            New members need admin approval before voting.
          </p>
        )}
      </div>
    </div>
  )
}
