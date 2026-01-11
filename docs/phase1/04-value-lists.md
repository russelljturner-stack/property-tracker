# FileMaker Value Lists Inventory

**Total Value Lists:** 97
**Source:** DDR_converted.xml (ValueListCatalog section)

---

## Summary

| Category | Count |
|----------|-------|
| Custom Value Lists (static) | 33 |
| Field-Based Value Lists (dynamic) | 64 |
| With "Show Related" Filtering | 28 |

---

## Custom Value Lists (Static Options)

These become TypeScript constants/enums in the web app.

| ID | Name | Values |
|----|------|--------|
| 10 | Yes No | Yes, No |
| 19 | Panel Sides | Single, Double |
| 35 | Organisation Type | Site Owner/Client, Agent, Developer, Local Authority, Consultant, Media Owner, Brand, Build Contractor, Lawyer, Other |
| 41 | Developer Role | Lead, Supervisor |
| 42 | Salutation | Mr, Mrs, Miss, Ms, Dr |
| 44 | Site Owner Role | Asset Manager, Surveyor, Marketing, Planning, Administrator |
| 45 | Decision Level | Decision Maker, Influencer |
| 48 | Development Option | Chosen, Preferred, Option |
| 54 | Planning Score | 1, 2, 3, 4, 5 |
| 66 | Zoom Levels | 2-13 (Google Maps) |
| 70 | Completion Status | Incomplete, Complete |
| 73 | Type of Site | Advertisement, WS Planning |
| 75 | Country | United Kingdom |
| 86 | Estimate or Actual | Estimate, Actual |
| 100 | Appeal Type | Hearing, Written Representations |
| 101 | Planning Doc Type | Advert Application, Advert Appeal, Planning Application, Planning Appeal |
| 106 | Draft or Final | Draft, Final |
| 118 | Agreement Type | License, Lease (Protected), Lease (Excluded), Other |
| 119 | Payment Schedule | Weekly, Monthly, Quarterly, Annually |
| 120 | Billing Frequency | Weekly, Monthly, Quarterly, Annually, Advance, Arrears |
| 127 | Contract Documents | 13 document types for Acquisition/Lease/Consultancy phases |
| 129 | Tender Strategy | Formal, Informal |
| 130 | Tender Status | Pre-Tender, Ongoing, Complete |
| 131 | Tender Materials | Video, Visuals, Event |

---

## Field-Based Value Lists (Database-Driven)

### Simple Lookups (No Filtering)

| ID | Name | Source Table | Display Field |
|----|------|--------------|---------------|
| 1 | Deal Type | dealtype | type |
| 11 | Site Status | sitestatus | status |
| 13 | Site | site | name |
| 17 | Panel Types | paneltype | type |
| 18 | Panel Orientation | panelorientation | type |
| 22 | Task Type | tasktype | action |
| 25 | Development Status | developmentstatus | statuscustomorder |
| 27 | Projects | project | name |
| 43 | Organisation | organisation | name |
| 49 | Site Title | title | type |
| 51 | Panel Size | panelsize | size |
| 53 | ASGF Status | asgfstatus | status |
| 79 | Build Part | buildpart | partofbuild |
| 84 | Towns and Cities | townsandcities | Name |
| 87 | Development Type | developmenttype | type |
| 89 | Counties | counties | name |
| 97 | Site Owners | organisation_siteowner | name |
| 102 | Counties | counties | name |
| 103 | Towns and Cities | townsandcities | Name |
| 121 | Structure Type | structure | type |
| 123 | Contracting Entity | contractingentity | entity |

### Cascading/Filtered Lists (Show Related Values)

These require parent-child dropdown patterns in the web app.

| ID | Name | Source Table | Filtered By |
|----|------|--------------|-------------|
| 32 | Site Owners by Type | organisation_siteownertypes | site |
| 40 | Contacts from Developer | contact_developers | development (selected developer) |
| 47 | Wildstone Contacts | contact_wildstone | development |
| 56 | Consultant Orgs | organisation_consultants | development |
| 57 | Media Owner/Brand Orgs | organisation_mediaownersorbrands | development |
| 59 | Contacts from Media Owner | contact_mediaownersorbrands | tenderoffers |
| 61 | Local Authority | organisation_localauthoritytype | site |
| 62 | LA Planning Contacts | contact_localauthority | development |
| 67 | Planning Inspectorate Contacts | contact_planning_inspectorate | development |
| 68 | Contacts from Site Owner | contact_siteowner | site |
| 77 | Contacts from Site Agent | contact_siteagent | site |
| 81 | Build Contractors | organisation_buildcontractors | buildtenderesponses |
| 83 | Build Contractor Contacts | contact_buildtendercontractor | buildtenderesponses |
| 88 | Contacts from Media Owner | contact_mediaowner | development |
| 112 | Wildstone Planners | useraccounts_planners | development |
| 115 | Media Owner Agent Orgs | organisation_agents | development |
| 116 | Media Owner Agent Contacts | contact_mediaowneragent | development |
| 125 | Lawyer Orgs | organisation_lawyertype | development |
| 126 | Lawyer Contacts | contact_lawyer | development |

---

## Lookup Tables Required

These reference tables must be created in PostgreSQL:

**Status Tables:**
- sitestatus, developmentstatus, applicationstatus, asgfstatus

**Type Tables:**
- dealtype, developmenttype, tasktype, paneltype, panelorientation, panelsize, structure, buildpart, title

**Location Tables:**
- counties, townsandcities, contractingentity

---

## Web Implementation Patterns

### Pattern 1: Static Constants
```typescript
export const SALUTATION_OPTIONS = ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr'] as const;
```

### Pattern 2: Database Lookup
```typescript
const sites = await prisma.site.findMany({
  select: { id: true, name: true },
  orderBy: { name: 'asc' }
});
```

### Pattern 3: Cascading Dropdown
```typescript
const contacts = await prisma.contact.findMany({
  where: { organisationId: selectedOrgId },
  select: { id: true, combinedName: true }
});
```

---

*Document generated from FileMaker DDR analysis - Phase 1 Discovery*
