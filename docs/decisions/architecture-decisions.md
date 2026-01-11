# Architecture Decision Records (ADR)

This document tracks architectural and design decisions for the Property Development Tracker migration project.

---

## Summary

| ID | Decision | Category | Status | Priority | Date |
|----|----------|----------|--------|----------|------|
| 001 | Approval Workflow for Status Changes | Business Logic | Deferred | Medium | 2026-01-11 |
| 002 | Migration Approach: Improve, Don't Replicate | Migration | Accepted | High | 2026-01-11 |
| 003 | Application Entry Point and Navigation | UI/UX | Proposed | High | 2026-01-11 |
| 004 | System Purpose and Management Information | Business Logic | Accepted | High | 2026-01-11 |

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
| **Status** | Proposed |
| **Priority** | High |
| **Date** | 2026-01-11 |
| **Revisit** | Before Phase 4, after reviewing FileMaker layouts |

#### Context

In FileMaker, there are 4 dashboards (Sites, Developments, Planning, Tasks). The relationship between Sites and Developments is key:
- **Site** = a physical location (may have one or more developments)
- **Development** = the primary working level for users

Users primarily work at the Development level, but Site acts as an entry point to reach Developments. The original FileMaker navigation may not have been optimal.

#### Decision

Defer the final navigation structure decision until the Phase 4 review. During Phase 3, build a flexible navigation shell that can be adjusted based on the review findings.

Key questions to answer in review:
- Should users land on a Dashboard, Sites list, or Developments list?
- How do users navigate between Site and its Developments?
- Which dashboards are actually needed?
- Should the mobile experience differ from desktop?

#### Consequences

- Phase 3 navigation will be a placeholder structure
- Final navigation will be designed after reviewing FileMaker layouts and discussing workflows
- The system may end up with a different navigation model than FileMaker

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
