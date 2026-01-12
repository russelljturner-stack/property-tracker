import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"

// Force dynamic rendering - this page fetches data at request time
export const dynamic = 'force-dynamic'

/**
 * Development Detail Page
 *
 * Shows all information about a single development:
 * - Header with site name, status, and project number
 * - Key dates and progress indicators
 * - Panel details (type, size, structure)
 * - Tasks list
 * - Link to parent site
 *
 * This page is the main working view for a development - users will spend
 * most of their time here tracking progress and completing tasks.
 */

// In Next.js 15+, params is a Promise that needs to be awaited
type PageProps = {
  params: Promise<{ id: string }>
}

export default async function DevelopmentDetailPage({ params }: PageProps) {
  // Await params to get the ID
  const { id } = await params
  const developmentId = parseInt(id, 10)

  // Validate ID is a number
  if (isNaN(developmentId)) {
    notFound()
  }

  // Fetch the development with all related data
  const development = await db.development.findUnique({
    where: { id: developmentId },
    include: {
      // Site and address info
      site: {
        include: {
          address: {
            include: {
              townCity: true,
              county: true,
            },
          },
          siteOwner: true,
          localAuthority: true,
        },
      },
      // Status and type lookups
      status: true,
      dealType: true,
      developmentType: true,
      // Panel details
      details: {
        include: {
          panelType: true,
          panelSize: true,
          orientation: true,
          structureType: true,
        },
      },
      // Tasks
      tasks: {
        include: {
          taskType: true,
        },
        orderBy: [
          { complete: 'asc' },      // Incomplete first
          { needsReview: 'desc' },   // Needs review at top
          { dueDate: 'asc' },        // Then by due date
        ],
      },
      // Planning info
      planningAppStatus: true,
      advertAppStatus: true,
      // Notes (most recent first)
      notes: {
        orderBy: { noteDate: 'desc' },
        take: 5,
      },
    },
  })

  // If development not found, show 404
  if (!development) {
    notFound()
  }

  // Build display name
  const siteName = development.site?.name
    || development.site?.address?.line1
    || development.site?.address?.townCity?.name
    || "Unknown site"

  // Format address for display
  const addressParts = [
    development.site?.address?.line1,
    development.site?.address?.line2,
    development.site?.address?.townCity?.name,
    development.site?.address?.county?.name,
    development.site?.address?.postcode,
  ].filter(Boolean)
  const fullAddress = addressParts.join(", ")

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <nav className="text-sm text-gray-500">
        <Link href="/developments" className="hover:text-blue-600">
          Developments
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{siteName}</span>
      </nav>

      {/* Header section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{siteName}</h1>
              {development.status && (
                <StatusBadge
                  name={development.status.name}
                  colour={development.status.colour}
                />
              )}
            </div>
            {fullAddress && (
              <p className="text-gray-600 mt-1">{fullAddress}</p>
            )}
            {development.projectNo && (
              <p className="text-sm text-gray-500 mt-1">
                Project #{development.projectNo}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {development.site && (
              <Link
                href={`/sites/${development.site.id}`}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Site
              </Link>
            )}
            <Link
              href={`/developments/${development.id}/edit`}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
        </div>

        {/* Key info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <InfoItem
            label="Deal Type"
            value={development.dealType?.name}
          />
          <InfoItem
            label="Development Type"
            value={development.developmentType?.name}
          />
          <InfoItem
            label="Internal Developer"
            value={development.internalDeveloper}
          />
          <InfoItem
            label="Site Owner"
            value={development.site?.siteOwner?.name}
          />
        </div>
      </div>

      {/* Two-column layout for main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Main content (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Panel Details Section */}
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Panel Details</h2>
            </div>
            <div className="p-6">
              {development.details.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No panel details recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {development.details.map((detail, index) => (
                    <PanelDetailCard key={detail.id} detail={detail} index={index} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Tasks Section */}
          <section id="tasks" className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
              <span className="text-sm text-gray-500">
                {development.tasks.filter(t => !t.complete).length} open
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {development.tasks.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No tasks for this development.
                </div>
              ) : (
                development.tasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
            </div>
          </section>

          {/* Notes Section */}
          {development.notes.length > 0 && (
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {development.notes.map((note) => (
                  <div key={note.id} className="px-6 py-4">
                    <p className="text-gray-900">{note.noteText}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {note.noteBy && `${note.noteBy} • `}
                      {formatDate(note.noteDate)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right column: Sidebar (1/3 width on large screens) */}
        <div className="space-y-6">
          {/* Planning Status Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Planning
            </h3>
            <div className="space-y-3">
              <InfoItem
                label="Application Status"
                value={development.planningAppStatus?.name}
              />
              <InfoItem
                label="LA Reference"
                value={development.planningAppRefLa}
              />
              <InfoItem
                label="Submitted"
                value={development.planningApplicationSubmitted ? formatDate(development.planningApplicationSubmitted) : undefined}
              />
              <InfoItem
                label="Target Date"
                value={development.planningAppDeterminDate ? formatDate(development.planningAppDeterminDate) : undefined}
              />
            </div>
          </section>

          {/* Advert Application Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Advertisement
            </h3>
            <div className="space-y-3">
              <InfoItem
                label="Application Status"
                value={development.advertAppStatus?.name}
              />
              <InfoItem
                label="LA Reference"
                value={development.advertAppRefLa}
              />
              <InfoItem
                label="Submitted"
                value={development.advertApplicationSubmitted ? formatDate(development.advertApplicationSubmitted) : undefined}
              />
            </div>
          </section>

          {/* Financial Summary Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Financials
            </h3>
            <div className="space-y-3">
              <InfoItem
                label="Rental Value"
                value={development.rentalValue ? `£${Number(development.rentalValue).toLocaleString()}` : undefined}
              />
              <InfoItem
                label="Lease Per Annum"
                value={development.leasePerAnnum ? `£${Number(development.leasePerAnnum).toLocaleString()}` : undefined}
              />
              <InfoItem
                label="Lease Term"
                value={development.term ? `${development.term} years` : undefined}
              />
            </div>
          </section>

          {/* Key Dates Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Key Dates
            </h3>
            <div className="space-y-3">
              <InfoItem
                label="Offer Agreed"
                value={development.offerAgreed ? formatDate(development.offerAgreed) : undefined}
              />
              <InfoItem
                label="Contract Signed"
                value={development.contractSigned ? formatDate(development.contractSigned) : undefined}
              />
              <InfoItem
                label="Lease Start"
                value={development.leaseStartDate ? formatDate(development.leaseStartDate) : undefined}
              />
              <InfoItem
                label="Build Complete"
                value={development.buildCompletionDate ? formatDate(development.buildCompletionDate) : undefined}
              />
              <InfoItem
                label="Live Date"
                value={development.buildLiveDate ? formatDate(development.buildLiveDate) : undefined}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Component: Status Badge
// =============================================================================
function StatusBadge({ name, colour }: { name: string; colour?: string | null }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: colour ? `${colour}20` : "#e5e7eb",
        color: colour || "#374151",
      }}
    >
      {name}
    </span>
  )
}

// =============================================================================
// Component: Info Item (label/value pair)
// =============================================================================
function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="text-sm text-gray-900 mt-0.5">{value || "—"}</dd>
    </div>
  )
}

// =============================================================================
// Component: Panel Detail Card
// =============================================================================
function PanelDetailCard({
  detail,
  index,
}: {
  detail: {
    id: number
    quantity?: number | null
    panelType?: { name: string } | null
    panelSize?: { name: string } | null
    orientation?: { name: string } | null
    structureType?: { name: string } | null
    illuminated?: string | null
    digital?: string | null
    sides?: number | null
  }
  index: number
}) {
  const features = []
  if (detail.digital === "Yes") features.push("Digital")
  if (detail.illuminated === "Yes") features.push("Illuminated")
  if (detail.sides && detail.sides > 1) features.push(`${detail.sides} sides`)

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium text-gray-900">
            {detail.panelType?.name || "Panel"} {index + 1}
            {detail.quantity && detail.quantity > 1 && (
              <span className="text-gray-500 font-normal"> × {detail.quantity}</span>
            )}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {[
              detail.panelSize?.name,
              detail.orientation?.name,
              detail.structureType?.name,
            ]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>
        {features.length > 0 && (
          <div className="flex gap-1">
            {features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Component: Task Item
// =============================================================================
function TaskItem({
  task,
}: {
  task: {
    id: number
    description?: string | null
    dueDate?: Date | null
    complete: boolean
    needsReview?: boolean
    assignedTo?: string | null
    taskType?: { name: string } | null
  }
}) {
  const isOverdue = !task.complete && task.dueDate && new Date(task.dueDate) < new Date()

  return (
    <div
      className={`px-6 py-4 ${task.complete ? "bg-gray-50" : ""}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox indicator */}
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 ${
            task.complete
              ? "bg-green-500 border-green-500"
              : "border-gray-300"
          }`}
        >
          {task.complete && (
            <svg className="w-4 h-4 text-white m-auto" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {task.needsReview && !task.complete && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                NEW
              </span>
            )}
            <p
              className={`font-medium ${
                task.complete ? "text-gray-400 line-through" : "text-gray-900"
              }`}
            >
              {task.description || "Task"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            {task.taskType && <span>{task.taskType.name}</span>}
            {task.assignedTo && (
              <>
                <span>•</span>
                <span>{task.assignedTo}</span>
              </>
            )}
          </div>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div
            className={`flex-shrink-0 text-sm ${
              isOverdue
                ? "text-red-600 font-medium"
                : task.complete
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {isOverdue && !task.complete && "Overdue: "}
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Helper: Format date
// =============================================================================
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
