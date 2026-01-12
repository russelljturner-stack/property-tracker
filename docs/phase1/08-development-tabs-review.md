# FileMaker Development Tabs - Detailed Review

**Purpose:** This document captures the analysis of all FileMaker Development tab screenshots to inform the design of sub-section pages in the new web application.

**Status:** ✅ **COMPLETE** - All 10 tabs reviewed with Russell's input captured.

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

**Site Context is Critical (Map & Photos):**
> "The site's physical location almost determines the quality of the site as an advertising asset. The quality depends on: footfall/traffic passing it, viewing angles, how far you can see it on approach (road or pavement). This affects:
> - What the site is worth as an advertising asset
> - What type of screen can be built (e.g., digital screens may not be allowed roadside as they could distract drivers)
>
> Whether you're a planner, designer, developer, leader, or marketer - you would always look at those photos and location map to quickly understand the area. A quick link to the map and a photo of the site in context would be very useful on every development view."

**Proposed Development Visual is Equally Critical:**
> "The development that has been proposed is just as critical. Outdoor advertising is about impact and visibility. Particularly for premium sites, having an image of the proposed development is key - whether that's:
> - A dummy/stock image (e.g., '48 sheet digital' placeholder)
> - An actual design in progress
> - What's gone into planning
> - What's being built
>
> The asset value is about the quality of the advertising asset: the size of the screen, whether it's digital or paper-and-paste, and how it's presented (e.g., architectural surround to make it sit within the landscape or on a building). Much like the site drives potential asset value, what is being proposed is critically important - that's the exciting thing that gets sold."

**Status and Next Action are What Matters:**
> "The rest of the information is relatively dry but important. Statuses are very important - and what actually needs to happen next to move it along the linear flow. Progressing developments from start to finish is how we actually make money. Seeing them all stuck in development cycles isn't interesting. It's about: let's get them over the line, let's make some money, let's build beautiful sites."

### Design Implications:
**Two key visuals should be persistently visible** (or one-click accessible) from the development detail page:
1. **Site context** - Map location + site photo showing the physical location
2. **Proposed asset** - The development visual (design render, stock placeholder, or planning submission image)

These are essential context for ALL roles and represent the two core value drivers: location quality + asset quality.

**The system should emphasise momentum, not just data:**
- Status and "what's next" should be prominent
- The UI should make it obvious what's blocking progress
- The goal is getting developments over the line, not cataloguing stuck projects

### App Personality & Branding Direction

> "What's the personality of the app? We're talking about the excitement around the development, progressing, financial wins. It needs to take what is potentially dry information, make it upbeat and exciting - so it's not just a repository but a system that drives action."

**Design Personality Principles:**
- **Action-oriented** - Not a passive database, but a tool that pushes things forward
- **Celebratory** - Wins and completions should feel like achievements
- **Energetic** - Reflect the excitement of developing premium advertising sites
- **Visual** - Lead with the exciting visuals (site, asset), not dry data tables
- **Progress-focused** - Movement through stages should feel like momentum

This should inform colour choices, micro-interactions, language/copy, and overall UI feel.

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
- [x] What is ASGF? (Assessment/report type?)
- [x] Should Survey data live on the Site page instead?
- [x] How often is survey information updated after initial entry?

### Russell's Input:

**ASGF Explained:**
> "ASGF is a report that determines whether it's suitable to have outdoor advertising at the side of a road."

**Survey Data Location:**
> "Yes, survey data does live on the site page. The site survey information wouldn't be updated afterwards - it's entered once. I considered placing it on the Development tab because I wanted quick access, but in FileMaker I was having challenges navigating to the correct site record and back to the development record. It was easier to place it in a tab. But if navigation back to the site and into the development is seamless (one click), it can stay with the rest of the site data."

**Development History at Site is Critical:**
> "The 'Other Developments at Site' view shows the history of developments - what's been attempted, what's current, what's succeeded or failed. This is critical for understanding:
> - What is a suitable proposal for this site
> - What is likely to gain planning permission
> - What might look good in this context
> - What types of developments have been considered before
> - How well-valued the site is as a development opportunity (multiple attempts = high-value location)"

### Schema Confirmation:

| FileMaker Tab 2 Element | Where it Lives in Schema | Recommendation |
|------------------------|--------------------------|----------------|
| Site Photos | Site.photos (SitePhoto table) | Keep on Site page |
| Site Survey Notes | Site.survey field | Keep on Site page |
| ASGF | Development.asgfStatus + asgfReports | Keep on Development (specific to proposal) |
| Other Developments at Site | Site.developments relation | Display on Site page with clear history |

### Design Implications:

1. **Survey data stays on Site** - with seamless navigation from Development to Site
2. **ASGF stays on Development** - it's about whether *that specific proposal* is suitable for roadside advertising
3. **Development history visible from Development page** via "Site context" panel

### Decision: Site Context Panel on Development Page (Option C)

When viewing a Development, there should be a persistent or expandable **"Site context" panel** that shows:
- Site photo (primary)
- Map location
- "X other developments at this site" (expandable to show history)

**Why this approach:**
- Site context is critical for all roles (established in Tab 1)
- Development history is valuable intelligence for decision-making
- Users shouldn't have to navigate away to see this context
- Avoids the FileMaker problem of "hard to get back to the right record"

The full Site page still exists for deeper site information (all photos, full survey notes, complete development history timeline), but key context is always visible when working on a Development.

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
- [x] Who fills in the Contract Terms? Legal team or developers?
- [x] Are all those deadline fields actually used?
- [x] Should financial data be restricted by role?

### Russell's Input:

**Who fills in Contract Terms:**
> "It used to be developers, but it could be legal team or developers. We'd probably need to add 'Legal' as a role type. There could be both internal and external legal teams involved."

**Deadline fields:**
> "Yes, all of those deadlines could potentially be used."

**Access Control for Financial/Contract Data:**
> "Financial data and contractual data should only be visible to:
> - The developer assigned to the development
> - Team leaders
> - Leadership team
> - Legal"

**Purpose of Acquisition/Lease Financials:**
> "This was to help calculate things so that reports could be generated on:
> - Potential revenue coming forward
> - Long-term value of the site (e.g., a lease might be annual but for a set period of years)"

**Purpose of Consultancy Financials:**
> "More of a descriptive box because consultancy deals can be very different between sites - hard to capture in structured fields."

**Purpose of Existing Lease:**
> "If there's an existing development at a site, the landowner may have leased that land to another outdoor operator for a period of time. This captures critical information to:
> - Remind us to go back and speak to that company when the agreement is coming up to its term
> - See terms and conditions of the current lease
> - View lease breaks
> - Understand what kind of lease has been agreed in the past
> - Provide commercial insight for what future agreements could be based on"

**Contract Documents:**
> "A place to upload actual copies of contracts or other key negotiation documents."

### Design Implications:

1. **Add "Legal" role** - Both internal and external legal teams need access
2. **Role-based visibility** for Commercial tab:
   - Visible to: Assigned developer, Team leaders, Leadership, Legal, Admin
   - Hidden from: Other developers, Planners, Build managers (unless assigned)
3. **Existing Lease is about competitive intelligence** - Not just data storage, but actionable reminders (lease expiry alerts?)
4. **Financials drive reporting** - Cost/Revenue/Profit structure feeds into management reports
5. **Consultancy stays as free text** - Too varied to structure

### Key Feature: Contract & Deadline Alerts

**Lease Expiry Alerts:**
Based on "remind us to go back when the agreement is coming up to its term" - the system should:
- Track lease end dates for existing developments/competitors
- Generate alerts when leases are approaching expiry (e.g., 6 months before)
- Surface these as opportunities on the dashboard

**Contract Deadline Alerts:**
> "Alerts regarding contract terms are important - for example, if there's a planning submission date outlined in the contract, this is critical information to the planning team so they don't miss this deadline."

The system should:
- Track all contractual deadlines (planning submission, build completion, etc.)
- Route alerts to the **relevant team** (not just the developer):
  - Planning submission deadline → Planning team
  - Build deadline → Build manager
  - Contract expiry → Developer + Legal
- Allow configurable alert timing (e.g., 2 weeks before, 1 month before)
- Show upcoming deadlines prominently on role-specific dashboards

**This reinforces ADR-009 (Notification System)** - deadlines from contracts should feed into the notification engine.

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
- [x] How many design iterations does a typical development go through?
- [x] Who does the sign-off? Internal or client?

### Russell's Input:

**Design Status Options - More than Draft/Final:**
> "As well as having draft and final, we might also want 'Proposed'. If someone just says '48 sheet digital', they could put in a stock image. The actual advertising asset being proposed - particularly if it's design-led - is exciting to the overall project. This should be front and centre."

**Types of Design Content:**
> "This could include:
> - Photos of what's being proposed
> - Photos of what's being built
> - CGI images of things being proposed
> - Technical drawings alongside nice renders
> - Multiple documents relative to a single design (e.g., a nice render PLUS technical drawings)"

**Design Iterations:**
> "I don't think there have been many design iterations, but there may be other documents relative to a single design."

**Sign-off - Both Internal and Client:**
> "The design could be signed off both internally AND by the client."

**Design and Planning are Integral:**
> "Design is integral to planning - at Wildstone, design sat within the planning team. Planning applications are very much concerned with:
> - Road safety and impact of advertising
> - How advertising sits within the landscape
> - Wider redevelopment schemes (e.g., a town centre redevelopment part-funded by advertising where the screen must fit the overall scheme to get approval)"

### Design Implications:

1. **Design status options:** Proposed → Draft → Final (not just Draft/Final)
2. **Design is front and centre** - connects to Tab 1's "proposed development visual" requirement
3. **Multiple document types per design:**
   - Hero image (the exciting render/CGI)
   - Technical drawings
   - Supporting documents
4. **Dual sign-off tracking:**
   - Internal sign-off (date, by whom)
   - Client sign-off (date, by whom)
5. **Design history preserved** - previous iterations visible but current/approved prominent
6. **Design ↔ Planning link** - design decisions affect planning outcomes; may need cross-referencing

### Connection to Tab 1 Visual Requirement:

The "proposed asset" visual from Tab 1 should pull from the Design section:
- If no design exists → Show stock image based on panel type/size
- If Proposed design exists → Show that
- If Draft design exists → Show that (marked as draft)
- If Final/Approved design exists → Show that (this is the "hero" image)

This creates a natural progression: stock placeholder → proposed → draft → approved design.

### Product Consideration: Design Importance Varies by Customer

> "Different developers who might use this system will have different priorities:
> - Some are incredibly design-led, building beautiful, architecturally important advertising sites
> - Others build very boring roadside assets like post boxes or docking stations for hire bikes - where design isn't front and centre"

**Implication for productisation:**
- Design section should be **optional or configurable** per customer
- Some customers may want design prominently featured; others may barely use it
- The "hero visual" fallback to stock images is even more important for non-design-led customers
- Consider a customer setting: "Design-led workflow" (on/off) that adjusts UI prominence

This connects to **ADR-013 (Product Strategy)** - features should be modular and configurable per customer.

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
- [x] What's the difference between Advertisement Application and Planning Application?
- [x] Is the Planning Score actually used and useful?
- [x] How often do developments go to appeal?

### Russell's Input:

**Advertisement vs Planning Application:**
> "Some instances may not need a full planning application - just an advert application."

**Planning is Data-Intensive (and That's OK):**
> "The whole planning section will be very data-intensive because there are a lot of fields to capture with the planning process. There are a lot of important dates which will trigger actions. There are also relevant documents and reference numbers that need to be captured. Yes, it is quite dry information - but that's the very nature of planning!"

**Planning Stages:**
> "There are different stages:
> 1. **Pre-planning** - Potential development discussed with planning officer at local authority to get an indication of whether a full application might be approved
> 2. **Full planning application** - Formal submission
> 3. **Appeal** - Very common for advertising submissions
> 4. **Conditions** - Lots of conditions attached to approval that must be met before site can go live"

**Planning Score is Critical:**
> "The planning score is very important because getting planning approval is probably the most challenging aspect of the development. We can work on different designs - that's fine - but actually getting the potential for planning approval from the local authority is very hard to achieve. It's almost the hardest part of the whole process, aside from getting an agreement with the landowner."

**Appeals are Common:**
> "Appeals are very common for advertising submissions."

### Design Implications:

1. **Planning is a critical bottleneck** - The UI should reflect this importance:
   - Planning Score should be prominent (it predicts the hardest part)
   - Planning status/stage visible from development overview
   - Deadlines here are especially critical

2. **Two application types, similar structure:**
   - Advertisement Application (lighter process)
   - Planning Application (full process)
   - Both can go to appeal
   - UI can use same component with conditional fields

3. **Appeal workflow is essential, not edge case** - Appeals are common, so this isn't a rarely-used section

4. **Pre-commencement conditions are a gate:**
   - Can't go live until conditions are met
   - Needs clear tracking: which conditions, status, who's responsible

5. **Data density is acceptable here** - Planning is inherently data-heavy; don't over-simplify
   - But use progressive disclosure: show status/next action at top, details below

### Planning Score Prominence

Given that planning approval is "the hardest part of the whole process", the Planning Score (1-5) should be:
- Visible on the development card/summary (not buried in Planning tab)
- Colour-coded (red/amber/green) for quick assessment
- Used in leadership reports: "Pipeline by Planning Score"
- Potentially factor into risk assessment or prioritisation

### Planning Score = Financial Weighting Factor

> "The planning score determines what the likelihood is that the planning team thinks the development might get approval. It also helps calculate the probability of potential income outlined in the commercial tabs. If a site is projected to be worth £100,000 to the business but has very low probability of being approved in planning, that should put significant weighting on what the commercial possibility is for that site/development."

**Business Logic:**
- Planning Score (1-5) represents probability of approval
- This should weight financial projections:
  - Raw value: £100,000
  - Planning Score: 2/5 (40% probability)
  - Weighted value: £40,000

**Reporting Implications:**
- Pipeline reports should show both:
  - **Gross pipeline value** (total if everything gets approved)
  - **Weighted pipeline value** (adjusted by planning probability)
- This gives leadership a more realistic view of actual expected revenue
- Helps prioritise: high-value + high-probability sites are most important

**Formula consideration:**
```
Weighted Value = Projected Revenue × (Planning Score / 5)
```
Or use custom probability mapping: Score 1 = 10%, Score 2 = 30%, Score 3 = 50%, etc.

### Planning Approval = Value Creation

> "The site really gains value once planning has been approved. A site that can't get planning doesn't have any value. You can have all the best ideas in the world as to what could be built there, but what is actually allowed to be built there determines what the revenue opportunity is from that site. Getting planning is a major, major milestone - and it's often the trickiest hurdle to overcome."

**Business Implication:**
- **Pre-planning approval:** Site value is speculative/potential
- **Post-planning approval:** Site has real, quantifiable value

**UI/Reporting Implications:**
- Planning approval should be a **celebrated milestone** (reinforces app personality)
- Pipeline reports should clearly distinguish pre-planning vs post-planning sites
- Financial projections are more meaningful after planning approval
- Consider "Planning Approved" as a key filter/segment in dashboards
- Leadership views: "Total pipeline value with planning" vs "Total pipeline value pending planning"

This is arguably the most important status change in the entire workflow.

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
- [x] How many offers does a typical tender receive?
- [x] Is video actually used often, or rarely?

### Russell's Input:

**Number of Offers:**
> "A tender might receive 5-6 offers."

**Video Usage:**
> "Yes, videos are often used in this instance."

**Marketing Assets Become Primary Development Imagery:**
> "Videos are very important. Some of the marketing materials and imagery generated to market the opportunity might become the primary photos or imagery for the development. They will be the best rendered CGIs, for example, and may also be annotated with critical information to show the potential for the site in its best light."

### Design Implications:

1. **Multiple offers need comparison view:**
   - 5-6 offers is significant - users need to compare bids side-by-side
   - Key comparison points: Media Owner, Offer amount, Premium, Response quality
   - Consider a comparison table or card layout for evaluating offers

2. **Video is a real requirement:**
   - Not a rarely-used feature - videos are actively used for marketing
   - Need proper video upload and playback support
   - Consider video thumbnail previews in the tender materials view

3. **Marketing assets can become the "hero" imagery:**
   - Best CGI renders created for marketing may become the primary development visuals
   - Annotated images showing site potential are valuable beyond just the tender
   - Need ability to **promote** a marketing asset to be the development's primary image
   - This connects to Tab 1's requirement for "proposed asset" visual - marketing often produces the best version
   - Asset flow: Stock placeholder → Design draft → Marketing CGI (often the best) → Final

4. **Tender workflow is substantial:**
   - Materials preparation → Release → Collect responses → Evaluate → Award → Contract
   - Multiple offers to track through evaluation
   - This warrants its own dedicated stage view, not just a sub-tab

5. **Marketing = Sales Process:**
   - "Marketing" is really about selling the advertising opportunity
   - The tender process is competitive bidding from media owners
   - Clear workflow from materials preparation through to contract completion

6. **Rich media gallery needed:**
   - Photos + videos + documents for tender packages
   - These are sales materials - presentation matters
   - Consider a polished gallery view for tender assets

### Asset Promotion Feature

**Key insight:** Marketing often produces the highest-quality visuals because they're designed to sell the opportunity. The system should support:

1. **"Set as primary" action** on any image/video in the marketing gallery
2. **Visual indicator** showing which asset is currently the development's hero image
3. **Source tracking** - know where the primary image came from (Design, Marketing, Site Photo, Stock)
4. **History** - previous primary images preserved, not overwritten

This means images aren't siloed by section (Design images vs Marketing images) - the best image from anywhere can become the face of the development.

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
- [x] How many build parts does a typical development have?
- [x] Is the contractor tendering process always used, or sometimes direct appointment?

### Russell's Input:

**Number of Build Parts:**
> "There might only be 4-5 main build parts."

**Tendering vs Direct Appointment:**
> "There's not always a contract tendering process; sometimes it could be a direct appointment."

### Design Implications:

1. **Build parts are manageable:**
   - 4-5 parts is a small, predictable set
   - Could use a simple card or accordion layout per build part
   - Each part tracks: contractor, cost, timeline, status

2. **Support both tendering and direct appointment:**
   - Tendering workflow: Release tender → Collect responses → Evaluate → Appoint
   - Direct appointment: Skip tendering, just record contractor + cost
   - UI should allow either path - don't force unnecessary steps
   - Perhaps a toggle: "Tender required?" (Yes/No) that shows/hides tender fields

3. **Build stage is relatively lightweight:**
   - Compared to Planning or Commercial, Build is simpler
   - Focus on: Who's doing the work? What does it cost? Is it done?
   - Snagging list is post-build quality control

4. **Snagging is a checklist workflow:**
   - Items added → tracked → completed
   - Date-based tracking (added, estimated completion, actual completion)
   - Could be a simple task-like list within the Build section

---

## Tab 8: Consultancy (6 Sub-tabs) - DEFERRED

**Status:** ⏸️ **DEFERRED** - Not included in core product build

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
- [x] Is Consultancy handled by the same team as Development?
- [x] Should this be a separate area of the app entirely?

### Russell's Input:

**What is Consultancy?**
> "A consultancy is where a landowner has already got an agreement with another media operator to operate an advertising site on their land. As a consultancy, we advise on best terms on renewal of the contract - acting in the interest of the landowner to maximise their deal with their existing operator, vs us taking over a lease on a site.
>
> You're acting as a consultant only and not ever owning or leasing the site, but you would get a revenue share from that consultancy deal."

**Key Distinction:**
- **Development deal:** You acquire/lease the site and operate it yourself
- **Consultancy deal:** You advise the landowner, they keep their existing operator, you get a revenue share for your advisory work

### Decision: Defer Consultancy Module

> "This is a very specific Wildstone requirement and wouldn't be likely to be a requirement of any other development company I'm selling the system to."

**Rationale:**
- ADR-013 establishes this system will be sold to other outdoor advertising developers
- Consultancy is a niche business model specific to one company
- Other developers may not offer consultancy services at all
- Including it would add complexity and confusion to the core product

**Consequence:**
- Consultancy tab will NOT be built in Phase 4
- The 6 sub-tabs (Rent Review, Lease Renewal, Valuation, Revenue Share, Rent Collection, Other) are not in scope
- Data model remains flexible - can add Consultancy as a module later if needed
- Focus development time on the universally-valuable core workflow

**Future consideration:**
If Russell (or a future customer) needs Consultancy, it could be added as an optional module that can be enabled per customer. This aligns with ADR-013's principle of modular features.

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
- [x] Should tasks have priority levels?
- [x] Are notes used for formal audit trail or informal communication?

### Russell's Input:

**Task Priority Levels:**
> "Yes, tasks should definitely have priority levels."

**Notes Purpose:**
> "Notes are just informal communication about what's being discussed."

### Design Implications:

1. **Tasks need priority field:**
   - Add priority levels (e.g., High / Medium / Low)
   - Priority should be visible in task lists and sortable/filterable
   - Consider colour-coding: Red = High, Amber = Medium, Green/Grey = Low
   - High priority tasks should be prominent on dashboards

2. **Notes are informal, not audit trail:**
   - Simple chronological list of comments
   - No formal workflow or approval needed
   - Attachments supported for sharing files in context
   - Think of it like a comment thread on a record
   - Not a replacement for formal documentation (contracts, planning docs, etc.)

3. **Tasks vs Notes distinction:**
   - **Tasks** = Action items with assignee, due date, priority, completion tracking
   - **Notes** = Discussion/commentary, informal updates, context sharing
   - Both are valuable but serve different purposes

4. **Task fields (enhanced from FileMaker):**
   - Task Type
   - Description
   - Priority (NEW - High/Medium/Low)
   - Assigned to
   - Due Date
   - Status (Incomplete/Complete)
   - Created By
   - Created Date
   - Completed Date
   - Department (optional - for routing/filtering)

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
- [x] What are the typical Site Roles?
- [x] What are the Decision Levels?

### Russell's Input:

**Typical Site Roles:**
> "Asset Manager, Marketing, Planning, Administrator"

**Decision Levels:**
> "1. Decision Maker
> 2. Influencer"

### Design Implications:

1. **Site Roles are functional categories:**
   - Asset Manager
   - Marketing
   - Planning
   - Administrator
   - These describe what the contact does / their area of responsibility
   - Should be a dropdown/select field

2. **Decision Levels are simple and important:**
   - **Decision Maker** - Has authority to approve/sign off
   - **Influencer** - Can sway decisions but doesn't have final say
   - Only 2 levels keeps it simple and actionable
   - Very useful for knowing who to prioritise in communications

3. **Contact tracking intelligence:**
   - "Contact left?" + "Date Left" is smart - people change jobs
   - Keeps historical record without deleting data
   - Could filter to show only current contacts by default

4. **Two contact categories (Owner vs Agent):**
   - **Site Owner Contacts** - the landowner's team (direct employees/stakeholders)
   - **Site Owner Agent Contacts** - third parties engaged to act on behalf of site owners (lawyers, property agents, surveyors, etc.)
   - Both can influence decisions - agents aren't just administrative contacts
   - Both need same fields including Site Role and Decision Level
   - Important distinction: you may need to work through the agent to reach the owner

5. **Contact fields (from FileMaker):**
   - Name
   - Company
   - Title
   - Mobile / Telephone / Extension
   - Email
   - Site Role (Asset Manager, Marketing, Planning, Administrator)
   - Decision Level (Decision Maker, Influencer)
   - Contact Left? (Yes/No)
   - Date Left

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

## Summary of Key Decisions

| Tab | Key Insight | Design Implication |
|-----|-------------|-------------------|
| 1. Development | Site context + proposed asset visuals are critical | Two hero visuals always accessible |
| 1. Development | Status and "what's next" matter most | Momentum-focused, action-oriented UI |
| 1. Development | App needs personality | Celebratory, energetic, not just a database |
| 2. Survey | Survey data belongs on Site | Seamless navigation, Site context panel on Development |
| 3. Commercial | Legal role needed; access control required | Role-based visibility for financial data |
| 3. Commercial | Lease expiry = competitive intelligence | Alert system for lease expiries |
| 4. Design | Proposed → Draft → Final status | Design prominence configurable per customer |
| 4. Design | Dual sign-off (internal + client) | Track both approval types |
| 5. Planning | Planning is THE critical bottleneck | Planning Score prominent everywhere |
| 5. Planning | Planning Score = financial weighting | Weighted pipeline value in reports |
| 5. Planning | Planning approval = value creation | Celebrate this milestone |
| 6. Marketing | 5-6 offers typical; video important | Comparison view; rich media gallery |
| 6. Marketing | Marketing assets become hero imagery | "Set as primary" feature across all assets |
| 7. Build | 4-5 build parts; not always tendered | Support both tender and direct appointment |
| 8. Consultancy | **DEFERRED** - company-specific | Not in core product (ADR-014) |
| 9. Tasks | Priority levels needed | High/Medium/Low with colour coding |
| 9. Notes | Informal communication | Simple comment thread, not audit trail |
| 10. Contacts | Site Roles + Decision Levels | Know who matters and their authority |

## Next Steps

With the tab review complete, the next phase is to:
1. Design the Development detail page layout based on these insights
2. Determine which fields appear on stage cards vs full detail views
3. Create wireframes/mockups for key screens
4. Begin Phase 4 feature development
