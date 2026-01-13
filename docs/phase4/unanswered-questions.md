# Unanswered Questions - Phase 4

This document tracks questions that have arisen during development that need Russell's input or a decision.

---

## Schema Gaps - Commercial Section

**Date raised:** 13 Jan 2026

Some fields from FileMaker's Contract-Terms tab are not in the current Prisma schema:

| Field | In FileMaker | In Prisma | Question |
|-------|--------------|-----------|----------|
| Planning Consent Deadline | ✅ | ❌ | Add to schema, or belongs in Planning section? |
| Planning Consent Term | ✅ | ❌ | Add to schema? (text description field) |
| Contractual Planning Submission Date (Y/N) | ✅ | ❌ | Add to schema? |
| Planning Submission Deadline | ✅ | ❌ | Add to schema, or belongs in Planning section? |
| Planning Submission Term | ✅ | ❌ | Add to schema? (text description field) |
| Client Approval to Submit (Y/N) | ✅ | ❌ | Add to schema? |
| Planning Client Approval Term | ✅ | ❌ | Add to schema? (text description field) |
| Scope of Works Approval Deadline | ✅ | ❌ | Add to schema? |
| Scope of Works Approval Term | ✅ | ❌ | Add to schema? (text description field) |
| Build Deadline | ✅ | ❌ | Add to schema, or belongs in Build section? |
| Build Deadline Term | ✅ | ❌ | Add to schema? (text description field) |
| Contract Expires Date | ✅ | ❌ | Add to schema? |
| Contract Expires Term | ✅ | ❌ | Add to schema? (text description field) |
| Completion Date | ✅ | ❌ | Add to schema? |
| Completion Date Term | ✅ | ❌ | Add to schema? (text description field) |
| Contract Status | ✅ | ❌ | Add to schema? (dropdown/lookup?) |
| Contract Status Updated | ✅ | ❌ | Add to schema? (date field) |

**Options:**
- A) Add all fields to Prisma schema in Development model
- B) Some fields belong in Planning/Build sections - move them there
- C) These are contractual deadlines that should stay in Commercial but trigger alerts in other sections

**Decision needed:** Where should planning/build deadlines from contracts live?

---

## Total Profit Calculation

**Date raised:** 13 Jan 2026

FileMaker shows "Total Profit" as a calculated field (Profit Year 1 + (Profit Subsequent Years × remaining years)).

**Question:** Should Total Profit be:
- A) Calculated on the fly in the UI (not stored)
- B) Stored in the database
- C) Shown as a formula breakdown so users understand the calculation

---

## End Date Calculation

**Date raised:** 13 Jan 2026

FileMaker shows "End Date" in the Revenue section, which appears to be calculated from Start Date + Term.

**Question:** Should End Date be:
- A) Calculated on the fly (Start Date + Term years)
- B) Stored separately (allows override if needed)

---

## Existing Lease - Multiple Records?

**Date raised:** 13 Jan 2026

FileMaker's Existing Lease tab has Add/Remove buttons, suggesting multiple existing leases could be recorded.

Current Prisma schema has single fields on Development:
- `currentRentPerAnnum`
- `currentLeaseStartDate`
- `currentLeaseEndDate`
- `currentLeaseTerm`
- `currentLeaseUrl`

**Question:** Do we need to support multiple existing leases per development, or is one sufficient?

---

## Navigation Between Filtered Records

**Date raised:** 13 Jan 2026 (from session summary)

Russell mentioned wanting to:
1. Filter developments (e.g., by site owner, status)
2. Navigate between filtered results with forward/back arrows
3. See detail view within that filtered context

**Question:** How should this work technically?
- A) URL-based filtering with prev/next navigation preserving filters
- B) Client-side filtering with state management
- C) Something simpler for now, enhanced later

---

## Sticky Header on Detail Pages

**Date raised:** 13 Jan 2026

The header and site context (including map/photo thumbnails) on the Development detail page should remain visible as you scroll, so users always know which development they're looking at.

**Question:** Should we make the header sticky?
- A) Yes - header + site context both sticky
- B) Just the header row (title, status, badges) - site context scrolls
- C) Collapsible sticky header that shrinks on scroll

---

## User Menu / Sign-out Location

**Date raised:** 13 Jan 2026
**RESOLVED:** 13 Jan 2026 - Moved to sidebar bottom

User info and sign-out button now live at the bottom of the left sidebar, following common app patterns (Slack, Notion, VS Code). Header is now mobile-only (hamburger menu).

---

## Visual Differentiation: Workflow vs Reference Content

**Date raised:** 13 Jan 2026

On the Development detail page, the two-column layout has different purposes:
- **Left column** = Workflow progression (stage cards: Commercial → Design → Planning → Marketing → Build)
- **Right column** = Reference/supplementary information (Key Contacts, Internal Team, Recent Activity, Quick Info)

Currently both use the same white card styling, which doesn't communicate this distinction.

**Question:** How should we visually differentiate these areas?
- A) Different background colours (e.g., white cards on left, light grey or subtle tint on right)
- B) Different card styling (e.g., bordered cards on right, filled cards on left)
- C) Section header styling differences
- D) Subtle background colour for the entire right column area

**Goal:** Make it visually clear that the left side is "what you're working through" and the right side is "reference info you might need".

---

## Projects - Filtering/Grouping Mechanism (Not Detail Page Display)

**Date raised:** 13 Jan 2026
**Decision made:** Projects are for grouping/filtering, not detail page display

**Context:** In FileMaker, "Related Projects" appeared on the Development main tab. A Project connects multiple developments that share a common initiative (e.g., "Digital Network - Manchester", "High Street Regeneration", "City Centre Redevelopment").

**Decision:** Projects should be used for filtering and grouping on list pages, NOT displayed on the development detail page.

**Implementation:**
1. **Development list page** - Add "Project" as a filter/sort option
2. **Potentially a Projects page** - View all developments grouped by project
3. **Development detail page** - No projects section needed (removed from audit as "not displayed")

**Rationale:** Users want to view developments by site owner, developer, status, OR by project. It's a categorisation mechanism for list views, not context needed when viewing a single development's details.

---

## Review Items (Not Questions)

These items need review on Railway but aren't blocking questions:

- [ ] Sites list page - needs review
- [ ] Developments list page - needs review
- [ ] Development detail page - all expandable cards

---

*Last updated: 13 Jan 2026*
