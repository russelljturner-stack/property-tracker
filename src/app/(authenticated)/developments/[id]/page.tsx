import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"

// Force dynamic rendering - this page fetches data at request time
export const dynamic = 'force-dynamic'

/**
 * Development Detail Page - Progressive Disclosure Design
 *
 * This page implements a task-focused, progressive disclosure approach:
 * 1. Progress Timeline - Visual indication of where we are in the lifecycle
 * 2. Tasks & Actions - What needs to be done (most prominent)
 * 3. Stage Cards - Expandable sections for each workflow stage
 * 4. Sidebar - Quick access to contacts and recent activity
 *
 * The design prioritises what users need to DO rather than just showing data.
 */

// In Next.js 15+, params is a Promise that needs to be awaited
type PageProps = {
  params: Promise<{ id: string }>
}

// Define the development lifecycle stages
// Each stage maps to fields in the database and determines what to show
const STAGES = [
  { key: 'survey', label: 'Survey', icon: '📍' },
  { key: 'commercial', label: 'Commercial', icon: '💼' },
  { key: 'design', label: 'Design', icon: '✏️' },
  { key: 'planning', label: 'Planning', icon: '📋' },
  { key: 'marketing', label: 'Marketing', icon: '📢' },
  { key: 'build', label: 'Build', icon: '🏗️' },
  { key: 'live', label: 'Live', icon: '✅' },
] as const

type StageKey = typeof STAGES[number]['key']

export default async function DevelopmentDetailPage({ params }: PageProps) {
  const { id } = await params
  const developmentId = parseInt(id, 10)

  if (isNaN(developmentId)) {
    notFound()
  }

  // Fetch the development with all related data needed for the page
  const development = await db.development.findUnique({
    where: { id: developmentId },
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
          siteAgent: true,
          localAuthority: true,
          // Include photos for site context panel
          photos: {
            orderBy: [
              { isPrimary: 'desc' },
              { uploadedAt: 'desc' },
            ],
            take: 1,
          },
          // Include all developments at this site for history count
          developments: {
            select: {
              id: true,
              projectNo: true,
              status: { select: { name: true, colour: true } },
            },
          },
          ownerContacts: {
            include: {
              contact: {
                include: { organisation: true },
              },
            },
          },
          agentContacts: {
            include: {
              contact: {
                include: { organisation: true },
              },
            },
          },
        },
      },
      status: true,
      dealType: true,
      developmentType: true,
      details: {
        include: {
          panelType: true,
          panelSize: true,
          orientation: true,
          structureType: true,
        },
      },
      tasks: {
        include: { taskType: true },
        orderBy: [
          { complete: 'asc' },
          { needsReview: 'desc' },
          { dueDate: 'asc' },
        ],
      },
      planningAppStatus: true,
      advertAppStatus: true,
      notes: {
        orderBy: { noteDate: 'desc' },
        take: 10,
      },
      caseOfficer: {
        include: { organisation: true },
      },
      lawyerContact: {
        include: { organisation: true },
      },
      lawyer: true,
      mediaOwner: true,
      mediaOwnerContacts: {
        include: {
          contact: {
            include: { organisation: true },
          },
        },
      },
    },
  })

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

  // Determine current stage based on data
  const currentStage = determineCurrentStage(development)

  // Collect all contacts for the sidebar
  const allContacts = collectAllContacts(development)

  // Build activity items from notes and task completions
  const activityItems = buildActivityLog(development)

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

      {/* Header section with status and key info */}
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
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              {development.projectNo && (
                <span>Project #{development.projectNo}</span>
              )}
              {development.dealType && (
                <span className="px-2 py-0.5 bg-gray-100 rounded">{development.dealType.name}</span>
              )}
              {development.developmentType && (
                <span className="px-2 py-0.5 bg-gray-100 rounded">{development.developmentType.name}</span>
              )}
            </div>
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
      </div>

      {/* Site Context Panel - Map, Photo, and Development History */}
      {development.site && (
        <SiteContextPanel
          site={development.site}
          currentDevelopmentId={development.id}
        />
      )}

      {/* Progress Timeline */}
      <ProgressTimeline stages={STAGES} currentStage={currentStage} />

      {/* Main content: Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Tasks and Stage Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tasks Section - Most prominent */}
          <section id="tasks" className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {development.tasks.filter(t => !t.complete).length} open
                </span>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  + Add Task
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {development.tasks.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No tasks for this development.
                </div>
              ) : (
                development.tasks.slice(0, 5).map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))
              )}
              {development.tasks.length > 5 && (
                <div className="px-6 py-3 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View all {development.tasks.length} tasks
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Panel Details - Always visible summary */}
          {development.details.length > 0 && (
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Panel Configuration</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {development.details.map((detail, index) => (
                    <PanelDetailCard key={detail.id} detail={detail} index={index} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Stage Cards - Expandable sections for each workflow stage */}
          <div className="space-y-4">
            {/* Commercial Stage Card */}
            <StageCard
              title="Commercial"
              icon="💼"
              isActive={currentStage === 'commercial'}
              isComplete={isStageComplete('commercial', development)}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Offer Agreed" value={development.offerAgreed ? formatDate(development.offerAgreed) : undefined} />
                <InfoItem label="Lease Per Annum" value={development.leasePerAnnum ? `£${Number(development.leasePerAnnum).toLocaleString()}` : undefined} />
                <InfoItem label="Lease Term" value={development.term ? `${development.term} years` : undefined} />
                <InfoItem label="Contract Signed" value={development.contractSigned ? formatDate(development.contractSigned) : undefined} />
                <InfoItem label="Probability" value={development.probability ? `${development.probability}%` : undefined} />
                <InfoItem label="Rental Value" value={development.rentalValue ? `£${Number(development.rentalValue).toLocaleString()}` : undefined} />
              </div>
              {(development.offerAgreed || development.contractSigned || development.leasePerAnnum) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link href={`/developments/${development.id}/commercial`} className="text-sm text-blue-600 hover:text-blue-800">
                    View full commercial details →
                  </Link>
                </div>
              )}
            </StageCard>

            {/* Design Stage Card */}
            <StageCard
              title="Design"
              icon="✏️"
              isActive={currentStage === 'design'}
              isComplete={isStageComplete('design', development)}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Design Status" value={development.designFinalOrDraft} />
                <InfoItem label="Signed Off" value={development.designSignedOff} />
                <InfoItem label="Signed Off Date" value={development.designSignedOffDate ? formatDate(development.designSignedOffDate) : undefined} />
                <InfoItem label="Signed Off By" value={development.designSignedOffBy} />
              </div>
            </StageCard>

            {/* Planning Stage Card */}
            <StageCard
              title="Planning"
              icon="📋"
              isActive={currentStage === 'planning'}
              isComplete={isStageComplete('planning', development)}
            >
              <div className="space-y-4">
                {/* Planning Application */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Planning Application</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Status" value={development.planningAppStatus?.name} />
                    <InfoItem label="LA Reference" value={development.planningAppRefLa} />
                    <InfoItem label="Submitted" value={development.planningApplicationSubmitted ? formatDate(development.planningApplicationSubmitted) : undefined} />
                    <InfoItem label="Target Date" value={development.planningAppDeterminDate ? formatDate(development.planningAppDeterminDate) : undefined} />
                  </div>
                </div>
                {/* Advertisement Application */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Advertisement Application</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem label="Status" value={development.advertAppStatus?.name} />
                    <InfoItem label="LA Reference" value={development.advertAppRefLa} />
                    <InfoItem label="Submitted" value={development.advertApplicationSubmitted ? formatDate(development.advertApplicationSubmitted) : undefined} />
                    <InfoItem label="Target Date" value={development.advertAppDeterminationDate ? formatDate(development.advertAppDeterminationDate) : undefined} />
                  </div>
                </div>
                {development.caseOfficer && (
                  <div className="pt-4 border-t border-gray-100">
                    <InfoItem
                      label="Case Officer"
                      value={`${development.caseOfficer.firstName || ''} ${development.caseOfficer.lastName || ''}`.trim() || undefined}
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href={`/developments/${development.id}/planning`} className="text-sm text-blue-600 hover:text-blue-800">
                  View full planning details →
                </Link>
              </div>
            </StageCard>

            {/* Build Stage Card */}
            <StageCard
              title="Build"
              icon="🏗️"
              isActive={currentStage === 'build'}
              isComplete={isStageComplete('build', development)}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Start Date" value={development.buildStartDate ? formatDate(development.buildStartDate) : undefined} />
                <InfoItem label="Completion Date" value={development.buildCompletionDate ? formatDate(development.buildCompletionDate) : undefined} />
                <InfoItem label="Live Date" value={development.buildLiveDate ? formatDate(development.buildLiveDate) : undefined} />
                <InfoItem label="Contractor" value={development.buildContractor} />
              </div>
              {development.buildNotes && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <InfoItem label="Notes" value={development.buildNotes} />
                </div>
              )}
            </StageCard>
          </div>
        </div>

        {/* Right column: Sidebar (1/3 width) */}
        <div className="space-y-6">
          {/* Key Contacts Card */}
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Key Contacts
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {allContacts.length === 0 ? (
                <div className="px-6 py-4 text-sm text-gray-500">
                  No contacts recorded.
                </div>
              ) : (
                allContacts.map((contact, index) => (
                  <ContactItem key={`${contact.role}-${index}`} contact={contact} />
                ))
              )}
            </div>
          </section>

          {/* Internal Team Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Internal Team
            </h3>
            <div className="space-y-3">
              <InfoItem label="Developer" value={development.internalDeveloper} />
              <InfoItem label="Planner" value={development.internalPlanner} />
            </div>
          </section>

          {/* Recent Activity Card */}
          <section className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {activityItems.length === 0 ? (
                <div className="px-6 py-4 text-sm text-gray-500">
                  No recent activity.
                </div>
              ) : (
                activityItems.slice(0, 10).map((item, index) => (
                  <ActivityItem key={index} item={item} />
                ))
              )}
            </div>
          </section>

          {/* Quick Info Card */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Info
            </h3>
            <div className="space-y-3">
              <InfoItem
                label="Site Owner"
                value={development.site?.siteOwner?.name}
              />
              <InfoItem
                label="Local Authority"
                value={development.site?.localAuthority?.name}
              />
              <InfoItem
                label="Media Owner"
                value={development.mediaOwner?.name}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Determine which stage of development we're currently in
 * This is based on which fields have been populated
 */
function determineCurrentStage(development: {
  buildLiveDate?: Date | null
  buildStartDate?: Date | null
  buildCompletionDate?: Date | null
  planningApplicationSubmitted?: Date | null
  advertApplicationSubmitted?: Date | null
  planningAppStatus?: { name: string } | null
  advertAppStatus?: { name: string } | null
  designSignedOff?: string | null
  contractSigned?: Date | null
  offerAgreed?: Date | null
}): StageKey {
  // Work backwards from most advanced stage
  if (development.buildLiveDate) return 'live'
  if (development.buildStartDate || development.buildCompletionDate) return 'build'
  if (development.planningApplicationSubmitted || development.advertApplicationSubmitted) return 'planning'
  if (development.designSignedOff === 'Yes') return 'design'
  if (development.contractSigned || development.offerAgreed) return 'commercial'
  return 'survey'
}

/**
 * Check if a stage is complete
 */
function isStageComplete(stage: StageKey, development: {
  buildLiveDate?: Date | null
  buildCompletionDate?: Date | null
  planningAppStatus?: { name: string } | null
  advertAppStatus?: { name: string } | null
  designSignedOff?: string | null
  contractSigned?: Date | null
}): boolean {
  switch (stage) {
    case 'live':
      return !!development.buildLiveDate
    case 'build':
      return !!development.buildCompletionDate
    case 'planning':
      // Consider complete if approved (would need to check status name)
      return development.planningAppStatus?.name?.toLowerCase().includes('approved') || false
    case 'design':
      return development.designSignedOff === 'Yes'
    case 'commercial':
      return !!development.contractSigned
    default:
      return false
  }
}

/**
 * Collect all contacts from various sources into a unified list
 */
type ContactInfo = {
  role: string
  name: string
  organisation?: string | null
  phone?: string | null
  email?: string | null
}

function collectAllContacts(development: {
  site?: {
    siteOwner?: { name: string } | null
    ownerContacts?: Array<{
      contact: {
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        email?: string | null
        organisation?: { name: string } | null
      }
    }>
    agentContacts?: Array<{
      contact: {
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        email?: string | null
        organisation?: { name: string } | null
      }
    }>
  } | null
  caseOfficer?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email?: string | null
    organisation?: { name: string } | null
  } | null
  lawyerContact?: {
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    email?: string | null
    organisation?: { name: string } | null
  } | null
  lawyer?: { name: string } | null
  mediaOwnerContacts?: Array<{
    contact: {
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      email?: string | null
      organisation?: { name: string } | null
    }
  }>
  internalDeveloper?: string | null
  internalPlanner?: string | null
}): ContactInfo[] {
  const contacts: ContactInfo[] = []

  // Site owner contacts
  development.site?.ownerContacts?.forEach(oc => {
    const name = `${oc.contact.firstName || ''} ${oc.contact.lastName || ''}`.trim()
    if (name) {
      contacts.push({
        role: 'Site Owner Contact',
        name,
        organisation: oc.contact.organisation?.name,
        phone: oc.contact.phone,
        email: oc.contact.email,
      })
    }
  })

  // Site agent contacts
  development.site?.agentContacts?.forEach(ac => {
    const name = `${ac.contact.firstName || ''} ${ac.contact.lastName || ''}`.trim()
    if (name) {
      contacts.push({
        role: 'Site Agent',
        name,
        organisation: ac.contact.organisation?.name,
        phone: ac.contact.phone,
        email: ac.contact.email,
      })
    }
  })

  // Case officer
  if (development.caseOfficer) {
    const name = `${development.caseOfficer.firstName || ''} ${development.caseOfficer.lastName || ''}`.trim()
    if (name) {
      contacts.push({
        role: 'Case Officer',
        name,
        organisation: development.caseOfficer.organisation?.name,
        phone: development.caseOfficer.phone,
        email: development.caseOfficer.email,
      })
    }
  }

  // Lawyer contact
  if (development.lawyerContact) {
    const name = `${development.lawyerContact.firstName || ''} ${development.lawyerContact.lastName || ''}`.trim()
    if (name) {
      contacts.push({
        role: 'Lawyer',
        name,
        organisation: development.lawyerContact.organisation?.name || development.lawyer?.name,
        phone: development.lawyerContact.phone,
        email: development.lawyerContact.email,
      })
    }
  }

  // Media owner contacts
  development.mediaOwnerContacts?.forEach(mc => {
    const name = `${mc.contact.firstName || ''} ${mc.contact.lastName || ''}`.trim()
    if (name) {
      contacts.push({
        role: 'Media Owner',
        name,
        organisation: mc.contact.organisation?.name,
        phone: mc.contact.phone,
        email: mc.contact.email,
      })
    }
  })

  return contacts
}

/**
 * Build activity log from notes
 */
type ActivityLogItem = {
  type: 'note' | 'task'
  date: Date
  description: string
  by?: string | null
}

function buildActivityLog(development: {
  notes: Array<{
    noteText?: string | null
    noteDate: Date
    noteBy?: string | null
  }>
}): ActivityLogItem[] {
  const items: ActivityLogItem[] = []

  // Add notes to activity log
  development.notes.forEach(note => {
    if (note.noteText) {
      items.push({
        type: 'note',
        date: note.noteDate,
        description: note.noteText.length > 100
          ? note.noteText.substring(0, 100) + '...'
          : note.noteText,
        by: note.noteBy,
      })
    }
  })

  // Sort by date descending
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return items
}

// =============================================================================
// Component: Progress Timeline
// =============================================================================
function ProgressTimeline({
  stages,
  currentStage,
}: {
  stages: typeof STAGES
  currentStage: StageKey
}) {
  const currentIndex = stages.findIndex(s => s.key === currentStage)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isPast = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex

          return (
            <div key={stage.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${isPast ? 'bg-green-100 text-green-600' : ''}
                    ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                    ${isFuture ? 'bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  {isPast ? '✓' : stage.icon}
                </div>
                <span
                  className={`
                    mt-2 text-xs font-medium
                    ${isCurrent ? 'text-blue-600' : isPast ? 'text-green-600' : 'text-gray-400'}
                  `}
                >
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2
                    ${index < currentIndex ? 'bg-green-300' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Component: Site Context Panel
// Shows map, site photo, and development history at this site
// =============================================================================
function SiteContextPanel({
  site,
  currentDevelopmentId,
}: {
  site: {
    id: number
    name?: string | null
    address?: {
      latitude?: number | null
      longitude?: number | null
      postcode?: string | null
    } | null
    photos?: Array<{
      photoUrl?: string | null
      caption?: string | null
    }>
    developments?: Array<{
      id: number
      projectNo?: number | null
      status?: { name: string; colour?: string | null } | null
    }>
  }
  currentDevelopmentId: number
}) {
  const hasCoordinates = site.address?.latitude && site.address?.longitude
  const primaryPhoto = site.photos?.[0]

  // Other developments at this site (excluding current one)
  const otherDevelopments = site.developments?.filter(d => d.id !== currentDevelopmentId) || []

  // Build Google Maps Static API URL
  // Using satellite view at zoom level 16 for good site context
  const mapUrl = hasCoordinates
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${site.address!.latitude},${site.address!.longitude}&zoom=16&size=400x200&maptype=satellite&markers=color:red%7C${site.address!.latitude},${site.address!.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`
    : null

  // Always show the panel - it provides important site context
  // Even if data is missing, we show placeholders to indicate what could be added

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Site Context
        </h2>
      </div>

      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Map Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Location</h3>
            {mapUrl ? (
              <a
                href={`https://www.google.com/maps?q=${site.address!.latitude},${site.address!.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors aspect-[4/3] max-h-28"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mapUrl}
                  alt={`Map of ${site.name || 'site location'}`}
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <div className="w-full aspect-[4/3] max-h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No coordinates available
              </div>
            )}
            {site.address?.postcode && (
              <p className="text-xs text-gray-500 text-center">{site.address.postcode}</p>
            )}
          </div>

          {/* Photo Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Site Photo</h3>
            {primaryPhoto?.photoUrl ? (
              <div className="rounded-lg overflow-hidden border border-gray-200 aspect-[4/3] max-h-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={primaryPhoto.photoUrl}
                  alt={primaryPhoto.caption || `Photo of ${site.name || 'site'}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] max-h-28 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                No photo available
              </div>
            )}
            {primaryPhoto?.caption && (
              <p className="text-xs text-gray-500 text-center truncate">{primaryPhoto.caption}</p>
            )}
          </div>

          {/* Development History Section */}
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-gray-500 uppercase">Development History</h3>
            <div className="bg-gray-50 rounded-lg p-2 aspect-[4/3] max-h-28 overflow-y-auto">
              {otherDevelopments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center mt-8">
                  First development at this site
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 mb-2">
                    {otherDevelopments.length} other development{otherDevelopments.length !== 1 ? 's' : ''} at this site
                  </p>
                  {otherDevelopments.map((dev) => (
                    <Link
                      key={dev.id}
                      href={`/developments/${dev.id}`}
                      className="block text-sm p-2 bg-white rounded border border-gray-200 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          #{dev.projectNo || dev.id}
                        </span>
                        {dev.status && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: dev.status.colour ? `${dev.status.colour}20` : '#e5e7eb',
                              color: dev.status.colour || '#374151',
                            }}
                          >
                            {dev.status.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Link to full site page */}
        <div className="mt-2 pt-2 border-t border-gray-100 text-center">
          <Link
            href={`/sites/${site.id}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View full site details →
          </Link>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Component: Stage Card (Expandable)
// =============================================================================
function StageCard({
  title,
  icon,
  isActive,
  isComplete,
  children,
}: {
  title: string
  icon: string
  isActive: boolean
  isComplete: boolean
  children: React.ReactNode
}) {
  // For now, cards are always expanded. Later we can add collapse/expand functionality
  return (
    <section className={`
      bg-white rounded-lg shadow overflow-hidden
      ${isActive ? 'ring-2 ring-blue-500' : ''}
    `}>
      <div className={`
        px-6 py-4 border-b border-gray-200 flex items-center justify-between
        ${isActive ? 'bg-blue-50' : ''}
      `}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Complete
            </span>
          )}
          {isActive && !isComplete && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              Current
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </section>
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
    <div className={`px-6 py-4 ${task.complete ? "bg-gray-50" : ""}`}>
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
// Component: Contact Item
// =============================================================================
function ContactItem({ contact }: { contact: ContactInfo }) {
  return (
    <div className="px-6 py-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{contact.role}</p>
          <p className="text-sm font-medium text-gray-900 mt-0.5">{contact.name}</p>
          {contact.organisation && (
            <p className="text-xs text-gray-500">{contact.organisation}</p>
          )}
        </div>
        <div className="flex gap-2">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="p-1.5 rounded-full hover:bg-gray-100"
              title={contact.phone}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-1.5 rounded-full hover:bg-gray-100"
              title={contact.email}
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Component: Activity Item
// =============================================================================
function ActivityItem({ item }: { item: ActivityLogItem }) {
  return (
    <div className="px-6 py-3">
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs
          ${item.type === 'note' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'}
        `}>
          {item.type === 'note' ? '📝' : '✓'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900">{item.description}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {item.by && `${item.by} • `}
            {formatDate(item.date)}
          </p>
        </div>
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
