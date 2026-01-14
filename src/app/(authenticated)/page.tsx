import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"

// Force dynamic rendering - this page fetches data at request time, not build time
export const dynamic = 'force-dynamic'

/**
 * Operational Dashboard (Developer View)
 *
 * This is the main landing page for developers (and most users).
 * It answers the question: "What do I need to do next?"
 *
 * Structure:
 * 1. Summary cards - quick counts and red flags
 * 2. My Tasks - things I need to do (most actionable, shown first)
 * 3. My Active Developments - developments I'm working on
 * 4. My Pipeline Sites - sites without developments (early stage)
 */

export default async function DashboardPage() {
  const session = await auth()
  const userName = session?.user?.name || "User"

  // Fetch dashboard data in parallel for speed
  const [
    tasksDue,
    tasksNeedingReview,
    pipelineSites,
    activeDevelopments,
    stalledDevelopments,
    recentTasks,
    recentDevelopments,
    recentPipelineSites,
  ] = await Promise.all([
    // Count: Tasks due (incomplete, with due date in past or next 7 days)
    db.developmentTask.count({
      where: {
        complete: false,
        dueDate: {
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      },
    }),

    // Count: Tasks needing review (newly assigned, not yet accepted)
    db.developmentTask.count({
      where: {
        needsReview: true,
        complete: false,
      },
    }),

    // Count: Pipeline sites (sites with a pipeline status but no active development)
    db.site.count({
      where: {
        pipelineStatusId: { not: null },
        // In future: filter to sites without active developments
      },
    }),

    // Count: Active developments (not completed/dropped/on hold)
    db.development.count({
      where: {
        status: {
          name: {
            notIn: ['Site operational', 'Development dropped', 'Development on hold'],
          },
        },
      },
    }),

    // Count: Stalled developments (no update in 30+ days, still active)
    db.development.count({
      where: {
        updatedAt: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
        status: {
          name: {
            notIn: ['Site operational', 'Development dropped', 'Development on hold'],
          },
        },
      },
    }),

    // List: Recent tasks (incomplete, ordered by due date)
    db.developmentTask.findMany({
      where: { complete: false },
      orderBy: [
        { needsReview: 'desc' },  // Needs review first
        { dueDate: 'asc' },        // Then by due date
      ],
      take: 5,
      include: {
        development: {
          include: {
            site: true,
          },
        },
        taskType: true,
      },
    }),

    // List: Recent active developments
    db.development.findMany({
      where: {
        status: {
          name: {
            notIn: ['Site operational', 'Development dropped', 'Development on hold'],
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        site: {
          include: {
            address: {
              include: {
                townCity: true,
              },
            },
          },
        },
        status: true,
        // Panel info is on DevelopmentDetail, not Development directly
        details: {
          take: 1,
          include: {
            panelType: true,
            panelSize: true,
          },
        },
        tasks: {
          where: {
            complete: false,
          },
          orderBy: { dueDate: 'asc' },
          take: 1,
        },
      },
    }),

    // List: Pipeline sites (sites being worked on before development)
    db.site.findMany({
      where: {
        pipelineStatusId: { not: null },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        pipelineStatus: true,
        address: {
          include: {
            townCity: true,
          },
        },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-teal">My Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {userName}. Here&apos;s what needs your attention.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column - Main content (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tasks section - at top for quick action */}
          <section id="tasks" className="bg-white shadow" style={{ borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-teal">My Tasks</h2>
              <Link
                href="/tasks"
                className="text-sm text-coral hover:text-coral-dark"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentTasks.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No tasks assigned. Tasks will appear here when assigned to you.
                </div>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentTasks.map((task) => <TaskRow key={task.id} task={task as any} />)
              )}
            </div>
          </section>

          {/* Active Developments section */}
          <section id="developments" className="bg-white shadow" style={{ borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-teal">
                My Active Developments
              </h2>
              <Link
                href="/developments"
                className="text-sm text-coral hover:text-coral-dark"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentDevelopments.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No active developments. Start by creating a development from a site.
                </div>
              ) : (
                recentDevelopments.map((dev) => (
                  <DevelopmentRow
                    key={dev.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    development={dev as any}
                    isStalled={
                      new Date(dev.updatedAt) <
                      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                  />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right column - Sidebar (1/4 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Summary cards - quick counts and red flags */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <SummaryCard
              title="Tasks Due"
              value={tasksDue}
              description="Due this week"
              variant={tasksDue > 0 ? "warning" : "default"}
              href="#tasks"
            />
            <SummaryCard
              title="Stalled"
              value={stalledDevelopments}
              description="No activity 30+ days"
              variant={stalledDevelopments > 0 ? "danger" : "default"}
              href="#developments"
            />
            <SummaryCard
              title="Needs Review"
              value={tasksNeedingReview}
              description="New assignments"
              variant={tasksNeedingReview > 0 ? "info" : "default"}
              href="#tasks"
            />
            <SummaryCard
              title="Pipeline"
              value={pipelineSites}
              description="Sites in progress"
              variant="default"
              href="#pipeline"
            />
          </div>

          {/* Pipeline Sites section */}
          <section id="pipeline" className="bg-white shadow" style={{ borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-teal">
                Pipeline Sites
              </h2>
              <Link
                href="/sites?filter=pipeline"
                className="text-sm text-coral hover:text-coral-dark"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPipelineSites.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No sites in pipeline.
                </div>
              ) : (
                recentPipelineSites.map((site) => (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  <PipelineSiteRow key={site.id} site={site as any} />
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Component: Summary Card
// =============================================================================
function SummaryCard({
  title,
  value,
  description,
  variant = "default",
  href,
}: {
  title: string
  value: number
  description: string
  variant?: "default" | "warning" | "danger" | "info"
  href: string
}) {
  const variantStyles = {
    default: "bg-white text-gray-900",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
    danger: "bg-red-50 text-red-900 border-red-200",
    info: "bg-blue-50 text-blue-900 border-blue-200",
  }

  const valueStyles = {
    default: "text-gray-900",
    warning: "text-amber-600",
    danger: "text-red-600",
    info: "text-blue-600",
  }

  return (
    <a
      href={href}
      className={`shadow border p-4 hover:shadow-md transition-shadow ${variantStyles[variant]}`}
      style={{ borderRadius: 0 }}
    >
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${valueStyles[variant]}`}>
        {value}
      </p>
      <p className="text-xs opacity-60 mt-1">{description}</p>
    </a>
  )
}

// =============================================================================
// Component: Development Row
// =============================================================================
// Using a generic type to avoid strict type checking issues with Prisma includes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DevelopmentRow({
  development,
  isStalled,
}: {
  development: {
    id: number
    updatedAt: Date
    site?: { name?: string | null; address?: { townCity?: { name?: string } | null } | null } | null
    status?: { name?: string; colour?: string | null } | null
    details?: { panelType?: { name?: string } | null; panelSize?: { name?: string } | null }[]
    tasks?: { dueDate?: Date | null; description?: string | null }[]
  }
  isStalled: boolean
}) {
  // Build display name: "[Panel Type] [Panel Size] at [Site Name]"
  // Panel info comes from the first detail record
  const firstDetail = development.details?.[0]
  const panelInfo = [firstDetail?.panelType?.name, firstDetail?.panelSize?.name]
    .filter(Boolean)
    .join(" ")
  const siteName =
    development.site?.name || development.site?.address?.townCity?.name || "Unknown site"
  const displayName = panelInfo ? `${panelInfo} at ${siteName}` : siteName

  // Format last activity
  const lastActivity = formatRelativeTime(development.updatedAt)

  // Next task
  const nextTask = development.tasks?.[0]
  const nextTaskDue = nextTask?.dueDate
    ? formatRelativeTime(nextTask.dueDate)
    : null

  return (
    <Link
      href={`/developments/${development.id}`}
      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isStalled && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                Stalled
              </span>
            )}
            <p className="font-medium text-gray-900 truncate">{displayName}</p>
          </div>
          {nextTask && (
            <p className="text-sm text-gray-500 mt-1 truncate">
              Next: {nextTask.description || "Task"}{" "}
              {nextTaskDue && <span className="text-gray-400">({nextTaskDue})</span>}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: development.status?.colour
                ? `${development.status.colour}20`
                : "#e5e7eb",
              color: development.status?.colour || "#374151",
            }}
          >
            {development.status?.name || "No status"}
          </span>
          <p className="text-xs text-gray-400 mt-1">{lastActivity}</p>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// Component: Pipeline Site Row
// =============================================================================
function PipelineSiteRow({ site }: {
  site: {
    id: number
    name?: string | null
    pipelineStatus?: { name?: string; isParked?: boolean } | null
    address?: { line1?: string | null; townCity?: { name?: string } | null } | null
  }
}) {
  const displayName =
    site.name || site.address?.line1 || site.address?.townCity?.name || "Unnamed site"
  const location = site.address?.townCity?.name || ""
  const isParked = site.pipelineStatus?.isParked || false

  return (
    <Link
      href={`/sites/${site.id}`}
      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 truncate">{displayName}</p>
          {location && (
            <p className="text-sm text-gray-500">{location}</p>
          )}
        </div>
        <div className="flex-shrink-0">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isParked
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {site.pipelineStatus?.name || "In pipeline"}
          </span>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// Component: Task Row
// =============================================================================
function TaskRow({ task }: {
  task: {
    id: number
    description?: string | null
    dueDate?: Date | null
    needsReview?: boolean
    development?: { id: number; site?: { name?: string | null } | null }
    taskType?: { name?: string } | null
  }
}) {
  const siteName = task.development?.site?.name || "Unknown site"
  const dueText = task.dueDate ? formatRelativeTime(task.dueDate) : null
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <Link
      href={`/developments/${task.development?.id || 0}#tasks`}
      className="block px-6 py-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {task.needsReview && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                NEW
              </span>
            )}
            <p className="font-medium text-gray-900 truncate">
              {task.description || "Task"}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-1">{siteName}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          {task.taskType && (
            <span className="text-xs text-gray-500">{task.taskType.name}</span>
          )}
          {dueText && (
            <p
              className={`text-xs mt-1 ${
                isOverdue ? "text-red-600 font-medium" : "text-gray-400"
              }`}
            >
              {isOverdue ? "Overdue: " : "Due: "}
              {dueText}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// Helper: Format relative time
// =============================================================================
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    // Future date
    const futureDays = Math.abs(diffDays)
    if (futureDays === 0) return "Today"
    if (futureDays === 1) return "Tomorrow"
    if (futureDays < 7) return `In ${futureDays} days`
    if (futureDays < 30) return `In ${Math.floor(futureDays / 7)} weeks`
    return then.toLocaleDateString()
  }

  // Past date
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return then.toLocaleDateString()
}
