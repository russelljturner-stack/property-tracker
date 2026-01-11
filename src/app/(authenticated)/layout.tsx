import { AppShell } from "@/components/app-shell"

// This layout applies to all pages within the (authenticated) route group.
//
// Route groups in Next.js are folders with names in parentheses like (authenticated).
// They don't affect the URL structure - they're just for organising code.
// Everything in this folder will use the AppShell layout with the sidebar.
//
// The login page is OUTSIDE this group, so it doesn't have the sidebar.

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
