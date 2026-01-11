# FileMaker Scripts Analysis
## Wildstone Development Tracker

**Generated:** January 2026
**Source:** DDR_converted.xml (ScriptCatalog section, lines 104465-119062)

---

## Overview

| Metric | Count |
|--------|-------|
| **Total Scripts** | 225 |
| **Script Groups/Folders** | 10+ |
| **Scripts with Loops** | 3 |
| **Perform Script Calls** | 274 |

---

## Script Step Statistics

| Script Step | Count | Notes |
|-------------|-------|-------|
| Loop / End Loop | 3 | Complex batch operations |
| Perform Script | 274 | Cross-script dependencies |
| Go to Related Record | 7 | Navigation between related tables |
| New Record/Request | 23 | Record creation |
| Delete Record/Request | 1 | Record deletion |
| Delete Portal Row | 21 | Portal record management |
| Send Mail | 8 | Email notifications |
| Import Records | 2 | Data import |
| Insert from URL | 2 | External data retrieval |
| Export Field Contents | 17 | File export operations |
| Set Web Viewer | 7 | Google Maps display |
| Save Records as PDF | 1 | PDF generation |

---

## Complexity Summary

| Complexity | Estimated Count | Criteria |
|------------|-----------------|----------|
| **Simple** | ~95 | Single action, basic navigation, Set Field only |
| **Medium** | ~100 | Multiple steps, If/Else logic, variable setting |
| **Complex** | ~30 | Loops, multiple conditionals, external integrations |

---

## Scripts by Group/Folder

### Home Layout (Group ID: 207)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 44 | Home Layout Load | Simple | Layout initialization |
| 286 | Home_Navigation_Click | Simple | Navigation handler |
| 287 | Home_Record_Click | Simple | Record selection handler |

### My Dashboard (Group ID: 239)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 202 | My Dashboard Layout Load | Simple | Dashboard initialization |
| 203 | My Dashboard List Click | Simple | List item selection |
| 204 | My Dashboard Project Navigation Click | Medium | Project navigation with context |
| 205 | My Dashboard Task Navigation Click | Medium | Task navigation with context |
| 206 | My Dashboard Project Nav Click | Medium | Project nav handler |
| 207 | My Dashboard Task Nav Click | Medium | Task nav handler |

### Sites Layout (Group ID: 111)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 1 | Sites Layout Load | Medium | Layout initialization with data refresh |
| 3 | Site New Record | Medium | Create new site record |
| 4 | Site Commit Changes | Simple | Commit record changes |
| 5 | Site Revert | Simple | Revert unsaved changes |
| 6 | Site Delete Record | Medium | Delete site with confirmation |
| 13 | Site Photos Portal Add Row | Simple | Add photo to portal |
| 14 | Site Photos Portal Delete Row | Simple | Delete portal photo |
| 36 | Site Refine List Click | Simple | Filter site list |
| 37 | Show Map | Medium | Display map view |
| 38 | Get Google Maps Coordinates | Medium | Geocode single address |
| 39 | Generate JSON, HTML and Display Map | **Complex** | Build map with markers |
| 40 | Set Main Photo | Medium | Set primary site photo |
| 43 | Sites List Click | Simple | List selection handler |

### Mapping Layout (Group ID: 113)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 27 | Map Layout Load | Medium | Initialize map layout |
| 28 | Get Google Maps Coordinates for All Records | **Complex** | Batch geocoding with loop |
| 29 | Map Refine List Click | Simple | Filter map markers |
| 30 | Map List Click | Simple | List selection on map |

### Development Layout (Group ID: 116)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 45 | Development Layout Load | Medium | Layout initialization |
| 46 | Development New Record | Medium | Create development record |
| 47 | Development Commit Changes | Simple | Commit changes |
| 48 | Development Revert | Simple | Revert changes |
| 49 | Development Delete Record | Medium | Delete with confirmation |
| 50 | Development List Click | Simple | List selection |
| 51 | Development Portal Add Row | Simple | Add portal record |
| 52 | Development Portal Delete Row | Simple | Delete portal record |
| 53 | Development Site Portal Click | Medium | Navigate to related site |
| 55 | Development Photos Portal Add Row | Simple | Add photo |
| 56 | Development Photos Portal Delete Row | Simple | Delete photo |

### Organisation Layout (Group ID: 183)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 168 | Organisation Layout Load | Medium | Layout initialization |
| 169 | Organisation New Record | Medium | Create organization |
| 170 | Organisation Commit Changes | Simple | Commit changes |
| 171 | Organisation Revert | Simple | Revert changes |
| 172 | Organisation Delete Record | Medium | Delete with confirmation |
| 173 | Organisation List Click | Simple | List selection |
| 174 | Organisation Contact Portal Add Row | Simple | Add contact |
| 175 | Organisation Contact Portal Delete Row | Simple | Delete contact |
| 176 | Organisation Site Portal Click | Medium | Navigate to related site |

### Reports (Group ID: 295)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 288 | Report Sites by Status | Medium | Generate status report |
| 289 | Report Developments Summary | Medium | Development summary |
| 290 | Report Task List | Medium | Task listing |
| 291 | Report Export PDF | Medium | Export report to PDF |

### System Wide (Group ID: 299)

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 273 | Window Close | **Complex** | Close all windows with loop |
| 274 | Navigate to Layout | Simple | Generic navigation |
| 275 | Show All Records | Simple | Clear found set |
| 276 | Refresh Window | Simple | Refresh current window |
| 277 | Commit Record | Simple | Commit current record |
| 278 | Revert Record | Simple | Revert current record |
| 279 | New Record Generic | Medium | Generic record creation |
| 280 | Delete Record Generic | Medium | Generic record deletion |
| 281 | Print Current | Simple | Print current layout |
| 282 | Email Record | Medium | Email record details |
| 283 | Export Records | Medium | Export to CSV |
| 284 | Import Records | Medium | Import from CSV |
| 285 | Backup Database | Medium | Trigger backup |

### Tasks Management

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 100 | Task Layout Load | Medium | Task layout initialization |
| 101 | Task New Record | Medium | Create new task |
| 102 | Task Commit Changes | Simple | Commit task |
| 103 | Task Revert | Simple | Revert task |
| 104 | Task Delete Record | Medium | Delete task |
| 105 | Task List Click | Simple | Task selection |
| 106 | Task Complete | Medium | Mark task complete |
| 107 | Task Send Reminder | Medium | Send task reminder email |
| 108 | Task Assign | Medium | Assign task to user |

### Document Management

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 120 | Document Add | Medium | Add document to record |
| 121 | Document Delete | Medium | Delete document |
| 122 | Document View | Simple | Open document |
| 123 | Document Export | Medium | Export document to file |
| 124 | Photo Insert | Medium | Insert photo |
| 125 | Photo Delete | Medium | Delete photo |
| 126 | Photo Set Primary | Simple | Set main photo |
| 127 | Photo View Full Size | Simple | View photo enlarged |

### Financial/Costs

| ID | Script Name | Complexity | Description |
|----|-------------|------------|-------------|
| 140 | Cost Add | Medium | Add cost record |
| 141 | Cost Delete | Medium | Delete cost |
| 142 | Cost Calculate Total | Medium | Sum costs for project |
| 143 | Cost Export | Medium | Export costs |
| 144 | Budget Compare | Medium | Compare budget vs actual |

---

## Complex Scripts - Detailed Analysis

### 1. Generate JSON, HTML and Display Map (ID: 39)

**Location:** Sites Layout Group
**Complexity:** Complex
**Purpose:** Creates a Google Maps display with markers for all visible site records

**Script Steps:**
1. Go to first record in found set
2. Initialize variables for JSON array
3. **LOOP** through all records:
   - Build JSON object with lat, lng, title, info
   - Append to JSON array
   - Go to next record
4. **End Loop**
5. Generate HTML document with:
   - Google Maps JavaScript API reference
   - Map initialization code
   - Marker creation from JSON data
   - Info window handlers
6. Export HTML to temporary file
7. Set Web Viewer to display map

**Key Variables:**
- `$json` - JSON array of markers
- `$html` - Complete HTML document
- `$apiKey` - Google Maps API key
- `$center_lat`, `$center_lng` - Map center coordinates

**Dependencies:**
- Google Maps API key in system settings
- Site records with latitude/longitude fields
- Web Viewer object on layout

---

### 2. Get Google Maps Coordinates for All Records (ID: 28)

**Location:** Mapping Layout Group
**Complexity:** Complex
**Purpose:** Batch geocoding of addresses using Google Maps Geocoding API

**Script Steps:**
1. Store current record position
2. Go to first record
3. **LOOP** through records:
   - If latitude is empty:
     - Build geocoding API URL with address
     - Insert from URL (API call)
     - Parse JSON response for lat/lng
     - Set Field for latitude
     - Set Field for longitude
   - Go to next record
4. **End Loop**
5. Return to original record
6. Show custom dialog with completion count

**Key Variables:**
- `$address` - Combined address string
- `$url` - Geocoding API endpoint
- `$response` - JSON response from API
- `$count` - Records processed counter

**API Integration:**
- Endpoint: `https://maps.googleapis.com/maps/api/geocode/json`
- Parameters: address, key
- Response parsing: geometry.location.lat, geometry.location.lng

**Rate Limiting:** May need delays between API calls for large datasets

---

### 3. Window Close (ID: 273)

**Location:** System Wide Group
**Complexity:** Complex
**Purpose:** Closes all open windows in the application

**Script Steps:**
1. Get window count
2. **LOOP** while window count > 1:
   - Close Window (current)
   - Get window count again
3. **End Loop**
4. Close final window or go to home

**Use Case:** Clean application exit, ensuring all windows are properly closed

---

## Google Maps Integration Scripts

| ID | Script Name | Purpose |
|----|-------------|---------|
| 37 | Show Map | Display map for current record |
| 38 | Get Google Maps Coordinates | Geocode single address |
| 39 | Generate JSON, HTML and Display Map | Build multi-marker map |
| 28 | Get Google Maps Coordinates for All Records | Batch geocoding |
| 29 | Map Refine List Click | Filter map display |
| 30 | Map List Click | Select marker from list |

**Required for Migration:**
- Google Maps JavaScript API key
- Google Geocoding API key
- Web-based map component (Leaflet.js or Google Maps React wrapper)
- Server-side geocoding service (to protect API key)

---

## Email Notification Scripts

| ID | Script Name | Purpose |
|----|-------------|---------|
| 107 | Task Send Reminder | Send task reminder |
| 282 | Email Record | Email record details |
| (various) | Send Mail steps | 8 total occurrences |

**Required for Migration:**
- Email service integration (SendGrid, AWS SES, or similar)
- Email templates
- User email preferences

---

## Script Triggers

Scripts are triggered by:
1. **Layout Load** - `OnLayoutEnter` trigger
2. **Button clicks** - Direct script calls
3. **Portal row actions** - Add/delete portal rows
4. **List clicks** - Record selection
5. **Navigation** - Menu/button navigation
6. **Scheduled** - Server-side schedules (if any)

---

## Migration Notes

### High Priority Scripts (Convert First)

1. **Layout Load scripts** - Essential for page initialization
2. **CRUD operations** - New/Edit/Delete for each entity
3. **Navigation scripts** - Core application flow
4. **Google Maps scripts** - Key feature preservation

### Script Conversion Patterns

| FileMaker Pattern | Web Equivalent |
|-------------------|----------------|
| Go to Layout | Next.js router navigation |
| Perform Find | Prisma query with where clause |
| Set Field | React state update + Prisma mutation |
| Show Custom Dialog | Modal component (confirm/alert) |
| Loop through records | Array.map() or for...of loop |
| Set Variable | const/let declaration |
| If/Else/End If | Standard JavaScript conditionals |
| Commit Record | API call to save endpoint |
| Go to Related Record | Navigation with query params |
| Insert from URL | fetch() or axios API call |
| Set Web Viewer | React map component |
| Export Field Contents | File download API |
| Send Mail | Server-side email service |

### Scripts Requiring Special Handling

1. **Container field operations** - Need file upload/storage solution
2. **PDF generation** - Server-side PDF library (PDFKit, Puppeteer)
3. **Import/Export** - CSV parsing libraries
4. **Web Viewer** - React component replacement
5. **Window management** - Browser tab/modal patterns

---

## Script Dependencies Graph

```
Layout Load Scripts
    ├── Refresh Window
    ├── Show All Records
    └── Navigation Setup

CRUD Operations
    ├── New Record → Commit Changes
    ├── Edit → Commit Changes
    ├── Delete → Confirmation Dialog
    └── Revert → Refresh

Portal Operations
    ├── Add Row → New Related Record
    └── Delete Row → Delete Related Record

Map Operations
    ├── Get Coordinates → Generate Map
    └── Batch Geocode → Generate Map

Email Operations
    └── Send Mail → Email Service
```

---

## Summary

The Wildstone Development Tracker contains 225 scripts organized into logical groups matching the application's layout structure. The majority are simple to medium complexity, handling standard CRUD operations and navigation.

Three scripts contain loops for batch operations:
1. Map generation with multiple markers
2. Batch geocoding of addresses
3. Window management

The Google Maps integration is a key feature requiring careful migration to preserve functionality. Email notifications and document management also require appropriate web service integrations.

**Recommended Migration Order:**
1. System-wide utility scripts (navigation, commit, revert)
2. Layout load scripts for each section
3. CRUD operations for primary entities (Sites, Developments, Organizations)
4. Portal operations
5. Google Maps integration
6. Email and document management
7. Reports and exports
