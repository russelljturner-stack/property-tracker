# Migration Challenges & Risks

This document identifies key challenges for migrating from FileMaker to the web application.

---

## High Priority Challenges

### 1. Container Fields (Binary Data)
**Impact:** High | **Complexity:** Medium

**Current State:**
- ~30 container fields storing PDFs, images, videos
- Stored externally in FileMaker's "Secure storage"
- Tables affected: sitephotos, planningdocs, development (contracts, designs, leases)

**Migration Approach:**
- Export all container files from FileMaker
- Upload to cloud storage (AWS S3, Cloudflare R2, or similar)
- Store URLs in PostgreSQL instead of binary data
- Implement file upload/download API in Next.js

**Risk:** File export from FileMaker may require manual effort or scripting.

---

### 2. Google Maps Integration
**Impact:** High | **Complexity:** High

**Current State:**
- 15+ scripts for geocoding, map display, perimeter search
- Custom HTML/JavaScript generation for map display
- Google API key stored in settings table
- 7 dedicated mapping layouts

**Migration Approach:**
- Use React Google Maps library (@react-google-maps/api)
- Implement geocoding via Google Geocoding API
- Replace FileMaker web viewer with React map component
- Port perimeter search logic to JavaScript/PostGIS

**Risk:** Complex JavaScript generation scripts need careful conversion.

---

### 3. Calculated Fields (~80 fields)
**Impact:** Medium | **Complexity:** Medium

**Current State:**
- Auto-calculated field values (e.g., development name from details)
- Date calculations (planning deadlines, appeal dates)
- Financial calculations (profit, rental values)

**Migration Approach:**
- Simple calculations → Prisma computed fields or app logic
- Date calculations → TypeScript date utilities
- Complex calculations → Database triggers or app-level computation

**Risk:** Business logic embedded in calculations must be preserved exactly.

---

### 4. Cascading Dropdowns (28 value lists)
**Impact:** Medium | **Complexity:** Medium

**Current State:**
- "Show Related Values" filters dropdowns based on context
- Example: Contacts filtered by selected organisation
- Parent-child dependencies throughout UI

**Migration Approach:**
- Implement cascading select components in React
- API endpoints that accept filter parameters
- React Query for dependent data fetching

**Risk:** Complex relationship chains require careful testing.

---

### 5. Auto-Enter Fields
**Impact:** Low | **Complexity:** Low

**Current State:**
- Serial numbers (PKid auto-increment)
- Creation timestamps
- Modification timestamps
- Account name tracking (createdby, modifiedby)

**Migration Approach:**
- PostgreSQL auto-increment for IDs
- Prisma @default(autoincrement()) and @updatedAt
- NextAuth session for user tracking

**Risk:** Minimal - standard patterns in web apps.

---

## Medium Priority Challenges

### 6. Table Occurrences (123 total, 48 base tables)
**Impact:** Medium | **Complexity:** Low

**Current State:**
- Same table appears multiple times with different relationship contexts
- Example: organisation appears as organisation_developer, organisation_siteowner, etc.

**Migration Approach:**
- Single table in PostgreSQL with filtered queries
- Use Prisma relations with different aliases as needed
- Application-level filtering for different views

---

### 7. Script Conversion (225 scripts)
**Impact:** Medium | **Complexity:** Varies

**Breakdown:**
- ~95 Simple scripts (navigation, set field) → Easy conversion
- ~110 Medium scripts (CRUD, dialogs) → Moderate effort
- ~20 Complex scripts (loops, external APIs) → Careful conversion

**Key Script Categories:**
- Navigation → React Router / Next.js routing
- CRUD operations → Prisma queries
- Dialogs → Modal components
- Reports → PDF generation library
- Email → SendGrid or similar service

---

### 8. User Accounts & Permissions
**Impact:** Medium | **Complexity:** Medium

**Current State:**
- 30 user accounts
- 11 privilege sets
- Role-based access control

**Migration Approach:**
- NextAuth.js for authentication
- Custom role system in database
- Middleware for route protection

---

## Lower Priority Challenges

### 9. Reports (8 report layouts)
**Impact:** Low | **Complexity:** Medium

**Approach:**
- React-PDF for PDF generation
- Print-friendly CSS for browser printing
- Data export to Excel via API

### 10. Value List Validation
**Impact:** Low | **Complexity:** Low

**Approach:**
- Zod schema validation
- Select components with predefined options
- Database constraints where appropriate

---

## Data Migration Risks

### Record Counts to Migrate
| Table | Records | Risk Level |
|-------|---------|------------|
| developmentdetail | 2,116 | Low |
| address | 2,005 | Low |
| development | 1,984 | Medium (complex) |
| site | 1,847 | Low |
| planningdocs | 1,413 | Medium (files) |
| sitephotos | 1,250 | Medium (files) |
| organisation | 1,077 | Low |
| contact | 730 | Low |

### ID Mapping
- FileMaker PKid values must map to new PostgreSQL IDs
- All foreign key relationships must be preserved
- Recommend: Keep original IDs during migration, or create mapping table

---

## Questions for Russell

### Business Logic Clarification
1. How is the **development name** calculated from developmentdetail? (panel types, sizes, quantity)
2. What triggers a **planning application deadline** calculation?
3. Are there any **approval workflows** beyond status changes?
4. How does the **perimeter search** work - what's the typical radius used?

### Data Questions
5. Can you export container files from FileMaker, or do we need to manually download them?
6. Are all 30 user accounts still active?
7. Are there any **duplicate records** that should be cleaned before migration?

### Priority Questions
8. Which **dashboards** are most critical for day-to-day work?
9. Which **reports** are run most frequently?
10. Are there any features in FileMaker that are **not being used** anymore?

---

## Recommended Migration Order

1. **Database Schema** - Create PostgreSQL tables via Prisma
2. **Lookup Data** - Migrate status/type tables first
3. **Core Entities** - organisation, contact, address
4. **Main Tables** - site, development
5. **Junction Tables** - All jn* tables
6. **Child Tables** - Documents, photos, notes
7. **Container Files** - Export and upload to cloud storage
8. **User Accounts** - Create new accounts in NextAuth

---

*Document generated from FileMaker DDR analysis - Phase 1 Discovery*
