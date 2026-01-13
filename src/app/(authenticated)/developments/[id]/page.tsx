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
      {/* Header - Option A: Two-row layout */}
      <div className="bg-white rounded-lg shadow">
        {/* Top row: Title + Status + Buttons */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link href="/developments" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">{siteName}</h1>
            {development.status && (
              <StatusBadge
                name={development.status.name}
                colour={development.status.colour}
              />
            )}
          </div>
          <div className="flex gap-2">
            {development.site && (
              <Link
                href={`/sites/${development.site.id}`}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                View Site
              </Link>
            )}
            <Link
              href={`/developments/${development.id}/edit`}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit
            </Link>
          </div>
        </div>
        {/* Bottom row: Address + Badges */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {fullAddress && (
            <span className="text-gray-600">{fullAddress}</span>
          )}
          <span className="text-gray-300">|</span>
          {development.projectNo && (
            <span className="text-gray-500">#{development.projectNo}</span>
          )}
          {development.dealType && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{development.dealType.name}</span>
          )}
          {development.developmentType && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{development.developmentType.name}</span>
          )}
          <PlanningScoreBadge score={development.planningScore} />
        </div>
      </div>

      {/* Site Context - Map and Photo thumbnails */}
      {development.site && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Site Context</h3>
          {/* Thumbnails - 160x120px (4:3 ratio) */}
          <div className="flex gap-3">
            {/* Map thumbnail */}
            {development.site.address?.latitude && development.site.address?.longitude ? (
              <a
                href={`https://www.google.com/maps?q=${development.site.address.latitude},${development.site.address.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors w-[160px] h-[120px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${development.site.address.latitude},${development.site.address.longitude}&zoom=16&size=320x240&maptype=satellite&markers=color:red%7C${development.site.address.latitude},${development.site.address.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}`}
                  alt="Site location"
                  className="w-full h-full object-cover"
                />
              </a>
            ) : (
              <div className="bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs w-[160px] h-[120px]">
                No map
              </div>
            )}
            {/* Photo thumbnail */}
            {development.site.photos?.[0]?.photoUrl ? (
              <div className="rounded overflow-hidden border border-gray-200 w-[160px] h-[120px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={development.site.photos[0].photoUrl}
                  alt="Site photo"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs w-[160px] h-[120px]">
                No photo
              </div>
            )}
          </div>
        </div>
      )}

      {/* What's Next Action Prompt */}
      <WhatsNextPrompt development={development} />

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
            {/* Commercial Stage Card - Full Expandable */}
            <CommercialStageCard
              development={development}
              isActive={currentStage === 'commercial'}
              isComplete={isStageComplete('commercial', development)}
            />

            {/* Design Stage Card */}
            <StageCard
              title="Design"
              icon="✏️"
              isActive={currentStage === 'design'}
              isComplete={isStageComplete('design', development)}
            >
              {/* Design Visual - smaller hero image */}
              <div className="mb-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-900 max-w-md">
                  {development.designUrl ? (
                    <div className="aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={development.designUrl}
                        alt="Proposed development visual"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                      <div className="text-center text-gray-400">
                        <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs">No design visual</p>
                      </div>
                    </div>
                  )}
                  {/* Design status badge overlay */}
                  <div className="absolute top-2 left-2">
                    <DesignStatusBadge status={development.designFinalOrDraft} />
                  </div>
                </div>
              </div>

              {/* Design Status Progression */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  {['Stock', 'Proposed', 'Draft', 'Final'].map((stage, index) => {
                    const currentIndex = (() => {
                      switch (development.designFinalOrDraft?.toLowerCase()) {
                        case 'final': return 3
                        case 'draft': return 2
                        case 'proposed': return 1
                        default: return 0
                      }
                    })()
                    const isComplete = index < currentIndex
                    const isCurrent = index === currentIndex
                    return (
                      <div key={stage} className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                          isComplete ? 'bg-green-500 text-white' :
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {isComplete ? '✓' : index + 1}
                        </div>
                        <span className={isCurrent || isComplete ? 'font-medium text-gray-900' : 'text-gray-400'}>{stage}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sign-off Status */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Internal Sign-off</span>
                  {development.designSignedOff === 'Yes' || development.designSignedOffDate ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Approved
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Pending</span>
                  )}
                </div>
                {development.designSignedOffDate && (
                  <p className="text-xs text-gray-500">
                    {formatDate(development.designSignedOffDate)}
                    {development.designSignedOffBy && ` by ${development.designSignedOffBy}`}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Client Sign-off</span>
                  <span className="text-sm text-gray-400">Not tracked</span>
                </div>
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

            {/* Marketing Stage Card */}
            <StageCard
              title="Marketing"
              icon="📢"
              isActive={currentStage === 'marketing'}
              isComplete={isStageComplete('marketing', development)}
            >
              {/* Media Owner */}
              {development.mediaOwner && (
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <InfoItem label="Media Owner" value={development.mediaOwner.name} />
                </div>
              )}

              {/* Tender Status */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tender Status</h4>
                {development.tenderOffers && development.tenderOffers.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Offers Received</span>
                      <span className="font-semibold text-gray-900">{development.tenderOffers.length}</span>
                    </div>
                    {/* Offer comparison - show top offers */}
                    <div className="mt-3 space-y-2">
                      {development.tenderOffers.slice(0, 3).map((offer, index) => (
                        <div
                          key={offer.id}
                          className={`flex items-center justify-between p-2 rounded ${
                            index === 0 ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-medium">{offer.offerFrom || 'Unknown bidder'}</span>
                          <span className={`text-sm font-semibold ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>
                            {offer.offerAmount
                              ? `£${Number(offer.offerAmount).toLocaleString()}`
                              : 'Amount TBC'}
                          </span>
                        </div>
                      ))}
                      {development.tenderOffers.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{development.tenderOffers.length - 3} more offers
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No tender offers yet</p>
                )}
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

          {/* Related Developments Card - other developments at this site */}
          {development.site?.developments && development.site.developments.length > 1 && (
            <section className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
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

  const priorityStyles = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-amber-50 border-amber-200 text-amber-800',
    low: 'bg-green-50 border-green-200 text-green-800',
  }

  return (
    <div className={`rounded-lg border p-4 ${priorityStyles[nextAction.priority]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{nextAction.icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider opacity-75">What&apos;s Next</p>
          <p className="font-medium">{nextAction.action}</p>
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
// Component: Planning Score Badge
// Shows 1-5 planning score with colour coding
// =============================================================================
function PlanningScoreBadge({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-gray-500">
        <span className="text-xs">Planning Score:</span>
        <span className="font-medium">—</span>
      </span>
    )
  }

  // Colour coding based on score
  const getScoreStyle = () => {
    if (score >= 4) return 'bg-green-100 text-green-800 border-green-200'
    if (score === 3) return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-red-100 text-red-800 border-red-200'
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

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border ${getScoreStyle()}`}
      title={`Planning Score: ${score}/5 - ${getProbabilityText()}`}
    >
      <span className="text-xs font-medium">Planning:</span>
      <span className="font-bold">{score}/5</span>
      <span className="text-xs opacity-75">({getProbabilityText()})</span>
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
    <div className="px-6 py-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{contact.role}</p>
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
          <p className="text-sm font-medium text-gray-900 mt-0.5">{contact.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            {contact.organisation && (
              <p className="text-xs text-gray-500">{contact.organisation}</p>
            )}
            {contact.siteRole && (
              <>
                {contact.organisation && <span className="text-xs text-gray-300">•</span>}
                <span className="text-xs text-blue-600">{contact.siteRole}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
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

// =============================================================================
// Component: Commercial Stage Card (Full Expandable)
// =============================================================================
function CommercialStageCard({
  development,
  isActive,
  isComplete,
}: {
  development: {
    // Deal Financials
    estimateOrActual?: string | null
    probability?: number | null
    feeProposal?: string | null
    leasePerAnnum?: number | string | null
    purchasePrice?: number | string | null
    rentalValue?: number | string | null
    leaseStartDate?: Date | null
    term?: number | null
    profitYear1?: number | string | null
    profitThereafter?: number | string | null
    // Consultancy Financials
    consultancyFinancials?: string | null
    rentalValueConsultancy?: number | string | null
    // Existing Lease
    currentRentPerAnnum?: number | string | null
    currentLeaseStartDate?: Date | null
    currentLeaseEndDate?: Date | null
    currentLeaseTerm?: number | null
    currentLeaseUrl?: string | null
    // Contract Terms
    offerAgreed?: Date | null
    contractIssued?: Date | null
    contractSigned?: Date | null
    contractUrl?: string | null
    matterNo?: string | null
    contractAnnualRent?: string | null
    contractTerm?: string | null
    leaseAssignable?: string | null
    rpiIncreases?: string | null
    rentCommencement?: string | null
    // AFL
    aflSigned?: Date | null
    aflExpiryDate?: Date | null
    aflSignedComment?: string | null
    aflExpiryComment?: string | null
    // Related entities
    contractingEntity?: { name: string } | null
    lawyer?: { name: string } | null
    lawyerContact?: {
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      email?: string | null
      organisation?: { name: string } | null
    } | null
    contractDocs?: Array<{
      id: number
      description?: string | null
      documentUrl?: string | null
      documentType?: string | null
    }>
  }
  isActive: boolean
  isComplete: boolean
}) {
  // Check if sections have data
  const hasConsultancyData = development.consultancyFinancials || development.rentalValueConsultancy
  const hasExistingLeaseData = development.currentRentPerAnnum || development.currentLeaseEndDate
  const hasAflData = development.aflSigned || development.aflExpiryDate
  const hasContractDocs = development.contractDocs && development.contractDocs.length > 0

  // Expiry warnings
  const existingLeaseExpiringSoon = isExpiringSoon(development.currentLeaseEndDate)
  const aflExpiringSoon = isExpiringSoon(development.aflExpiryDate)

  return (
    <section className={`
      bg-white rounded-lg shadow overflow-hidden
      ${isActive ? 'ring-2 ring-blue-500' : ''}
    `}>
      {/* Header */}
      <div className={`
        px-6 py-4 border-b border-gray-200 flex items-center justify-between
        ${isActive ? 'bg-blue-50' : ''}
      `}>
        <div className="flex items-center gap-3">
          <span className="text-xl">💼</span>
          <h3 className="text-lg font-semibold text-gray-900">Commercial</h3>
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

      <div className="p-6 space-y-6">
        {/* Summary Row - Always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-gray-100">
          <InfoItem label="Offer Agreed" value={development.offerAgreed ? formatDate(development.offerAgreed) : undefined} />
          <InfoItem label="Lease Per Annum" value={formatCurrency(Number(development.leasePerAnnum))} />
          <InfoItem label="Contract Signed" value={development.contractSigned ? formatDate(development.contractSigned) : undefined} />
          <InfoItem label="Probability" value={development.probability ? `${development.probability}%` : undefined} />
        </div>

        {/* Deal Financials Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Deal Financials</h4>

          {/* Estimate or Actual */}
          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wider">Estimate or Actual?</span>
            <div className="mt-1 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                development.estimateOrActual === 'Estimate'
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                Estimate
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                development.estimateOrActual === 'Actual'
                  ? 'bg-green-100 text-green-800 font-medium'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                Actual
              </span>
            </div>
          </div>

          {/* Three column layout: Cost / Revenue / Profit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cost Column */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Cost</h5>
              <InfoItem label="Rent Per Annum" value={formatCurrency(Number(development.leasePerAnnum))} />
              <InfoItem label="Purchase Price" value={formatCurrency(Number(development.purchasePrice))} />
            </div>

            {/* Revenue Column */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Revenue</h5>
              <InfoItem label="Rental Value" value={formatCurrency(Number(development.rentalValue))} />
              <InfoItem label="Start Date" value={development.leaseStartDate ? formatDate(development.leaseStartDate) : undefined} />
              <InfoItem label="Term (Years)" value={development.term ? `${development.term}` : undefined} />
              <InfoItem label="End Date" value={calculateEndDate(development.leaseStartDate, development.term)} />
            </div>

            {/* Profit Column */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-200 pb-1">Profit</h5>
              <InfoItem label="Profit Year 1" value={formatCurrency(Number(development.profitYear1))} />
              <InfoItem label="Profit Subsequent Years" value={formatCurrency(Number(development.profitThereafter))} />
              <InfoItem
                label="Total Profit"
                value={calculateTotalProfit(
                  Number(development.profitYear1),
                  Number(development.profitThereafter),
                  development.term
                )}
              />
            </div>
          </div>

          {/* Fee Proposal */}
          {development.feeProposal && (
            <div className="mt-4">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Fee Proposal</span>
              <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded p-3">{development.feeProposal}</p>
            </div>
          )}
        </div>

        {/* Consultancy Financials Section - Only show if data exists */}
        {hasConsultancyData && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Consultancy Financials</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InfoItem label="Rental Value (Consultancy)" value={formatCurrency(Number(development.rentalValueConsultancy))} />
            </div>
            {development.consultancyFinancials && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Description of deal structure and expected revenue</span>
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 rounded p-3">{development.consultancyFinancials}</p>
              </div>
            )}
          </div>
        )}

        {/* Existing Lease Section - Only show if data exists */}
        {hasExistingLeaseData && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Existing Lease (Existing Advertising Only)
              {existingLeaseExpiringSoon && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  Expiring Soon
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="Current Rent Per Annum" value={formatCurrency(Number(development.currentRentPerAnnum))} />
              <InfoItem label="Lease Start Date" value={development.currentLeaseStartDate ? formatDate(development.currentLeaseStartDate) : undefined} />
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">Lease End Date</dt>
                <dd className={`text-sm mt-0.5 ${existingLeaseExpiringSoon ? 'text-amber-600 font-semibold' : 'text-gray-900'}`}>
                  {development.currentLeaseEndDate ? formatDate(development.currentLeaseEndDate) : '—'}
                  {existingLeaseExpiringSoon && ' ⚠️'}
                </dd>
              </div>
              <InfoItem label="Term" value={development.currentLeaseTerm ? `${development.currentLeaseTerm} years` : undefined} />
            </div>
            {development.currentLeaseUrl && (
              <div className="mt-3">
                <a
                  href={development.currentLeaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Current Lease Document
                </a>
              </div>
            )}
          </div>
        )}

        {/* AFL Section - Only show if data exists */}
        {hasAflData && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              AFL (Agreement for Lease)
              {aflExpiringSoon && (
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                  Expiring Soon
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem label="AFL Signed" value={development.aflSigned ? formatDate(development.aflSigned) : undefined} />
              <div>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">AFL Expiry Date</dt>
                <dd className={`text-sm mt-0.5 ${aflExpiringSoon ? 'text-amber-600 font-semibold' : 'text-gray-900'}`}>
                  {development.aflExpiryDate ? formatDate(development.aflExpiryDate) : '—'}
                  {aflExpiringSoon && ' ⚠️'}
                </dd>
              </div>
            </div>
            {(development.aflSignedComment || development.aflExpiryComment) && (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {development.aflSignedComment && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">AFL Signed Comments</span>
                    <p className="mt-1 text-sm text-gray-900">{development.aflSignedComment}</p>
                  </div>
                )}
                {development.aflExpiryComment && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">AFL Expiry Comments</span>
                    <p className="mt-1 text-sm text-gray-900">{development.aflExpiryComment}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Contract Terms Section */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contract Terms</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoItem label="Contracting Entity" value={development.contractingEntity?.name} />
            <InfoItem label="Matter No (Clyde & Co. Ref)" value={development.matterNo} />
            <InfoItem label="Contract Issued" value={development.contractIssued ? formatDate(development.contractIssued) : undefined} />
            <InfoItem label="Contract Signed" value={development.contractSigned ? formatDate(development.contractSigned) : undefined} />
            <InfoItem label="Lease Assignable" value={development.leaseAssignable} />
            <InfoItem label="RPI Increases" value={development.rpiIncreases} />
            <InfoItem label="Rent Commencement" value={development.rentCommencement} />
            <InfoItem label="Contract Term" value={development.contractTerm} />
            <InfoItem label="Contract Annual Rent" value={development.contractAnnualRent} />
          </div>
          {development.contractUrl && (
            <div className="mt-3">
              <a
                href={development.contractUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Contract Document
              </a>
            </div>
          )}
        </div>

        {/* Contract Documents Section - Only show if documents exist */}
        {hasContractDocs && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Contract Documents</h4>
            <div className="space-y-2">
              {development.contractDocs?.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.description || 'Document'}</p>
                    {doc.documentType && (
                      <p className="text-xs text-gray-500">{doc.documentType}</p>
                    )}
                  </div>
                  {doc.documentUrl && (
                    <a
                      href={doc.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Section */}
        {(development.lawyer || development.lawyerContact) && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Legal</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {development.lawyer && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Law Firm</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{development.lawyer.name}</p>
                </div>
              )}
              {development.lawyerContact && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Lawyer Contact</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {`${development.lawyerContact.firstName || ''} ${development.lawyerContact.lastName || ''}`.trim() || '—'}
                  </p>
                  {development.lawyerContact.organisation && (
                    <p className="text-xs text-gray-500">{development.lawyerContact.organisation.name}</p>
                  )}
                  <div className="flex gap-3 mt-2">
                    {development.lawyerContact.phone && (
                      <a href={`tel:${development.lawyerContact.phone}`} className="text-xs text-blue-600 hover:text-blue-800">
                        📞 {development.lawyerContact.phone}
                      </a>
                    )}
                    {development.lawyerContact.email && (
                      <a href={`mailto:${development.lawyerContact.email}`} className="text-xs text-blue-600 hover:text-blue-800">
                        ✉️ {development.lawyerContact.email}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
