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
    <div className="fixed top-3 right-9 sm:right-12 z-50 flex flex-col items-end">
      <div className="flex items-center gap-2">
        {/* Always-visible sign-in button for visitors */}
        {showSignIn && (
          <Link
            href={loginHref(pathname)}
            className="h-11 px-5 flex items-center rounded-full font-fun font-semibold text-[15px] text-sun-900 bg-gradient-to-b from-sun-300 to-sun-500 shadow-cushion active:translate-y-[2px] active:shadow-none transition-transform"
          >
            Sign in
          </Link>
        )}

      {/* Hamburger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white shadow-cushion-white active:translate-y-[2px] active:shadow-none transition-transform"
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
        <div className="mt-2 flex flex-col gap-1 bg-white rounded-3xl shadow-lift p-2 min-w-[180px] items-stretch">
          <Link
            href="/playful"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-gray-700 text-left hover:bg-sun-100 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/playful/topics"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-gray-700 text-left hover:bg-sun-100 transition-colors"
          >
            Topics
          </Link>
          <Link
            href="/playful/delegation"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-gray-700 text-left hover:bg-sun-100 transition-colors"
          >
            Delegation
          </Link>
          <div className="h-px bg-gray-100 mx-3 my-1" />
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-gray-700 text-left hover:bg-sun-100 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={signOut}
                className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-gray-700 text-left hover:bg-sun-100 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href={loginHref(pathname)}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-sun-700 text-left hover:bg-sun-100 transition-colors"
            >
              Sign in
            </Link>
          )}
          <div className="h-px bg-gray-100 mx-3 my-1" />
          <Link
            href="/topics"
            onClick={() => setOpen(false)}
            className="px-4 py-2.5 rounded-2xl text-[15px] font-bold text-sky bg-sky-soft text-left transition-colors"
          >
            Classic
          </Link>
        </div>
      )}
    </div>
  )
}
