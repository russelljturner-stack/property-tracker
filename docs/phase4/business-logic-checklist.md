# Business Logic Checklist

**Purpose:** Track implementation of all business logic extracted from FileMaker DDR.
**When to review:** After completing all layout builds, before final testing.

---

## 1. Calculated Fields

These fields need calculation logic in the web app.

| ID | Calculation | Formula | Where Used | Status | Notes |
|----|-------------|---------|------------|--------|-------|
| CALC-01 | Profit Year 1 (Lease) | `rentalValue - leasePerAnnum` | Development Commercial | NOT STARTED | Deal Type 1 |
| CALC-02 | Profit Year 1 (Acquisition) | `rentalValue - purchasePrice` | Development Commercial | NOT STARTED | Deal Type 5 |
| CALC-03 | Profit Thereafter (Lease) | `rentalValue - leasePerAnnum` | Development Commercial | NOT STARTED | Same each year |
| CALC-04 | Profit Thereafter (Acquisition) | `rentalValue` | Development Commercial | NOT STARTED | No ongoing cost |
| CALC-05 | Total Profit (Lease) | `(rentalValue - leasePerAnnum) * term` | Development Commercial | NOT STARTED | |
| CALC-06 | Total Profit (Acquisition) | `(rentalValue * term) - purchasePrice` | Development Commercial | NOT STARTED | |
| CALC-07 | Total Panel Count | `quantity * (doubleSided ? 2 : 1)` | Development Detail | NOT STARTED | |
| CALC-08 | End Date | `startDate + term years` | Development Commercial | NOT STARTED | |

**Decision needed:** Calculate on-the-fly or store? (See unanswered-questions.md)

---

## 2. Date Calculations

Auto-calculated deadline dates with override capability.

| ID | Calculation | Formula | Override Field | Status | Notes |
|----|-------------|---------|----------------|--------|-------|
| DATE-01 | Planning Target Date | `registrationDate + 56 days` | `planningAppTargetOverride` | NOT STARTED | 8 weeks standard |
| DATE-02 | Advert Target Date | `registrationDate + 56 days` | `advertAppTargetOverride` | NOT STARTED | 8 weeks standard |
| DATE-03 | Condition Target Date | `registrationDate + 56 days` | `conditionTargetOverride` | NOT STARTED | 8 weeks standard |
| DATE-04 | Appeal Determination (Written) | `appealStart + 112 days` | `appealForecastOverride` | NOT STARTED | 16 weeks |
| DATE-05 | Appeal Determination (Hearing) | `appealStart + 154 days` | `appealForecastOverride` | NOT STARTED | 22 weeks |
| DATE-06 | Appeal Deadline | `determinationDate + 56 days` | `appealDeadlineOverride` | NOT STARTED | 8 weeks |

**Decision needed:** Auto-calculate or manual entry? (See unanswered-questions.md)

---

## 3. Auto-Population / Auto-Generation

Fields that auto-populate based on other data.

| ID | Field | Logic | Where Used | Status | Notes |
|----|-------|-------|------------|--------|-------|
| AUTO-01 | Development Name | `[PanelType] [PanelSize] [Structure]` or "Mixed Format" | Development header | NOT STARTED | Based on panel config |
| AUTO-02 | Site Name | First line of address | Site header | NOT STARTED | If empty |
| AUTO-03 | Status Modified Date | `currentDate` when status changes | Development, Planning | NOT STARTED | Multiple fields |
| AUTO-04 | Created By | Current user | All records | DONE | Prisma handles |
| AUTO-05 | Created Date | Current timestamp | All records | DONE | Prisma handles |

**Decision needed:** Auto-generate development names? (See unanswered-questions.md)

---

## 4. Validation Rules

Field validation that must be enforced.

| ID | Field | Rule | Error Message | Where | Status |
|----|-------|------|---------------|-------|--------|
| VAL-01 | Project Number | Unique | "This project number is already in use" | Development | NOT STARTED |
| VAL-02 | Organisation Name | Unique | "This company already exists" | Organisation | NOT STARTED |
| VAL-03 | Probability | > 0, <= 100 | "Must be a percentage between 1-100" | Development | NOT STARTED |
| VAL-04 | Email | Valid format | "Invalid email address" | Contact | NOT STARTED |

---

## 5. Status Change Tracking

Auto-update timestamps when status fields change.

| ID | Status Field | Timestamp Field | Where | Status |
|----|--------------|-----------------|-------|--------|
| STAT-01 | Development Status | `developmentStatusModified` | Development | NOT STARTED |
| STAT-02 | Planning App Status | `planningAppStatusModified` | Development Planning | NOT STARTED |
| STAT-03 | Advert App Status | `advertAppStatusModified` | Development Planning | NOT STARTED |
| STAT-04 | Contract Status | `contractStatusUpdated` | Development Commercial | NOT STARTED |

**Decision needed:** Simple timestamp or full audit trail? (See unanswered-questions.md)

---

## 6. Conditional UI Behaviour

UI that changes based on data state.

| ID | Condition | Behaviour | Where | Status |
|----|-----------|-----------|-------|--------|
| UI-01 | No site owner selected | Disable contact dropdown, show "Select site owner first" | Site, Development | NOT STARTED |
| UI-02 | Site owner has no contacts | Show "Add contacts to owner" prompt | Site, Development | NOT STARTED |
| UI-03 | No site agent selected | Disable agent contact dropdown | Site | NOT STARTED |
| UI-04 | Site agent has no contacts | Show "Add contacts to agent" prompt | Site | NOT STARTED |
| UI-05 | No LPA contacts | Show "Add contacts to LPA" prompt | Development Planning | NOT STARTED |
| UI-06 | Survey notes empty | Show guidance text | Site Survey | NOT STARTED |
| UI-07 | Single development at site | Offer to view directly | Site → Development nav | NOT STARTED |
| UI-08 | Multiple developments at site | Show count, offer list view | Site → Development nav | NOT STARTED |

---

## 7. Aggregation / Summary Calculations

Dashboard and summary calculations.

| ID | Calculation | Formula | Where | Status |
|----|-------------|---------|-------|--------|
| AGG-01 | Total rent at site | `SUM(currentRentPerAnnum) WHERE siteId = x` | Site summary | NOT STARTED |
| AGG-02 | Development count by status | `COUNT(*) GROUP BY status` | Dashboard | NOT STARTED |
| AGG-03 | Total profit (filtered) | `SUM(totalProfit) WHERE [filters]` | Reports | NOT STARTED |
| AGG-04 | Overdue tasks count | `COUNT(*) WHERE dueDate < today AND NOT complete` | Dashboard | NOT STARTED |

---

## 8. Value Lists / Dropdowns

Lookup tables that need seeding and dropdown implementation.

| ID | Value List | Source | Seeded | UI Implemented | Notes |
|----|------------|--------|--------|----------------|-------|
| VL-01 | Deal Type | DealType table | YES | Partial | 4 types |
| VL-02 | Development Status | DevelopmentStatus table | YES | YES | 19 statuses |
| VL-03 | Site Status | SiteStatus table | YES | NO | |
| VL-04 | Organisation Type | Hardcoded | N/A | NO | 10 types |
| VL-05 | Site Owner Role | Hardcoded | N/A | NO | 5 roles |
| VL-06 | Decision Level | Hardcoded | N/A | NO | 2 levels |
| VL-07 | Panel Type | PanelType table | YES | YES | |
| VL-08 | Panel Size | PanelSize table | YES | YES | |
| VL-09 | Panel Orientation | PanelOrientation table | YES | YES | |
| VL-10 | Structure Type | StructureType table | YES | YES | |
| VL-11 | Planning Score | Hardcoded 1-5 | N/A | YES | |
| VL-12 | Appeal Type | Hardcoded | N/A | NO | Written/Hearing |
| VL-13 | Task Type | TaskType table | YES | NO | |
| VL-14 | Tender Strategy | Hardcoded | N/A | NO | Formal/Informal |
| VL-15 | Tender Status | Hardcoded | N/A | NO | Pre-Tender/Ongoing/Complete |
| VL-16 | Tender Materials | Hardcoded | N/A | NO | Video/Visuals/Event (multi) |

---

## Implementation Notes

### When to Implement

- **Calculated fields:** Implement when building the Commercial section UI
- **Date calculations:** Implement when building the Planning section UI
- **Validation rules:** Implement when building create/edit forms
- **Status tracking:** Implement via Prisma middleware (applies globally)
- **Conditional UI:** Implement per-component as building each section
- **Value lists:** Seed database first, then implement dropdowns

### Testing Approach

Each business logic item should be tested:
1. **Unit test** - Does the calculation/logic work correctly?
2. **Integration test** - Does it work with real data?
3. **UI test** - Is it displayed correctly to the user?

---

*Last updated: 13 Jan 2026*
