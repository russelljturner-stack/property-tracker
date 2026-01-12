# Session Handover Document

**Date:** 12 January 2026 (Session 4)
**Session:** Phase 4 Pre-Build Review (Part 1)
**Status:** IN PROGRESS

---

## Session Summary

This session began the structured pre-build review required before Phase 4 feature development. We completed Questions 1 and 2 of the 6-question review framework.

### Review Progress

| Question | Status | Summary |
|----------|--------|---------|
| 1. Core purpose | COMPLETE | Site intelligence, pipeline management, institutional memory |
| 2. Who uses it (roles) | COMPLETE | Role-based access with financial restrictions |
| 3. Pain points | NOT STARTED | Next session |
| 4. Unused features | NOT STARTED | |
| 5. Missing features | NOT STARTED | |
| 6. UI/UX patterns | NOT STARTED | |

---

## Key Findings: Core Purpose

The system is fundamentally about:

| Function | Description |
|----------|-------------|
| **Site Intelligence** | Track all outdoor advertising sites across the UK - know what exists, what's been tried, what the history is |
| **Pipeline Management** | Move developments through stages: Negotiation → Design → Planning → Marketing → Tendering |
| **Institutional Memory** | Preserve history so teams don't repeat mistakes or miss opportunities. Stop knowledge being siloed in emails/heads |
| **Team Coordination** | Enable handovers between teams at different stages. Everyone sees what's relevant to them |
| **Management Visibility** | See workloads, bottlenecks, pipeline status, financial reports, team performance |
| **Field Access** | Mobile-friendly for developers on the road - quick lookups, photo capture, site logging |

### Site vs Development - Critical Relationship

```
SITE (physical location)
├── Development 1 (2018 - poster site, completed)
├── Development 2 (2020 - digital upgrade attempt, planning refused)
├── Development 3 (2023 - new digital application, in progress)
└── Development 4 (2023 - second screen, separate planning app)
```

- **Site** = The physical location with landowner information
- **Development** = A project/attempt to build an asset at that location
- One Site can have many Developments over time (history, upgrades, concurrent projects)
- Sites can exist without any Development (opportunity pipeline)

### Pipeline Stages

Fixed sequence, but not all required:
**Negotiation → Design → Planning → Marketing → Tendering**

- Manual stage updates (user moves it forward)
- System can prompt based on events (e.g., planning submitted → set decision deadline)
- "Stalled" detection needed - flag developments with no activity for X days

### Site View - Information Hierarchy

When viewing a Site, show:
1. Most recent/active development - front and centre
2. History flag - "This site has 3 previous developments"
3. Nearby sites alert - "4 other sites within 500m"
4. Landowner details - accessible but not dominant

### Geographic/Mobile Features

| Feature | Description |
|---------|-------------|
| Auto-location search | App detects device location, shows sites within ~100m on map |
| Configurable radius | User adjusts based on area density |
| Road-based search | "Show all sites on M1" - for motorway/A-road corridors |
| Map pins | Visual display of existing sites/developments |

---

## Key Findings: Roles & Access

### Teams/Roles

| Role | Primary Focus |
|------|---------------|
| Developer | Site finding, oversee development through all stages |
| Planner | Planning applications and submissions |
| Build Manager | Construction phase |
| Sales/Tendering | Marketing and tender process |
| Leadership | Management information and reports |
| Administrator | System configuration |

**User distribution:** Mostly developers, smaller numbers in other roles.

### Access Control Model

**Core principle:** If you're involved in a development, you can see everything about it (except financials, if your role doesn't permit).

| Role | Financial Access | What They See |
|------|------------------|---------------|
| Developer | Yes | Everything on their developments |
| Planner | No | Everything on their developments (minus financials) |
| Build Manager | No | Everything on their developments (minus financials) |
| Sales/Tendering | Yes | Everything on their developments |
| Leadership | Yes | Everything (all developments) |
| Administrator | Yes | Everything + system config |

**Additional rules:**
- "Involved in" = assigned to development, or senior role
- Same role, not assigned = can view **active** developments only (holiday cover)
- Different role, not assigned = no access (unless Leadership/Admin)
- Team heads have elevated access within their area

---

## Current Status

**Phase 4: PRE-BUILD REVIEW IN PROGRESS**

Application remains deployed and working:

| Component | Status | URL/Location |
|-----------|--------|--------------|
| Application | Live | https://property-tracker-production-ac30.up.railway.app |
| Database | Connected | Railway PostgreSQL |
| GitHub | Synced | github.com/russelljturner-stack/property-tracker |

---

## Next Steps

Continue pre-build review:
1. **Question 3: Pain points** - What was frustrating about FileMaker?
2. **Question 4: Unused features** - What can we drop?
3. **Question 5: Missing features** - What should have been there?
4. **Question 6: UI/UX patterns** - How should navigation work?

Then document decisions and begin feature development.

---

## Files Changed This Session

| File | Change |
|------|--------|
| `docs/handover/2026-01-12-session4-handover.md` | NEW - this document |

---

## Quick Start for Next Session

```
I'm continuing work on the Property Development Tracker. Please read the handover document at:
docs/handover/2026-01-12-session4-handover.md

Last session: Started Phase 4 pre-build review - completed Questions 1 (Core Purpose) and 2 (Roles/Access)
Next task: Continue pre-build review with Question 3 (Pain Points)
```
