import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// This is the dashboard / home page.
//
// It shows an overview of the system including:
// - Key metrics (sites, developments, tasks)
// - Quick access to recent items
// - System status
//
// This is a server component, so we can fetch data directly from the database.

export default async function DashboardPage() {
  // Get the current session
  const session = await auth()

  // Fetch some basic counts from the database
  // We use Promise.all to run multiple queries in parallel for speed
  const [siteCount, developmentCount] = await Promise.all([
    db.site.count(),
    db.development.count(),
  ])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session?.user?.name || "User"}
        </p>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Sites"
          value={siteCount}
          description="Total properties"
          color="blue"
          href="/sites"
        />
        <MetricCard
          title="Developments"
          value={developmentCount}
          description="Active projects"
          color="green"
          href="/developments"
        />
        <MetricCard
          title="Contacts"
          value="--"
          description="People & companies"
          color="purple"
          href="/contacts"
        />
        <MetricCard
          title="Tasks"
          value="--"
          description="Due this week"
          color="orange"
          href="/tasks"
        />
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <QuickAction label="Add New Site" href="/sites/new" />
          <QuickAction label="Add Development" href="/developments/new" />
          <QuickAction label="Add Contact" href="/contacts/new" />
          <QuickAction label="View Reports" href="/reports" />
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-500 text-sm">
          Activity feed will appear here once the system is in use.
        </p>
      </div>

      {/* System status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h2>
        <div className="space-y-2 text-sm">
          <StatusItem status="ok" label="Database connected" />
          <StatusItem status="ok" label="Authentication active" />
          <StatusItem
            status="info"
            label={`Phase 3: Core Application Setup`}
          />
        </div>
      </div>
    </div>
  )
}

// Metric card component - shows a single statistic
function MetricCard({
  title,
  value,
  description,
  color,
  href,
}: {
  title: string
  value: number | string
  description: string
  color: "blue" | "green" | "purple" | "orange"
  href: string
}) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  }

  return (
    <a
      href={href}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
    >
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
        {value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </a>
  )
}

// Quick action button component
function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors"
    >
      {label}
    </a>
  )
}

// Status indicator component
function StatusItem({
  status,
  label,
}: {
  status: "ok" | "warning" | "error" | "info"
  label: string
}) {
  const statusColors = {
    ok: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
      <span className="text-gray-600">{label}</span>
    </div>
  )
}
