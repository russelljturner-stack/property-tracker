# Property Development Tracker - FileMaker Migration Project

## CRITICAL: Data Protection and Privacy

**This section must be followed at all times.**

### UK Data Protection Warning

Before Russell uploads, shares, or pastes ANY data (CSV files, database exports, screenshots with data, etc.), Claude Code MUST:

1. **STOP and warn Russell** that sharing personal data or commercially sensitive information with AI tools may have data protection implications
2. **Ask Russell to confirm** that either:
   - The data has been anonymised/redacted, OR
   - Russell has verified this use is compliant with their data protection obligations
3. **Suggest alternatives** such as:
   - Using fake/dummy data during development
   - Anonymising data before sharing (remove names, addresses, contact details)
   - Only describing the data structure without sharing actual records

### What Counts as Sensitive Data?

| Type | Examples | Risk Level |
|------|----------|------------|
| Personal Data | Names, emails, phone numbers, addresses | HIGH - UK GDPR applies |
| Commercial Data | Financial figures, client names, deal values | HIGH - Commercially sensitive |
| Location Data | Site addresses, coordinates | MEDIUM - Could identify properties |
| Structure Only | Field names, table schemas, record counts | LOW - Generally safe |

### Confidentiality

- This project must NOT contain any specific company names that could identify the original licence holder
- The system is being built as a generic "Property Development Tracker" that could be used by any company
- Remove or genericise any company-specific references found in legacy code/documentation

---

## IMPORTANT: Propose Before Implementing

**Claude must NOT implement new features or significant changes without Russell's approval first.**

When suggesting new work (pages, features, UI changes, etc.):

1. **Describe what you're proposing** - explain the change and why
2. **Wait for Russell to approve** - don't start coding until he agrees
3. **Only then implement** - once approved, proceed with the work

This applies to:
- Building new pages or screens
- Adding new features or functionality
- Significant UI/layout changes
- Database schema changes
- Any work that isn't a direct fix to something Russell has already requested

**Exception:** Small fixes, bug corrections, or direct responses to Russell's explicit requests (e.g., "make the thumbnails bigger") can be implemented immediately.

---

## About This Project

This project is migrating a FileMaker Pro 12 application to a modern web application. The FileMaker system is a property development tracking application with approximately 30 database tables, 15-20 layouts/screens, complex automation scripts, and Google Maps API integration.

### Important: This is Not a Like-for-Like Migration

The FileMaker system was essentially a **beta/prototype**. While it captured the core data structures and workflows, it:
- Never fully achieved the right UX/UI
- Was not widely adopted by users
- Contains design decisions that were compromises or first attempts

**This migration is an opportunity to build the system it should have been.** Every decision from FileMaker should be critically reviewed, not blindly replicated. The goal is a significantly improved application, not a carbon copy.

### Review Point: Before Phase 4

Before building any screens (Phase 4), conduct a structured review:
1. **Core purpose** - What is this system fundamentally for?
2. **Key workflows** - What do users actually need to do daily?
3. **Pain points** - What was frustrating about FileMaker?
4. **Unused features** - What can we drop entirely?
5. **Missing features** - What should have been there?
6. **UI/UX patterns** - How should navigation and screens actually work?

This ensures we build based on real needs, not inherited compromises.

## About the Developer

Russell is a coding beginner who wants to learn as the project progresses. When writing code or making technical decisions:

- **Always explain what you're doing and why** - don't just write code silently
- **Introduce concepts progressively** - explain new terms when they first appear
- **Use clear comments in code** - help Russell understand what each section does
- **Check understanding** - periodically ask if explanations are clear
- **Be patient with questions** - there are no silly questions in this project

## Target Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Frontend | Next.js + React | With TypeScript for helpful error checking |
| Styling | Tailwind CSS | Utility-first CSS framework |
| Database | PostgreSQL | Hosted on Railway or similar |
| Database Interface | Prisma | Type-safe database queries |
| Authentication | NextAuth.js | Email/password + optional social logins |
| Maps | Google Maps API | Preserving existing integration |
| Hosting | Railway or Vercel | Simple deployment |

## Migration Phases

| Phase | Status | Summary |
|-------|--------|---------|
| Phase 1: Discovery | COMPLETE | FileMaker analysis - see `docs/phase1/00-phase1-summary.md` |
| Phase 2: Database | COMPLETE | Prisma schema - see `docs/phase2/00-phase2-summary.md` |
| Phase 3: App Setup | COMPLETE | Next.js + Auth - see `docs/phase3/00-phase3-summary.md` |
| Phase 4: Features | IN PROGRESS | Building screens - see `docs/phase4/build-tracker.md` |
| Phase 5: Data Migration | NOT STARTED | Export FileMaker data, run migration scripts |
| Phase 6: Testing | NOT STARTED | UAT, deployment, documentation |

**Current Focus:** Phase 4 - Feature Development

### Phase 4 Approach

For each screen:
1. Create schema audit (FileMaker fields → Prisma → UI)
2. Build the React component
3. Implement business logic from checklist
4. Test on Railway

**Script Conversion Reference:**

| FileMaker | JavaScript/TypeScript |
|-----------|----------------------|
| Set Variable [$var] | `const var = value;` |
| If / End If | `if (condition) { }` |
| Loop / End Loop | `for (item of items) { }` |
| Go to Related Record | Database query with filter |
| Perform Find | Database query with where clause |
| Set Field | Update via Prisma |
| New Record | Create via Prisma |
| Delete Record | Delete via Prisma |
| Commit Record | Automatic with Prisma operations |

---

## Project Files Reference

When Russell adds files to this project, they will typically be:

| File/Folder | Purpose |
|-------------|---------|
| `filemaker/DDR.xml` | Database Design Report from FileMaker |
| `filemaker/layouts/` | Screenshots of FileMaker layouts |
| `filemaker/exports/` | CSV exports of table data (for migration) |
| `docs/` | Project documentation we create |
| `src/` | Application source code |
| `prisma/schema.prisma` | Database schema definition |

---

## Important Reminders

1. **Never skip explanations** - Russell is learning, every piece of code is a teaching opportunity
2. **Check before proceeding** - Confirm Russell is ready before moving to next phase
3. **Keep the FileMaker reference handy** - Always relate new concepts back to FileMaker equivalents
4. **Test incrementally** - Show working results frequently, don't build too much before testing
5. **Document as you go** - Create README files and code comments throughout

---

## Capturing Decisions and Rules

When building features or having design discussions:

1. **Before building** - Check `docs/decisions/` for relevant existing decisions
2. **During discussions** - If new rules or decisions emerge, document them immediately
3. **After building** - Update decisions docs if the implementation revealed new patterns

Key decision documents:

| Document | Purpose |
|----------|---------|
| `docs/decisions/architecture-decisions.md` | Technical and architectural choices (permanent) |
| `docs/decisions/ux-rules.md` | UX patterns, editing rules, user workflows (permanent) |
| `docs/phase4/unanswered-questions.md` | Open questions needing Russell's input (temporary - items removed once resolved) |

---

## Phase 4 Build Tracking

During Phase 4, use these documents to track progress and ensure nothing is missed:

| Document | Purpose |
|----------|---------|
| `docs/phase4/build-tracker.md` | Master checklist for all screens, schema audits, and schema gaps |
| `docs/phase4/business-logic-checklist.md` | All calculations, validations, auto-population patterns from DDR |
| `docs/phase4/development-schema-audit.md` | Field mapping for Development layout (template for other layouts) |

**Workflow for each layout:**
1. Create schema audit (FileMaker fields → Prisma → UI)
2. Build the screen
3. Check business logic items that apply to that screen
4. Mark items complete in build-tracker.md

**Before marking Phase 4 complete:**
- All schema audits done (Development, Site, Contact, Organisation, Dashboards)
- All screens built
- All business logic items in checklist implemented
- Review business-logic-checklist.md end-to-end

---

## Start of Session Procedure

At the start of each session:

1. **Check the build tracker** - Read `docs/phase4/build-tracker.md` to understand current progress
2. **Check unanswered questions** - Review `docs/phase4/unanswered-questions.md` for any blocking items
3. **Ask Russell** - "Where would you like to pick up?" or continue from where the tracker indicates

---

## End of Session Procedure

Before ending a session, complete these steps:

1. **Capture unanswered questions** - Review the session for any questions that emerged but weren't resolved. Add them to `docs/phase4/unanswered-questions.md`

2. **Update decisions docs** - If any rules or decisions were made during the session, ensure they're captured in:
   - `docs/decisions/architecture-decisions.md` (technical decisions)
   - `docs/decisions/ux-rules.md` (UX and business rules)

3. **Update handover document** - Create/update `docs/handover/[date]-session-handover.md` with:
   - What was completed
   - What's in progress
   - What's next
   - Any blockers or issues

4. **Commit and push** - Ensure all changes are committed to git and pushed to remote

---

## Documentation Standards

This project follows industry best practices for a solo developer, with the goal of professional handover-ready code.

### Avoid Document Bloat

- **Minimise the number of documents** - only create new files when essential
- **Consolidate where possible** - prefer adding sections to existing docs over new files
- **No overlapping content** - if two documents cover similar ground, merge them
- **Temporary docs should be deleted** - handover documents are removed after migration
- **Code should be self-documenting** - prefer clear code over extensive documentation

### Project Documentation Structure

```
project/
├── CLAUDE.md                              # AI assistant instructions (this file)
├── docs/
│   ├── decisions/                         # Permanent - architectural choices
│   ├── phase1/                            # Archive - FileMaker analysis
│   ├── phase4/                            # Active - build tracking & audits
│   └── handover/                          # Temporary - session continuity
├── prisma/
│   └── schema.prisma                      # Database schema (self-documenting)
└── src/                                   # Application code
```

### Document Index

**Permanent Documents (keep after migration):**

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | AI assistant instructions, project overview, procedures |
| `docs/decisions/architecture-decisions.md` | All architectural decisions (ADRs) |
| `docs/decisions/ux-rules.md` | UX patterns and business rules |

**Phase 4 Documents (active during build):**

| Document | Purpose |
|----------|---------|
| `docs/phase4/build-tracker.md` | Master progress tracker - screens, audits, schema gaps |
| `docs/phase4/business-logic-checklist.md` | All DDR business logic to implement |
| `docs/phase4/development-schema-audit.md` | Development layout field mapping (template for others) |
| `docs/phase4/unanswered-questions.md` | Open questions needing Russell's input |

**Completed Phase Summaries (archive after migration):**

| Document | Purpose |
|----------|---------|
| `docs/phase1/00-phase1-summary.md` | Phase 1 overview + links to 8 detail docs |
| `docs/phase2/00-phase2-summary.md` | Database design summary |
| `docs/phase3/00-phase3-summary.md` | App setup summary |

**Handover Documents (delete after migration):**

| Pattern | Purpose |
|---------|---------|
| `docs/handover/YYYY-MM-DD-sessionN-handover.md` | Session continuity notes |

### Naming Conventions

**IMPORTANT: Claude MUST follow these naming conventions exactly. Do not create files with different naming patterns.**

| Type | Pattern | Example |
|------|---------|---------|
| Handover docs | `YYYY-MM-DD-sessionN-handover.md` | `2026-01-15-session12-handover.md` |
| Phase summaries | `00-phaseN-summary.md` | `00-phase3-summary.md` |
| Schema audits | `[layout]-schema-audit.md` | `development-schema-audit.md` |
| Date-prefixed | `YYYY-MM-DD-` prefix | `2026-01-15-` |

**Rules:**
- Always check existing files in a folder before creating new ones to match the pattern
- Session numbers must be sequential (check the latest session number in `docs/handover/`)
- Never create files like `session-11-handover.md` without the date prefix

### Architecture Decision Records (ADRs)

Record significant decisions in `docs/decisions/architecture-decisions.md`:
- Use a single file with sections (not separate files per decision)
- Each decision has: Category, Status, Priority, Date, Context, Decision, Consequences
- Categories: Business Logic, Technical, Migration, UI/UX, Integration, Deferred Features
- Statuses: Proposed, Accepted, Deferred, Superseded, Rejected

### Best Practices for Handover

- Follow standard folder structures that any developer would recognise
- Use conventional naming (README.md, not readme.txt or ABOUT.md)
- Keep configuration files in expected locations
- Write clear commit messages
- Maintain a clean, organised codebase

---

## Git Workflow

**This section defines how version control should be used on this project. Claude must follow these rules.**

### Core Principles

1. **No worktrees** - Work in a single directory only. Never create or use git worktrees.
2. **Simple branching** - Keep it minimal. Complexity causes confusion.
3. **Ask before branching** - Claude must ask Russell before creating any new branch.

### Day-to-Day Workflow

- **Work directly on `main`** for routine development within a phase
- **Commit frequently** with clear messages describing what changed
- **Push regularly** to keep the remote backup current

### When to Create a Branch

Only create a branch when:
1. **Starting a new phase** (e.g., `phase-4-features`) - ask Russell first
2. **Attempting something risky** that might need to be completely undone
3. **Russell explicitly requests it**

When a branch is complete:
1. Merge it back to `main`
2. Delete the branch (keep things tidy)

### What Claude Must NOT Do

- Never create worktrees
- Never create branches without asking Russell first
- Never use complex branching strategies (no git-flow, no feature branches for small changes)
- Never leave stale branches lying around

### Commit Message Format

Keep it simple and descriptive:
```
Add login page with email/password authentication

- Created login form component
- Added NextAuth.js credential provider
- Protected routes redirect to login
```

For small changes, a single line is fine:
```
Fix typo in dashboard heading
```

---

## Current Status

**Current Phase:** Phase 4 - Feature Development (starting)

**Completed:**
- Phase 1: Discovery and Documentation (48 tables, 115 relationships, 225 scripts documented)
- Phase 2: Database Design (46 Prisma models created and deployed to Railway)
- Phase 3: Core Application Setup
  - Next.js 16 application with TypeScript and Tailwind CSS
  - Authentication with NextAuth.js (email/password)
  - Responsive sidebar navigation
  - Dashboard with summary cards, tasks, developments, pipeline sites
  - Database connected to Railway PostgreSQL
  - Deployed to Railway

**Phase 4 Progress:**
- Development detail page (`/developments/[id]`) - DONE

**Key Decisions Made (see docs/decisions/architecture-decisions.md):**
- ADR-002: This is NOT a like-for-like migration - improve, don't replicate
- ADR-004: System must deliver management insights, not just store data

---

## Development Environment

**IMPORTANT: Always test on Railway, not localhost.**

| Environment | URL | Notes |
|-------------|-----|-------|
| **Production (Railway)** | https://property-tracker-production-ac30.up.railway.app | Auto-deploys from `master` branch |
| Localhost | http://localhost:3000 | Has Turbopack issues on Windows |

**Test credentials:**
- Email: test@example.com
- Password: password123

Railway auto-deploys when you push to master. Wait ~2-3 minutes after push for changes to appear.
