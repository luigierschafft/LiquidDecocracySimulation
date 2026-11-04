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
}

/** Classic-mode navigation (hidden in playful mode, which has its own menu). */
export function Navbar({ showDelegation = true, showNotifications = false }: NavbarProps) {
  const pathname = usePathname()
  const { user, isAdmin, loading, signOut } = useAuthUser({ withAdmin: true })
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/topics', label: 'Topics', show: true },
    { href: '/analytics', label: 'Analytics', show: true },
    { href: '/delegation', label: 'Delegation', show: showDelegation },
    { href: '/playful', label: 'Playful mode', show: true },
  ].filter((l) => l.show)

  if (pathname.startsWith('/playful')) return null

  const onLoginPage = pathname.startsWith('/auth')

  return (
    <div className="fixed top-4 right-4 z-50 flex items-start gap-2">
      {/* Always-visible sign-in button for visitors */}
      {!loading && !user && !onLoginPage && (
        <Link
          href={loginHref(pathname)}
          className="flex items-center gap-1.5 h-11 px-4 rounded-xl bg-accent text-white text-[15px] font-semibold shadow-soft hover:bg-accent-hover transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign in
        </Link>
      )}

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-white border border-line shadow-soft hover:bg-gray-50 transition-colors"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5 text-foreground/70" /> : <Menu className="w-5 h-5 text-foreground/70" />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-[52px] w-56 bg-white border border-line rounded-2xl shadow-lift p-1.5 space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3.5 py-2.5 rounded-xl text-[15px] font-semibold transition-colors',
                  pathname.startsWith(link.href)
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-line my-1 mx-2" />
            {user ? (
              <>
                {showNotifications && <NotificationBell userId={user.id} />}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      'block px-3.5 py-2.5 rounded-xl text-[15px] font-semibold transition-colors',
                      pathname.startsWith('/admin')
                        ? 'bg-accent/10 text-accent'
                        : 'text-accent/70 hover:text-accent hover:bg-accent/10'
                    )}
                  >
                    Admin
                  </Link>
                )}
                <Link href="/profile" className="block px-3.5 py-2.5 rounded-xl text-[15px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Profile
                </Link>
                <button onClick={signOut} className="block w-full text-left px-3.5 py-2.5 rounded-xl text-[15px] font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Sign out
                </button>
              </>
            ) : (
              <Link href={loginHref(pathname)} className="block px-3.5 py-2.5 rounded-xl text-[15px] font-semibold text-accent hover:bg-accent-soft">
                Sign in
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
