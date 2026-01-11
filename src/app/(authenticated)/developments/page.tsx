import { db } from "@/lib/db"

// Developments list page
//
// This page displays all developments (projects) in the system.
// Developments are linked to sites and track the progress of property projects.

export default async function DevelopmentsPage() {
  const developmentCount = await db.development.count()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developments</h1>
          <p className="text-gray-600">
            Track property development projects
          </p>
        </div>
        <a
          href="/developments/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Development
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {developmentCount} developments in database
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          This page will display all development projects with their status,
          linked sites, and progress tracking. Full features coming in Phase 4.
        </p>
      </div>
    </div>
  )
}
