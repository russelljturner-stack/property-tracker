# Session Handover Document

**Date:** 11 January 2026
**Session:** Phase 3 - Core Application Setup (Part 1)
**Status:** IN PROGRESS - Folder rename pending

---

## Quick Start for Next Session

Copy and paste this to start your next session:

```
I've renamed the project folder from DevData to property-tracker. Please read the handover document at:
C:\Projects\property-tracker\docs\handover\2026-01-11-phase3-handover.md

I'm ready to continue with Phase 3: Core Application Setup.
```

---

## What Was Completed This Session

### 1. Company References Removed from Prisma Schema

All specific company references have been genericised:

| Original | Changed To |
|----------|------------|
| "Wildstone Development Tracker" | "Property Development Tracker" |
| `wildstoneOwner` | `internalOwner` |
| `wildstoneDeveloper` | `internalDeveloper` |
| `wildstonePlanner` | `internalPlanner` |
| `nonWildstoneDeveloper` / `NonWildstoneDeveloper` | `externalDeveloper` / `ExternalDeveloper` |
| "Wildstone legal entities" | "company legal entities" |
| Role examples "Wildstone Developer" | "Developer", "Planner", "Admin" |

**Note:** These changes are in the Prisma schema file only. The database on Railway still has the old column names. A migration will be needed later to sync the database.

### 2. Data Protection Warning Added to CLAUDE.md

A new critical section added at the top of CLAUDE.md that instructs Claude Code to:
- Stop and warn before any data uploads (CSV, exports, screenshots with data)
- Ask for confirmation that data is anonymised or compliant
- Suggest alternatives like dummy data
- Keep the project generic with no company-specific references

### 3. Architecture Explanation Provided

Russell received explanations of:
- How the four layers work together (Browser → Next.js → Prisma → PostgreSQL)
- What each technology does and its FileMaker equivalent
- How data flows through the system (with examples)
- Why API routes are needed (browser and server are separate systems)

---

## What's Next: Continue Phase 3

### Immediate Next Step

Russell needs to rename the project folder:
- From: `C:\Projects\DevData`
- To: `C:\Projects\property-tracker`

This requires closing Claude Code first, then reopening in the new location.

### Phase 3 Tasks Remaining

| Task | Status |
|------|--------|
| Rename folder to property-tracker | Pending (Russell to do) |
| Initialise Next.js with TypeScript and Tailwind | Pending |
| Connect to existing Prisma schema and Railway database | Pending |
| Set up NextAuth.js authentication | Pending |
| Build main layout with responsive navigation | Pending |
| Create placeholder pages for main sections | Pending |
| Deploy initial version | Pending |

---

## Project File Structure (After Rename)

```
C:\Projects\property-tracker\
├── CLAUDE.md                              # Updated with data protection section
├── .env                                   # Database connection (SECRET)
├── package.json
├── DDR_converted.xml
├── docs/
│   ├── decisions/
│   │   └── architecture-decisions.md
│   ├── handover/
│   │   ├── 2026-01-10-session-handover.md
│   │   ├── 2026-01-10-phase2-handover.md
│   │   ├── 2026-01-11-session-handover.md
│   │   └── 2026-01-11-phase3-handover.md  # This file
│   └── phase1/
│       └── [analysis documents]
├── prisma/
│   ├── schema.prisma                      # Updated - company refs removed
│   └── migrations/
└── Filemaker/
    └── Layouts/
```

---

## Notes for Claude (Next Session)

- Russell is a coding beginner - explain concepts as you go
- Prisma 5 is installed (not version 7)
- Database schema is deployed to Railway but column names don't match new Prisma field names (migration needed later)
- The `.env` file contains the Railway connection string
- Follow the phase structure in CLAUDE.md strictly
- This is NOT a like-for-like migration - critically review every FileMaker decision
- **NEW:** Always follow the data protection warning in CLAUDE.md before accepting any data files

---

## Key Decisions Reference

See `docs/decisions/architecture-decisions.md` for full details:
- ADR-001: Approval Workflow for Status Changes (Deferred)
- ADR-002: Migration Approach - Improve, Don't Replicate (Accepted)
- ADR-003: Application Entry Point and Navigation (Proposed)
- ADR-004: System Purpose and Management Information (Accepted)

---

*Next session: Continue Phase 3 - Initialise Next.js project*
