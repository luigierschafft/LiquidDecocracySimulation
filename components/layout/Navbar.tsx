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
    { href: '/proposals', label: 'Topics', show: true },
    { href: '/units', label: 'Areas', show: true },
    { href: '/delegation', label: 'Delegation', show: showDelegation },
    { href: '/voting-cycles', label: 'Votes', show: showVotingCycles },
    { href: '/governance', label: 'Governance', show: showGovernance },
  ].filter((l) => l.show)

  return (
    <nav className="border-b border-sand bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-semibold text-accent text-lg tracking-tight shrink-0">
          Flow Democracy
          <span className="text-foreground/50 font-normal text-sm ml-2 hidden sm:inline">Auroville</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
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

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {showNotifications && <NotificationBell userId={user.id} />}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    pathname.startsWith('/admin')
                      ? 'bg-accent/10 text-accent'
                      : 'text-accent/70 hover:text-accent hover:bg-accent/10'
                  )}
                >
                  Admin
                </Link>
              )}
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

        {/* Mobile right: notification + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {user && showNotifications && <NotificationBell userId={user.id} />}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-lg hover:bg-sand/50 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-sand bg-white/95 backdrop-blur-sm px-4 py-3 space-y-1">
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
          <div className="pt-2 border-t border-sand mt-2 space-y-1">
            {user ? (
              <>
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
                <div className="flex items-center gap-2 pt-1">
                  <Link href="/profile" className="flex-1 text-center text-sm text-foreground/70 hover:text-foreground px-3 py-2 rounded-lg hover:bg-sand/50">
                    Profile
                  </Link>
                  <button onClick={signOut} className="flex-1 btn-secondary text-sm py-2">
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <Link href="/auth/login" className="block w-full text-center btn-primary text-sm py-2">
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
