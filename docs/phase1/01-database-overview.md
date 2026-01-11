# Wildstone Development Tracker - Database Overview

**Generated from FileMaker DDR:** 10/01/2026
**FileMaker Version:** 22.0.4
**Source File:** WildstoneDevelopmentTracker240714.fmp12

---

## Executive Summary

This document provides a comprehensive analysis of the Wildstone Development Tracker FileMaker database, which is a property development tracking application used by Wildstone (a UK-based advertising/media site development company).

### Database Statistics

| Component | Count |
|-----------|-------|
| Base Tables | 48 |
| Table Occurrences | 123 |
| Relationships | 115 |
| Layouts | 82 |
| Scripts | 225 |
| Value Lists | 97 |
| Custom Functions | 7 |
| User Accounts | 30 |
| Privilege Sets | 11 |
| Total Fields | ~660 |

---

## Business Domain Understanding

Based on the DDR analysis, this application tracks:

1. **Sites** - Physical locations where advertising structures can be placed
2. **Developments** - Projects to develop advertising sites (billboards, digital panels, etc.)
3. **Organisations** - Companies involved (site owners, media owners, agents, local authorities)
4. **Contacts** - People at those organisations
5. **Planning Applications** - Planning permission tracking with local authorities
6. **Contracts and Leases** - Financial and legal agreements
7. **Tenders** - Competitive bidding processes
8. **Tasks** - Project management and workflow items

### Industry Context

This is an **outdoor advertising (OOH - Out of Home)** business application. Wildstone appears to:
- Identify potential advertising sites
- Negotiate with site owners
- Obtain planning permission
- Build advertising structures (billboards, digital screens)
- Lease sites to media owners (JCDecaux, Clear Channel, etc.)

---

## Core Tables (48 Total)

### Primary Business Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `site` | 1,847 | Physical locations for advertising |
| `address` | 2,005 | Addresses (linked to sites and organisations) |
| `development` | 1,984 | Development projects on sites |
| `organisation` | 1,077 | Companies (owners, agents, authorities) |
| `contact` | 730 | People at organisations |
| `developmentdetail` | 2,116 | Detailed specs for developments |
| `planningdocs` | 1,413 | Planning application documents |
| `sitephotos` | 1,250 | Photos of sites |

### Junction/Linking Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `jndevelopmentnotes` | 274 | Notes linked to developments |
| `jndevelopmentprojects` | 60 | Development-to-project links |
| `jndevelopmenttasks` | 41 | Tasks linked to developments |
| `jnsiteownercontacts` | 434 | Site owner contact assignments |
| `jnsiteagentcontacts` | 74 | Site agent contact assignments |
| `jndevelopmentbuildpart` | 0 | Build part assignments |

### Lookup/Reference Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `dealtype` | 4 | Types of deals (acquisition, lease, etc.) |
| `developmentstatus` | 19 | Status options for developments |
| `applicationstatus` | 13 | Planning application statuses |
| `developmenttype` | 4 | Types of developments |
| `paneltype` | 8 | Types of advertising panels |
| `panelsize` | 12 | Panel size options |
| `panelorientation` | 3 | Portrait, Landscape, etc. |
| `structure` | 8 | Structure types |
| `tasktype` | 5 | Types of tasks |
| `title` | 3 | Ownership title types (freehold, leasehold) |
| `sitestatus` | 2 | Site status (live, dead) |
| `townsandcities` | 193 | UK towns and cities |
| `counties` | 75 | UK counties |
| `contractingentity` | 8 | Legal contracting entities |
| `buildpart` | 5 | Build components |
| `asgfstatus` | 3 | ASGF (?) status values |

### Consultancy Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `consultancyrentreview` | 2 | Rent review consultancy |
| `consultancyvaluation` | 0 | Valuation consultancy |
| `consultancyother` | 2 | Other consultancy work |
| `consultancyrevenue` | 0 | Revenue consultancy |

### System/Utility Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `useraccounts` | 25 | User accounts |
| `userlog` | 239 | User activity log |
| `settings` | 2 | System settings |
| `filterfields` | 0 | Filter configuration |
| `project` | 5 | Project groupings |

### Document/Media Tables

| Table Name | Records | Description |
|------------|---------|-------------|
| `planningdocs` | 1,413 | Planning documents |
| `planningconditions` | 4 | Planning conditions |
| `contractdocuments` | 12 | Contract documents |
| `advertdocs` | 0 | Advertisement documents |
| `tenderphotos` | 1 | Tender photos |
| `tenderoffers` | 1 | Tender offers |
| `buildtenderesponses` | 1 | Build tender responses |
| `tenderdocumantstest` | 2 | Test tender documents |
| `buildsnagginglist` | 0 | Build snagging items |
| `asgfreports` | 1 | ASGF reports |

---

## Key Field Patterns

### Primary Keys
All tables use `PKid` as the primary key with:
- Data type: Number
- Auto-enter: Serial, increment by 1
- Generated on creation

### Foreign Keys
Foreign keys follow the pattern `FK[tablename]_id` or `FK[tablename]_id_[role]`:
- `FKsite_id` - Links to site
- `FKorganisation_id_siteowner` - Links to organisation as site owner
- `FKorganisation_id_mediaowner` - Links to organisation as media owner
- `FKdevelopment_statusid` - Links to development status

### Common Field Types Found

| FileMaker Type | Count (approx) | PostgreSQL Equivalent |
|----------------|----------------|----------------------|
| Text | ~350 | String / Text |
| Number | ~200 | Int / Float |
| Date | ~50 | DateTime |
| Binary (Container) | ~30 | String (URL) |
| Calculated | ~80 | Computed / App logic |
| Timestamp | ~10 | DateTime |

### Container Fields (Files/Images)
Found in multiple tables, storing:
- Site photos
- Planning documents (PDFs)
- Land registry documents
- Lease agreements
- Tender documents

These are stored externally (Secure storage) and will need cloud storage in the web app.

---

## Data Volumes

### High-Volume Tables (>500 records)
- developmentdetail: 2,116
- address: 2,005
- development: 1,984
- site: 1,847
- planningdocs: 1,413
- sitephotos: 1,250
- organisation: 1,077
- contact: 730

### Medium-Volume Tables (50-500 records)
- jnsiteownercontacts: 434
- jndevelopmentnotes: 274
- userlog: 239
- townsandcities: 193
- counties: 75
- jnsiteagentcontacts: 74
- jndevelopmentprojects: 60

### Low-Volume/Lookup Tables (<50 records)
- Most reference tables have <20 records
- Many junction tables have minimal data

---

## Next Steps

1. Review the **Relationships Document** for table connections
2. Review the **Scripts Analysis** for business logic
3. Review the **Value Lists** for dropdown options
4. Review the **Layouts Analysis** for UI requirements
5. Identify **Migration Challenges** and plan solutions

---

*Document generated as part of Phase 1: Discovery and Documentation*
