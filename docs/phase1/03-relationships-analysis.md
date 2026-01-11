# FileMaker Relationships Analysis

**Total Relationships:** 115
**Source:** DDR_converted.xml

---

## Relationship Types Summary

| Type | Count | Description |
|------|-------|-------------|
| Equal (=) | 114 | Standard FK to PK joins |
| CartesianProduct (X) | 1 | Cross-join for related developments |

---

## Core Entity Relationships

### Site Relationships (16 relationships)
| Source Table | Source Field | Target Table | Target Field | Notes |
|--------------|--------------|--------------|--------------|-------|
| site | PKid | development | FKsite_id | Site → Developments (cascade delete) |
| site | PKid | sitephotos | FKsite_id | Site → Photos (cascade delete) |
| site | FKtitle_id | title | PKid | Site → Title type |
| site | FKsitestatus_id | sitestatus | PKid | Site → Status |
| site | FKorganisation_id_siteowner | organisation | PKid | Site → Owner org |
| site | FKorganisation_id_siteagent | organisation | PKid | Site → Agent org |
| site | FKorganisation_id_localauthority | organisation | PKid | Site → Local authority |
| address_site | PKid | site | FKaddress_id | Address → Site |
| site | PKid | jnsiteownercontacts | FKsite_id | Site ↔ Owner contacts (junction) |
| site | PKid | jnsiteagentcontacts | FKsite_id | Site ↔ Agent contacts (junction) |

### Development Relationships (30+ relationships)
| Source Table | Source Field | Target Table | Target Field | Notes |
|--------------|--------------|--------------|--------------|-------|
| development | FKsite_id | site | PKid | Development → Site |
| development | FKdealtype_id | dealtype | PKid | Development → Deal type |
| development | FKdevelopment_statusid | developmentstatus | PKid | Development → Status |
| development | FKdevelopmenttype_id | developmenttype | PKid | Development → Type |
| development | FKcontractingentity_PKid | contractingentity | PKid | Development → Contracting entity |
| development | FKstatus_id_planningapp | applicationstatus | PKid | Development → Planning status |
| development | FKstatus_ID_advertapplication | applicationstatus | PKid | Development → Advert status |
| development | FKorganisation_id_developercompany | organisation | PKid | Development → Developer |
| development | FKorganisation_id_mediaowner | organisation | PKid | Development → Media owner |
| development | FKorganisation_id_mediaowneragent | organisation | PKid | Development → Media agent |
| development | FKorganisation_id_lawyer | organisation | PKid | Development → Lawyer |
| development | FKcontact_id_mediaowner | contact | PKid | Development → Media owner contact |
| development | FKcontact_id_caseofficer | contact | PKid | Development → Case officer |
| development | FKcontact_id_lawyer | contact | PKid | Development → Lawyer contact |

### Development Child Tables (Cascade Delete Enabled)
| Parent | Child Table | Junction Field | Notes |
|--------|-------------|----------------|-------|
| development | developmentdetail | FKdevelopement_id | Panel specifications |
| development | jndevelopmentnotes | FKdevelopment_id | Notes |
| development | jndevelopmentprojects | FKdevelopment_id | Project links |
| development | jndevelopmenttasks | FKdevelopment_id | Tasks |
| development | jndevelopmentbuildpart | FKdevelopment_id | Build parts |
| development | planningdocs | FKdevelopment_id | Planning documents |
| development | advertdocs | FKdevelopment_id | Advert documents |
| development | tenderoffers | fk_development_id | Tender offers |
| development | tenderphotos | fk_development_id | Tender photos |
| development | consultancyrentreview | FKdevelopment_id | Rent reviews |
| development | consultancyvaluation | FKdevelopment_id | Valuations |
| development | contractdocuments | FKdevelopment_id | Contract docs |

### Organisation-Contact Relationships
| Source Table | Source Field | Target Table | Target Field | Notes |
|--------------|--------------|--------------|--------------|-------|
| organisation | PKid | contact | FKorganisation_id | Org → Contacts |
| organisation | FKaddress_id | address | PKid | Org → Address |
| contact | FKaddress_ID | address | PKid | Contact → Address |

### Junction Tables (Many-to-Many)
| Junction Table | Table A | Table B | Purpose |
|----------------|---------|---------|---------|
| jndevelopmentprojects | development | project | Dev ↔ Projects |
| jndevelopmentnotes | development | (notes) | Dev ↔ Notes |
| jndevelopmenttasks | development | tasktype | Dev ↔ Tasks |
| jndevelopmentbuildpart | development | buildpart | Dev ↔ Build parts |
| jnsiteownercontacts | site | contact | Site ↔ Owner contacts |
| jnsiteagentcontacts | site | contact | Site ↔ Agent contacts |

### Address-Location Relationships
| Source Table | Source Field | Target Table | Target Field |
|--------------|--------------|--------------|--------------|
| address | FKtownsandcities_id | townsandcities | PKid |
| address | FKcounties_PKid | counties | PKid |

### Build/Tender Relationships
| Source Table | Source Field | Target Table | Target Field |
|--------------|--------------|--------------|--------------|
| jndevelopmentbuildpart | FKbuildpart_id | buildpart | PKid |
| jndevelopmentbuildpart | PKid | buildtenderesponses | FKjndeveloperbuildpart_PKid |
| jndevelopmentbuildpart | PKid | buildsnagginglist | FKjndevelopmentbuildpart_id |

---

## Special Relationship: CartesianProduct (ID 102)

```
development.FKsite_id X development_related.FKsite_id
```

This creates a cross-join that shows **all developments at the same site** - used for displaying related developments in the UI.

---

## Multi-Predicate Relationship (ID 155)

```
development.PKid = jndevelopmenttasks.FKdevelopment_id
AND development.gtasksbystatus = jndevelopmenttasks.complete
```

This filters tasks by completion status in addition to the development link.

---

## Table Occurrences (Aliases)

FileMaker uses "table occurrences" - multiple views of the same base table with different relationship contexts:

| Base Table | Occurrences Used |
|------------|------------------|
| organisation | organisation_developer, organisation_siteowner, organisation_mediaowner, organisation_lawyer, organisation_wildstone, organisation_agents, organisation_localauthoritytype |
| contact | contact_siteowner, contact_developers, contact_localauthority, contact_mediaowner, contact_lawyer, contact_wildstone |
| address | address_site, address_siteowner, address_organisation, address_localauthority |

---

## Cascade Delete Summary

**Tables with cascade delete from parent:**
- sitephotos ← site
- development ← site
- All development child tables (notes, tasks, projects, documents, etc.) ← development
- buildtenderesponses ← jndevelopmentbuildpart
- buildsnagginglist ← jndevelopmentbuildpart

---

## Migration Recommendations

1. **Create lookup tables first:** dealtype, developmentstatus, applicationstatus, sitestatus, tasktype, paneltype, panelsize, panelorientation, townsandcities, counties

2. **Create base entities:** organisation, contact, address, site

3. **Create central tables:** development, project

4. **Create junction tables:** All jn* tables with composite foreign keys

5. **Create child tables:** All document and detail tables

6. **Implement cascade deletes in Prisma schema** using `onDelete: Cascade`

7. **Handle table occurrences** using filtered queries in the application layer

---

*Document generated from FileMaker DDR analysis - Phase 1 Discovery*
