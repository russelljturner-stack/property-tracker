# FileMaker Development Tabs - Detailed Review

**Purpose:** This document captures the analysis of all FileMaker Development tab screenshots to inform the design of sub-section pages in the new web application.

**Status:** Screenshots reviewed, awaiting Russell's input on what was important on each tab.

---

## Overview

The FileMaker Development layout has **10 main tabs** with **28 sub-tabs** containing approximately **200+ fields**.

| Main Tab | Sub-tabs | Approx. Fields |
|----------|----------|----------------|
| Development | - | ~25 |
| Survey | 4 | ~15 |
| Commercial Agreement | 5 | ~40+ |
| Design | - | ~5 |
| Planning | 4 | ~50+ |
| Marketing | 3 | ~20 |
| Build | 2 | ~15 |
| Consultancy | 6 | ~30 |
| Tasks & Notes | 2 | ~15 |
| Contacts | 2 | ~15 |

---

## Tab 1: Development (Main Tab)

**Screenshot:** `Filemaker/Layouts/Development.jpg`

### What's on this tab:

**Header Area:**
- Record navigation (317 of 1984)
- Development name with site name and project number
- Quick links to Sites, Developments, Companies

**Left Column:**
- Name, Site Name, Project No
- Site Owner/Client
- Owners Agent
- Photo/Map/Address tabs (with Google Map embed)
- Related Projects list

**Middle Column:**
- Date Created
- Development Type
- Deal Type
- Development Status
- Advertisement Planning Status
- Panel Details (repeating section) - Type, Size, Orientation, Structure, Double Sided, No. of Structures, Total Panels

**Right Column:**
- Developer Company
- Wildstone Owner (internal owner)
- Developer
- Media Owner
- Media Owner Agent
- Notes area (Further detail regarding proposed development)

### Initial Observations:
- Panel Details appear as a repeating section - can have multiple panels per development
- Information density is high - everything visible at once
- 10 tabs visible in the tab bar - overwhelming navigation
- Map/Photo is prominent - location context is important

### Questions for Russell:
- [ ] Who primarily used this screen?
- [ ] How often was data edited vs just viewed?
- [ ] Which fields were most important for daily work?

### Russell's Input (from conversation):
> "This was primarily used by the developer but would be reviewed by other roles. It would largely be completed in one go but updated afterwards every few weeks possibly."

> "The multiple panels was necessary when a development attempt included more than one advertising panel. Although it is for 2 or more panels it would be treated as one development as the planning / design / marketing etc of the site would be handled in one go."

> "In terms of user frustrations there are none reported from the limited use but I suspect everyone felt there was too much information competing for attention."

---

## Tab 2: Survey (4 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Survey.jpg` (Site Photos)
- `Filemaker/Layouts/Development_Survey_Notes.jpg` (Site Survey Notes)
- `Filemaker/Layouts/Development_Survey_ASGF.jpg` (ASGF)
- `Filemaker/Layouts/Development_Survey_Other Devs.jpg` (Other Developments at Site)

### Left Side (constant across all sub-tabs):
- Date Identified
- Site Status
- Local Authority
- Title
- Photo/Map/Address tabs
- Street View & Open Map in Browser buttons

### Sub-tab 2.1: Site Photos
- Photo gallery with description fields
- "Click for larger photo" functionality

### Sub-tab 2.2: Site Survey Notes
- Large text area for measurements, obstructions, design notes
- Prompt: "Please add any relevant notes (e.g. key measurements or potential obstructions) which will be useful when designing the proposed scheme"

### Sub-tab 2.3: ASGF
- ASGF Required checkbox
- ASGF Reports list:
  - View Point
  - ASGF Consultancy (dropdown)
  - Date Requested
  - Date Completed
  - Status
  - Open File button

### Sub-tab 2.4: Other Developments at Site
- Table showing other developments at same site:
  - Development Name
  - Development Type
  - Developer Company
  - Size
  - Type

### Initial Observations:
- This is really **Site-level data**, not Development-level - it's about the physical location
- "Other Developments at Site" is useful context - shows what else has been attempted here
- Photo/Map appears on both Development and Survey tabs - **duplication**
- Lots of empty space - the layout doesn't adapt to content amount

### Questions for Russell:
- [ ] What is ASGF? (Assessment/report type?)
- [ ] Should Survey data live on the Site page instead?
- [ ] How often is survey information updated after initial entry?

---

## Tab 3: Commercial Agreement (5 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Commercial_AcqLease.jpg` (Acquisition/Lease Financials)
- `Filemaker/Layouts/Development_Commercial_Consultancy.jpg` (Consultancy Financials)
- `Filemaker/Layouts/Development_Commercial_Existing.jpg` (Existing Lease)
- `Filemaker/Layouts/Development_Commercial_Contract.jpg` (Contract Terms)
- `Filemaker/Layouts/Development_Commercial_ContractDocs.jpg` (Contract Documents)

### Sub-tab 3.1: Acquisition / Lease Financials
- Estimate or Actual? (radio buttons)
- Probability %
- Fee Proposal (text area)
- **Cost Section:**
  - Rent Per Annum
  - Purchase Price
- **Revenue Section:**
  - Rental Value
  - Start Date, Term (Yrs), End Date
- **Profit Section:**
  - Profit Year 1
  - Profit Subsequent Years
  - Total Profit
- Red validation warning: "Enter Deal Term"

### Sub-tab 3.2: Consultancy Financials
- Single large text area: "Description of deal structure and expected revenue"

### Sub-tab 3.3: Existing Lease (Existing Advertising Only)
- Current Rent Per Annum
- Lease Start Date
- Lease End Date
- Current Lease document upload
- Add/Remove buttons

### Sub-tab 3.4: Contract - Terms
**Very dense - approximately 25+ fields:**

Left column:
- Clyde & Co. Reference
- Contracting Entity (dropdown)
- Fee Proposal
- Contract Term
- Is the Lease Assignable? (Yes/No)
- Lease Assignable Term
- RPI Increases Term
- Rent Commencement Term
- Date AFL Signed
- AFL Signed Comments
- Contractual Planning Submission Date (Yes/No)
- Planning Submission Deadline
- Planning Submission Term

Middle column:
- Planning Consent Deadline
- Planning Consent Term
- AFL Expiry Date
- AFL Expiry Date Term
- Client Approval to Submit (Yes/No)
- Planning Client Approval Term
- Agreement Signed (date)
- Scope of Works Approval Deadline
- Scope of Works Approval Term
- Build Deadline
- Build Deadline Term
- Contract Expires Date
- Contract Expires Term

Right column:
- Completion Date
- Completion Date Term
- Contract Status
- Contract Status Updated
- Wildstone Lawyer (dropdown)
- Clyde & Co. Lawyer (dropdown)

### Sub-tab 3.5: Contract - Documents
- Document Type dropdown
- Document upload area
- Dual-column layout for multiple documents

### Initial Observations:
- **Contract Terms is overwhelming** - ~25 fields visible covering legal references, deadlines, approvals, lawyers
- Financials are well-structured - Cost/Revenue/Profit breakdown is logical
- "Existing Lease" only relevant for certain development types (conditional)
- Documents scattered - contracts here, but also in Survey, Planning, Design, Build

### Questions for Russell:
- [ ] Who fills in the Contract Terms? Legal team or developers?
- [ ] Are all those deadline fields actually used?
- [ ] Should financial data be restricted by role?

---

## Tab 4: Design

**Screenshot:** `Filemaker/Layouts/Development_Design.jpg`

### Content:
- Large preview area (presumably shows design image/PDF)
- **Design Signed Off?** (Yes/No radio)
- **Design:** Draft / Final (radio)
- **Date** (date picker)
- **By** (who signed off - dropdown)
- Add/Remove buttons (multiple design versions possible)

### Initial Observations:
- **Very simple layout** - Only 4 fields plus document viewer
- Clear approval workflow - who, when, draft vs final
- Multiple designs possible (+/- buttons)
- Well-designed for its purpose - focused on: "Is the design approved?"

### Questions for Russell:
- [ ] How many design iterations does a typical development go through?
- [ ] Who does the sign-off? Internal or client?

---

## Tab 5: Planning (4 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Planning_PrePlanning.jpg`
- `Filemaker/Layouts/Development_Planning_AdvertisingAppeal.jpg`
- `Filemaker/Layouts/Development_Planning_PlannignAppeal.jpg`
- `Filemaker/Layouts/Development_Planning_PreCommencement.jpg`
- `Filemaker/Layouts/Development_Planning_Docs.jpg` (popup)

### Right Sidebar (constant across all sub-tabs):
- Lead Wildstone Planner (dropdown)
- Local Authority
- Planning Score (5=High, 1=Low chance of success)
- "Planning Documents" button

### Sub-tab 5.1: Pre-Planning
- Contractual deadlines section
- Draft Application Completed (date)
- Client Approval (date)
- **Pre-Application section:**
  - Required? (Yes/No)
  - Type
  - Date Submitted
  - Officer
  - Meeting Date
  - Response (date)
- Pre-App Response Notes (text area)
- Pre-App Document upload

### Sub-tab 5.2: Advertisement Application / Appeal
**Application section:**
- Status
- Application Description
- Application Detail
- Date Submitted
- Date Validated
- LA Reference
- Consultation Ends
- Target Determination Date
- Actual Determination Date
- Planning Officer
- Deadline to Appeal
- Pre-Commencement Conditions (text area)

**Appeal section:**
- Date Submitted
- Start Date
- Reference
- Procedure
- Representations Date
- Final Comments Date
- Forecast Determination
- Actual Determination
- Case Officer
- Inspector

### Sub-tab 5.3: Planning Application / Appeal
- **Nearly identical structure to Advertisement Application**
- Same fields for a different application type

### Sub-tab 5.4: Pre-Commencement Conditions
- Conditions tracking area

### Planning Documents Popup
- PDF list with:
  - Description
  - Related Application
- Separate window rather than inline

### Initial Observations:
- **Two parallel application types** - Advertisement and Planning applications have nearly identical structures
- **Heavy date tracking** - Multiple deadline and milestone dates
- **Appeal workflow** - Full appeal tracking built into each application type
- **Planning Score** - Interesting metric (1-5 success probability)
- Documents open in popup rather than inline

### Questions for Russell:
- [ ] What's the difference between Advertisement Application and Planning Application?
- [ ] Is the Planning Score actually used and useful?
- [ ] How often do developments go to appeal?

---

## Tab 6: Marketing (3 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Marketing_Tender.jpg`
- `Filemaker/Layouts/Development_Marketing_TenderPhotos.jpg`
- `Filemaker/Layouts/Development_Marketing_TenderVideos.jpg`

### Sub-tab 6.1: Tender Dates & Offers
- Tender Strategy
- Tender Status
- **Materials Required checkboxes:**
  - Video
  - Visuals
  - Event
- Materials Comment
- **Key Dates:**
  - Materials Prepared
  - Release Date
  - Response Deadline
  - Evaluation Complete
  - Awarded
  - Solicitors Instructed
  - Contract Issued
  - Contract Complete
- **Offers table (repeating):**
  - Media Owner/Brand
  - Main Contact
  - Response Received? (Yes/No)
  - Response document
  - Offer amount
  - Premium
  - Offer Accepted? (Yes/No)

### Sub-tab 6.2: Tender Documents & Photos
- Tender Photos gallery with "View Larger Image"
- Tender Documents button

### Sub-tab 6.3: Tender Video
- Large video preview area
- Add/remove buttons

### Initial Observations:
- This is about **selling advertising space** - "Tender" = marketing to media owners/advertisers
- **Multiple offers tracked** - Comparing bids from different media owners
- **Full tender workflow** - From materials preparation through to contract completion
- **Rich media support** - Photos and video for marketing materials
- Relatively well-structured - dates flow logically through the process

### Questions for Russell:
- [ ] How many offers does a typical tender receive?
- [ ] Is video actually used often, or rarely?

---

## Tab 7: Build (2 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Build_Elements.jpg`
- `Filemaker/Layouts/Development_Build_Snagging.jpg`

### Header:
- Contractual Completion Date

### Sub-tab 7.1: Build Elements
**Build Parts (repeating):**
- Build Part (dropdown)
- Tender Required (Yes/No)
- Tender Released date
- Tender Deadline date
- Contractor Appointed
- "View Responses" button

**Tender Responses section:**
- Contractor
- Main Contact
- Cost
- Response document
- "Is accepted bid?" button

### Sub-tab 7.2: Snagging List
- Build Part (dropdown)
- "View snagging list" button
- **Snagging items (repeating):**
  - Date added
  - Estimated completion date
  - Actual completion date
  - Description

### Initial Observations:
- **Build Parts are modular** - Different construction components tendered separately
- **Contractor tendering workflow** - Similar pattern to Marketing but for construction
- **Snagging tracking** - Post-build issue tracking with dates
- Yellow highlighting appears to indicate required fields
- **Relatively lightweight** compared to Planning or Commercial

### Questions for Russell:
- [ ] How many build parts does a typical development have?
- [ ] Is the contractor tendering process always used, or sometimes direct appointment?

---

## Tab 8: Consultancy (6 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Consulatancy_Rent Review.jpg`
- `Filemaker/Layouts/Development_Consulatancy_LeaseRenewal.jpg`
- `Filemaker/Layouts/Development_Consulatancy_Valuation.jpg`
- `Filemaker/Layouts/Development_Consulatancy_RevenueShare.jpg`
- `Filemaker/Layouts/Development_Consulatancy_RentCollection.jpg`
- `Filemaker/Layouts/Development_Consulatancy_Other.jpg`

### Sub-tab 8.1: Rent Review
**Simple repeating list:**
- Instruction Date
- Is complete? (Yes/No)
- Completion Date
- "Open Detail" button

### Sub-tab 8.2: Lease Renewal
**Most complex - Left side:**
- Instruction Date
- Inspection Date
- Time Critical flag
- Current Lease End
- Existing Tenant info
- Current Rent
- Market Value
- Agreement Type
- Negotiation section

**Middle:**
- Agreement dates (Date Agreed, Client Approved, Solicitors Instructed)
- Fee info
- Completion status

**Right:**
- Current Lease document
- Renewal Notice document

### Sub-tab 8.3: Valuation
- Same simple list structure as Rent Review

### Sub-tab 8.4: Revenue Share Audit
- Same simple list structure

### Sub-tab 8.5: Rent Collection
- Rent Collection (Yes/No)
- Frequency
- Rent PA/PM
- Lease Start/End
- Term
- Fee
- Fee Basis
- Rent Collection Date
- Current Lease document

### Sub-tab 8.6: Other
- Same simple list structure (catch-all)

### Initial Observations:
- This is **post-development operational work** - managing existing sites, not developing new ones
- **Lease Renewal is most complex** - full negotiation tracking
- **Common pattern** for Rent Review, Valuation, Revenue Share, Other - simple list with "Open Detail"
- **Fee tracking** - consultancy work generates fees
- **Might be different user group** - handled by different staff than development?

### Questions for Russell:
- [ ] Is Consultancy handled by the same team as Development?
- [ ] Should this be a separate area of the app entirely?

### Russell's Input (from conversation):
> "Consultancy is used and reflects a different deal structure. But I need to come back to this."

---

## Tab 9: Tasks & Notes (2 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_TaskandNotes_Tasks.jpg`
- `Filemaker/Layouts/Development_TaskandNotes_Notes.jpg`

### Sub-tab 9.1: Tasks
- Filter by Status: Incomplete / Complete (radio buttons)
- **Repeating rows:**
  - Task Type
  - Note (description)
  - Created By
  - Department
  - Created Date
  - Due Date
  - Assigned to
  - Status (Incomplete/Complete)
  - Completed date

### Sub-tab 9.2: Notes
- **Repeating rows:**
  - Note (large text area)
  - Related file (document upload)
  - Added date
  - Made By
  - Department

### Initial Observations:
- **Tasks well-structured** - Has all key fields: type, description, assignee, due date, status
- **Filter by status** - Good! Users can focus on incomplete tasks
- **Department tracking** - Both track which department (useful for multi-team)
- **Notes can have attachments**
- **No priority field visible** - Tasks don't have High/Medium/Low
- Simple but functional

### Questions for Russell:
- [ ] Should tasks have priority levels?
- [ ] Are notes used for formal audit trail or informal communication?

---

## Tab 10: Contacts (2 Sub-tabs)

**Screenshots:**
- `Filemaker/Layouts/Development_Coontacts_Owner.jpg`
- `Filemaker/Layouts/Development_Coontacts_Agents.jpg`

### Sub-tab 10.1: Site Owner Contacts
**Repeating rows:**
- Name
- Company
- Title
- Mobile
- Telephone
- Ext.
- Email
- Site Role (dropdown)
- Decision Level (dropdown)
- Contact left? (Yes checkbox)
- Date Left

### Sub-tab 10.2: Site Owner Agent Contacts
**Same structure:**
- Name
- Company
- Title
- Email
- Mobile
- Landline
- Ext.
- Contact left?
- Date Left

### Initial Observations:
- **Two contact types** - Site Owner contacts vs their Agent contacts
- **Decision Level tracking** - Useful for knowing who has authority
- **Contact left tracking** - Smart to track when contacts leave
- **Site Role field** - Categorises contact's role
- **Multiple contacts per type** - Repeating rows

### Questions for Russell:
- [ ] What are the typical Site Roles?
- [ ] What are the Decision Levels?

---

## UX Strategy (Approved by Russell)

### Core Problem
> "Too much information competing for attention"

The FileMaker system was designed around **storing data** rather than **supporting workflows**.

### Approved Approach: Progressive Disclosure

**Three Layers of Information:**

| Layer | What it shows | When visible |
|-------|---------------|--------------|
| 1. At a Glance | Status, location, next action, red flags | Always visible |
| 2. Working Detail | The section you're currently working on | When you click into a stage |
| 3. Full Record | Everything else (reference data, history) | Available but tucked away |

### Page Structure (Implemented)

1. **Header** - Site name, status, project number, internal owner, last activity
2. **Progress Timeline** - Visual 7-stage indicator (Survey → Commercial → Design → Planning → Marketing → Build → Live)
3. **Quick Actions** - Add Note, Add Task, Upload Document
4. **Main Content** - Stage cards showing current stage expanded, others collapsed
5. **Sidebar** - Tasks, Key Contacts, Recent Activity

### Key Decisions from Russell

- Progressive disclosure approach: **Approved**
- All contacts shown in sidebar: **Yes** (not filtered by role)
- Activity log shows: **Last 10 items**
- Mobile design: **Deferred** until desktop layout settled
- For new developments: Show full form first, then minimal required fields after save

---

## Next Steps

Go through each tab with Russell to understand:
1. What fields are actually important for daily work?
2. What can be hidden in "View full details"?
3. What's rarely used and could be deprioritised?
4. Any fields that are completely unused?

This will inform which fields appear on stage cards vs full detail views.
