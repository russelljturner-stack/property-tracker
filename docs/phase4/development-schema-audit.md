# Development Schema Audit

**Purpose:** Compare FileMaker Development layout fields → Prisma schema → Current UI
**Generated:** 2026-01-13

Legend:
- [x] = Present and displayed in UI
- [S] = In Prisma schema but not yet displayed
- [ ] = Not in schema (missing)

---

## Tab 1: Development (Main Tab)

### Header Area

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Development Name | site.name | [x] | Shown in header |
| Site Name | site.name | [x] | Same as above |
| Project No | projectNo | [x] | Shown in header row 2 |

### Left Column

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Name | site.name | [x] | Header |
| Site Owner/Client | site.siteOwner | [x] | Header row 2 |
| Owners Agent | site.siteAgent | [x] | Header row 2 |
| Photo | site.photos | [x] | Site context panel |
| Map | site.address (lat/lng) | [x] | Google Maps embed |
| Address | site.address | [x] | Header row 2 |
| Related Projects | projects (DevelopmentProject) | [-] | DECISION: Use for list filtering, not detail display |

### Middle Column

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Date Created | createdAt | [S] | In schema, not shown |
| Development Type | developmentType | [x] | Header row 2 |
| Deal Type | dealType | [x] | Header row 2 |
| Development Status | status | [x] | Status badge in header |
| Advertisement Planning Status | advertAppStatus | [S] | In schema, not on main view |

### Panel Details (Repeating - DevelopmentDetail)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Panel Type | details.panelType | [x] | Panel Configuration card |
| Panel Size | details.panelSize | [x] | Panel Configuration card |
| Orientation | details.orientation | [x] | Panel Configuration card |
| Structure | details.structureType | [x] | Panel Configuration card |
| Double Sided | details.sides | [x] | Panel Configuration card |
| No. of Structures | details.quantity | [x] | Panel Configuration card |
| Total Panels | (calculated) | [ ] | Could calculate from quantity × sides |
| Digital | details.digital | [x] | Panel Configuration card |
| Illuminated | details.illuminated | [x] | Panel Configuration card |
| Height | details.height | [x] | Panel Configuration card |
| Width | details.width | [x] | Panel Configuration card |

### Right Column

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Developer Company | developer | [S] | In schema, not displayed |
| Wildstone Owner (internal) | internalDeveloper | [x] | Header row 2 ("Developer") |
| Developer | externalDeveloper | [S] | Contact relation, not displayed |
| Media Owner | mediaOwner | [x] | Commercial card (collapsed) |
| Media Owner Agent | mediaOwnerAgent | [S] | In schema, not displayed |
| Notes (development description) | - | [ ] | No general notes field on Development |

---

## Tab 2: Survey (4 Sub-tabs)

### Survey - Left Side (Site Data)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Date Identified | site.dateAdded | [S] | Site table, not shown |
| Site Status | site.status | [S] | Site table, not on dev page |
| Local Authority | site.localAuthority | [x] | Header row 2 |
| Title | site.titleType | [S] | In schema, not displayed |
| Street View link | (generated from lat/lng) | [ ] | Could add |
| Open Map in Browser | (generated from lat/lng) | [ ] | Could add |

### Survey - Site Photos (Sub-tab 2.1)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Site Photos | site.photos | [x] | Site context panel (1 photo) |
| Photo Description | site.photos.caption | [S] | In schema, not shown |

### Survey - Site Survey Notes (Sub-tab 2.2)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Survey Notes | site.survey | [S] | In Site table, not on dev page |

### Survey - ASGF (Sub-tab 2.3)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| ASGF Required | - | [ ] | Missing - need boolean field |
| ASGF Status | asgfStatus | [S] | In schema, not displayed |
| ASGF Reports | asgfReports | [S] | Table exists, not displayed |

### Survey - Other Developments at Site (Sub-tab 2.4)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Other developments at site | site.developments | [x] | Site context panel shows count |

---

## Tab 3: Commercial Agreement (5 Sub-tabs)

### Commercial - Acquisition/Lease Financials (Sub-tab 3.1)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Estimate or Actual? | estimateOrActual | [S] | In schema, not displayed |
| Probability % | probability | [S] | In schema, not displayed |
| Fee Proposal | feeProposal | [S] | In schema, not displayed |
| Rent Per Annum | leasePerAnnum | [x] | Commercial card |
| Purchase Price | purchasePrice | [S] | In schema, not displayed |
| Rental Value | rentalValue | [S] | In schema, not displayed |
| Rental Value (Consultancy) | rentalValueConsultancy | [S] | In schema, not displayed |
| Start Date | leaseStartDate | [x] | Commercial card |
| Term (Yrs) | term | [x] | Commercial card |
| End Date | (calculated) | [ ] | Could calc from start + term |
| Profit Year 1 | profitYear1 | [S] | In schema, not displayed |
| Profit Subsequent Years | profitThereafter | [S] | In schema, not displayed |
| Total Profit | (calculated) | [ ] | Would need calculation |

### Commercial - Consultancy Financials (Sub-tab 3.2)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Description of deal structure | consultancyFinancials | [S] | In schema, not displayed |

### Commercial - Existing Lease (Sub-tab 3.3)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Current Rent Per Annum | currentRentPerAnnum | [S] | In schema, not displayed |
| Lease Start Date | currentLeaseStartDate | [S] | In schema, not displayed |
| Lease End Date | currentLeaseEndDate | [S] | In schema, not displayed |
| Current Lease document | currentLeaseUrl | [S] | In schema, not displayed |

### Commercial - Contract Terms (Sub-tab 3.4)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Clyde & Co. Reference | matterNo | [S] | In schema (matterNo), not displayed |
| Contracting Entity | contractingEntity | [x] | Commercial card |
| Contract Term | contractTerm | [S] | In schema, not displayed |
| Is Lease Assignable? | leaseAssignable | [S] | In schema, not displayed |
| RPI Increases | rpiIncreases | [S] | In schema, not displayed |
| Rent Commencement | rentCommencement | [S] | In schema, not displayed |
| Date AFL Signed | aflSigned | [S] | In schema, not displayed |
| AFL Signed Comments | aflSignedComment | [S] | In schema, not displayed |
| AFL Expiry Date | aflExpiryDate | [S] | In schema, not displayed |
| AFL Expiry Comment | aflExpiryComment | [S] | In schema, not displayed |
| Contract Annual Rent | contractAnnualRent | [S] | In schema, not displayed |
| Contract Issued | contractIssued | [S] | In schema, not displayed |
| Contract Signed | contractSigned | [x] | Commercial card |
| Contract URL | contractUrl | [S] | In schema, not displayed |
| Offer Agreed | offerAgreed | [x] | Commercial card |

### Commercial - Contract Terms (Additional Fields)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Contractual Planning Submission | planningContractualSubmission | [S] | In schema |
| Planning Submission Deadline | planningContractualSubmissionDate | [S] | In schema |
| Lawyer (Wildstone) | lawyer | [x] | Commercial card |
| Lawyer Contact | lawyerContact | [S] | In schema, not displayed |

### Commercial - Contract Documents (Sub-tab 3.5)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Contract Documents | contractDocs | [S] | Table exists, not displayed |

---

## Tab 4: Design

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Design Document/Image | designUrl | [x] | Design card |
| Design Signed Off? | designSignedOff | [x] | Design card |
| Design Status (Draft/Final) | designFinalOrDraft | [x] | Design card |
| Sign-off Date | designSignedOffDate | [x] | Design card |
| Signed Off By | designSignedOffBy | [x] | Design card |
| Design Status | - | [ ] | Missing "Proposed" status per Tab review |
| Client Sign-off Date | - | [ ] | Missing - dual sign-off recommended |
| Client Sign-off By | - | [ ] | Missing - dual sign-off recommended |

---

## Tab 5: Planning (4 Sub-tabs)

### Planning - Common Fields (Right Sidebar)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Lead Wildstone Planner | internalPlanner | [x] | Planning card |
| Local Authority | site.localAuthority | [x] | Via site relation |
| Planning Score (1-5) | planningScore | [x] | Planning card |

### Planning - Pre-Planning (Sub-tab 5.1)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Draft Application Completed | draftApplicationComplete | [S] | In schema, not displayed |
| Client Approval | planningClientApproval | [S] | In schema, not displayed |
| Pre-App Required? | preAppMeetingRequired | [S] | In schema, not displayed |
| Pre-App Submitted | preAppSubmitted | [S] | In schema, not displayed |
| Pre-App Meeting Date | preAppMeetingDate | [S] | In schema, not displayed |
| Pre-App Response Received | preAppResponseReceived | [S] | In schema, not displayed |
| Pre-App Reference | preAppReference | [S] | In schema, not displayed |
| Pre-App Feedback | preAppFeedback | [S] | In schema, not displayed |
| Pre-App Document | preAppDocUrl | [S] | In schema, not displayed |

### Planning - Advertisement Application (Sub-tab 5.2)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Status | advertAppStatus | [x] | Planning card |
| Application Description | advertApplicationDescription | [S] | In schema, not displayed |
| Application Detail | advertApplicationDetail | [S] | In schema, not displayed |
| Date Submitted | advertApplicationSubmitted | [S] | In schema, not displayed |
| Date Validated | advertApplicationRegistration | [S] | In schema, not displayed |
| LA Reference | advertAppRefLa | [x] | Planning card |
| Target Determination Date | advertAppDeterminationDate | [S] | In schema, not displayed |
| Conditions | advertConditions | [S] | In schema, not displayed |
| Conditions Number | advertConditionsNumber | [S] | In schema, not displayed |

### Planning - Advertisement Appeal (Sub-tab 5.2 continued)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Appeal Deadline Override | advertAppealDeadlineOverride | [S] | In schema |
| Appeal Submitted | advertAppealSubmitted | [S] | In schema |
| Appeal Start | advertAppealStart | [S] | In schema |
| Appeal Reference | advertAppealRefLa | [S] | In schema |
| Appeal Procedure | advertAppealProcedure | [S] | In schema |
| Appeal Representations Date | advertAppealRepresentations | [S] | In schema |

### Planning - Planning Application (Sub-tab 5.3)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Status | planningAppStatus | [x] | Planning card |
| Application Description | planningApplicationDescription | [S] | In schema |
| Application Detail | planningApplicationDetail | [S] | In schema |
| Date Submitted | planningApplicationSubmitted | [S] | In schema |
| Date Registered | planningAppRegistration | [S] | In schema |
| LA Reference | planningAppRefLa | [x] | Planning card |
| Target Determination Date | planningAppDeterminDate | [x] | Planning card |
| Target Override | planningAppTargetOverride | [S] | In schema |
| Conditions | planningConditions | [S] | In schema |
| Conditions Number | planningConditionsNumber | [S] | In schema |

### Planning - Planning Appeal (Sub-tab 5.3 continued)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Appeal Deadline Override | planningAppealDeadlineOverride | [S] | In schema |
| Appeal Submitted | planningAppealSubmitted | [S] | In schema |
| Appeal Start | planningAppealStart | [S] | In schema |
| Appeal Reference | planningAppealRefLa | [S] | In schema |
| Appeal Procedure | planningAppealProcedure | [S] | In schema |
| Appeal Representations Date | planningAppealRepresentations | [S] | In schema |
| Appeal Hearing Date | planningAppealHearing | [S] | In schema |
| Appeal Final Comments | planningAppealFinalComments | [S] | In schema |
| Appeal Actual Determination | planningAppealActualDetermination | [S] | In schema |

### Planning - Pre-Commencement Conditions (Sub-tab 5.4)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Conditions | planningConditions | [S] | Table exists (PlanningCondition) |

### Planning Documents

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Planning Documents | planningDocs | [S] | Table exists, not displayed |

---

## Tab 6: Marketing (3 Sub-tabs)

### Marketing - Tender Dates & Offers (Sub-tab 6.1)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Tender Strategy | - | [ ] | **MISSING from schema** |
| Tender Status | - | [ ] | **MISSING from schema** |
| Materials Required (Video) | - | [ ] | **MISSING from schema** |
| Materials Required (Visuals) | - | [ ] | **MISSING from schema** |
| Materials Required (Event) | - | [ ] | **MISSING from schema** |
| Materials Comment | - | [ ] | **MISSING from schema** |
| Materials Prepared Date | - | [ ] | **MISSING from schema** |
| Release Date | - | [ ] | **MISSING from schema** |
| Response Deadline | - | [ ] | **MISSING from schema** |
| Evaluation Complete | - | [ ] | **MISSING from schema** |
| Awarded Date | - | [ ] | **MISSING from schema** |
| Solicitors Instructed | - | [ ] | **MISSING from schema** |
| Contract Issued | - | [ ] | **MISSING from schema** |
| Contract Complete | - | [ ] | **MISSING from schema** |

### Marketing - Tender Offers (repeating)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Media Owner/Brand | tenderOffers.offerFrom | [S] | In schema (basic) |
| Main Contact | - | [ ] | **MISSING - need contact relation** |
| Response Received? | - | [ ] | **MISSING from schema** |
| Response document | - | [ ] | **MISSING from schema** |
| Offer amount | tenderOffers.offerAmount | [S] | In schema |
| Premium | - | [ ] | **MISSING from schema** |
| Offer Accepted? | tenderOffers.status | [S] | Could use status field |
| Offer Date | tenderOffers.offerDate | [S] | In schema |
| Notes | tenderOffers.notes | [S] | In schema |

### Marketing - Tender Photos (Sub-tab 6.2)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Tender Photos | tenderPhotos | [S] | Table exists |
| Tender Documents | - | [ ] | **MISSING - no TenderDoc table** |

### Marketing - Tender Video (Sub-tab 6.3)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Tender Video | - | [ ] | **MISSING from schema** |

---

## Tab 7: Build (2 Sub-tabs)

### Build - Header

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Contractual Completion Date | buildCompletionDate | [x] | Build card |

### Build - Build Elements (Sub-tab 7.1)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Build Part | buildParts.buildPart | [S] | Junction table exists |
| Tender Required | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Tender Released | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Tender Deadline | - | [ ] | **MISSING from DevelopmentBuildPart** |
| Contractor Appointed | buildContractor | [x] | On Development, not BuildPart |

### Build - Tender Responses

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Contractor | buildTenderResponses.contractor | [S] | Table exists |
| Main Contact | - | [ ] | **MISSING - need contact relation** |
| Cost | buildTenderResponses.responseAmount | [S] | In schema |
| Response document | - | [ ] | **MISSING from schema** |
| Is accepted bid? | buildTenderResponses.status | [S] | In schema |

### Build - Snagging List (Sub-tab 7.2)

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Build Part | buildSnaggingItem.developmentBuildPart | [S] | Via relation |
| Date Added | buildSnaggingItem.reportedDate | [S] | In schema |
| Estimated Completion | - | [ ] | **MISSING from BuildSnaggingItem** |
| Actual Completion | buildSnaggingItem.resolvedDate | [S] | In schema |
| Description | buildSnaggingItem.description | [S] | In schema |

### Build - Additional Fields

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Build Start Date | buildStartDate | [x] | Build card |
| Build Completion Date | buildCompletionDate | [x] | Build card |
| Build Live Date | buildLiveDate | [x] | Build card |
| Build Notes | buildNotes | [S] | In schema, not displayed |

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

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Task Type | tasks.taskType | [x] | Tasks sidebar |
| Description | tasks.description | [x] | Tasks sidebar |
| Created By | tasks.assignedById | [S] | In schema, not displayed |
| Department | - | [ ] | **MISSING from schema** |
| Created Date | tasks.createdAt | [x] | Tasks sidebar |
| Due Date | tasks.dueDate | [x] | Tasks sidebar |
| Assigned To | tasks.assignedTo | [x] | Tasks sidebar |
| Status | tasks.complete | [x] | Tasks sidebar |
| Completed Date | tasks.completedDate | [S] | In schema |
| Priority | tasks.priority | [S] | In schema |
| Needs Review | tasks.needsReview | [S] | In schema |

### Notes

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Note Text | notes.noteText | [x] | Activity sidebar |
| Related File | - | [ ] | **MISSING from DevelopmentNote** |
| Added Date | notes.noteDate | [x] | Activity sidebar |
| Made By | notes.noteBy | [x] | Activity sidebar |
| Department | - | [ ] | **MISSING from schema** |

---

## Tab 10: Contacts (2 Sub-tabs)

### Site Owner Contacts

| FileMaker Field | Prisma Field | In UI | Notes |
|-----------------|--------------|-------|-------|
| Name | contact.firstName + lastName | [x] | Contacts sidebar |
| Company | contact.organisation.name | [x] | Contacts sidebar |
| Title | contact.jobTitle | [S] | In schema |
| Mobile | contact.mobile | [x] | Contacts sidebar |
| Telephone | contact.phone | [x] | Contacts sidebar |
| Extension | - | [ ] | **MISSING from Contact** |
| Email | contact.email | [x] | Contacts sidebar |
| Site Role | contact.role | [S] | Generic role field |
| Decision Level | contact.decisionLevel | [S] | In schema |
| Contact Left? | - | [ ] | **MISSING from Contact** |
| Date Left | - | [ ] | **MISSING from Contact** |

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
