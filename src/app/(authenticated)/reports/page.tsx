// Reports page
//
// This page displays various reports and analytics about the property portfolio.
// Reports provide management insights and summaries.

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-teal">Reports</h1>
        <p className="text-gray-600">
          Analytics and summaries
        </p>
      </div>

      {/* Placeholder content */}
      <div className="bg-white shadow p-8 text-center" style={{ borderRadius: 0 }}>
        <div className="text-coral mb-4">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-teal mb-2">
          Reports & Analytics
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          This page will provide management reports including development
          pipeline, site status summaries, and key metrics. Coming in Phase 4.
        </p>
      </div>

      {/* Report types preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
          <h3 className="font-semibold text-teal mb-2">Pipeline Report</h3>
          <p className="text-sm text-gray-500">
            Overview of all developments by status stage
          </p>
        </div>
        <div className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
          <h3 className="font-semibold text-teal mb-2">Site Summary</h3>
          <p className="text-sm text-gray-500">
            Active vs inactive sites with key details
          </p>
        </div>
        <div className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
          <h3 className="font-semibold text-teal mb-2">Task Overview</h3>
          <p className="text-sm text-gray-500">
            Overdue and upcoming tasks by assignee
          </p>
        </div>
        <div className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
          <h3 className="font-semibold text-teal mb-2">Activity Log</h3>
          <p className="text-sm text-gray-500">
            Recent changes and user activity
          </p>
        </div>
      </div>
    </div>
  )
}
