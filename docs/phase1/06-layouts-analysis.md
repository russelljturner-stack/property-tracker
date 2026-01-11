# FileMaker Layouts Analysis

**Total Layouts:** 82
**Source:** DDR_converted.xml (LayoutCatalog section)

---

## Layout Groups Summary

| Group | Count | Description |
|-------|-------|-------------|
| Administrator | 1 | Admin/system layouts |
| Tables | 45 | Data table management (tbl_*) |
| Reports | 7 | Print/export reports |
| Layout | 16 | Main user interface |
| Mapping | 7 | Google Maps integration |
| Script Steps | 4 | Utility layouts for scripts |
| Ungrouped | 2 | Miscellaneous |

---

## Main User Interface Layouts (16)

These are the primary screens users interact with daily.

### Dashboards (6)
| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 199 | lay_home | site | Home/landing page |
| 224 | lay_sitedashboard | site | Site list dashboard |
| 226 | lay_developmentdashboard | development | Development list dashboard |
| 263 | lay_planningdashboard | development | Planning schedule dashboard |
| 229 | lay_taskdashboard | jndevelopmenttasks | Task list dashboard |
| 365 | lay_taskdashboard_assignor | jndevelopmenttasks | Task assignor view |

### Detail/Edit Views (4)
| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 332 | lay_site | site | Site detail/edit form |
| 331 | lay_development | development | Development detail/edit form |
| 59 | lay_contact | contact | Contact detail view |
| 92 | lay_large photos | sitephotos | Photo viewer popup |

### List Views (3)
| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 90 | lay_companiesandcontacts | organisation | Companies & contacts list |
| 192 | lay_planningpdfs | development | Planning documents list |
| 325 | lay_tenderpdfs | development | Tender documents list |

### Document Viewers (2)
| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 195 | lay_pdfs | planningdocs | Planning PDF viewer |
| 326 | lay_pdfstender | tenderdocumantstest | Tender PDF viewer |

---

## Google Maps Layouts (7)

| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 112 | Solution1 | address_site | Map solution 1 |
| 115 | Solution 2 Data Entry View | site | Map with data entry |
| 116 | Solution 2 Map View | settings | Main map display |
| 117 | Solution 2 Settings | settings | Map configuration |
| 118 | Solution 2 Data | site | Map data panel |
| 119 | Solution 2 Map Detail | site | Map popup detail |
| 122 | settings | settings | General settings |

---

## Report Layouts (8)

| Layout ID | Name | Base Table | Purpose |
|-----------|------|------------|---------|
| 252 | sites report | site | Sites summary |
| 253 | developments report | development | Developments summary |
| 269 | planning schedule | development | Planning schedule |
| 348 | developments report Copy4 | development | Wide report variant |
| 369 | planning conditions schedule | planningconditions | Conditions schedule |
| 375 | development update | development | Development update |
| 380 | marketing tenders | development | Marketing tenders |
| 384 | Forecast Revenue | development | Revenue forecast |

---

## Table Management Layouts (45)

Admin-only data management for all tables. These follow the naming pattern `tbl_[tablename]`.

**Key Tables:**
- tbl_site, tbl_development, tbl_organisation, tbl_contact
- tbl_developmentstatus, tbl_applicationstatus, tbl_dealtype
- tbl_paneltype, tbl_panelsize, tbl_panelorientation
- tbl_townsandcities, tbl_counties
- All junction tables (tbl_jn*)

---

## Layout Screenshots Available

You have ~50 screenshots in `Filemaker/Layouts/` including:
- Home.jpg
- Site.jpg, Site_*.jpg (contacts, developments, photos, map, etc.)
- Development.jpg, Development_*.jpg (all tabs)
- Dashboard_*.jpg (Sites, Developments, Planning, Tasks)
- Companies_*.jpg
- Menu_*.jpg

---

## Web App Page Structure (Recommended)

### Main Navigation
1. **Dashboard** → lay_home
2. **Sites** → lay_sitedashboard, lay_site, map views
3. **Developments** → lay_developmentdashboard, lay_development
4. **Planning** → lay_planningdashboard
5. **Tasks** → lay_taskdashboard
6. **Companies & Contacts** → lay_companiesandcontacts, lay_contact
7. **Documents** → lay_pdfs, lay_tenderpdfs
8. **Maps** → Solution 2 layouts
9. **Reports** → All report layouts

### Admin Section
- User management
- System settings
- Lookup table management (all tbl_* layouts)

---

## Migration Priority

| Priority | Layouts | Reason |
|----------|---------|--------|
| 1 - Critical | 6 dashboards | Primary user navigation |
| 2 - High | 4 detail views | Core data entry |
| 3 - High | 7 map layouts | Key differentiator |
| 4 - Medium | 8 reports | Business reporting |
| 5 - Medium | 3 list views | Secondary navigation |
| 6 - Low | 45 table layouts | Admin consolidation |

---

*Document generated from FileMaker DDR analysis - Phase 1 Discovery*
