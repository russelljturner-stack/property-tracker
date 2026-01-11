"use client"

import { signOut, useSession } from "next-auth/react"

// This is the header component that appears at the top of every page.
//
// It shows:
// - A hamburger menu button (on mobile, to open the sidebar)
// - The current page title (optional)
// - The logged-in user's name and a sign out button

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  // Get the current user's session data
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side - hamburger menu (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Center - could show page title or breadcrumbs later */}
        <div className="hidden lg:block">
          {/* Placeholder for breadcrumbs or page context */}
        </div>

        {/* Right side - user info and sign out */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session.user.name || session.user.email}
                </p>
                {session.user.role && (
                  <p className="text-xs text-gray-500">{session.user.role}</p>
                )}
              </div>

              <button
                onClick={() => signOut()}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
