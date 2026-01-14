import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CommercialCard } from "@/components/CommercialCard"
import { DesignCard } from "@/components/DesignCard"
import { PlanningCard } from "@/components/PlanningCard"
import { MarketingCard } from "@/components/MarketingCard"
import { BuildCard } from "@/components/BuildCard"

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
// Icons are SVG paths (line-style, matching sidebar navigation)
const STAGES = [
  { key: 'survey', label: 'Survey', iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' }, // Location pin
  { key: 'commercial', label: 'Commercial', iconPath: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }, // Pound/money circle
  { key: 'design', label: 'Design', iconPath: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' }, // Pencil
  { key: 'planning', label: 'Planning', iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }, // Clipboard with checkmark
  { key: 'marketing', label: 'Marketing', iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z' }, // Megaphone/loudhailer
  { key: 'build', label: 'Build', iconPath: 'M4 21h16M4 21V10l4-4m12 15V10l-4-4M8 6l4-4 4 4M12 2v8M8 21v-6h8v6' }, // Crane/construction
  { key: 'live', label: 'Live', iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }, // Checkmark circle
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
      mediaOwnerAgent: true,
      mediaOwnerContacts: {
        include: {
          contact: {
            include: { organisation: true },
          },
        },
      },
      // Marketing/Tender data
      tenderOffers: {
        orderBy: { offerDate: 'desc' },
      },
      // Commercial data
      contractingEntity: true,
      contractDocs: {
        orderBy: { uploadedAt: 'desc' },
      },
    },
  })

  if (!development) {
    notFound()
  }

  // Fetch prev/next development IDs for navigation
  // Simple approach: order all by id and find adjacent ones
  const [prevDevelopment, nextDevelopment] = await Promise.all([
    db.development.findFirst({
      where: { id: { lt: developmentId } },
      orderBy: { id: 'desc' },
      select: { id: true, projectNo: true }
    }),
    db.development.findFirst({
      where: { id: { gt: developmentId } },
      orderBy: { id: 'asc' },
      select: { id: true, projectNo: true }
    })
  ])

  // Fetch lookup data for dropdowns (in parallel for efficiency)
  const [contractingEntities, lawyers, applicationStatuses, mediaOwners] = await Promise.all([
    // ContractingEntity is its own model
    db.contractingEntity.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { sortOrder: 'asc' },
    }),
    // Lawyers are Organisations with developmentsAsLawyer relation
    // For now, get all organisations that have been used as lawyers
    db.organisation.findMany({
      where: {
        developmentsAsLawyer: { some: {} }
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    // Application statuses for planning and advert applications
    db.applicationStatus.findMany({
      select: { id: true, name: true },
      orderBy: { sortOrder: 'asc' },
    }),
    // Media owners - organisations that have been used as media owners
    db.organisation.findMany({
      where: {
        developmentsAsMediaOwner: { some: {} }
      },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

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
      {/* Header & Site Context - Combined card with coral background, sticky at top */}
      <div className="shadow sticky top-0 z-10" style={{ backgroundColor: '#fa6e60', borderRadius: 0 }}>
        {/* Top row: Title + Status + Buttons */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/20">
          <div className="flex items-center gap-3">
            <Link href="/developments" title="Back to list" className="text-white hover:opacity-80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">{siteName}</h1>
            {development.status && (
              <StatusBadgeDark
                name={development.status.name}
                colour={development.status.colour}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Prev/Next navigation */}
            <div className="flex items-center gap-1 mr-2">
              {prevDevelopment ? (
                <Link
                  href={`/developments/${prevDevelopment.id}`}
                  className="p-1.5 text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded"
                  title={`Previous: #${prevDevelopment.projectNo || prevDevelopment.id}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ) : (
                <span className="p-1.5 text-white/40 bg-white/10 rounded cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              )}
              {nextDevelopment ? (
                <Link
                  href={`/developments/${nextDevelopment.id}`}
                  className="p-1.5 text-white/80 hover:text-white bg-white/20 hover:bg-white/30 rounded"
                  title={`Next: #${nextDevelopment.projectNo || nextDevelopment.id}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <span className="p-1.5 text-white/40 bg-white/10 rounded cursor-not-allowed">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </div>
            {development.site && (
              <Link
                href={`/sites/${development.site.id}`}
                className="px-3 py-1.5 text-sm border border-white text-white rounded-full hover:bg-white/10"
              >
                View Site
              </Link>
            )}
            <Link
              href={`/developments/${development.id}/edit`}
              className="px-3 py-1.5 text-sm rounded-full transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1e434d', color: 'white' }}
            >
              Edit
            </Link>
          </div>
        </div>
        {/* Middle row: Address + Badges */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm border-b border-white/20">
          {fullAddress && (
            <span className="text-white/90">{fullAddress}</span>
          )}
          <span className="text-white/40">|</span>
          {development.projectNo && (
            <span className="text-white/80">#{development.projectNo}</span>
          )}
          {development.dealType && (
            <span className="px-2 py-0.5 bg-white/20 rounded text-white">{development.dealType.name}</span>
          )}
          {development.developmentType && (
            <span className="px-2 py-0.5 bg-white/20 rounded text-white">{development.developmentType.name}</span>
          )}
          <PlanningScoreBadge score={development.planningScore} />
        </div>
        {/* Bottom row: Site Context - Map and Photo thumbnails with muted background */}
        {development.site && (
          <div className="px-6 py-4" style={{ backgroundColor: '#6b7280' }}>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 text-white/90">Site Context</h3>
            {/* Thumbnails - 160x120px (4:3 ratio) */}
            <div className="flex gap-3">
              {/* Map thumbnail */}
              {development.site.address?.latitude && development.site.address?.longitude ? (
                <a
                  href={`https://www.google.com/maps?q=${development.site.address.latitude},${development.site.address.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded overflow-hidden border-2 border-white/30 hover:border-white transition-colors w-[160px] h-[120px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${development.site.address.latitude},${development.site.address.longitude}&zoom=16&size=320x240&maptype=satellite&markers=color:red%7C${development.site.address.latitude},${development.site.address.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`}
                    alt="Site location"
                    className="w-full h-full object-cover"
                  />
                </a>
              ) : (
                <div className="bg-white/10 rounded flex items-center justify-center text-white/50 text-xs w-[160px] h-[120px]">
                  No map
                </div>
              )}
              {/* Photo thumbnail */}
              {development.site.photos?.[0]?.photoUrl ? (
                <div className="rounded overflow-hidden border-2 border-white/30 w-[160px] h-[120px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={development.site.photos[0].photoUrl}
                    alt="Site photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="bg-white/10 rounded flex items-center justify-center text-white/50 text-xs w-[160px] h-[120px]">
                  No photo
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main content: Two-column layout - narrower right column */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: Timeline, Tasks and Stage Cards (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          {/* What's Next Action Prompt */}
          <WhatsNextPrompt development={development} />

          {/* Progress Timeline - now within left column */}
          <ProgressTimeline stages={STAGES} currentStage={currentStage} />
          {/* Tasks Section - Most prominent */}
          <section id="tasks" className="bg-white shadow" style={{ borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Tasks</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {development.tasks.filter(t => !t.complete).length} open
                </span>
                <button className="text-sm hover:opacity-80" style={{ color: '#fa6e60' }}>
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
                  <button className="text-sm hover:opacity-80" style={{ color: '#fa6e60' }}>
                    View all {development.tasks.length} tasks
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Panel Details - Always visible summary */}
          {development.details.length > 0 && (
            <section className="bg-white shadow" style={{ borderRadius: 0 }}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold" style={{ color: '#1e434d' }}>Panel Configuration</h2>
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
            {/* Commercial Stage Card - Expandable with Edit capability */}
            <CommercialCard
              developmentId={development.id}
              data={development}
              isActive={currentStage === 'commercial'}
              isComplete={isStageComplete('commercial', development)}
              contractingEntities={contractingEntities}
              lawyers={lawyers}
            />

            {/* Design Stage Card - Expandable with Edit capability */}
            <DesignCard
              developmentId={development.id}
              data={{
                id: development.id,
                designUrl: development.designUrl,
                designFinalOrDraft: development.designFinalOrDraft,
                designSignedOff: development.designSignedOff,
                designSignedOffDate: development.designSignedOffDate,
                designSignedOffBy: development.designSignedOffBy,
              }}
              isActive={currentStage === 'design'}
              isComplete={isStageComplete('design', development)}
            />

            {/* Planning Stage Card - Expandable with Edit capability */}
            <PlanningCard
              developmentId={development.id}
              data={{
                id: development.id,
                planningAppStatusId: development.planningAppStatusId,
                planningAppStatus: development.planningAppStatus,
                planningScore: development.planningScore,
                planningApplicationDescription: development.planningApplicationDescription,
                planningApplicationDetail: development.planningApplicationDetail,
                planningClientApproval: development.planningClientApproval,
                planningApplicationSubmitted: development.planningApplicationSubmitted,
                planningAppRegistration: development.planningAppRegistration,
                planningAppRefLa: development.planningAppRefLa,
                planningAppDeterminDate: development.planningAppDeterminDate,
                planningConditions: development.planningConditions,
                planningConditionsNumber: development.planningConditionsNumber,
                planningAppealSubmitted: development.planningAppealSubmitted,
                planningAppealStart: development.planningAppealStart,
                planningAppealRefLa: development.planningAppealRefLa,
                planningAppealProcedure: development.planningAppealProcedure,
                advertAppStatusId: development.advertAppStatusId,
                advertAppStatus: development.advertAppStatus,
                advertApplicationDescription: development.advertApplicationDescription,
                advertApplicationSubmitted: development.advertApplicationSubmitted,
                advertApplicationRegistration: development.advertApplicationRegistration,
                advertAppRefLa: development.advertAppRefLa,
                advertAppDeterminationDate: development.advertAppDeterminationDate,
                advertConditions: development.advertConditions,
                advertConditionsNumber: development.advertConditionsNumber,
                advertAppealSubmitted: development.advertAppealSubmitted,
                advertAppealStart: development.advertAppealStart,
                advertAppealRefLa: development.advertAppealRefLa,
                advertAppealProcedure: development.advertAppealProcedure,
                caseOfficer: development.caseOfficer,
              }}
              applicationStatuses={applicationStatuses}
              isActive={currentStage === 'planning'}
              isComplete={isStageComplete('planning', development)}
            />

            {/* Marketing Stage Card - Expandable with Edit capability */}
            <MarketingCard
              developmentId={development.id}
              data={{
                id: development.id,
                mediaOwnerId: development.mediaOwnerId,
                mediaOwner: development.mediaOwner,
                mediaOwnerAgentId: development.mediaOwnerAgentId,
                mediaOwnerAgent: development.mediaOwnerAgent,
                tenderOffers: development.tenderOffers,
              }}
              mediaOwners={mediaOwners}
              isActive={currentStage === 'marketing'}
              isComplete={isStageComplete('marketing', development)}
            />

            {/* Build Stage Card - Expandable with Edit capability */}
            <BuildCard
              developmentId={development.id}
              data={{
                id: development.id,
                buildStartDate: development.buildStartDate,
                buildCompletionDate: development.buildCompletionDate,
                buildLiveDate: development.buildLiveDate,
                buildContractor: development.buildContractor,
                buildNotes: development.buildNotes,
              }}
              isActive={currentStage === 'build'}
              isComplete={isStageComplete('build', development)}
            />
          </div>
        </div>

        {/* Right column: Sidebar (1/4 width) - Ocean blue background */}
        <div
          className="lg:col-span-1 space-y-6 p-4"
          style={{
            backgroundColor: '#0078a0', // Ocean blue
            borderRadius: 0,
          }}
        >
          {/* Key Contacts Card */}
          <section className="bg-white shadow" style={{ borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>
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
          <section className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e434d' }}>
              Internal Team
            </h3>
            <div className="space-y-3">
              <InfoItem label="Developer" value={development.internalDeveloper} />
              <InfoItem label="Planner" value={development.internalPlanner} />
            </div>
          </section>

          {/* Recent Activity Card - Black background for contrast */}
          <section className="shadow" style={{ backgroundColor: '#000000', borderRadius: 0 }}>
            <div className="px-6 py-4 border-b border-white/20">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                {/* Activity icon in coral */}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  style={{ color: '#fa6e60' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
            </div>
            <div className="divide-y divide-white/10 max-h-80 overflow-y-auto">
              {activityItems.length === 0 ? (
                <div className="px-6 py-4 text-sm text-white/60">
                  No recent activity.
                </div>
              ) : (
                activityItems.slice(0, 10).map((item, index) => (
                  <ActivityItemDark key={index} item={item} />
                ))
              )}
            </div>
          </section>

          {/* Related Developments Card - other developments at this site */}
          {development.site?.developments && development.site.developments.length > 1 && (
            <section className="bg-white shadow" style={{ borderRadius: 0 }}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold" style={{ color: '#1e434d' }}>
                  Related Developments
                </h3>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-3">
                  Other developments at this site
                </p>
                <div className="space-y-2">
                  {development.site.developments
                    .filter(dev => dev.id !== development.id)
                    .map((dev) => (
                      <Link
                        key={dev.id}
                        href={`/developments/${dev.id}`}
                        className="block p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
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
              </div>
            </section>
          )}

          {/* Quick Info Card */}
          <section className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1e434d' }}>
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
  buildStartDate?: Date | null
  planningAppStatus?: { name: string } | null
  advertAppStatus?: { name: string } | null
  designSignedOff?: string | null
  contractSigned?: Date | null
  mediaOwner?: { name: string } | null
}): boolean {
  switch (stage) {
    case 'live':
      return !!development.buildLiveDate
    case 'build':
      return !!development.buildCompletionDate
    case 'marketing':
      // Marketing complete if media owner assigned and build started
      return !!development.mediaOwner && !!development.buildStartDate
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
  siteRole?: string | null       // Asset Manager, Marketing, Planning, Administrator
  decisionLevel?: string | null  // Decision Maker, Influencer
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
        role?: string | null
        decisionLevel?: string | null
        organisation?: { name: string } | null
      }
    }>
    agentContacts?: Array<{
      contact: {
        firstName?: string | null
        lastName?: string | null
        phone?: string | null
        email?: string | null
        role?: string | null
        decisionLevel?: string | null
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
        siteRole: oc.contact.role,
        decisionLevel: oc.contact.decisionLevel,
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
        siteRole: ac.contact.role,
        decisionLevel: ac.contact.decisionLevel,
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
// Uses brand colours: teal for complete, coral for current, muted grey for future
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
    <div className="bg-white shadow p-6" style={{ borderRadius: 0 }}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isPast = index < currentIndex
          const isCurrent = index === currentIndex
          const isFuture = index > currentIndex

          // Colour based on status:
          // Past/Complete = dark teal #1e434d
          // Current = coral #fa6e60
          // Future = muted grey
          const getIconColour = () => {
            if (isPast) return '#1e434d'
            if (isCurrent) return '#fa6e60'
            return '#9ca3af' // grey-400
          }

          const getBgColour = () => {
            if (isPast) return 'rgba(30, 67, 77, 0.1)' // teal with opacity
            if (isCurrent) return 'rgba(250, 110, 96, 0.15)' // coral with opacity
            return '#f3f4f6' // grey-100
          }

          return (
            <div key={stage.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isCurrent ? 'ring-4 ring-[#fa6e60]/30' : ''}
                  `}
                  style={{
                    backgroundColor: getBgColour(),
                  }}
                >
                  {isPast ? (
                    // Checkmark for completed stages
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      style={{ color: getIconColour() }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    // Stage icon
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      style={{ color: getIconColour() }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={stage.iconPath} />
                    </svg>
                  )}
                </div>
                <span
                  className="mt-2 text-xs font-medium"
                  style={{
                    color: isPast ? '#1e434d' : isCurrent ? '#fa6e60' : '#9ca3af',
                  }}
                >
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-2"
                  style={{
                    backgroundColor: index < currentIndex ? '#1e434d' : '#e5e7eb',
                  }}
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
// Component: Status Badge Dark (for coral/dark backgrounds)
// Uses white/semi-transparent styling for readability
// =============================================================================
function StatusBadgeDark({ name, colour }: { name: string; colour?: string | null }) {
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        color: 'white',
      }}
    >
      {name}
    </span>
  )
}

// =============================================================================
// Component: What's Next Prompt
// Shows the next action required to progress the development
// =============================================================================
function WhatsNextPrompt({ development }: {
  development: {
    status?: { name: string } | null
    designFinalOrDraft?: string | null
    designSignedOff?: string | null
    planningAppStatus?: { name: string } | null
    advertAppStatus?: { name: string } | null
    contractSigned?: Date | null
    mediaOwner?: { name: string } | null
    buildStartDate?: Date | null
    buildCompletionDate?: Date | null
    buildLiveDate?: Date | null
    tasks?: Array<{
      complete: boolean
      dueDate?: Date | null
      description?: string | null
    }>
  }
}) {
  // Determine what's next based on current state
  const getNextAction = (): { action: string; priority: 'high' | 'medium' | 'low'; icon: string } | null => {
    // Check for overdue tasks first
    const overdueTasks = development.tasks?.filter(
      t => !t.complete && t.dueDate && new Date(t.dueDate) < new Date()
    )
    if (overdueTasks && overdueTasks.length > 0) {
      return {
        action: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} need attention`,
        priority: 'high',
        icon: '⚠️',
      }
    }

    // Design not signed off
    if (development.designSignedOff !== 'Yes' && development.designFinalOrDraft !== 'Final') {
      return {
        action: 'Get design signed off to progress to planning',
        priority: 'medium',
        icon: '✏️',
      }
    }

    // Planning submitted but awaiting decision
    const planningStatus = development.planningAppStatus?.name?.toLowerCase() || ''
    if (planningStatus.includes('submitted') || planningStatus.includes('consideration')) {
      return {
        action: 'Awaiting planning decision - chase case officer if needed',
        priority: 'medium',
        icon: '📋',
      }
    }

    // Planning refused
    if (planningStatus.includes('refused')) {
      return {
        action: 'Consider appeal or revised application',
        priority: 'high',
        icon: '🔄',
      }
    }

    // Planning approved but no media owner
    if (planningStatus.includes('approved') && !development.mediaOwner) {
      return {
        action: 'Initiate tender process to secure media owner',
        priority: 'medium',
        icon: '📢',
      }
    }

    // Media owner but not in build
    if (development.mediaOwner && !development.buildStartDate) {
      return {
        action: 'Schedule build commencement',
        priority: 'medium',
        icon: '🏗️',
      }
    }

    // In build but not complete
    if (development.buildStartDate && !development.buildCompletionDate) {
      return {
        action: 'Monitor build progress',
        priority: 'low',
        icon: '🔨',
      }
    }

    // Build complete but not live
    if (development.buildCompletionDate && !development.buildLiveDate) {
      return {
        action: 'Complete handover and go live',
        priority: 'high',
        icon: '🚀',
      }
    }

    // Already live
    if (development.buildLiveDate) {
      return {
        action: 'Site is live - monitor performance',
        priority: 'low',
        icon: '✅',
      }
    }

    return null
  }

  const nextAction = getNextAction()

  if (!nextAction) return null

  // Use vibrant blue for emphasis - high contrast attention grabber
  // Text is white for readability on blue background
  return (
    <div
      className="p-4"
      style={{
        backgroundColor: '#007aee', // Vibrant blue for emphasis
        borderRadius: 0,
      }}
    >
      <div className="flex items-center gap-4">
        {/* Icon - white on blue background, coral for high priority */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: nextAction.priority === 'high' ? '#fa6e60' : 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            {nextAction.priority === 'high' ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            ) : nextAction.priority === 'medium' ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">
            What&apos;s Next
          </p>
          <p className="font-semibold text-lg text-white">
            {nextAction.action}
          </p>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Component: Info Item (label/value pair)
// =============================================================================
function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-sm text-gray-500 uppercase tracking-wider">{label}</dt>
      <dd className="text-base text-gray-900 mt-0.5">{value || "—"}</dd>
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
// Component: Planning Score Badge
// Shows 1-5 planning score with bright yellow emphasis
// =============================================================================
function PlanningScoreBadge({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-500" style={{ borderRadius: '9999px' }}>
        <span className="text-xs">Planning Score:</span>
        <span className="font-medium">—</span>
      </span>
    )
  }

  // Probability description
  const getProbabilityText = () => {
    switch (score) {
      case 5: return 'Very likely'
      case 4: return 'Likely'
      case 3: return 'Possible'
      case 2: return 'Unlikely'
      case 1: return 'Very unlikely'
      default: return ''
    }
  }

  // Use vibrant blue for emphasis with white text
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-white"
      style={{
        backgroundColor: '#007aee', // Vibrant blue
        borderRadius: '9999px',
      }}
      title={`Planning Score: ${score}/5 - ${getProbabilityText()}`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <span className="text-xs font-semibold">Planning:</span>
      <span className="font-bold">{score}/5</span>
      <span className="text-xs font-medium opacity-90">({getProbabilityText()})</span>
    </span>
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
    priority?: string | null
    taskType?: { name: string } | null
  }
}) {
  const isOverdue = !task.complete && task.dueDate && new Date(task.dueDate) < new Date()

  // Priority colour coding
  const getPriorityStyle = (priority: string | null | undefined) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'low':
        return 'bg-gray-100 text-gray-600 border-gray-200'
      default:
        return null
    }
  }

  const priorityStyle = getPriorityStyle(task.priority)

  return (
    <div className={`px-6 py-4 ${task.complete ? "bg-gray-50" : ""}`}>
      <div className="flex items-start gap-3">
        {/* Priority indicator bar */}
        {task.priority && !task.complete && (
          <div
            className={`flex-shrink-0 w-1 self-stretch rounded-full ${
              task.priority.toLowerCase() === 'high' ? 'bg-red-500' :
              task.priority.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-gray-300'
            }`}
          />
        )}

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
            {/* Priority badge */}
            {priorityStyle && !task.complete && (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border ${priorityStyle}`}>
                {task.priority}
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
// Component: Design Status Badge
// Shows the current design status (Stock/Proposed/Draft/Final) as a badge
// =============================================================================
function DesignStatusBadge({ status }: { status: string | null | undefined }) {
  const getStatusStyle = () => {
    switch (status?.toLowerCase()) {
      case 'final':
        return 'bg-green-500 text-white'
      case 'draft':
        return 'bg-blue-500 text-white'
      case 'proposed':
        return 'bg-amber-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const displayStatus = status || 'Stock'

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded ${getStatusStyle()}`}>
      {displayStatus}
    </span>
  )
}

// =============================================================================
// Component: Design Progress Indicator
// Shows the Stock → Proposed → Draft → Final progression
// =============================================================================
function DesignProgressIndicator({ currentStatus }: { currentStatus: string | null | undefined }) {
  const stages = ['Stock', 'Proposed', 'Draft', 'Final']

  const getCurrentIndex = () => {
    const status = currentStatus?.toLowerCase()
    switch (status) {
      case 'final': return 3
      case 'draft': return 2
      case 'proposed': return 1
      default: return 0
    }
  }

  const currentIndex = getCurrentIndex()

  return (
    <div className="flex items-center justify-between">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                index <= currentIndex
                  ? index === currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentIndex ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className={`mt-1 text-xs ${index <= currentIndex ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
              {stage}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              className={`w-6 h-0.5 mx-1 mt-[-16px] ${
                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Component: Contact Item
// =============================================================================
function ContactItem({ contact }: { contact: ContactInfo }) {
  const isDecisionMaker = contact.decisionLevel?.toLowerCase().includes('decision')

  return (
    <div className="px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 uppercase tracking-wider">{contact.role}</p>
            {/* Decision Maker indicator */}
            {isDecisionMaker && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800" title="Decision Maker">
                ★ DM
              </span>
            )}
            {contact.decisionLevel && !isDecisionMaker && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                {contact.decisionLevel}
              </span>
            )}
          </div>
          <p className="text-base font-medium text-gray-900 mt-0.5">{contact.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {contact.organisation && (
              <p className="text-sm text-gray-500">{contact.organisation}</p>
            )}
            {contact.siteRole && (
              <>
                {contact.organisation && <span className="text-sm text-gray-300">•</span>}
                <span className="text-sm text-blue-600">{contact.siteRole}</span>
              </>
            )}
          </div>
        </div>
        {/* Contact action icons - teal colour */}
        <div className="flex gap-2 flex-shrink-0">
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="p-2 rounded-full hover:bg-gray-100"
              title={contact.phone}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e434d' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="p-2 rounded-full hover:bg-gray-100"
              title={contact.email}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1e434d' }}>
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
// Component: Activity Item (Light background)
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
// Component: Activity Item Dark (Black background)
// Uses coral accent for icons, white text
// =============================================================================
function ActivityItemDark({ item }: { item: ActivityLogItem }) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-3">
        {/* Icon - line-style SVG in coral on dark background */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(250, 110, 96, 0.2)' }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            style={{ color: '#fa6e60' }}
          >
            {item.type === 'note' ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            )}
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base text-white">{item.description}</p>
          <p className="text-sm text-white/60 mt-0.5">
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

// =============================================================================
// Helper: Format currency
// =============================================================================
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return `£${Number(value).toLocaleString()}`
}

// =============================================================================
// Helper: Calculate end date from start date and term
// =============================================================================
function calculateEndDate(startDate: Date | null | undefined, termYears: number | null | undefined): string {
  if (!startDate || !termYears) return '—'
  const end = new Date(startDate)
  end.setFullYear(end.getFullYear() + termYears)
  return formatDate(end)
}

// =============================================================================
// Helper: Calculate total profit
// =============================================================================
function calculateTotalProfit(
  profitYear1: number | null | undefined,
  profitThereafter: number | null | undefined,
  termYears: number | null | undefined
): string {
  if (!profitYear1 || !termYears) return '—'
  const thereafter = profitThereafter || 0
  const total = profitYear1 + (thereafter * (termYears - 1))
  return formatCurrency(total)
}

// =============================================================================
// Helper: Check if date is expiring soon (within 6 months)
// =============================================================================
function isExpiringSoon(date: Date | null | undefined): boolean {
  if (!date) return false
  const sixMonthsFromNow = new Date()
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
  return new Date(date) <= sixMonthsFromNow && new Date(date) > new Date()
}

// CommercialStageCard has been moved to src/components/CommercialCard.tsx
// It now supports expand/collapse and edit functionality
