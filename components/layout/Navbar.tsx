'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { NotificationBell } from './NotificationBell'

interface NavbarProps {
  showDelegation?: boolean
  showGovernance?: boolean
  showNotifications?: boolean
}

export function Navbar({ showDelegation = true, showGovernance = false, showNotifications = false }: NavbarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-sand bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-accent text-lg tracking-tight">
          Flow Democracy
          <span className="text-foreground/50 font-normal text-sm ml-2">Auroville</span>
        </Link>

        <div className="flex items-center gap-1">
          {[
            { href: '/proposals', label: 'Topics', show: true },
            { href: '/units', label: 'Areas', show: true },
            { href: '/delegation', label: 'Delegation', show: showDelegation },
            { href: '/governance', label: 'Governance', show: showGovernance },
          ].filter((l) => l.show).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'bg-sand text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-sand/50'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              {showNotifications && <NotificationBell userId={user.id} />}
              <Link href="/profile" className="text-sm text-foreground/70 hover:text-foreground px-2">
                Profile
              </Link>
              <button onClick={signOut} className="btn-secondary text-sm py-1.5">
                Sign out
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm py-1.5">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
