"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"

// This is the sidebar navigation component.
//
// "use client" is needed because we use hooks (usePathname) to highlight
// the current page. The sidebar shows on all pages and helps users
// navigate between different sections of the application.
//
// NAVIGATION STRUCTURE:
// Based on the FileMaker layouts, the main navigation sections are:
// - Dashboard (home)
// - Sites (properties/land)
// - Developments (projects on sites)
// - Contacts (people and companies)
// - Tasks (action items)
// - Reports (summaries and analytics)

// Define the navigation items
// Each item has a name (display text), href (URL), and icon (SVG path)
const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Sites",
    href: "/sites",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    name: "Developments",
    href: "/developments",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
]

// Utility/settings items - shown separately at the bottom
const utilityItems = [
  {
    name: "Style Guide",
    href: "/style-guide",
    icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      {/* Mobile overlay - darkens background when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Dark teal background */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: '#1e434d' }}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">PDT</span>
          </Link>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-white/10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-4 px-2 flex-1">
          {navigationItems.map((item) => {
            // Check if this is the current page
            const isActive = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}  // Close sidebar on mobile after clicking
                className={`
                  flex items-center px-4 py-3 mb-1 rounded-lg
                  transition-colors duration-150 text-base
                  ${isActive
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {/* Icons use coral accent colour on dark teal background */}
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: '#fa6e60' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={item.icon}
                  />
                </svg>
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Utility Links - separated from main nav */}
        <div className="px-2 mb-2">
          <div className="border-t border-white/20 pt-3">
            {utilityItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-4 py-3 mb-1 rounded-lg
                    transition-colors duration-150 text-base
                    ${isActive
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: '#fa6e60' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer - User info and sign out */}
        <div className="border-t border-white/20">
          {session?.user && (
            <div className="p-3">
              {/* User row */}
              <div className="flex items-center gap-3 px-1">
                {/* User avatar - initials in a circle (coral accent) */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-medium text-white"
                  style={{ backgroundColor: '#fa6e60' }}
                >
                  {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-white truncate">
                    {session.user.name || session.user.email}
                  </p>
                  {session.user.role && (
                    <p className="text-sm text-white/60 truncate">{session.user.role}</p>
                  )}
                </div>
              </div>
              {/* Sign out - aligned under user info */}
              <div className="mt-2 pl-1" style={{ marginLeft: 'calc(2.5rem + 0.75rem)' }}>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 text-base text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#fa6e60' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
