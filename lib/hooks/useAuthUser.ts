'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/browser'

/**
 * Current Supabase user on the client, kept in sync with sign-in/sign-out.
 * `loading` is true until the first check finished (avoids flashing "Sign in"
 * for users who are actually signed in).
 */
export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    function loadAdminFlag(u: User | null) {
      if (!u) return setIsAdmin(false)
      supabase.from('member').select('is_admin').eq('id', u.id).single()
        .then(({ data }) => setIsAdmin(data?.is_admin ?? false))
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      loadAdminFlag(data.user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      loadAdminFlag(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await createClient().auth.signOut()
    window.location.href = '/'
  }

  return { user, isAdmin, loading, signOut }
}

/** Login URL that returns the user to `path` afterwards. */
export function loginHref(path: string) {
  return `/auth/login?next=${encodeURIComponent(path)}`
}
