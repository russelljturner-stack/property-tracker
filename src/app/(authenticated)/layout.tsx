import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AppShell } from "@/components/app-shell"

// This layout applies to all pages within the (authenticated) route group.
//
// Route groups in Next.js are folders with names in parentheses like (authenticated).
// They don't affect the URL structure - they're just for organising code.
// Everything in this folder will use the AppShell layout with the sidebar.
//
// The login page is OUTSIDE this group, so it doesn't have the sidebar.
//
// AUTHENTICATION CHECK:
// In Next.js 16, middleware is deprecated for auth checks. Instead, we check
// authentication here in the layout. If the user isn't logged in, they get
// redirected to the login page.

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const session = await auth()

  // If not logged in, redirect to login page
  if (!session?.user) {
    redirect("/login")
  }

  return <AppShell>{children}</AppShell>
}
