'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { loginHref, useAuthUser } from '@/lib/hooks/useAuthUser'

export function PlayfulMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, loading, signOut } = useAuthUser()
  const showSignIn = !loading && !user

  return (
    <div className="fixed top-3 right-4 z-50 flex flex-col items-end">
      <div className="flex items-center gap-2">
        {/* Always-visible sign-in button for visitors */}
        {showSignIn && (
          <Link
            href={loginHref(pathname)}
            className="h-12 px-5 flex items-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-sm font-bold text-gray-900 shadow-md active:scale-95 transition-transform"
          >
            Sign in
          </Link>
        )}

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/80 backdrop-blur shadow-md active:scale-95 transition-transform"
        aria-label="Menu"
      >
        {open ? (
          <>
            <span className="block w-5 h-0.5 bg-gray-600 rotate-45 translate-y-2 transition-transform" />
            <span className="block w-5 h-0.5 bg-gray-600 opacity-0 transition-opacity" />
            <span className="block w-5 h-0.5 bg-gray-600 -rotate-45 -translate-y-2 transition-transform" />
          </>
        ) : (
          <>
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
            <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
          </>
        )}
      </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 flex flex-col gap-2 bg-white/90 backdrop-blur rounded-2xl shadow-lg px-4 py-3 min-w-[160px] items-center">
          <Link
            href="/playful"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/playful/topics"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
          >
            Topics
          </Link>
          <Link
            href="/playful/delegation"
            onClick={() => setOpen(false)}
            className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
          >
            Delegation
          </Link>
          <div className="w-full h-px bg-gray-200 my-1" />
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="text-sm font-semibold text-gray-700 hover:text-amber-600 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={loginHref(pathname)}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Sign in
            </Link>
          )}
          <div className="w-full h-px bg-gray-200 my-1" />
          <Link
            href="/topics"
            onClick={() => setOpen(false)}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-xl px-4 py-2 w-full text-center transition-colors"
          >
            Classic
          </Link>
        </div>
      )}
    </div>
  )
}
