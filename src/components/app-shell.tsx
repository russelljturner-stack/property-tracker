"use client"

import { useState } from "react"
import { SessionProvider } from "next-auth/react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

// This is the main application shell that provides the layout for all pages.
//
// It includes:
// - The sidebar navigation (left side)
// - The header with user menu (top)
// - The main content area (where page content goes)
//
// The sidebar is responsive:
// - On desktop (lg and up): Always visible
// - On mobile: Hidden by default, opens as an overlay when hamburger is clicked
//
// SessionProvider wraps everything to make authentication data available
// to all child components via the useSession() hook.

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  // State to track if mobile sidebar is open
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area - shifts right on desktop to make room for sidebar */}
        <div className="lg:pl-64">
          {/* Header */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  )
}
