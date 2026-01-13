import { db } from "@/lib/db"
import Link from "next/link"

// Force dynamic rendering - this page fetches data at request time
export const dynamic = 'force-dynamic'

/**
 * Developments List Page
 *
 * Displays all developments with key information for navigation:
 * - Site name and project number
 * - Location
 * - Development status
 * - Current stage in the workflow
 * - Planning score
 * - Site owner
 */

// Define the development lifecycle stages for determining current stage
const STAGE_ORDER = ['survey', 'commercial', 'design', 'planning', 'marketing', 'build', 'live'] as const

export default async function DevelopmentsPage() {
  // Fetch all developments with related data for the list view
  const developments = await db.development.findMany({
    include: {
      site: {
        include: {
          address: {
            include: {
              townCity: true,
              county: true,
            },
          },
          siteOwner: true,
        },
      },
      status: true,
      dealType: true,
      developmentType: true,
      planningAppStatus: true,
      mediaOwner: true,
    },
    orderBy: [
      { createdAt: 'desc' },
    ],
  })

  // Count developments by status for summary cards
  const statusCounts = developments.reduce((acc, dev) => {
    const status = dev.status?.name || 'Unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Sort status counts by count descending, take top 6
  const topStatuses = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developments</h1>
          <p className="text-gray-600">
            {developments.length} development projects
          </p>
        </div>
        <Link
          href="/developments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Development
        </Link>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topStatuses.map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500 truncate" title={status}>{status}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
          </div>
        ))}
      </div>

      {/* Developments table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Development
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Planning
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {developments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No developments found. Add your first development to get started.
                </td>
              </tr>
            ) : (
              developments.map((dev) => {
                // Build development name - use site name or derive
                const devName = dev.site?.name
                  || dev.site?.address?.line1
                  || dev.site?.address?.townCity?.name
                  || `Development #${dev.id}`

                // Build location string
                const location = [
                  dev.site?.address?.townCity?.name,
                  dev.site?.address?.county?.name,
                ].filter(Boolean).join(', ')

                // Determine current stage
                const currentStage = determineCurrentStage(dev)

                return (
                  <tr key={dev.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/developments/${dev.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {devName}
                      </Link>
                      {dev.projectNo && (
                        <p className="text-xs text-gray-500">#{dev.projectNo}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {location || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {dev.status ? (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: dev.status.colour ? `${dev.status.colour}20` : '#e5e7eb',
                            color: dev.status.colour || '#374151',
                          }}
                        >
                          {dev.status.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StageBadge stage={currentStage} />
                    </td>
                    <td className="px-6 py-4">
                      <PlanningScoreBadge score={dev.planningScore} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {dev.site?.siteOwner?.name || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/developments/${dev.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Determine which stage of development we're currently in
 */
function determineCurrentStage(development: {
  buildLiveDate?: Date | null
  buildStartDate?: Date | null
  buildCompletionDate?: Date | null
  planningApplicationSubmitted?: Date | null
  advertApplicationSubmitted?: Date | null
  planningAppStatus?: { name: string } | null
  designSignedOff?: string | null
  contractSigned?: Date | null
  offerAgreed?: Date | null
  mediaOwner?: { name: string } | null
}): string {
  // Work backwards from most advanced stage
  if (development.buildLiveDate) return 'live'
  if (development.buildStartDate || development.buildCompletionDate) return 'build'
  if (development.mediaOwner) return 'marketing'
  if (development.planningApplicationSubmitted || development.advertApplicationSubmitted) return 'planning'
  if (development.designSignedOff === 'Yes') return 'design'
  if (development.contractSigned || development.offerAgreed) return 'commercial'
  return 'survey'
}

/**
 * Stage Badge Component
 */
function StageBadge({ stage }: { stage: string }) {
  const stageConfig: Record<string, { label: string; color: string; bg: string }> = {
    survey: { label: 'Survey', color: '#6b7280', bg: '#f3f4f6' },
    commercial: { label: 'Commercial', color: '#9333ea', bg: '#f3e8ff' },
    design: { label: 'Design', color: '#2563eb', bg: '#dbeafe' },
    planning: { label: 'Planning', color: '#ea580c', bg: '#ffedd5' },
    marketing: { label: 'Marketing', color: '#0891b2', bg: '#cffafe' },
    build: { label: 'Build', color: '#ca8a04', bg: '#fef9c3' },
    live: { label: 'Live', color: '#16a34a', bg: '#dcfce7' },
  }

  const config = stageConfig[stage] || stageConfig.survey

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  )
}

/**
 * Planning Score Badge - compact version for list view
 */
function PlanningScoreBadge({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) {
    return <span className="text-sm text-gray-400">—</span>
  }

  // Colour coding based on score
  const getScoreStyle = () => {
    if (score >= 4) return 'bg-green-100 text-green-800'
    if (score === 3) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${getScoreStyle()}`}
      title={`Planning Score: ${score}/5`}
    >
      {score}/5
    </span>
  )
}
