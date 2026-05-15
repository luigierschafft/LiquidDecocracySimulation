'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { cn } from '@/lib/utils'
import { NotificationBell } from './NotificationBell'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  showDelegation?: boolean
  showGovernance?: boolean
  showNotifications?: boolean
  showVotingCycles?: boolean
}

export function Navbar({ showDelegation = true, showGovernance = false, showNotifications = false, showVotingCycles = false }: NavbarProps) {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('member').select('is_admin').eq('id', data.user.id).single()
          .then(({ data: m }) => setIsAdmin(m?.is_admin ?? false))
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from('member').select('is_admin').eq('id', session.user.id).single()
          .then(({ data: m }) => setIsAdmin(m?.is_admin ?? false))
      } else {
        setIsAdmin(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/topics', label: 'Topics', show: true },
    { href: '/delegation', label: 'Delegation', show: showDelegation },
    { href: '/voting-cycles', label: 'Votes', show: false },
    { href: '/governance', label: 'Governance', show: false },
    { href: '/playful', label: '🐾 Play', show: true },
  ].filter((l) => l.show)

  if (pathname.startsWith('/playful')) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-sand shadow-md hover:bg-white transition-colors"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5 text-foreground/70" /> : <Menu className="w-5 h-5 text-foreground/70" />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-12 w-52 bg-white/95 backdrop-blur-sm border border-sand rounded-xl shadow-lg py-2 space-y-0.5 px-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-sand text-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-sand/50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-sand my-1" />
            {user ? (
              <>
                {showNotifications && <NotificationBell userId={user.id} />}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      pathname.startsWith('/admin')
                        ? 'bg-accent/10 text-accent'
                        : 'text-accent/70 hover:text-accent hover:bg-accent/10'
                    )}
                  >
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-sand/50">
                  Profile
                </Link>
                <button onClick={signOut} className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-sand/50">
                  Sign out
                </button>
              </>
            ) : (
              <Link href={`/auth/login?next=${encodeURIComponent(pathname)}`} className="block px-3 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/10">
                Sign in
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
