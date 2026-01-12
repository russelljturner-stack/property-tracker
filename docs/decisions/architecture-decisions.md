# Architecture Decision Records (ADR)

This document tracks architectural and design decisions for the Property Development Tracker migration project.

---

## Summary

| ID | Decision | Category | Status | Priority | Date |
|----|----------|----------|--------|----------|------|
| 001 | Approval Workflow for Status Changes | Business Logic | Deferred | Medium | 2026-01-11 |
| 002 | Migration Approach: Improve, Don't Replicate | Migration | Accepted | High | 2026-01-11 |
| 003 | Application Entry Point and Navigation | UI/UX | Accepted | High | 2026-01-12 |
| 004 | System Purpose and Management Information | Business Logic | Accepted | High | 2026-01-11 |
| 005 | Role-Based Dashboards and Access Control | UI/UX | Accepted | High | 2026-01-12 |
| 006 | Active Work Focus Principle | UI/UX | Accepted | High | 2026-01-12 |
| 007 | External Integration Strategy | Integration | Accepted | Medium | 2026-01-12 |
| 008 | Mobile and Field Use Requirements | UI/UX | Accepted | High | 2026-01-12 |
| 009 | Notification System | Technical | Accepted | Medium | 2026-01-12 |
| 010 | Stalled Development Detection | Business Logic | Accepted | Medium | 2026-01-12 |
| 011 | Search and Discovery | UI/UX | Accepted | High | 2026-01-12 |
| 012 | Site Pipeline Status Model | Business Logic | Accepted | High | 2026-01-12 |
| 013 | Product Strategy: Built to Sell | Technical | Accepted | High | 2026-01-12 |
| 014 | Consultancy Module Deferred | Deferred Features | Deferred | Low | 2026-01-12 |

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision made, will be implemented |
| **Deferred** | Noted for future consideration |
| **Superseded** | Replaced by a later decision |
| **Rejected** | Considered but decided against |

## Priority Definitions

| Priority | Meaning |
|----------|---------|
| **High** | Blocking or critical to core functionality |
| **Medium** | Important but not blocking progress |
| **Low** | Nice to have, revisit when time allows |

## Category Definitions

| Category | Covers |
|----------|--------|
| **Business Logic** | Approval workflows, calculation rules, status transitions |
| **Technical** | Database design, API structure, authentication approach |
| **Migration** | Data handling, what to keep/archive, FileMaker-specific issues |
| **UI/UX** | Layout decisions, navigation, mobile design |
| **Integration** | Google Maps, email, file storage |
| **Deferred Features** | Things to add post-launch |

---

## Decisions

---

### ADR-001: Approval Workflow for Status Changes

| Field | Value |
|-------|-------|
| **Category** | Business Logic |
| **Status** | Deferred |
| **Priority** | Medium |
| **Date** | 2026-01-11 |
| **Revisit** | After initial deployment |

#### Context

The FileMaker system allows any user to change development status directly (e.g., from "Design" to "Build"). There is no approval workflow requiring sign-off from managers or other roles before certain status transitions.

During migration planning, Russell identified that approval workflows would be a valuable addition but the specific business rules are not yet defined.

#### Decision

Defer implementation of approval workflows. Build the initial system with direct status changes (matching current FileMaker behaviour), but design the database and code structure to accommodate approval workflows later.

#### Consequences

- **Now:** Status changes work like FileMaker - simple and direct
- **Later:** Once the system is in use and requirements are clearer, we can add rules such as:
  - "Only managers can move a development to 'Build' status"
  - "Moving to 'Complete' requires sign-off from finance"
  - "Planning submissions need director approval"

#### Notes

The User and Role tables in the database already support granular permissions, which will make adding approval logic straightforward when requirements are defined.

---

### ADR-002: Migration Approach: Improve, Don't Replicate

| Field | Value |
|-------|-------|
| **Category** | Migration |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-11 |

#### Context

The FileMaker system was essentially a beta/prototype. While it captured the core data structures and workflows, it:
- Never fully achieved the right UX/UI
- Was not widely adopted by users
- Contains design decisions that were compromises or first attempts

The original system was rolled out but never really hit the mark. User apathy and lack of proper training/cascading meant it was never fully utilised.

#### Decision

This migration is **not a like-for-like replication**. Every decision from FileMaker should be critically reviewed. The goal is to build the system it should have been - a significantly improved application.

A structured review will be conducted before Phase 4 (Feature Development) to define:
1. Core purpose - What is this system fundamentally for?
2. Key workflows - What do users actually need to do daily?
3. Pain points - What was frustrating about FileMaker?
4. Unused features - What can we drop entirely?
5. Missing features - What should have been there?
6. UI/UX patterns - How should navigation and screens actually work?

#### Consequences

- Phase 3 proceeds as planned (technical foundation)
- Before Phase 4, a formal review session will be held
- Features will be built based on real needs, not inherited compromises
- Some FileMaker features may be dropped entirely
- New features not in FileMaker may be added

---

### ADR-003: Application Entry Point and Navigation

| Field | Value |
|-------|-------|
| **Category** | UI/UX |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

In FileMaker, there are 4 dashboards (Sites, Developments, Planning, Tasks). The relationship between Sites and Developments is key:
- **Site** = a physical location (may have one or more developments)
- **Development** = the primary working level for users

Users primarily work at the Development level, but Site acts as an entry point to reach Developments. The Phase 4 pre-build review clarified the navigation requirements.

#### Decision

**Entry Point:** Users land on a role-specific dashboard (not a list view).

**Primary Entity:** Development is the primary working entity. Users work on developments day-to-day.

**Site as Reference:** People refer to sites by name in conversation ("92 Cromwell Road") but mean the development they're working on there. The UI must support both mental models.

**Naming Convention:** Developments display as "[Type/Size] at [Site Name]" (e.g., "48 Sheet at 92 Cromwell Road").

**Key Navigation Paths:**
- Dashboard → Development (1 click)
- Development → Site details (1 click)
- Site → Related contacts (1 click)
- Development → Stage information (always visible)

**Stage Navigation:** The pipeline stages (Negotiation → Design → Planning → Marketing → Tendering) must be easy to see and navigate.

#### Consequences

- Build role-specific dashboards as the landing page
- Development lists/cards are the primary navigation element
- Site information is always accessible but secondary to development
- Search by site name returns relevant developments
- Mobile and desktop share the same navigation model (responsive)

---

### ADR-004: System Purpose and Management Information

| Field | Value |
|-------|-------|
| **Category** | Business Logic |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-11 |

#### Context

The FileMaker system became a data repository but never delivered on its core purpose: providing actionable management information. The 8 reports were never fully completed or utilised. This migration must address that gap.

#### Core Purpose

The system tracks **development sites for Wildstone** - both their own projects and competitor sites. It serves two primary purposes:

**1. Operational Efficiency**
- Stop developers repeatedly visiting the same sites without context
- Provide full site history so developers understand what's been tried before
- Enable smooth handover between team members at different development stages
- Prevent duplication of effort across the team

**2. Management Information**
- Track individual developer workloads and progress
- Monitor financial projections across development sites
- Identify bottlenecks (e.g., sites stuck in planning)
- Forecast when sites will go live
- Review competitor activity (what advertising has been approved nearby)

#### Key Data Relationships

- **Sites** can have **multiple Developments** (this complexity is easy to get overwhelmed by)
- **Developments** move through stages and can be handed between team members
- **Competitor sites** need to be tracked for market intelligence

#### Decision

The new system must be designed around delivering management insights, not just storing data. This means:

1. **Dashboards should answer questions**, not just list records:
   - "Which sites are stuck in planning?"
   - "What's my team's pipeline worth?"
   - "What competitor activity is near this location?"

2. **Reports should be first-class features**, not afterthoughts:
   - Planning schedule with upcoming deadlines
   - Developer workload/progress
   - Financial forecasting
   - Competitor analysis

3. **The UI should surface insights**, not hide them in reports:
   - Status indicators, alerts, and summaries on main screens
   - Easy filtering by bottleneck/stage
   - Visual progress tracking

#### Consequences

- Phase 4 must prioritise dashboard and reporting features
- UI design should focus on surfacing key information, not just CRUD forms
- We may need to define KPIs and metrics during the Phase 4 review
- Some FileMaker reports may be dropped; new ones may be needed

---

### ADR-005: Role-Based Dashboards and Access Control

| Field | Value |
|-------|-------|
| **Category** | UI/UX |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

Different roles have different daily needs. The FileMaker system had a one-size-fits-all approach that didn't serve anyone particularly well. The Phase 4 review identified specific needs by role.

#### Decision

**Each role gets a tailored dashboard:**

| Role | Dashboard Focus |
|------|-----------------|
| **Developer** | My active developments, my tasks due, my priorities |
| **Planner** | My active workload, upcoming planning deadlines |
| **Build Manager** | My active workload, construction schedules |
| **Sales/Tendering** | My active workload, tender deadlines |
| **Leadership** | Pipeline by stage, revenue potential, team workloads, red flags/bottlenecks |
| **Administrator** | System overview + configuration access |

**Access Control Model:**

| Principle | Rule |
|-----------|------|
| Involvement | If assigned to a development, see everything (except financials if role restricts) |
| Same role, not assigned | Can view active developments only (holiday cover) |
| Different role, not assigned | No access (unless Leadership/Admin) |
| Financial data | Restricted to: Developer, Sales/Tendering, Leadership, Admin |

#### Consequences

- Build 2-3 dashboard variants (operational, leadership, admin)
- Dashboard components are reusable but composed differently per role
- Access control middleware checks role + assignment
- Financial fields conditionally hidden based on role

---

### ADR-006: Active Work Focus Principle

| Field | Value |
|-------|-------|
| **Category** | UI/UX |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

The FileMaker system could feel overwhelming because historical data and active work were given equal prominence. Users need to focus on what they're doing now, not what happened years ago.

#### Decision

**The system answers: "What do I need to do next?" not "What's everything that ever happened?"**

| View Type | Focus | Historical Data |
|-----------|-------|-----------------|
| Dashboards | Active developments only | Not shown |
| Development lists | Active by default | Filter to show historical |
| Site detail | Most recent/active development prominent | History available but collapsed |
| Search results | Active developments first | Historical clearly marked |

**"Active" definition:**
- Development is not in a terminal status (Completed, Cancelled, On Hold)
- Has had activity within a reasonable period

**Historical access:**
- Always available via explicit action (filter, expand, drill-down)
- Never clutters the default working view
- Valuable for context when viewing a site ("3 previous developments here")

#### Consequences

- Default queries filter to active records
- Lists have "Show historical" toggle
- Site views show history count as a badge, expandable
- Dashboard metrics exclude historical data unless specifically requested

---

### ADR-007: External Integration Strategy

| Field | Value |
|-------|-------|
| **Category** | Integration |
| **Status** | Accepted |
| **Priority** | Medium |
| **Date** | 2026-01-12 |

#### Context

The FileMaker system was isolated - no connection to Outlook, documents on the server, or other business systems. This created data silos and duplicate work. The Phase 4 review identified integration as a key gap.

#### Decision

**Integration priorities (in order):**

| Priority | Integration | Scope | Phase |
|----------|-------------|-------|-------|
| 1 | Manual activity logging | Log "I contacted X on Y date" | Phase 4 (core) |
| 2 | Document linking | Link to files on network/cloud storage | Phase 4 (core) |
| 3 | Outlook Calendar/Tasks | Two-way sync of deadlines and tasks | Post-launch |
| 4 | Outlook Email | Pull emails into site/contact history | Post-launch |
| 5 | Outlook Contacts | Sync contact details | Post-launch |

**Approach:**
- Build manual logging first - works immediately, no external dependencies
- Design data model to support richer integration later (activity log, document references)
- Outlook integration via Microsoft Graph API - complex, requires proper scoping
- File storage approach TBC based on company infrastructure (on-premise vs cloud)

#### Consequences

- Activity logging table needed in database (already exists in schema)
- Document/attachment linking needs URL-based approach initially
- Microsoft 365 integration is a separate project post-launch
- Photo uploads from mobile will use cloud storage (specific provider TBC)

---

### ADR-008: Mobile and Field Use Requirements

| Field | Value |
|-------|-------|
| **Category** | UI/UX |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

FileMaker was designed for field use but never properly tested or used on mobile. The Phase 4 review confirmed field access is critical for developers and leadership.

#### Decision

**Mobile use cases:**

| User | Scenario | Needs |
|------|----------|-------|
| Developer | Standing near a site | Quick lookup: is this logged? Quick actions: photo, notes |
| Leadership | Driving past opportunity | Check if site exists, or quick-log for follow-up |

**Mobile-specific features:**

| Feature | Description |
|---------|-------------|
| Auto-location | Detect device location, show nearby sites on map |
| Configurable radius | User adjusts search radius based on area density |
| Quick site check | "Is there already a site here?" - fast answer |
| Quick capture | Photo + notes with minimal taps |
| Offline consideration | Core lookups should work with poor connectivity (deferred) |

**Design principles:**
- Responsive design, not separate mobile app
- Mobile gets same data, simplified presentation
- Large touch targets, minimal typing
- Camera integration for photos
- GPS integration for location

#### Consequences

- All screens must be responsive (Tailwind CSS helps here)
- Mobile testing is part of development, not afterthought
- Photo upload flow needs designing
- Map view is high priority
- Consider progressive web app (PWA) for better mobile experience

---

### ADR-009: Notification System

| Field | Value |
|-------|-------|
| **Category** | Technical |
| **Status** | Accepted |
| **Priority** | Medium |
| **Date** | 2026-01-12 |

#### Context

Users need to know when things require their attention without constantly checking the system. The FileMaker system had no notification capability.

#### Decision

**Notification triggers:**

| Event | Who Gets Notified |
|-------|-------------------|
| Assigned to development | The assignee |
| Assigned a task | The assignee |
| Development stalled (no activity) | The assignee + their manager |
| Planning decision due soon | Development owner |
| Task overdue | Task owner |

**Notification channels:**
- In-app notifications (bell icon, notification centre)
- Email notifications (configurable per user)

**User control:**
- Users can configure which notifications they receive
- Email notifications can be disabled individually
- In-app notifications always shown

#### Consequences

- Notification table needed in database
- Email sending infrastructure required (e.g., SendGrid, Resend)
- Background job for checking stalled developments
- Notification preferences in user settings
- Notification UI component (bell icon with count)

---

### ADR-010: Stalled Development Detection

| Field | Value |
|-------|-------|
| **Category** | Business Logic |
| **Status** | Accepted |
| **Priority** | Medium |
| **Date** | 2026-01-12 |

#### Context

Developments can go quiet without anyone noticing. Leadership needs visibility into bottlenecks and stalled work. The Phase 4 review defined what "stalled" means.

#### Decision

**Definition of "stalled":**

A development is considered stalled when ALL of the following are true:
- No field changes in 30 days
- No new tasks attached in 30 days
- No activity log entries in 30 days
- Development is in an active status (not Completed/Cancelled/On Hold)

**Stalled handling:**
- Flag appears on development card/detail
- Appears in leadership dashboard "Red Flags" section
- Triggers notification to assignee and their manager
- "Last activity" date shown prominently

**Configurable:**
- 30-day threshold is a starting point
- May vary by stage (e.g., longer acceptable during Planning wait)
- System setting, adjustable by admin

#### Consequences

- Need "last activity" tracking (already have updatedAt on most tables)
- Background job to check for stalled developments daily
- Dashboard component for "stalled" list
- Notification integration per ADR-009

---

### ADR-011: Search and Discovery

| Field | Value |
|-------|-------|
| **Category** | UI/UX |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

Users need to find sites and developments quickly. The Phase 4 review identified the primary search patterns.

#### Decision

**Search methods:**

| Method | Description |
|--------|-------------|
| Text search | Search by site name, address, postcode |
| Map search | Visual search - click on map, see nearby sites |
| Road-based search | "Show all sites on M1" - corridor search (future) |

**Search behaviour:**
- Primary search box searches site name/address
- Results show the Site with its active Development(s)
- Active developments shown first, historical clearly marked
- Search is fast - typeahead/autocomplete

**Result display:**
- Site name prominent
- Active development(s) listed with stage and assignee
- "X historical developments" as expandable section
- Click goes to development detail (not site)

**Map search:**
- Auto-detect location option
- Configurable radius (default ~100m, user adjustable)
- Pins show sites with colour coding by stage
- Click pin to see site summary, click through to detail

#### Consequences

- Search index needed for fast text search
- Map component with location services
- Site/Development query optimised for search result format
- Mobile: map search may be primary interface

---

### ADR-012: Site Pipeline Status Model

| Field | Value |
|-------|-------|
| **Category** | Business Logic |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

The FileMaker system had 19 "Development Status" values in a single table, but analysis revealed these statuses actually cover two distinct workflows:

1. **Site Pipeline** - Early-stage work before a Development exists (identifying sites, contacting landowners, negotiating terms)
2. **Development Workflow** - Project work once committed to building something specific

The existing `SiteStatus` table only has 2 values (Live, Dead), which indicates whether a site exists, not where it is in the pipeline.

#### Decision

**Split statuses into two models:**

**SitePipelineStatus** (new table for Sites without active Developments):

| Status | Description |
|--------|-------------|
| Opportunity identified | Site first logged |
| Contact made with land owner / agent | In discussion |
| Land owner / agent can't be contacted | Parked - needs different approach |
| Offer in negotiation | Active discussions on terms |
| Offers declined - no deal reached | Parked - try again later |

**DevelopmentStatus** (existing table, refined for Development workflow):

| Status | Stage | Description |
|--------|-------|-------------|
| Offer accepted | Negotiation | Deal agreed, Development created |
| Head of terms agreed | Negotiation | Formal terms documented |
| ASGF required | Negotiation | Advertising Safety Guidance Form needed |
| Awaiting ASGF outcome | Negotiation | Waiting on ASGF approval |
| Planning / advert application submitted | Planning | With local authority |
| Planning / advert consent refused | Planning | Need to appeal or redesign |
| Planning / advert consent granted | Planning | Approved - can proceed |
| Contracts in negotiation | Contracts | Legal stage |
| Contracts exchanged | Contracts | Legally committed |
| Out to tender | Marketing | Finding advertisers |
| Site in development | Build | Construction underway |
| Site operational | Complete | Live and earning |
| Development on hold | Paused | Temporary pause |
| Development dropped | Terminal | Cancelled/abandoned |

**Workflow trigger:**
- When a Site reaches "Offer accepted", a Development is created
- The Site can remain in pipeline status or be cleared once Development exists

**Dashboard implications:**
- Developers see "My Pipeline Sites" (Sites with pipeline status, no active Development)
- Developers see "My Active Developments" (Developments in progress)
- Both are work requiring action

#### Consequences

- New `SitePipelineStatus` lookup table needed
- New `pipelineStatusId` field on Site model
- Existing `SiteStatus` (Live/Dead) remains unchanged
- Seed data needed for both status tables
- Dashboard filters by pipeline status for "Sites needing work"

---

### ADR-013: Product Strategy: Built to Sell

| Field | Value |
|-------|-------|
| **Category** | Technical |
| **Status** | Accepted |
| **Priority** | High |
| **Date** | 2026-01-12 |

#### Context

This project started as a FileMaker migration for a specific use case. However, the strategic vision is broader: Russell wants to sell the application to other outdoor advertising developers. This changes the project from a bespoke internal tool to a **product**.

#### Decision

**The system will be designed as a sellable product, not a one-off internal tool.**

This affects decisions at multiple levels:

**Design & UX:**
- The app should have personality - action-oriented, celebratory, energetic
- Users should *want* to engage with it, not feel it's a chore
- Professional visual design that looks like a product, not a database interface
- Branding should be flexible (not hardcoded company references)

**Architecture:**
- White-labelling capability - branding/colours configurable per customer
- Multi-tenant ready - could support multiple companies in future
- Clean separation of business logic from company-specific customisation
- Modular features that can be enabled/disabled per customer

**Engineering:**
- Fast iterative updates - architecture that supports rapid changes
- Bespoke versions per customer should be achievable
- Well-documented codebase (for maintainability and potential handover)
- Standard patterns that any developer could understand

**Sales positioning:**
- "Designed to make users want to engage with it"
- "Fast iterative development capability"
- "White-label ready"
- "Proven in real-world outdoor advertising operations"

#### Consequences

- Avoid hardcoding company-specific values - use configuration
- Theme/branding layer needed (colours, logo, terminology)
- Consider tenant model in database design (even if single-tenant for now)
- Documentation becomes more important
- Code quality standards matter for future maintenance
- Features should be generalised, not overly specific to one workflow
- UI copy should use generic terms ("your company") not specific names

#### Notes

This doesn't mean building everything upfront - but making choices that don't *prevent* these capabilities later. The first customer is Russell's own use case; the architecture should support growth beyond that.

---

### ADR-014: Consultancy Module Deferred

| Field | Value |
|-------|-------|
| **Category** | Deferred Features |
| **Status** | Deferred |
| **Priority** | Low |
| **Date** | 2026-01-12 |
| **Revisit** | Post-launch, if customer demand emerges |

#### Context

The FileMaker system includes a Consultancy section with 6 sub-tabs (Rent Review, Lease Renewal, Valuation, Revenue Share, Rent Collection, Other). Consultancy represents a different business model where:

- A landowner already has an agreement with another media operator
- You act as an advisor to help the landowner maximise their deal
- You receive a revenue share rather than operating the site yourself

During review, Russell identified that this is a specific business model unique to one company and would not be a requirement for other outdoor advertising developers who might purchase this system.

#### Decision

**Consultancy will NOT be built in Phase 4. It is deferred as a potential future module.**

The core product will focus on the universally-valuable Development workflow:
- Site identification and survey
- Commercial agreement
- Design
- Planning
- Marketing (tender)
- Build
- Live operation

This aligns with ADR-013 (Product Strategy: Built to Sell) - the system should be generalised, not overly specific to one workflow.

#### Consequences

- 6 sub-tabs not built, saving significant development time
- Core product is cleaner and more focused
- Data model remains flexible to add Consultancy later if needed
- If Russell needs Consultancy for internal use, it can be added as a customer-specific module
- Other customers won't see irrelevant features

#### Notes

Consultancy could be implemented as an optional module in future, enabled per customer. The pattern of "Site has Developments" could extend to "Site has Developments OR Consultancies" without major architectural changes.

---

<!--
Template for new decisions:

### ADR-XXX: [Title]

| Field | Value |
|-------|-------|
| **Category** | Business Logic / Technical / Migration / UI/UX / Integration / Deferred Features |
| **Status** | Proposed / Accepted / Deferred / Superseded / Rejected |
| **Priority** | High / Medium / Low |
| **Date** | YYYY-MM-DD |
| **Revisit** | [When to revisit, if applicable] |

#### Context

[Why is this decision needed? What's the background?]

#### Decision

[What was decided, or what is being deferred/proposed?]

#### Consequences

[What are the implications of this decision?]

#### Notes

[Any additional context, links, or references]

-->
