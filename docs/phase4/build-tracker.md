# Phase 4 Build Tracker

**Purpose:** Track progress across all screens, schema audits, and business logic implementation.

---

## Layout Schema Audits

Each layout needs a field-by-field audit comparing FileMaker → Prisma → UI.

| Layout | Audit Doc | Status | Notes |
|--------|-----------|--------|-------|
| Development Detail | `development-schema-audit.md` | COMPLETE | 10 tabs audited |
| Site Detail | `site-schema-audit.md` | NOT STARTED | |
| Contact Detail | `contact-schema-audit.md` | NOT STARTED | |
| Organisation Detail | `organisation-schema-audit.md` | NOT STARTED | |
| Dashboard - Home | (combined in dashboard-audit.md) | NOT STARTED | |
| Dashboard - Sites List | (combined in dashboard-audit.md) | NOT STARTED | |
| Dashboard - Developments List | (combined in dashboard-audit.md) | NOT STARTED | |
| Dashboard - Planning | (combined in dashboard-audit.md) | NOT STARTED | |
| Dashboard - Tasks | (combined in dashboard-audit.md) | NOT STARTED | |

---

## Screen Build Status

### Detail Pages

| Screen | Route | Built | Schema Complete | Fields Displayed | Edit Working | Notes |
|--------|-------|-------|-----------------|------------------|--------------|-------|
| Development Detail | `/developments/[id]` | YES | Partial | ~40% | YES | Expandable cards done |
| Site Detail | `/sites/[id]` | NO | - | - | - | |
| Contact Detail | `/contacts/[id]` | NO | - | - | - | |
| Organisation Detail | `/organisations/[id]` | NO | - | - | - | |

### List Pages (Dashboards)

| Screen | Route | Built | Filtering | Sorting | Pagination | Notes |
|--------|-------|-------|-----------|---------|------------|-------|
| Home Dashboard | `/` | YES | NO | NO | NO | Basic cards only |
| Sites List | `/sites` | YES | Basic | NO | NO | Needs review |
| Developments List | `/developments` | YES | Basic | NO | NO | Needs review |
| Planning Dashboard | `/planning` | NO | - | - | - | |
| Tasks Dashboard | `/tasks` | NO | - | - | - | |
| Companies & Contacts | `/contacts` | NO | - | - | - | |

### Create/Edit Forms

| Screen | Route | Built | Validation | All Fields | Notes |
|--------|-------|-------|------------|------------|-------|
| Create Development | `/developments/new` | NO | - | - | |
| Create Site | `/sites/new` | NO | - | - | |
| Create Contact | `/contacts/new` | NO | - | - | |
| Create Organisation | `/organisations/new` | NO | - | - | |

---

## Business Logic Implementation

See `business-logic-checklist.md` for detailed tracking.

| Category | Items | Implemented | Tested |
|----------|-------|-------------|--------|
| Calculated Fields | 8 | 0 | 0 |
| Validation Rules | 4 | 0 | 0 |
| Auto-Population | 5 | 0 | 0 |
| Status Tracking | 4 | 0 | 0 |
| Date Calculations | 6 | 0 | 0 |
| Conditional UI | 8 | 0 | 0 |

---

## Schema Gaps to Address

From the development audit, these schema changes are needed before building certain features:

### Priority 1: Marketing Tab (Blocking)
- [ ] Add tender workflow fields to Development
- [ ] Enhance TenderOffer table
- [ ] Add TenderDocument table

### Priority 2: Contact Tracking
- [ ] Add `hasLeft` boolean to Contact
- [ ] Add `leftDate` to Contact

### Priority 3: Design Enhancements
- [ ] Add `designStatus` enum (Proposed/Draft/Final)
- [ ] Add client sign-off fields

### Priority 4: Build Tender
- [ ] Add tender fields to DevelopmentBuildPart

---

## Review Checklist

Before marking a screen as complete:

- [ ] All FileMaker fields mapped and accounted for
- [ ] Schema has all required fields
- [ ] UI displays all priority fields
- [ ] Edit mode works for editable fields
- [ ] Validation rules implemented
- [ ] Business logic (calculations, auto-population) working
- [ ] Mobile responsive
- [ ] Tested on Railway

---

## Questions Blocking Progress

See `unanswered-questions.md` for full details.

**Currently blocking:**
- Deal Type "Push" - what is it?
- Planning date calculation approach
- Development name auto-generation approach
- Status change audit trail approach

---

*Last updated: 13 Jan 2026*
