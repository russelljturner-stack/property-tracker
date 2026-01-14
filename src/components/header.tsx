"use client"

// This is the header component that appears at the top of every page.
//
// It shows:
// - A hamburger menu button (on mobile, to open the sidebar)
// - Space for breadcrumbs or page context (future)
//
// User info has been moved to the sidebar for a cleaner layout.

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
      <div className="flex items-center h-14 px-4">
        {/* Hamburger menu (mobile only) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Open menu"
        >
          {/* Hamburger icon uses coral accent */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: '#fa6e60' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <span className="ml-3 font-semibold" style={{ color: '#1e434d' }}>PDT</span>
      </div>
    </header>
  )
}
