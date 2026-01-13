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

## Review Items (Not Questions)

These items need review on Railway but aren't blocking questions:

- [ ] Sites list page - needs review
- [ ] Developments list page - needs review
- [ ] Development detail page - all 8 improvements from previous session

---

*Last updated: 13 Jan 2026*
