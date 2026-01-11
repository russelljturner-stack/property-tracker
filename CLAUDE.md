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

Follow these phases in order. Do not skip ahead unless Russell explicitly requests it.

---

### Phase 1: Discovery and Documentation ⬅️ START HERE

**Goal:** Understand the complete FileMaker structure before writing any code.

**When Russell provides the DDR (Database Design Report):**

1. Parse and analyse the DDR XML file thoroughly
2. Create a summary document listing:
   - All tables with their field counts
   - Field types and any validation rules
   - Relationships between tables (the relationship graph)
   - Scripts and what they do (categorise by complexity)
   - Value lists used in the application
   - Any calculation fields or auto-enter settings
3. Identify potential migration challenges (e.g., complex calculations, container fields)
4. Create a mapping document: FileMaker concepts → Web equivalents
5. Ask Russell clarifying questions about any unclear business logic

**When Russell provides layout screenshots:**

1. Analyse each layout's purpose and data displayed
2. Note UI patterns used (list views, detail views, forms, reports)
3. Identify which tables each layout draws from
4. Document the navigation flow between layouts

**Phase 1 Deliverables:**
- [ ] Complete table/field inventory
- [ ] Relationship map documentation
- [ ] Script analysis and conversion notes
- [ ] Layout analysis with wireframe notes
- [ ] Questions for Russell about business logic
- [ ] Migration risk assessment

**Do not proceed to Phase 2 until Russell confirms Phase 1 is complete.**

---

### Phase 2: Database Design

**Goal:** Create the PostgreSQL database structure.

**Steps:**

1. Design the Prisma schema based on Phase 1 analysis
   - Convert each FileMaker table to a Prisma model
   - Map FileMaker field types to PostgreSQL types
   - Define relationships using Prisma relations
   - Add indexes for commonly queried fields
2. Add authentication tables (User, Account, Session)
3. Add role-based permission structure
4. Review schema with Russell before proceeding
5. Set up the database on Railway (or chosen platform)
6. Run initial migration to create tables

**Key FileMaker → PostgreSQL Type Mappings:**
- Text → String
- Number → Int or Float (depending on decimals)
- Date → DateTime
- Time → DateTime
- Timestamp → DateTime
- Container → String (URL to file storage)
- Calculation (stored) → Regular field + application logic
- Calculation (unstored) → Computed at query time
- Summary → Aggregation queries

**Phase 2 Deliverables:**
- [ ] Complete Prisma schema file
- [ ] Database deployed and accessible
- [ ] Schema reviewed and approved by Russell

---

### Phase 3: Core Application Setup

**Goal:** Build the application foundation with authentication and navigation.

**Steps:**

1. Initialise Next.js project with TypeScript
   ```bash
   npx create-next-app@latest property-tracker --typescript --tailwind --app
   ```
2. Install and configure Prisma
3. Set up NextAuth.js authentication
   - Email/password authentication
   - Session management
   - Protected routes
4. Create role-based access control middleware
5. Build the main layout shell
   - Responsive sidebar/navigation
   - Header with user info
   - Mobile-friendly hamburger menu
6. Create placeholder pages for main sections
7. Deploy initial version so Russell can see it working

**Phase 3 Deliverables:**
- [ ] Working login/logout system
- [ ] Role-based route protection
- [ ] Responsive navigation matching FileMaker structure
- [ ] Deployed and accessible from any device

---

### Phase 4: Feature Development

**Goal:** Build each screen, prioritising the most important workflows.

**Approach for each feature:**

1. Review the relevant FileMaker layout screenshot
2. Identify the data requirements (which tables/fields)
3. Create the API route (data fetching/saving)
4. Build the React component (user interface)
5. Add form validation and error handling
6. Test thoroughly before moving to next feature
7. Explain to Russell what was built and how it works

**Build order (adjust based on Russell's priorities):**
1. Main dashboard/home screen
2. Primary list views (e.g., Projects list)
3. Detail views (e.g., Project details)
4. Create/Edit forms
5. Related record displays
6. Search and filtering
7. Google Maps integration
8. Reports and summaries
9. Any remaining screens

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

**Phase 4 Deliverables:**
- [ ] All screens rebuilt as React components
- [ ] All critical scripts converted to TypeScript functions
- [ ] Google Maps integration working
- [ ] Forms with validation
- [ ] Search and filtering functional

---

### Phase 5: Data Migration

**Goal:** Transfer all existing data from FileMaker to PostgreSQL.

**Steps:**

1. Guide Russell through exporting each FileMaker table as CSV
2. Create a migration script that:
   - Reads CSV files
   - Transforms data as needed (dates, relationships, etc.)
   - Handles FileMaker internal IDs → new PostgreSQL IDs
   - Preserves all relationships between records
3. Run migration on test database first
4. Verify data integrity:
   - Record counts match
   - Relationships intact
   - Spot-check key records
5. Run migration on production database

**Special Handling Required:**
- Container fields: Export files separately, upload to cloud storage, store URLs
- Calculation fields: Verify calculations work correctly in new system
- Summary fields: Test aggregation queries return correct values

**Phase 5 Deliverables:**
- [ ] Migration scripts created and tested
- [ ] All data transferred successfully
- [ ] Data integrity verified

---

### Phase 6: Testing and Deployment

**Goal:** Ensure everything works and go live.

**Steps:**

1. Functional testing against FileMaker workflows
2. User acceptance testing (Russell tests real scenarios)
3. Performance optimisation
4. Security review
5. Production deployment with proper domain
6. Create user documentation
7. Knowledge transfer to Russell

**Phase 6 Deliverables:**
- [ ] All features tested and working
- [ ] Application deployed to production
- [ ] Documentation complete
- [ ] Russell understands how to maintain the system

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
├── README.md                              # Project overview, how to run it
├── CLAUDE.md                              # AI assistant instructions (this file)
├── docs/
│   ├── decisions/
│   │   └── architecture-decisions.md      # All ADRs in one file
│   ├── phase1/                            # FileMaker analysis (archive after migration)
│   └── handover/                          # Session continuity (delete after migration)
├── prisma/
│   └── schema.prisma                      # Database schema (self-documenting)
└── src/                                   # Application code
```

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

## Current Status

**Current Phase:** Phase 3 - Core Application Setup

**Completed:**
- Phase 1: Discovery and Documentation (48 tables, 115 relationships, 225 scripts documented)
- Phase 2: Database Design (46 Prisma models created and deployed to Railway)
- Pre-Phase 3: All outstanding questions answered, project approach clarified

**Key Decisions Made (see docs/decisions/architecture-decisions.md):**
- ADR-002: This is NOT a like-for-like migration - improve, don't replicate
- ADR-004: System must deliver management insights, not just store data

**Next action:** Build the Next.js application with authentication and navigation.
