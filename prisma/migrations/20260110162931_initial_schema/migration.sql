-- CreateTable
CREATE TABLE "site_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "site_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "title_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "title_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "deal_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "colour" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "development_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "development_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "colour" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "application_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panel_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "panel_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panel_size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "widthMm" INTEGER,
    "heightMm" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "panel_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panel_orientation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "panel_orientation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "structure_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "structure_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "task_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracting_entity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "contracting_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_part" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "build_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asgf_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "asgf_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "county" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "county_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "town_city" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "town_city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organisation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "addressId" INTEGER,

    CONSTRAINT "organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "jobTitle" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "role" TEXT,
    "notes" TEXT,
    "decisionLevel" TEXT,
    "salutation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "organisationId" INTEGER,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_development_media_owner" (
    "contactId" INTEGER NOT NULL,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "contact_development_media_owner_pkey" PRIMARY KEY ("contactId","developmentId")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "line1" TEXT,
    "line2" TEXT,
    "postcode" TEXT,
    "country" TEXT DEFAULT 'United Kingdom',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "townCityId" INTEGER,
    "countyId" INTEGER,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT DEFAULT 'Advertisement',
    "clientRef" TEXT,
    "survey" TEXT,
    "wildstoneOwner" TEXT,
    "landRegistryDocUrl" TEXT,
    "landRegistryMapUrl" TEXT,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "statusId" INTEGER,
    "titleTypeId" INTEGER,
    "addressId" INTEGER,
    "siteOwnerId" INTEGER,
    "siteAgentId" INTEGER,
    "localAuthorityId" INTEGER,

    CONSTRAINT "site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development" (
    "id" SERIAL NOT NULL,
    "projectNo" INTEGER,
    "wildstoneDeveloper" TEXT,
    "currentRentPerAnnum" DECIMAL(12,2),
    "currentLeaseStartDate" TIMESTAMP(3),
    "currentLeaseEndDate" TIMESTAMP(3),
    "currentLeaseTerm" INTEGER,
    "currentLeaseUrl" TEXT,
    "rentalValue" DECIMAL(12,2),
    "rentalValueConsultancy" DECIMAL(12,2),
    "profitYear1" DECIMAL(12,2),
    "profitThereafter" DECIMAL(12,2),
    "purchasePrice" DECIMAL(12,2),
    "leasePerAnnum" DECIMAL(12,2),
    "feeProposal" TEXT,
    "estimateOrActual" TEXT,
    "consultancyFinancials" TEXT,
    "offerAgreed" TIMESTAMP(3),
    "leaseStartDate" TIMESTAMP(3),
    "term" INTEGER,
    "probability" INTEGER,
    "contractIssued" TIMESTAMP(3),
    "contractSigned" TIMESTAMP(3),
    "contractUrl" TEXT,
    "matterNo" TEXT,
    "contractAnnualRent" TEXT,
    "contractTerm" TEXT,
    "leaseAssignable" TEXT,
    "rpiIncreases" TEXT,
    "rentCommencement" TEXT,
    "aflSigned" TIMESTAMP(3),
    "aflExpiryDate" TIMESTAMP(3),
    "aflSignedComment" TEXT,
    "aflExpiryComment" TEXT,
    "designSignedOffDate" TIMESTAMP(3),
    "designSignedOffBy" TEXT,
    "designUrl" TEXT,
    "designFinalOrDraft" TEXT,
    "designSignedOff" TEXT,
    "wildstonePlanner" TEXT,
    "planningContractualSubmission" TEXT,
    "planningContractualSubmissionDate" TIMESTAMP(3),
    "planningScore" INTEGER,
    "preAppMeetingRequired" TEXT,
    "draftApplicationComplete" TIMESTAMP(3),
    "preAppSubmitted" TIMESTAMP(3),
    "preAppMeetingDate" TIMESTAMP(3),
    "preAppResponseReceived" TIMESTAMP(3),
    "preAppReference" TEXT,
    "preAppFeedback" TEXT,
    "preAppDocUrl" TEXT,
    "planningApplicationDescription" TEXT,
    "planningApplicationDetail" TEXT,
    "planningClientApproval" TEXT,
    "planningApplicationSubmitted" TIMESTAMP(3),
    "planningAppRegistration" TIMESTAMP(3),
    "planningAppRefLa" TEXT,
    "planningAppDeterminDate" TIMESTAMP(3),
    "planningAppTargetOverride" TIMESTAMP(3),
    "planningConditions" TEXT,
    "planningConditionsNumber" INTEGER,
    "planningAppStatusModified" TIMESTAMP(3),
    "planningAppealDeadlineOverride" TIMESTAMP(3),
    "planningAppealSubmitted" TIMESTAMP(3),
    "planningAppealStart" TIMESTAMP(3),
    "planningAppealRefLa" TEXT,
    "planningAppealProcedure" TEXT,
    "planningAppealRepresentations" TIMESTAMP(3),
    "planningAppealActualDetermination" TIMESTAMP(3),
    "planningAppealHearing" TIMESTAMP(3),
    "planningAppealFinalComments" TIMESTAMP(3),
    "advertApplicationDescription" TEXT,
    "advertApplicationDetail" TEXT,
    "advertApplicationSubmitted" TIMESTAMP(3),
    "advertApplicationRegistration" TIMESTAMP(3),
    "advertAppRefLa" TEXT,
    "advertAppDeterminationDate" TIMESTAMP(3),
    "advertConditions" TEXT,
    "advertConditionsNumber" INTEGER,
    "advertAppStatusModified" TIMESTAMP(3),
    "advertAppealDeadlineOverride" TIMESTAMP(3),
    "advertAppealSubmitted" TIMESTAMP(3),
    "advertAppealStart" TIMESTAMP(3),
    "advertAppealRefLa" TEXT,
    "advertAppealProcedure" TEXT,
    "advertAppealRepresentations" TIMESTAMP(3),
    "buildStartDate" TIMESTAMP(3),
    "buildCompletionDate" TIMESTAMP(3),
    "buildLiveDate" TIMESTAMP(3),
    "buildContractor" TEXT,
    "buildNotes" TEXT,
    "developmentStatusModified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,
    "dealTypeId" INTEGER,
    "statusId" INTEGER,
    "developmentTypeId" INTEGER,
    "planningAppStatusId" INTEGER,
    "advertAppStatusId" INTEGER,
    "contractingEntityId" INTEGER,
    "asgfStatusId" INTEGER,
    "siteId" INTEGER,
    "developerId" INTEGER,
    "mediaOwnerId" INTEGER,
    "mediaOwnerAgentId" INTEGER,
    "lawyerId" INTEGER,
    "caseOfficerId" INTEGER,
    "lawyerContactId" INTEGER,
    "nonWildstoneDeveloperId" INTEGER,

    CONSTRAINT "development_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_detail" (
    "id" SERIAL NOT NULL,
    "sides" INTEGER,
    "digital" TEXT,
    "illuminated" TEXT,
    "height" DECIMAL(8,2),
    "width" DECIMAL(8,2),
    "quantity" INTEGER,
    "developmentId" INTEGER NOT NULL,
    "panelTypeId" INTEGER,
    "panelSizeId" INTEGER,
    "orientationId" INTEGER,
    "structureTypeId" INTEGER,

    CONSTRAINT "development_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_photo" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "siteId" INTEGER NOT NULL,

    CONSTRAINT "site_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_doc" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "documentUrl" TEXT,
    "documentType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "planning_doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_condition" (
    "id" SERIAL NOT NULL,
    "conditionNo" INTEGER,
    "description" TEXT,
    "status" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "notes" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "planning_condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advert_doc" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "documentUrl" TEXT,
    "documentType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "advert_doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_document" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "documentUrl" TEXT,
    "documentType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "contract_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_offer" (
    "id" SERIAL NOT NULL,
    "offerAmount" DECIMAL(12,2),
    "offerDate" TIMESTAMP(3),
    "offerFrom" TEXT,
    "notes" TEXT,
    "status" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "tender_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_photo" (
    "id" SERIAL NOT NULL,
    "photoUrl" TEXT,
    "caption" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "tender_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asgf_report" (
    "id" SERIAL NOT NULL,
    "reportUrl" TEXT,
    "reportDate" TIMESTAMP(3),
    "notes" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "asgf_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_note" (
    "id" SERIAL NOT NULL,
    "noteText" TEXT,
    "noteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noteBy" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "development_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_task" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "complete" BOOLEAN NOT NULL DEFAULT false,
    "assignedTo" TEXT,
    "priority" TEXT,
    "developmentId" INTEGER NOT NULL,
    "taskTypeId" INTEGER,

    CONSTRAINT "development_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_project" (
    "id" SERIAL NOT NULL,
    "developmentId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "development_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "development_build_part" (
    "id" SERIAL NOT NULL,
    "notes" TEXT,
    "status" TEXT,
    "developmentId" INTEGER NOT NULL,
    "buildPartId" INTEGER NOT NULL,

    CONSTRAINT "development_build_part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_tender_response" (
    "id" SERIAL NOT NULL,
    "responseAmount" DECIMAL(12,2),
    "responseDate" TIMESTAMP(3),
    "contractor" TEXT,
    "notes" TEXT,
    "status" TEXT,
    "developmentBuildPartId" INTEGER NOT NULL,

    CONSTRAINT "build_tender_response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "build_snagging_item" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "reportedDate" TIMESTAMP(3),
    "resolvedDate" TIMESTAMP(3),
    "status" TEXT,
    "developmentBuildPartId" INTEGER NOT NULL,

    CONSTRAINT "build_snagging_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_owner_contact" (
    "id" SERIAL NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "siteId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "site_owner_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_agent_contact" (
    "id" SERIAL NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "siteId" INTEGER NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "site_agent_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_rent_review" (
    "id" SERIAL NOT NULL,
    "reviewDate" TIMESTAMP(3),
    "currentRent" DECIMAL(12,2),
    "proposedRent" DECIMAL(12,2),
    "agreedRent" DECIMAL(12,2),
    "notes" TEXT,
    "status" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "consultancy_rent_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_valuation" (
    "id" SERIAL NOT NULL,
    "valuationDate" TIMESTAMP(3),
    "valuationAmount" DECIMAL(12,2),
    "valuationType" TEXT,
    "notes" TEXT,
    "reportUrl" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "consultancy_valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_other" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "consultancyType" TEXT,
    "startDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "fee" DECIMAL(12,2),
    "notes" TEXT,
    "status" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "consultancy_other_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultancy_revenue" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12,2),
    "revenueDate" TIMESTAMP(3),
    "notes" TEXT,
    "developmentId" INTEGER NOT NULL,

    CONSTRAINT "consultancy_revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "roleId" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "canViewSites" BOOLEAN NOT NULL DEFAULT true,
    "canEditSites" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteSites" BOOLEAN NOT NULL DEFAULT false,
    "canViewDevelopments" BOOLEAN NOT NULL DEFAULT true,
    "canEditDevelopments" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteDevelopments" BOOLEAN NOT NULL DEFAULT false,
    "canViewContacts" BOOLEAN NOT NULL DEFAULT true,
    "canEditContacts" BOOLEAN NOT NULL DEFAULT false,
    "canViewReports" BOOLEAN NOT NULL DEFAULT true,
    "canExportData" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_log" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" INTEGER,
    "details" TEXT,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter_field" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "filterConfig" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "filter_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "site_status_name_key" ON "site_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "title_type_name_key" ON "title_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deal_type_name_key" ON "deal_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "development_status_name_key" ON "development_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "development_type_name_key" ON "development_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "application_status_name_key" ON "application_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "panel_type_name_key" ON "panel_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "panel_size_name_key" ON "panel_size"("name");

-- CreateIndex
CREATE UNIQUE INDEX "panel_orientation_name_key" ON "panel_orientation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "structure_type_name_key" ON "structure_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "task_type_name_key" ON "task_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "contracting_entity_name_key" ON "contracting_entity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "build_part_name_key" ON "build_part"("name");

-- CreateIndex
CREATE UNIQUE INDEX "asgf_status_name_key" ON "asgf_status"("name");

-- CreateIndex
CREATE UNIQUE INDEX "county_name_key" ON "county"("name");

-- CreateIndex
CREATE UNIQUE INDEX "town_city_name_key" ON "town_city"("name");

-- CreateIndex
CREATE UNIQUE INDEX "development_projectNo_key" ON "development"("projectNo");

-- CreateIndex
CREATE UNIQUE INDEX "development_project_developmentId_projectId_key" ON "development_project"("developmentId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "development_build_part_developmentId_buildPartId_key" ON "development_build_part"("developmentId", "buildPartId");

-- CreateIndex
CREATE UNIQUE INDEX "site_owner_contact_siteId_contactId_key" ON "site_owner_contact"("siteId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "site_agent_contact_siteId_contactId_key" ON "site_agent_contact"("siteId", "contactId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "setting_key_key" ON "setting"("key");

-- AddForeignKey
ALTER TABLE "organisation" ADD CONSTRAINT "organisation_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_development_media_owner" ADD CONSTRAINT "contact_development_media_owner_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_development_media_owner" ADD CONSTRAINT "contact_development_media_owner_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_townCityId_fkey" FOREIGN KEY ("townCityId") REFERENCES "town_city"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_countyId_fkey" FOREIGN KEY ("countyId") REFERENCES "county"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "site_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_titleTypeId_fkey" FOREIGN KEY ("titleTypeId") REFERENCES "title_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_siteOwnerId_fkey" FOREIGN KEY ("siteOwnerId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_siteAgentId_fkey" FOREIGN KEY ("siteAgentId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_localAuthorityId_fkey" FOREIGN KEY ("localAuthorityId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_dealTypeId_fkey" FOREIGN KEY ("dealTypeId") REFERENCES "deal_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "development_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_developmentTypeId_fkey" FOREIGN KEY ("developmentTypeId") REFERENCES "development_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_planningAppStatusId_fkey" FOREIGN KEY ("planningAppStatusId") REFERENCES "application_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_advertAppStatusId_fkey" FOREIGN KEY ("advertAppStatusId") REFERENCES "application_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_contractingEntityId_fkey" FOREIGN KEY ("contractingEntityId") REFERENCES "contracting_entity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_asgfStatusId_fkey" FOREIGN KEY ("asgfStatusId") REFERENCES "asgf_status"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_mediaOwnerId_fkey" FOREIGN KEY ("mediaOwnerId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_mediaOwnerAgentId_fkey" FOREIGN KEY ("mediaOwnerAgentId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_caseOfficerId_fkey" FOREIGN KEY ("caseOfficerId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_lawyerContactId_fkey" FOREIGN KEY ("lawyerContactId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development" ADD CONSTRAINT "development_nonWildstoneDeveloperId_fkey" FOREIGN KEY ("nonWildstoneDeveloperId") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_detail" ADD CONSTRAINT "development_detail_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_detail" ADD CONSTRAINT "development_detail_panelTypeId_fkey" FOREIGN KEY ("panelTypeId") REFERENCES "panel_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_detail" ADD CONSTRAINT "development_detail_panelSizeId_fkey" FOREIGN KEY ("panelSizeId") REFERENCES "panel_size"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_detail" ADD CONSTRAINT "development_detail_orientationId_fkey" FOREIGN KEY ("orientationId") REFERENCES "panel_orientation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_detail" ADD CONSTRAINT "development_detail_structureTypeId_fkey" FOREIGN KEY ("structureTypeId") REFERENCES "structure_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_photo" ADD CONSTRAINT "site_photo_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_doc" ADD CONSTRAINT "planning_doc_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advert_doc" ADD CONSTRAINT "advert_doc_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_document" ADD CONSTRAINT "contract_document_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_offer" ADD CONSTRAINT "tender_offer_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_photo" ADD CONSTRAINT "tender_photo_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asgf_report" ADD CONSTRAINT "asgf_report_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_note" ADD CONSTRAINT "development_note_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_task" ADD CONSTRAINT "development_task_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_task" ADD CONSTRAINT "development_task_taskTypeId_fkey" FOREIGN KEY ("taskTypeId") REFERENCES "task_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_project" ADD CONSTRAINT "development_project_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_project" ADD CONSTRAINT "development_project_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_build_part" ADD CONSTRAINT "development_build_part_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "development_build_part" ADD CONSTRAINT "development_build_part_buildPartId_fkey" FOREIGN KEY ("buildPartId") REFERENCES "build_part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_tender_response" ADD CONSTRAINT "build_tender_response_developmentBuildPartId_fkey" FOREIGN KEY ("developmentBuildPartId") REFERENCES "development_build_part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "build_snagging_item" ADD CONSTRAINT "build_snagging_item_developmentBuildPartId_fkey" FOREIGN KEY ("developmentBuildPartId") REFERENCES "development_build_part"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_owner_contact" ADD CONSTRAINT "site_owner_contact_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_owner_contact" ADD CONSTRAINT "site_owner_contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_agent_contact" ADD CONSTRAINT "site_agent_contact_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_agent_contact" ADD CONSTRAINT "site_agent_contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultancy_rent_review" ADD CONSTRAINT "consultancy_rent_review_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultancy_valuation" ADD CONSTRAINT "consultancy_valuation_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultancy_other" ADD CONSTRAINT "consultancy_other_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultancy_revenue" ADD CONSTRAINT "consultancy_revenue_developmentId_fkey" FOREIGN KEY ("developmentId") REFERENCES "development"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_log" ADD CONSTRAINT "user_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
