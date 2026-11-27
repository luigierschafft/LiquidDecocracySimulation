'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { loginHref, useAuthUser } from '@/lib/hooks/useAuthUser'
import { NotificationBell } from './NotificationBell'

interface NavbarProps {
  showDelegation?: boolean
  showNotifications?: boolean
  currentPlatformName?: string | null
}

/** Classic-mode navigation (hidden in playful mode, which has its own menu). */
export function Navbar({ showDelegation = true, showNotifications = false, currentPlatformName }: NavbarProps) {
  const pathname = usePathname()
  const { user, isAdmin, loading, signOut } = useAuthUser({ withAdmin: true })
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/topics', label: 'Topics', show: true },
    { href: '/analytics', label: '📊 Analytics', show: true },
    { href: '/delegation', label: 'Delegation', show: showDelegation },
    { href: '/playful', label: '🐾 Play', show: true },
  ].filter((l) => l.show)

  if (pathname.startsWith('/playful')) return null

  const onLoginPage = pathname.startsWith('/auth')

  return (
    <div className="fixed top-4 right-4 z-50 flex items-start gap-2">
      {/* Always-visible sign-in button for visitors */}
      {!loading && !user && !onLoginPage && (
        <Link
          href={loginHref(pathname)}
          className="flex items-center gap-1.5 h-10 px-3.5 rounded-xl bg-accent text-white text-sm font-semibold shadow-md hover:bg-accent/90 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign in
        </Link>
      )}

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-sand shadow-md hover:bg-white transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
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
            {currentPlatformName && (
              <>
                <div className="border-t border-sand my-1" />
                <div className="px-3 py-1.5">
                  <p className="text-xs text-foreground/40 font-medium uppercase tracking-wide">Platform</p>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-sm text-foreground/70 truncate">{currentPlatformName}</span>
                    <Link
                      href="/platform-select?choose=1"
                      className="text-xs text-accent hover:underline shrink-0"
                    >
                      Switch
                    </Link>
                  </div>
                </div>
              </>
            )}
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
              <Link href={loginHref(pathname)} className="block px-3 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/10">
                Sign in
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
