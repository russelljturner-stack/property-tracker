# Development Schema Audit

**Purpose:** Compare FileMaker Development layout fields → Prisma schema → Current UI
**Generated:** 2026-01-13
**Updated:** 2026-01-13 - Added FileMaker DDR field descriptions

Legend:
- [x] = Present and displayed in UI
- [S] = In Prisma schema but not yet displayed
- [ ] = Not in schema (missing)

---

## Tab 1: Development (Main Tab)

### Header Area

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Development Name | "development name autocompleted based on development detail selected" | site.name | [x] | Shown in header |
| Site Name | "name of site - this is set automatically via a script to show the first line of the address" | site.name | [x] | Same as above |
| Project No | "existing wildstone project number" | projectNo | [x] | Shown in header row 2 |

### Left Column

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Name | "name of site - set automatically to show first line of address" | site.name | [x] | Header |
| Site Owner/Client | "foreign key to show the related site owner" | site.siteOwner | [x] | Header row 2 |
| Owners Agent | "foreign key to show the site agent" | site.siteAgent | [x] | Header row 2 |
| Photo | - | site.photos | [x] | Site context panel |
| Map | - | site.address (lat/lng) | [x] | Google Maps embed |
| Address | - | site.address | [x] | Header row 2 |
| Related Projects | - | projects (DevelopmentProject) | [-] | DECISION: Use for list filtering, not detail display |

### Middle Column

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Date Created | "auto enters the date the development record was created" | createdAt | [S] | In schema, not shown |
| Development Type | "foreign key to show related development type" | developmentType | [x] | Header row 2 |
| Deal Type | "foreign key to show the deal type e.g acquisition / consultancy" | dealType | [x] | Header row 2 |
| Development Status | "foreign key to show the status of the development" | status | [x] | Status badge in header |
| Development Status Modified | "date the development status was updated - autocalculated" | - | [ ] | Not in schema |
| Advertisement Planning Status | - | advertAppStatus | [S] | In schema, not on main view |

### Panel Details (Repeating - DevelopmentDetail)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Panel Type | "foreign key to show proposed panel type e.g. digital, backlit" | details.panelType | [x] | Panel Configuration card |
| Panel Size | "foreign key to show proposed panel size e.g. 48 sheet or P10" | details.panelSize | [x] | Panel Configuration card |
| Orientation | "foreign key to show proposed panel orientation" | details.orientation | [x] | Panel Configuration card |
| Structure | "foreign key to show type of structure, e.g. Tower / Freestanding" | details.structureType | [x] | Panel Configuration card |
| Double Sided | "proposed development - is it single or double sided" | details.sides | [x] | Panel Configuration card |
| No. of Structures | "proposed development - single site or multi e.g. Two Towers" | details.quantity | [x] | Panel Configuration card |
| Total Panels | "total number of panels e.g. if there are multiple sides per screen and multiple structures it would be multiplied" | (calculated) | [ ] | Could calculate from quantity × sides |
| Digital | - | details.digital | [x] | Panel Configuration card |
| Illuminated | - | details.illuminated | [x] | Panel Configuration card |
| Height | "proposed panel height in metres" | details.height | [x] | Panel Configuration card |
| Width | "proposed panel width in metres" | details.width | [x] | Panel Configuration card |
| Proposed/Alternative | "radio button to show whether an option is proposed option or an alternative option" | - | [ ] | Could add to DevelopmentDetail |
| Panel Comments | "other comments relating to proposed development" | details.notes | [S] | In schema, not displayed |

### Right Column

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Developer Company | "foreign key to show the company who developed the development" | developer | [S] | In schema, not displayed |
| Wildstone Owner (internal) | "wildstone developer who is leading the development or is the person who has input the development" | internalDeveloper | [x] | Header row 2 ("Developer") |
| Developer | "foreign key to show the lead contact at the development company (only where wildstone aren't the developer)" | externalDeveloper | [S] | Contact relation, not displayed |
| Media Owner | "foreign key to show the company name of the media owner operating the site" | mediaOwner | [x] | Commercial card (collapsed) |
| Media Owner Contact | "foreign key to show the lead contact at the media owner" | - | [ ] | Not in schema |
| Media Owner Agent | "foreign key to show the company name of agent working for the media owner" | mediaOwnerAgent | [S] | In schema, not displayed |
| Media Owner Agent Contact | "foreign key to show the related contact at the media owners agent" | - | [ ] | Not in schema |
| Notes (development description) | - | - | [ ] | No general notes field on Development |

---

## Tab 2: Survey (4 Sub-tabs)

### Survey - Left Side (Site Data)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Date Identified | "date site added - auto entered when site is created / uploaded" | site.dateAdded | [S] | Site table, not shown |
| Site Status | "foreign key to show the status of the site i.e. dead or live" | site.status | [S] | Site table, not on dev page |
| Local Authority | "foreign key to show which local planning authority the site is located in" | site.localAuthority | [x] | Header row 2 |
| Title | "foreign key to show the ownership title type of the site e.g. freehold / leasehold" | site.titleType | [S] | In schema, not displayed |
| Land Registry Doc | "container field showing land registry pdf doc" | site.landRegistryDocUrl | [S] | In schema, not displayed |
| Land Registry Map | "container field showing land registry pdf map" | site.landRegistryMapUrl | [S] | In schema, not displayed |
| Street View link | - | (generated from lat/lng) | [ ] | Could add |
| Open Map in Browser | - | (generated from lat/lng) | [ ] | Could add |
| Wildstone Owner | "shows which wildstone contact is assigned to the site as the key contact - automatically enters the name of person who created the site but can be edited" | site.wildstoneSiteOwner | [S] | In schema, not displayed |
| Client Reference | "clients reference for the site (if provided by client)" | site.clientRef | [S] | In schema, not displayed |

### Survey - Site Photos (Sub-tab 2.1)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Site Photos | - | site.photos | [x] | Site context panel (1 photo) |
| Photo Description | - | site.photos.caption | [S] | In schema, not shown |

### Survey - Site Survey Notes (Sub-tab 2.2)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Survey Notes | "general notes regarding the site which might be useful when designing the proposed site" | site.survey | [S] | In Site table, not on dev page |

### Survey - ASGF (Sub-tab 2.3)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| ASGF Required | - | - | [ ] | Missing - need boolean field |
| ASGF Status | - | asgfStatus | [S] | In schema, not displayed |
| ASGF Reports | - | asgfReports | [S] | Table exists, not displayed |

### Survey - Other Developments at Site (Sub-tab 2.4)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Other developments at site | - | site.developments | [x] | Site context panel shows count |

---

## Tab 3: Commercial Agreement (5 Sub-tabs)

### Commercial - Acquisition/Lease Financials (Sub-tab 3.1)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Estimate or Actual? | "shows whether deal figures are estimate or actual figures" | estimateOrActual | [S] | In schema, not displayed |
| Probability % | "percentage likelihood of development built" | probability | [S] | In schema, not displayed |
| Fee Proposal | "description of fee proposal" | feeProposal | [S] | In schema, not displayed |
| Lease Per Annum | "lease cost of site per year" | leasePerAnnum | [x] | Commercial card |
| Purchase Price | "purchase price of site if acquisition" | purchasePrice | [S] | In schema, not displayed |
| Rental Value | "onward rental value of the proposed development (lease / acquisition)" | rentalValue | [S] | In schema, not displayed |
| Rental Value (Consultancy) | "onward rental value of the proposed development (consultancy)" | rentalValueConsultancy | [S] | In schema, not displayed |
| Offer Agreed Date | "date offer was agreed" | offerAgreed | [x] | Commercial card |
| Start Date | "start date of lease" | leaseStartDate | [x] | Commercial card |
| Term (Yrs) | "term of contract in years" | term | [x] | Commercial card |
| End Date | "finish year of term" | (calculated) | [ ] | Could calc from start + term |
| Profit Year 1 | "profit for the first year" | profitYear1 | [S] | In schema, not displayed |
| Profit Thereafter | "profit of development for all other years after year 1" | profitThereafter | [S] | In schema, not displayed |
| Calculated Profit Year 1 | "calculated profit year 1" | - | [ ] | FileMaker calculated field |
| Calculated Profit Thereafter | "calculated profit thereafter" | - | [ ] | FileMaker calculated field |
| Total Profit | "calculated total profit" | (calculated) | [ ] | Would need calculation |

### Commercial - Consultancy Financials (Sub-tab 3.2)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Description of deal structure | "description of deal or consultancy" | consultancyFinancials | [S] | In schema, not displayed |

### Commercial - Existing Lease (Sub-tab 3.3)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Current Rent Per Annum | "current rent value per annum paid by existing media operator" | currentRentPerAnnum | [S] | In schema, not displayed |
| Current Rent Per Month | "current rent value per month paid by existing media operator" | (calculated) | [ ] | FileMaker calculated field |
| Lease Start Date | "current lease start date" | currentLeaseStartDate | [S] | In schema, not displayed |
| Lease End Date | "current lease end date" | currentLeaseEndDate | [S] | In schema, not displayed |
| Lease Term | "current lease term" | currentLeaseTerm | [S] | In schema, not displayed |
| Current Lease document | "current lease container for pdf doc" | currentLeaseUrl | [S] | In schema, not displayed |

### Commercial - Contract Terms (Sub-tab 3.4)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Clyde & Co. Reference | "Clyde and Co Matter No." | matterNo | [S] | In schema (matterNo), not displayed |
| Contracting Entity | "foreign key to show which company the deal sits with e.g. wildstone property, wildstone consultancy llp" | contractingEntity | [x] | Commercial card |
| Contract Term | "contract term description for contracts" | contractTerm | [S] | In schema, not displayed |
| Contract Annual Rent | "annual rent description for contracts" | contractAnnualRent | [S] | In schema, not displayed |
| Is Lease Assignable? | "lease is assignable Yes / No" | leaseAssignable | [S] | In schema, not displayed |
| Lease Assignable Comment | "terms of whether lease is assignable" | leaseAssignableComment | [S] | In schema, not displayed |
| RPI Increases | "terms of rpi increases" | rpiIncreases | [S] | In schema, not displayed |
| Rent Commencement | "terms for rent commencement" | rentCommencement | [S] | In schema, not displayed |
| Date AFL Signed | "date afl signed" | aflSigned | [S] | In schema, not displayed |
| AFL Signed Comments | "date afl signed comments" | aflSignedComment | [S] | In schema, not displayed |
| AFL Expiry Date | "afl expiry date" | aflExpiryDate | [S] | In schema, not displayed |
| AFL Expiry Comment | "afl expiry date" | aflExpiryComment | [S] | In schema, not displayed |
| Planning Consent Deadline | "deadline for gaining planning consent" | planningContractualConsentDate | [S] | In schema |
| Planning Consent Comment | "deadline for gaining planning consent term" | planningContractualConsentComment | [S] | In schema |
| Planning Submission Comment | "comments re contractual date the application must be submitted by" | planningContractualSubmissionComment | [S] | In schema |
| Client Approval Term | "terms of getting pre-planning approval from client" | planningClientApprovalTerm | [S] | In schema |
| Scope of Works Approval Date | "date scope of works to be approved by" | scopeOfWorksApprovalDate | [S] | In schema |
| Scope of Works Approval Term | "terms in contract re scope of works approval" | scopeOfWorksApprovalTerm | [S] | In schema |
| Build Contractual Stop Date | "contractual date that build must be completed as stipulated by siteowner" | buildContractualStopDate | [S] | In schema |
| Build Deadline Term | "term that describes the contractual date that build must be completed as stipulated by siteowner" | buildContractualStopDateTerm | [S] | In schema |
| Contract Expires Date | "date the contract expires" | contractExpiresDate | [S] | In schema |
| Contract Expires Term | "term describing when the contract expires" | contractExpiresTerm | [S] | In schema |
| Completion Date | "completion date" | completionDate | [S] | In schema |
| Completion Term | "completion date term" | completionTerm | [S] | In schema |
| Contract Status | "contract status" | contractStatus | [S] | In schema |
| Contract Status Updated | "contract status last updated" | contractStatusUpdated | [S] | In schema |
| Contract Issued | "date contract issued to siteowner" | contractIssued | [S] | In schema, not displayed |
| Contract Signed | "date contract signed" | contractSigned | [x] | Commercial card |
| Contract URL | "pdf container for contract" | contractUrl | [S] | In schema, not displayed |
| Lawyer (Firm) | "Foreign Key to show lawyers dealing with contract" | lawyer | [x] | Commercial card |
| Lawyer Contact | "foreign key contact id of lawyer handling contract negotiations" | lawyerContact | [S] | In schema, not displayed |

### Commercial - Contract Documents (Sub-tab 3.5)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Contract Documents | - | contractDocs | [S] | Table exists, not displayed |

---

## Tab 4: Design

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Design Document/Image | "container to store the design document" | designUrl | [x] | Design card |
| Design Signed Off? | "is design signed off" | designSignedOff | [x] | Design card |
| Design Status (Draft/Final) | "is the design final or draft" | designFinalOrDraft | [x] | Design card |
| Sign-off Date | "date design was signed off" | designSignedOffDate | [x] | Design card |
| Signed Off By | "who signed off the design" | designSignedOffBy | [x] | Design card |
| Design Status | - | - | [ ] | Missing "Proposed" status per Tab review |
| Client Sign-off Date | - | - | [ ] | Missing - dual sign-off recommended |
| Client Sign-off By | - | - | [ ] | Missing - dual sign-off recommended |

---

## Tab 5: Planning (4 Sub-tabs)

### Planning - Common Fields (Right Sidebar)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Lead Wildstone Planner | - | internalPlanner | [x] | Planning card |
| Local Authority | "foreign key to show which local planning authority the site is located in" | site.localAuthority | [x] | Via site relation |
| Planning Score (1-5) | - | planningScore | [x] | Planning card |
| Advertisement Planning Officer | "foreign key to show which planning officer at LPA is dealing with advert application" | advertPlanningOfficer | [S] | In schema, not displayed |
| Case Officer | "foreign key to show which case officer at LPA is dealing with appeal" | caseOfficer | [S] | In schema, not displayed |
| Planning Appeal Inspector | "foreign key to show which planning inspector at inspectorate is dealing with appeal" | planningAppealInspector | [S] | In schema, not displayed |

### Planning - Pre-Planning (Sub-tab 5.1)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Draft Application Completed | - | draftApplicationComplete | [S] | In schema, not displayed |
| Client Approval | - | planningClientApproval | [S] | In schema, not displayed |
| Pre-App Required? | - | preAppMeetingRequired | [S] | In schema, not displayed |
| Pre-App Submitted | - | preAppSubmitted | [S] | In schema, not displayed |
| Pre-App Meeting Date | - | preAppMeetingDate | [S] | In schema, not displayed |
| Pre-App Response Received | - | preAppResponseReceived | [S] | In schema, not displayed |
| Pre-App Reference | - | preAppReference | [S] | In schema, not displayed |
| Pre-App Feedback | - | preAppFeedback | [S] | In schema, not displayed |
| Pre-App Document | - | preAppDocUrl | [S] | In schema, not displayed |

### Planning - Advertisement Application (Sub-tab 5.2)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Status | - | advertAppStatus | [x] | Planning card |
| Application Description | - | advertApplicationDescription | [S] | In schema, not displayed |
| Application Detail | - | advertApplicationDetail | [S] | In schema, not displayed |
| Date Submitted | - | advertApplicationSubmitted | [S] | In schema, not displayed |
| Date Validated | - | advertApplicationRegistration | [S] | In schema, not displayed |
| LA Reference | - | advertAppRefLa | [x] | Planning card |
| Target Determination Date | - | advertAppDeterminationDate | [S] | In schema, not displayed |
| Conditions | - | advertConditions | [S] | In schema, not displayed |
| Conditions Number | - | advertConditionsNumber | [S] | In schema, not displayed |

### Planning - Advertisement Appeal (Sub-tab 5.2 continued)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Appeal Deadline Override | - | advertAppealDeadlineOverride | [S] | In schema |
| Appeal Submitted | - | advertAppealSubmitted | [S] | In schema |
| Appeal Start | - | advertAppealStart | [S] | In schema |
| Appeal Reference | - | advertAppealRefLa | [S] | In schema |
| Appeal Procedure | - | advertAppealProcedure | [S] | In schema |
| Appeal Representations | "advert appeal further representations" | advertAppealRepresentations | [S] | In schema |
| Appeal Representations NA | "deadline for advert appeal representations submission date not applicable" | - | [ ] | Not in schema |
| Appeal Final Comments | "advert appeal final comments" | advertAppealFinalComments | [S] | In schema |
| Appeal Final Comments NA | "advert appeal final comments not applicable" | - | [ ] | Not in schema |

### Planning - Planning Application (Sub-tab 5.3)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Status | - | planningAppStatus | [x] | Planning card |
| Application Description | - | planningApplicationDescription | [S] | In schema |
| Application Detail | - | planningApplicationDetail | [S] | In schema |
| Date Submitted | - | planningApplicationSubmitted | [S] | In schema |
| Date Registered | - | planningAppRegistration | [S] | In schema |
| LA Reference | - | planningAppRefLa | [x] | Planning card |
| Target Determination Date | - | planningAppDeterminDate | [x] | Planning card |
| Target Override | - | planningAppTargetOverride | [S] | In schema |
| Conditions | - | planningConditions | [S] | In schema |
| Conditions Number | - | planningConditionsNumber | [S] | In schema |

### Planning - Planning Appeal (Sub-tab 5.3 continued)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Appeal Deadline Override | - | planningAppealDeadlineOverride | [S] | In schema |
| Appeal Submitted | - | planningAppealSubmitted | [S] | In schema |
| Appeal Start | - | planningAppealStart | [S] | In schema |
| Appeal Reference | - | planningAppealRefLa | [S] | In schema |
| Appeal Procedure | - | planningAppealProcedure | [S] | In schema |
| Appeal Representations Date | - | planningAppealRepresentations | [S] | In schema |
| Appeal Hearing Date | - | planningAppealHearing | [S] | In schema |
| Appeal Final Comments | - | planningAppealFinalComments | [S] | In schema |
| Appeal Actual Determination | - | planningAppealActualDetermination | [S] | In schema |

### Planning - Pre-Commencement Conditions (Sub-tab 5.4)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Condition Number | "condition number" | planningConditions.conditionNumber | [S] | Table exists (PlanningCondition) |
| Condition Description | "planning teams description of condition" | planningConditions.description | [S] | In schema |
| Condition Type | "condition type - whether linked to advertisement or planning" | planningConditions.conditionType | [S] | In schema |
| Application Submitted | "date condition application submitted to local authority" | planningConditions.applicationSubmitted | [S] | In schema |
| Application Registered | "condition planning application date registered with local authority" | planningConditions.applicationRegistered | [S] | In schema |
| LA Reference | "local planning authority - condition planning application reference" | planningConditions.laReference | [S] | In schema |
| Consultation End | "date consultation for condition planning application ends autocalculated 21 days from application submitted date" | (calculated) | [ ] | FileMaker calculated |
| Target Date | "target date for condition planning application determination" | planningConditions.targetDate | [S] | In schema |
| Target Date Override | "target date for condition planning application determination override" | planningConditions.targetDateOverride | [S] | In schema |
| Determination Date | "date condition planning application was determined" | planningConditions.determinationDate | [S] | In schema |
| Condition Officer | "foreign key to show which planning officer at LPA is dealing with condition application" | planningConditions.officer | [S] | In schema |

### Planning Documents

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Planning Documents | - | planningDocs | [S] | Table exists, not displayed |
| PDF Container | "container for pdf document" | planningDocs.fileUrl | [S] | In schema |
| Description | "description of planning document" | planningDocs.description | [S] | In schema |
| Related Application | "which planning application this is related to i.e.advert application or planning appeal" | planningDocs.relatedApplication | [S] | In schema |
| Filename | "filename of pdf" | planningDocs.filename | [S] | In schema |

---

## Tab 6: Marketing (3 Sub-tabs)

### Marketing - Tender Dates & Offers (Sub-tab 6.1)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Tender Strategy | "tender strategy type - formal or informal" | - | [ ] | **MISSING from schema** |
| Tender Status | "tender status" | - | [ ] | **MISSING from schema** |
| Materials Required | "type of collateral required - Video / Visuals / Event (can select multiple)" | - | [ ] | **MISSING from schema** |
| Materials Comment | "comments re tender materials required" | - | [ ] | **MISSING from schema** |
| Materials Prepared Date | "date tender materials were completed" | - | [ ] | **MISSING from schema** |
| Tender Release Date | "date tender was released" | - | [ ] | **MISSING from schema** |
| Tender Deadline | "deadline for tender responses" | - | [ ] | **MISSING from schema** |
| Evaluation Complete | "date when tender evaluation was completed" | - | [ ] | **MISSING from schema** |
| Tender Awarded | "date tender was awarded" | - | [ ] | **MISSING from schema** |
| Solicitors Instructed | "date solicitors were instructed to create contract with tender winner" | - | [ ] | **MISSING from schema** |
| Contract Issued | "date contract was issued to media owner" | - | [ ] | **MISSING from schema** |
| Contract Complete | "date contract was completed" | - | [ ] | **MISSING from schema** |
| Marketing Video | "container to show video of site that was included with tender" | - | [ ] | **MISSING from schema** |
| Active Tender PDF | "active planning pdf" | - | [ ] | **MISSING from schema** |

### Marketing - Tender Offers (repeating)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Media Owner/Brand | - | tenderOffers.offerFrom | [S] | In schema (basic) |
| Main Contact | - | - | [ ] | **MISSING - need contact relation** |
| Response Received? | - | - | [ ] | **MISSING from schema** |
| Response document | - | - | [ ] | **MISSING from schema** |
| Offer amount | - | tenderOffers.offerAmount | [S] | In schema |
| Premium | - | - | [ ] | **MISSING from schema** |
| Offer Accepted? | - | tenderOffers.status | [S] | Could use status field |
| Offer Date | - | tenderOffers.offerDate | [S] | In schema |
| Notes | - | tenderOffers.notes | [S] | In schema |

### Marketing - Tender Photos (Sub-tab 6.2)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Tender Photos | - | tenderPhotos | [S] | Table exists |
| Tender Documents | - | - | [ ] | **MISSING - no TenderDoc table** |

### Marketing - Tender Video (Sub-tab 6.3)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Tender Video | "container to show video of site that was included with tender" | - | [ ] | **MISSING from schema** |

---

## Tab 7: Build (2 Sub-tabs)

### Build - Header

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Contractual Stop Date | "contractual date that build must be completed as stipulated by siteowner" | buildContractualStopDate | [x] | Build card |

### Build - Build Elements (Sub-tab 7.1)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Build Part | - | buildParts.buildPart | [S] | Junction table exists |
| Tender Required | - | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Tender Released | - | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Tender Deadline | - | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Contractor Appointed | - | buildContractor | [x] | On Development, not BuildPart |
| Selected Build Part Tender | "used to filter tender responses" | - | [ ] | UI filter field, not needed |
| Selected Build Part Snagging | "used to filter snagging list" | - | [ ] | UI filter field, not needed |

### Build - Tender Responses

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Contractor | - | buildTenderResponses.contractor | [S] | Table exists |
| Main Contact | - | - | [ ] | **MISSING - need contact relation** |
| Cost | - | buildTenderResponses.responseAmount | [S] | In schema |
| Response document | - | - | [ ] | **MISSING from schema** |
| Is accepted bid? | - | buildTenderResponses.status | [S] | In schema |

### Build - Snagging List (Sub-tab 7.2)

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Build Part | - | buildSnaggingItem.developmentBuildPart | [S] | Via relation |
| Date Added | - | buildSnaggingItem.reportedDate | [S] | In schema |
| Estimated Completion | - | - | [ ] | **MISSING from BuildSnaggingItem** |
| Actual Completion | - | buildSnaggingItem.resolvedDate | [S] | In schema |
| Description | - | buildSnaggingItem.description | [S] | In schema |

### Build - Additional Fields

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Build Start Date | - | buildStartDate | [x] | Build card |
| Build Completion Date | - | buildCompletionDate | [x] | Build card |
| Build Live Date | - | buildLiveDate | [x] | Build card |
| Build Notes | - | buildNotes | [S] | In schema, not displayed |

---

## Tab 8: Consultancy (6 Sub-tabs)

**DEFERRED** - Per ADR-014, Consultancy is not in scope for core product.

Tables exist in schema but will not be displayed:
- ConsultancyRentReview
- ConsultancyValuation
- ConsultancyOther
- ConsultancyRevenue

---

## Tab 9: Tasks & Notes (2 Sub-tabs)

### Tasks

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Task Type | - | tasks.taskType | [x] | Tasks sidebar |
| Description | - | tasks.description | [x] | Tasks sidebar |
| Created By | - | tasks.assignedById | [S] | In schema, not displayed |
| Department | - | - | [ ] | **MISSING from schema** |
| Created Date | - | tasks.createdAt | [x] | Tasks sidebar |
| Due Date | - | tasks.dueDate | [x] | Tasks sidebar |
| Assigned To | - | tasks.assignedTo | [x] | Tasks sidebar |
| Status | - | tasks.complete | [x] | Tasks sidebar |
| Completed Date | - | tasks.completedDate | [S] | In schema |
| Priority | - | tasks.priority | [S] | In schema |
| Needs Review | - | tasks.needsReview | [S] | In schema |
| Filter by Status | "filter field for tasks portal" | - | [ ] | UI filter field, not needed |

### Notes

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| Note Text | - | notes.noteText | [x] | Activity sidebar |
| Related File | - | - | [ ] | **MISSING from DevelopmentNote** |
| Added Date | - | notes.noteDate | [x] | Activity sidebar |
| Made By | - | notes.noteBy | [x] | Activity sidebar |
| Department | - | - | [ ] | **MISSING from schema** |

---

## Tab 10: Contacts (2 Sub-tabs)

### Site Owner Contacts

| FileMaker Field | DDR Description | Prisma Field | In UI | Notes |
|-----------------|-----------------|--------------|-------|-------|
| First Name | "first name" | contact.firstName | [x] | Contacts sidebar |
| Last Name | "last name" | contact.lastName | [x] | Contacts sidebar |
| Combined Name | "auto calculated combined name of fname and lname" | (calculated) | [x] | Shown as full name |
| Company | "foreign key of organisation they work for" | contact.organisation.name | [x] | Contacts sidebar |
| Job Title | "job title" | contact.jobTitle | [S] | In schema |
| Mobile | "mobile number" | contact.mobile | [x] | Contacts sidebar |
| Telephone | "telephone number" | contact.phone | [x] | Contacts sidebar |
| Extension | "extension number of landline" | - | [ ] | **MISSING from Contact** |
| Email | "email address" | contact.email | [x] | Contacts sidebar |
| Site Role | - | contact.role | [S] | Generic role field |
| Decision Level | - | contact.decisionLevel | [S] | In schema |
| Contact Left? | "radio button to show if contact has now left the organisation" | - | [ ] | **MISSING from Contact** |
| Date Left | "date contact has left organisation" | - | [ ] | **MISSING from Contact** |
| Notes | "any general notes about the contact" | contact.notes | [S] | In schema |

### Site Owner Agent Contacts

Same as above - uses same Contact table.

---

## Summary: Missing from Schema

Fields that need to be added to Prisma schema:

### Development Table
1. `developmentNotes` - General notes/description field

### DevelopmentNote Table
1. `fileUrl` - For note attachments
2. `department` - Department categorisation

### DevelopmentTask Table
1. `department` - Department categorisation

### Contact Table
1. `extension` - Phone extension
2. `hasLeft` - Boolean for contact departure
3. `leftDate` - Date contact left

### Marketing/Tender Fields (Development or new table)
1. `tenderStrategy` - Text
2. `tenderStatus` - Lookup or enum
3. `tenderMaterialsVideo` - Boolean
4. `tenderMaterialsVisuals` - Boolean
5. `tenderMaterialsEvent` - Boolean
6. `tenderMaterialsComment` - Text
7. `tenderMaterialsPreparedDate` - DateTime
8. `tenderReleaseDate` - DateTime
9. `tenderResponseDeadline` - DateTime
10. `tenderEvaluationComplete` - DateTime
11. `tenderAwardedDate` - DateTime
12. `tenderSolicitorsInstructed` - DateTime
13. `tenderContractIssued` - DateTime
14. `tenderContractComplete` - DateTime

### TenderOffer Table Enhancements
1. `contactId` - FK to Contact
2. `responseReceived` - Boolean
3. `responseDocUrl` - String
4. `premium` - Decimal

### TenderDocument Table (NEW)
Create a new table for tender documents

### TenderVideo Table or Field
Add video support for marketing

### DevelopmentBuildPart Table Enhancements
1. `tenderRequired` - Boolean
2. `tenderReleasedDate` - DateTime
3. `tenderDeadlineDate` - DateTime

### BuildTenderResponse Table Enhancements
1. `contactId` - FK to Contact
2. `responseDocUrl` - String

### BuildSnaggingItem Table Enhancements
1. `estimatedCompletionDate` - DateTime

### Design Fields (Development)
1. `designStatus` - Add "Proposed" option (Proposed/Draft/Final)
2. `clientSignOffDate` - DateTime
3. `clientSignOffBy` - String

### ASGF
1. `asgfRequired` - Boolean on Development

---

## Summary: In Schema But Not Displayed

Fields that exist in Prisma but aren't shown in the UI yet:

### High Priority (commonly needed)
- `createdAt` - When development was created
- `probability` - Deal probability %
- `planningApplicationSubmitted` - Key planning date
- `advertApplicationSubmitted` - Key planning date
- `tasks.priority` - Task priority level
- `tasks.completedDate` - When task was done
- `contact.decisionLevel` - Key for knowing who to talk to
- `site.survey` - Survey notes

### Medium Priority (useful but not critical)
- `estimateOrActual` - Financial estimate indicator
- `feeProposal` - Fee proposal text
- `profitYear1` / `profitThereafter` - Profit calculations
- `currentRentPerAnnum` / `currentLeaseStartDate` / `currentLeaseEndDate` - Existing lease
- `aflSigned` / `aflExpiryDate` - AFL tracking
- All pre-app fields
- All appeal fields
- `buildNotes`

### Lower Priority (reference data)
- `developer` (organisation)
- `mediaOwnerAgent` (organisation)
- `externalDeveloper` (contact)
- Contract document URLs
- Planning document list
- ASGF reports

---

## UI Coverage by Tab

| Tab | Fields in FileMaker | In Schema | Displayed | Coverage |
|-----|---------------------|-----------|-----------|----------|
| Development | ~25 | 22 | 18 | 72% |
| Survey | ~15 | 12 | 5 | 33% |
| Commercial | ~40+ | 35 | 8 | 20% |
| Design | ~5 | 5 | 5 | 100% |
| Planning | ~50+ | 45 | 8 | 16% |
| Marketing | ~20 | 4 | 0 | 0% |
| Build | ~15 | 12 | 4 | 27% |
| Consultancy | ~30 | 30 | 0 | DEFERRED |
| Tasks & Notes | ~15 | 12 | 10 | 67% |
| Contacts | ~15 | 10 | 6 | 40% |

**Overall: Marketing tab has the biggest schema gaps.**

---

## Recommended Priority for Schema Updates

### Priority 1: Marketing Tab (Biggest Gap)
The entire tender workflow is missing. Add:
- Tender workflow fields to Development
- Enhance TenderOffer table
- Add TenderDocument table

### Priority 2: Contact Tracking
Add to Contact table:
- `hasLeft` / `leftDate` for tracking departures
- Consider adding `extension`

### Priority 3: Design Enhancements
Add dual sign-off (internal + client) and "Proposed" status

### Priority 4: Department Tracking
Add `department` to Tasks and Notes if needed

### Priority 5: Build Tender Fields
Enhance DevelopmentBuildPart for tender workflow

---

## FileMaker UI/Helper Fields (Not Needed in Web App)

These fields existed in FileMaker for UI functionality or filtering that will be handled differently in the web app:

| Field | DDR Description | Why Not Needed |
|-------|-----------------|----------------|
| autoenterdeveloper | "auto enters 'developer' to provide a filtered list" | Web app uses dynamic filtering |
| autoenterlocalplanningauthority | "auto enters 'local planning authority' to provide a filtered list" | Web app uses dynamic filtering |
| autoentermediaownerorbrand | "auto enters 'media owner or brand' to provide a filtered list" | Web app uses dynamic filtering |
| autoenterplanninginspectorate | "auto enters 'planning inspectorate' to provide a filtered list" | Web app uses dynamic filtering |
| autoenterwildstone | "auto enters 'wildstone' to provide a filtered list of contacts from wildstone" | Web app uses dynamic filtering |
| autoenterlawyer | "auto enters 'lawyer' to provide a filtered list of law firms" | Web app uses dynamic filtering |
| autenteragent | "auto enters 'agent' to provide a filtered list" | Web app uses dynamic filtering |
| autenterconsultant | "auto enters 'consultant' to provide a filtered list" | Web app uses dynamic filtering |
| autoenterplanning | "auto enters 'planning' - used to filter user accounts to only show planners" | Web app uses role-based filtering |
| g_siteid | "global field to store site id" | Not needed - proper relations used |
| selectedbuildparttender | "used to filter tender responses" | UI state, not data |
| selectedbuildpartsnagging | "used to filter snagging list" | UI state, not data |
| selectedrentreview | "used to display details from selected rent review" | UI state, not data |
| gtasksbystatus | "filter field for tasks portal" | UI state, not data |
| activepdf | "active planning pdf - used to display the selected planning document" | UI state, not data |
| activepdftender | "active planning pdf" | UI state, not data |
| currentwindowmode | "used in conditional formatting" | FileMaker UI specific |
| setdevelopmentcompanydialog | "shows a custom dialog to prompt users" | FileMaker dialog specific |
| dialogmixedformat | "dialog that shows 'multiple formats'" | FileMaker dialog specific |
| dialogplanningofficer | "dialog that prompts users to add planning officer contacts" | Web app handles validation differently |
| dialogplanninginspector | "dialog that prompts users to add planning inspector contacts" | Web app handles validation differently |
| dialog owner | "used to display custom message on the site layout" | FileMaker dialog specific |
| dialog agent | "used to display custom message on the site layout" | FileMaker dialog specific |
| namedialog | "used to display custom message" | FileMaker dialog specific |
| surveynotesdialog | "used to show a message to write survey notes" | FileMaker dialog specific |

---

## Key DDR Field Insights

The DDR field descriptions reveal important business context:

### Profit Calculations
- **profityear1**: "profit for the first year"
- **profitthereafter**: "profit of development for all other years after year 1"
- FileMaker had calculated fields (c_profityear1, c_profitthereafter, c_totalprofit) that computed these based on deal type

### Contract Terms Context
- **aflSigned**: "date afl signed" - AFL = Agreement for Lease
- **aflExpiryDate**: "afl expiry date" - Key contractual milestone
- **leaseAssignable**: "lease is assignable Yes / No" - Important for deal flexibility
- **rpiIncreases**: "terms of rpi increases" - Rent increases linked to inflation

### Development Tracking
- **wildstonedeveloperorcontact**: "wildstone developer who is leading the development or is the person who has input the development" - Internal owner/lead
- **estimateoractual**: "shows whether deal figures are estimate or actual figures" - Important for pipeline vs confirmed deals
- **probability**: "percentage likelihood of development built" - Deal confidence level

### Tender Process
- **tenderstrategy**: "tender strategy type - formal or informal" - Affects process requirements
- **tendermaterialsrequired**: "type of collateral required - Video / Visuals / Event (can select multiple)" - Marketing needs
- **tenderawarded**: "date tender was awarded" - Key milestone

### Contact Management
- **contact left**: "radio button to show if contact has now left the organisation" - Critical for data hygiene
- **leftorganisation**: "date contact has left organisation" - When they left

---

## Business Logic from Scripts

The FileMaker scripts reveal important business logic that needs to be replicated:

### Profit Calculations (from calculated fields)

The profit calculations depend on the **Deal Type** (FKdealtype_id):
- **Deal Type 1 (Lease):**
  - Profit Year 1 = Rental Value - Lease Per Annum
  - Profit Thereafter = Rental Value - Lease Per Annum (same each year)
  - Total Profit = (Rental Value - Lease Per Annum) × Term
- **Deal Type 5 (Acquisition):**
  - Profit Year 1 = Rental Value - Purchase Price (one-time cost)
  - Profit Thereafter = Rental Value (no ongoing cost)
  - Total Profit = (Rental Value × Term) - Purchase Price

```javascript
// Example TypeScript implementation
function calculateProfitYear1(dealTypeId: number, rentalValue: number, leasePerAnnum: number, purchasePrice: number): number {
  if (dealTypeId === 1) return rentalValue - leasePerAnnum;  // Lease
  if (dealTypeId === 5) return rentalValue - purchasePrice;   // Acquisition
  return 0;
}

function calculateTotalProfit(dealTypeId: number, rentalValue: number, leasePerAnnum: number, purchasePrice: number, term: number): number {
  if (dealTypeId === 1) return (rentalValue - leasePerAnnum) * term;  // Lease
  if (dealTypeId === 5) return (rentalValue * term) - purchasePrice;   // Acquisition
  return 0;
}
```

### Deal Types (from dealtype table - 4 records)

| ID | Type | Description |
|----|------|-------------|
| 1 | Lease | Ongoing lease arrangement - pay annually |
| 2 | Push | (Unknown - needs clarification) |
| 3 | Consultancy | Advisory/consultancy work |
| 5 | Acquisition | One-time purchase |

### Tender Status Workflow (from value lists)

**Tender Strategy:**
- Formal
- Informal

**Tender Status:**
- Pre-Tender
- Ongoing
- Complete

**Tender Materials Required:** (multi-select)
- Video
- Visuals
- Event

### Status Auto-Update Logic

Several fields auto-update dates when their status changes:
- `developmentstatusmodified` - Updates when development status changes
- `planningappstatusmodified` - Updates when planning app status changes
- `advertappstatusmodified` - Updates when advert app status changes
- `contractstatusupdated` - Updates when contract status changes

This pattern should be implemented via database triggers or application logic:
```javascript
// Prisma middleware example
prisma.$use(async (params, next) => {
  if (params.model === 'Development' && params.action === 'update') {
    if (params.args.data.statusId && params.args.data.statusId !== currentStatusId) {
      params.args.data.statusModifiedDate = new Date();
    }
  }
  return next(params);
});
```

### Key Script Patterns

1. **Contact Management Scripts:**
   - `Add Site Owner Contacts Button` - Opens dialog to add contacts to site owner
   - `Add Planning Officer Contacts` - Links LPA planning officers
   - `Email Contact` - Opens email client with contact's email

2. **Development Navigation:**
   - `Go To Related Development from Dashboard` - Navigate to development detail
   - `View Related Developments` - Show all developments at a site
   - `Refresh Development Name` - Recalculates development name from panel details

3. **Tender Process Scripts:**
   - `Delete Tender Response Portal Row` - Remove tender responses
   - `Accepted Build Tender` - Mark a tender response as accepted
   - `Set Build Part Tender` - Link tender to specific build part
   - `Add Marketing Video` / `Delete Marketing Video` - Manage tender videos

### Field Validation Rules

From the DDR validation settings:
- `probability` must be > 1 (percentage validation)
- Deal Type fields have strict validation against the lookup table
- Most date fields use "OnlyDuringDataEntry" validation

### Auto-Enter Patterns

Several fields auto-populate on record creation:
- `createdby` - Account name of creator
- `createddate` - Date record created
- `modifiedby` - Account name of last modifier
- `modifiedtimestamp` - Date/time of last modification

These patterns are already handled by Prisma's `createdAt` and `updatedAt` fields.

---

## Additional Business Logic & UI/UX Patterns from DDR

### Script Triggers - Automatic Behaviours

The FileMaker DDR reveals several automatic behaviours triggered when entering layouts or modifying fields:

| Trigger | Script | Layout | Purpose |
|---------|--------|--------|---------|
| OnLayoutEnter | "Development Update Filter" | Development Update Report | Auto-filters when entering the update report view |
| OnLayoutEnter | "Marketing Tenders Report" | Marketing Tenders | Initialises the tender report view |
| OnLayoutEnter | "External Developer Filter" | Forecast Revenue | Filters by external developer |
| OnObjectValidate | "Check for Duplicate Company Entries" | Organisation form | Validates org name is unique before saving |
| OnObjectExit | "Town name type ahead organisation" | Address fields | Type-ahead lookup for town names |

**UI/UX Insight:** The web app should implement:
- Page-level data initialisation on route enter (via React useEffect or Next.js data fetching)
- Real-time duplicate checking on organisation name input
- Autocomplete/typeahead for town and city fields

### Validation Rules

The DDR shows strict validation on key fields:

| Field | Validation | Error Message |
|-------|------------|---------------|
| Project Number | Unique | "This project number is already in use. Please enter a unique number." |
| Organisation Name | Unique | "This company / organisation already exists." |

**UI/UX Insight:** Display validation errors inline, and check uniqueness on blur (not just on submit).

### Portal Configurations - Related Data Display

FileMaker portals show how related data was displayed:

| Portal Table | Context | Rows | Purpose |
|--------------|---------|------|---------|
| contact | Site/Development | 6 rows | Show related contacts |
| project_client | Development | 3 rows | Show related projects |
| sitephotos | Site | 1 row | Show featured photo |
| developmentdetail | Development | 2 rows | Show panel configurations |
| asgfreports | Development | 4 rows | Show ASGF reports |
| development_related | Site | 6 rows | Show other developments at site |
| jndevelopmentprojects | Development | 3 rows | Show linked projects |

**UI/UX Insight:** These suggest sensible default display counts for lists in the web app. Consider:
- Contacts: Show 3-5 initially with "Show all" option
- Photos: Show 1 featured with thumbnail gallery
- Panel configs: Show all (typically 1-2)
- Related developments: Show 3-5 with expandable list

### Value Lists - Dropdown Options

The DDR defines all dropdown options. Key ones for the web app:

**Organisation Types:**
- Site Owner / Client
- Agent
- Developer
- Local Authority
- Consultant
- Media Owner
- Brand
- Build Contractor
- Lawyer
- Other

**Site Owner Roles:**
- Asset Manager
- Surveyor
- Marketing
- Planning
- Administrator

**Decision Level:**
- Decision Maker
- Influencer

**Developer Role:**
- Lead
- Supervisor

**Site Title (Ownership):**
- (From lookup table - likely Freehold, Leasehold, etc.)

**Planning Score:**
- 1, 2, 3, 4, 5 (simple rating)

**Yes/No Options:**
- Yes
- No

**Completion Status (Tasks):**
- (From lookup table)

**Task Types:**
- (From lookup table - action types)

**Application Status (Planning/Advert):**
- (From lookup table with custom sort order)

**Development Status:**
- (From lookup table with custom sort order - 19 records)

**Site Status:**
- (From lookup table)

**Panel Types, Sizes, Orientations, Structures:**
- All from lookup tables (ensures consistency across developments)

**Appeal Types:**
- Written Representations
- Hearing

**Build Parts:**
- (From lookup table - different build elements)

**Billing Frequency:**
- (From lookup table - for consultancy)

**Payment Schedule:**
- (From lookup table - for consultancy)

**Agreement Types:**
- (From lookup table - contract types)

### Calculated Date Fields - Deadline Logic

The DDR reveals sophisticated deadline calculations:

**Planning Application Target Date:**
```
Case(
  IsEmpty(planningappregistration); planningappregistration;
  not IsEmpty(planningappregistration) and IsEmpty(planningapplicationtargetoveride);
    planningappregistration + 56;  // 8 weeks standard determination
  planningapplicationtargetoveride  // Manual override if set
)
```

**Appeal Determination Forecast:**
```
Case(
  IsEmpty(planningappealstart); planningappealstart;
  not IsEmpty(planningappealstart) and IsEmpty(planningappealforecastdeterminationoveride)
    and planningappealprocedure = "written representations";
    planningappealstart + 112;  // 16 weeks for written representations
  not IsEmpty(planningappealstart) and IsEmpty(planningappealforecastdeterminationoveride)
    and planningappealprocedure = "hearing";
    planningappealstart + 154;  // 22 weeks for hearing
  planningappealforecastdeterminationoveride
)
```

**Advert Application Target:** Same pattern as planning (registration + 56 days unless override set)

**Condition Application Target:** Same pattern (registration + 56 days unless override set)

**UI/UX Insight:** The web app should:
1. Auto-calculate target dates based on registration dates
2. Allow manual overrides that take precedence
3. Display different durations based on appeal type (written vs hearing)
4. Show clear visual indicators when dates are approaching or overdue

### Development Name Auto-Generation

```
Case(
  Count(developmentdetail::FKdevelopement_id) > 1; "Mixed Format";
  paneltype_developmentdetail::type & " " & panelsize_developmentdetail::size & " " & structure_developmentdetail::type
)
```

**Logic:** Development name is generated from panel configuration:
- If multiple panel configs → "Mixed Format"
- Otherwise → "[Panel Type] [Panel Size] [Structure Type]" (e.g., "Digital 48 Sheet Tower")

**UI/UX Insight:** The web app should auto-generate development names but allow manual override.

### Panel Count Calculation

```
Case(
  panelsingledouble = "Yes"; numbersof * 2;
  numbersof
)
```

**Logic:** If panel is double-sided, total panels = quantity × 2

### Conditional Messages

The DDR shows contextual helper messages:

| Field | Condition | Message |
|-------|-----------|---------|
| survey | Empty | "Please add any relevant notes (e.g. key measurements or potential obstructions) which will be useful when designing the proposed scheme" |
| site owner contact dropdown | No site owner selected | "Select site owner first" |
| site owner contact dropdown | Site owner has no contacts | "Add contacts to owner" |
| site agent contact dropdown | No site agent selected | "Select site agent first" |
| site agent contact dropdown | Site agent has no contacts | "Add contacts to agent" |
| site name | Empty | "Populated automatically from address" |
| planning officer dropdown | No LPA contacts | "Add contacts to LPA" |
| planning inspector dropdown | No inspectorate contacts | "Add contacts first" |

**UI/UX Insight:** The web app should show contextual guidance:
- Empty state messages that guide users on what to do
- Dependent field disabling (can't select contact until org is selected)
- Prompts to add related data when missing

### SQL Aggregation

```sql
SELECT SUM("currentrentperannum")
FROM Development
WHERE FKsite_id = ? AND FKdevelopmenttype_id = ?
```

**Purpose:** Calculate total existing rent across all developments at a site of a specific type

**UI/UX Insight:** Dashboard/summary views should aggregate:
- Total rent per site
- Total profit across developments
- Count of developments by status

### Contact Sorting

```
If(IsEmpty(combinedname); "zzzz"; combinedname)
```

**Purpose:** Empty contact names sort to end of list (not beginning)

**UI/UX Insight:** Handle null/empty values in sorting to avoid unexpected ordering.

### Confirmation Dialogs

The DDR shows user confirmation patterns:

```
Case(
  $found = 1; $found & " development was found at this site. Do you wish to view it now?";
  $found > 1; $found & " developments were found at this site. Do you wish to view them now?"
)
```

**UI/UX Insight:** When navigating from site to developments:
- Single development → Offer to view directly
- Multiple developments → Offer to view list
- No developments → Inform user none exist

### Report Export Patterns

Key report/export scripts:
- "Development Update Export" - Export development update report
- "Marketing Tenders Export" - Export tender information
- "Print Planning Schedule" - Print planning timeline

**UI/UX Insight:** The web app should support:
- Export to PDF/Excel for key reports
- Print-optimised views for schedules
- Filtered exports based on current view

---

## UI/UX Improvement Opportunities

Based on FileMaker analysis, areas to improve rather than replicate:

### 1. Navigation & Context
**FileMaker:** Tab-based layout with context switching
**Improvement:**
- Keep development context visible at all times (sticky header with key info)
- Progressive disclosure - show summary, expand for detail
- Better breadcrumb navigation

### 2. Filtering & Search
**FileMaker:** Script-based filtering with global variables
**Improvement:**
- URL-based filtering that can be shared/bookmarked
- Faceted search across multiple dimensions
- Saved filter presets per user

### 3. Status Tracking
**FileMaker:** Status dropdown with separate modification date
**Improvement:**
- Visual status timeline showing progression
- Automatic audit trail of all status changes
- Alert notifications for status changes

### 4. Date Calculations
**FileMaker:** Hidden calculated fields
**Improvement:**
- Show calculation breakdown so users understand dates
- Visual timeline of key dates
- Calendar integration for deadline tracking
- Overdue highlighting

### 5. Contact Management
**FileMaker:** Contacts scattered across multiple tabs
**Improvement:**
- Unified contact panel with role-based grouping
- Quick contact actions (email, call, LinkedIn)
- Contact activity history

### 6. Tender Workflow
**FileMaker:** Basic fields without clear workflow
**Improvement:**
- Visual pipeline/kanban for tender status
- Comparison view of tender offers
- Document management with version control

### 7. Mobile Experience
**FileMaker:** Desktop-only application
**Improvement:**
- Mobile-responsive design
- Key actions available on mobile
- Photo capture directly to development

### 8. Reporting
**FileMaker:** Separate report layouts
**Improvement:**
- Interactive dashboards with drill-down
- Real-time KPIs on home page
- Customisable report builder

---

*Last updated: 13 Jan 2026 - Added comprehensive DDR business logic analysis*
