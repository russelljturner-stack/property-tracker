# Session Handover Document

**Date:** 12 January 2026 (Session 5)
**Session:** Phase 4 Pre-Build Review (Complete)
**Status:** COMPLETE

---

## Session Summary

This session completed the structured pre-build review required before Phase 4 feature development. All 6 questions have been answered and documented as Architecture Decision Records.

### Review Progress

| Question | Status | Summary |
|----------|--------|---------|
| 1. Core purpose | COMPLETE | Site intelligence, pipeline management, institutional memory |
| 2. Who uses it (roles) | COMPLETE | Role-based access with financial restrictions |
| 3. Pain points | COMPLETE | Platform limitations, lack of polish, no integrations |
| 4. Unused features | COMPLETE | Keep all - low usage was rollout failure, not feature problem |
| 5. Missing features | COMPLETE | Email/document integration, better reporting |
| 6. UI/UX patterns | COMPLETE | Role-based dashboards, Development as primary entity |

---

## New ADRs Created This Session

| ADR | Title | Status |
|-----|-------|--------|
| 003 | Application Entry Point and Navigation | Updated to Accepted |
| 005 | Role-Based Dashboards and Access Control | NEW - Accepted |
| 006 | Active Work Focus Principle | NEW - Accepted |
| 007 | External Integration Strategy | NEW - Accepted |
| 008 | Mobile and Field Use Requirements | NEW - Accepted |
| 009 | Notification System | NEW - Accepted |
| 010 | Stalled Development Detection | NEW - Accepted |
| 011 | Search and Discovery | NEW - Accepted |

See `docs/decisions/architecture-decisions.md` for full details.

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

## Key Findings: Pain Points (Question 3)

| Category | Pain Point |
|----------|------------|
| **Platform** | FileMaker struggled with cross-platform (iOS, Android, desktop, Mac) |
| **UX/Polish** | Never reached modern standards - functional but not slick |
| **Mobile** | Designed for field use but never properly tested there |
| **Information Density** | Layouts too heavy with data fields |
| **Feature Bloat** | Lost focus as it grew larger |
| **Reporting** | Existed but wasn't compelling enough to drive adoption |
| **Integration** | No connection to Outlook (tasks, diary, emails, contacts) |
| **Maintainability** | FileMaker made changes difficult |

**Key theme:** Polish over features - better to have fewer features that work beautifully.

---

## Key Findings: Unused Features (Question 4)

**Finding:** Low usage was due to incomplete rollout, not feature problems.

**Decision:** Keep the full feature set for now. Review usage once the new system is live and adopted.

---

## Key Findings: Missing Features (Question 5)

| Gap | Notes |
|-----|-------|
| Email integration | Communication history is key to institutional memory |
| Document integration | Link to contracts, plans, etc. on company server |
| Better reporting | Needed to drive leadership engagement and user adoption |

**Key theme:** Not about adding more - about making what exists work better.

---

## Key Findings: UI/UX Patterns (Question 6)

### User Journeys

| User | Context | What They Need |
|------|---------|----------------|
| Developer (office) | Morning planning | Dashboard: active developments, tasks due |
| Developer (field) | Standing near a site | Quick lookup, photo capture, notes |
| Leadership (field) | Spots opportunity | Check if site exists, quick-log for follow-up |
| Leadership (office) | Pipeline management | Overview, team workloads, bottlenecks |

### Navigation Decisions

| Decision | Answer |
|----------|--------|
| Entry point | Role-based dashboard (not a list) |
| Primary entity | Development (what people work on) |
| Reference entity | Site (what people say in conversation) |
| Naming | "[Type/Size] at [Site Name]" |
| Key relationships | Development ↔ Site ↔ Contacts = 1-2 clicks |
| Role-based views | Yes - different dashboards per role |

### Active Work Focus

**Core principle:** "What do I need to do next?" not "What's everything that ever happened?"

- Dashboards show active developments only
- Historical data available but not prominent
- Default queries filter to active records

### Dashboard Metrics

| Role | Metrics |
|------|---------|
| Leadership | Pipeline by stage, potential revenue, red flags (stalled developments) |
| Operational | My active developments, my next tasks, my priorities |

### Other Decisions

| Topic | Decision |
|-------|----------|
| Stalled definition | No field changes, no new tasks, no activity for ~30 days |
| Search | By site name; map-based; results show site with active development |
| Notifications | In-app and email; for assignments, stalled warnings, task assignments |

---

## Current Status

**Phase 4: PRE-BUILD REVIEW COMPLETE - READY FOR FEATURE DEVELOPMENT**

Application remains deployed and working:

| Component | Status | URL/Location |
|-----------|--------|--------------|
| Application | Live | https://property-tracker-production-ac30.up.railway.app |
| Database | Connected | Railway PostgreSQL |
| GitHub | Synced | github.com/russelljturner-stack/property-tracker |

---

## Next Steps

Pre-build review is complete. Ready to begin Phase 4 feature development.

**Recommended build order:**

| Priority | Feature | Rationale |
|----------|---------|-----------|
| 1 | Role-based dashboard (operational) | Landing page for most users |
| 2 | Development list view | Core working interface |
| 3 | Development detail view | Where users spend most time |
| 4 | Site detail view | Quick access from development |
| 5 | Search functionality | Critical for finding sites/developments |
| 6 | Map view with location | Key for field use |
| 7 | Leadership dashboard | Pipeline and team visibility |
| 8 | Task management | Assignments and follow-ups |
| 9 | Activity logging | Communication history |
| 10 | Notifications | Alerts and reminders |

---

## Files Changed This Session

| File | Change |
|------|--------|
| `docs/handover/2026-01-12-session4-handover.md` | UPDATED - complete review findings |
| `docs/decisions/architecture-decisions.md` | UPDATED - 7 new ADRs added |

---

## Quick Start for Next Session

```
I'm continuing work on the Property Development Tracker. Please read the handover document at:
docs/handover/2026-01-12-session4-handover.md

Last session: Completed Phase 4 pre-build review - all 6 questions answered, 7 new ADRs created
Next task: Begin Phase 4 feature development - start with operational dashboard
```
