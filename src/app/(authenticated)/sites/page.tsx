import { db } from "@/lib/db"
import Link from "next/link"

// Force dynamic rendering - this page fetches data at request time
export const dynamic = 'force-dynamic'

/**
 * Sites List Page
 *
 * Displays all sites (properties/land) with key information:
 * - Site name and address
 * - Status and pipeline status
 * - Owner organisation
 * - Number of developments at this site
 * - Local authority
 */

export default async function SitesPage() {
  // Fetch all sites with related data for the list view
  const sites = await db.site.findMany({
    include: {
      address: {
        include: {
          townCity: true,
          county: true,
        },
      },
      status: true,
      pipelineStatus: true,
      siteOwner: true,
      localAuthority: true,
      developments: {
        select: {
          id: true,
          status: { select: { name: true, colour: true } },
        },
      },
      photos: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: [
      { dateAdded: 'desc' },
    ],
  })

  // Count sites by pipeline status for summary cards
  const pipelineCounts = sites.reduce((acc, site) => {
    const status = site.pipelineStatus?.name || 'Unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-teal">Sites</h1>
          <p className="text-gray-600">
            {sites.length} properties and land parcels
          </p>
        </div>
        <Link
          href="/sites/new"
          className="px-4 py-2 bg-teal text-white rounded-full hover:bg-coral transition-colors"
        >
          Add Site
        </Link>
      </div>

      {/* Pipeline summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(pipelineCounts).map(([status, count]) => (
          <div key={status} className="bg-white shadow p-4" style={{ borderRadius: 0 }}>
            <p className="text-sm text-gray-500">{status}</p>
            <p className="text-2xl font-bold text-teal">{count}</p>
          </div>
        ))}
      </div>

      {/* Sites table */}
      <div className="bg-white shadow overflow-hidden" style={{ borderRadius: 0 }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Developments
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sites.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No sites found. Add your first site to get started.
                </td>
              </tr>
            ) : (
              sites.map((site) => {
                // Build site name - use name field or derive from address
                const siteName = site.name
                  || site.address?.line1
                  || site.address?.townCity?.name
                  || `Site #${site.id}`

                // Build location string
                const location = [
                  site.address?.townCity?.name,
                  site.address?.county?.name,
                  site.address?.postcode,
                ].filter(Boolean).join(', ')

                // Count active vs completed developments
                const activeDevelopments = site.developments.filter(
                  d => d.status?.name?.toLowerCase() !== 'complete'
                ).length
                const totalDevelopments = site.developments.length

                return (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/sites/${site.id}`}
                        className="font-medium text-gray-900 hover:text-coral"
                      >
                        {siteName}
                      </Link>
                      {site.clientRef && (
                        <p className="text-xs text-gray-500">Ref: {site.clientRef}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {location || '—'}
                      {site.localAuthority && (
                        <p className="text-xs text-gray-400">{site.localAuthority.name}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {site.siteOwner?.name || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {site.pipelineStatus && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {site.pipelineStatus.name}
                          </span>
                        )}
                        {site.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {site.status.name}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {totalDevelopments > 0 ? (
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">{activeDevelopments}</span>
                          <span className="text-gray-500"> active</span>
                          {totalDevelopments > activeDevelopments && (
                            <span className="text-gray-400"> / {totalDevelopments} total</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/sites/${site.id}`}
                        className="text-coral hover:text-coral-dark text-sm font-medium"
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
