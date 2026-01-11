import { db } from "@/lib/db"

// Sites list page
//
// This page displays all sites (properties/land) in the system.
// For now it's a placeholder showing the count from the database.
// In Phase 4, this will become a full list view with search and filtering.

export default async function SitesPage() {
  const siteCount = await db.site.count()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="text-gray-600">
            Manage properties and land parcels
          </p>
        </div>
        <a
          href="/sites/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Site
        </a>
      </div>

      {/* Placeholder content */}
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {siteCount} sites in database
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          This page will display a searchable list of all sites. Site details,
          editing, and mapping features will be built in Phase 4.
        </p>
      </div>
    </div>
  )
}
