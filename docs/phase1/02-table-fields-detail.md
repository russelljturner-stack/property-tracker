# Wildstone Development Tracker - Table Fields Detail

This document provides detailed field information for the primary tables in the database.

---

## Table: `site` (1,847 records)

The central table for tracking physical advertising site locations.

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key (auto-serial) |
| dateadded | Date | Normal | Date site was created (auto-enter creation date) |
| type | Text | Normal | Site type: "Advertisement" or "Planning" (default: Advertisement) |
| name | Text | Normal | Site name (auto-populated from address line 1) |
| FKsitestatus_id | Number | Normal | Link to site status (live/dead) |
| FKorganisation_id_siteowner | Number | Normal | Link to site owner organisation |
| siteownername | Text | Normal | Site owner name (type-ahead field) |
| FKorganisation_id_siteagent | Number | Normal | Link to site agent organisation |
| siteagentname | Text | Normal | Site agent name (type-ahead field) |
| clientref | Text | Normal | Client's reference for the site |
| FKsitephoto_id | Number | Normal | Link to main site photo |
| FKaddress_id | Number | Normal | Link to site address |
| FKorganisation_id_localauthority | Number | Normal | Link to local planning authority |
| localauthorityname | Text | Normal | Local authority name (type-ahead field) |
| FKtitle_id | Number | Normal | Ownership title type (freehold/leasehold) |
| landregistrydoc | Binary | Normal | Container: Land registry PDF document |
| landregistymap | Binary | Normal | Container: Land registry map |
| survey | Text | Normal | Survey notes about the site |
| surveynotesdialog | Text | Calculated | Dialog prompt for survey notes |
| dialog owner | Text | Calculated | Dialog helper for owner selection |
| dialog agent | Text | Calculated | Dialog helper for agent selection |
| namedialog | Text | Calculated | Dialog helper for name |
| autocompletesiteowner | Text | Normal | Autocomplete helper field |
| autocompletelocalauthority | Text | Normal | Autocomplete helper field |
| autocompletesagent | Text | Normal | Autocomplete helper field |
| autocompleteexisitingadvertising | Number | Normal | Flag field |
| autocomplete779 | Number | Normal | Flag field (possibly Wildstone org ID) |
| createdby | Text | Normal | User who created record |
| createddate | Date | Normal | Creation date |
| modifiedby | Text | Normal | User who last modified |
| modifiedtimestamp | Timestamp | Normal | Last modification timestamp |
| wildstoneowner | Text | Normal | Wildstone team member responsible |
| inserturl | Text | Normal | URL field |

**Migration Notes:**
- Container fields (landregistrydoc, landregistymap) need cloud storage solution
- Several "autocomplete" and "dialog" fields are UI helpers that may not need migration
- Type-ahead functionality will be replaced with modern autocomplete components

---

## Table: `address` (2,005 records)

Stores address information for sites and organisations.

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key |
| line1 | Text | Normal | Address line 1 |
| line2 | Text | Normal | Address line 2 |
| FKtownsandcities_id | Number | Normal | Link to towns/cities lookup |
| townname | Text | Normal | Town name (denormalised) |
| FKcounties_PKid | Number | Normal | Link to counties lookup |
| countyname | Text | Normal | County name (denormalised) |
| postcode | Text | Normal | Postcode |
| country | Text | Normal | Country |
| combined | Text | Calculated | Full address combined |
| longitude | Number | Normal | GPS longitude |
| latitude | Number | Normal | GPS latitude |
| html | Text | Normal | HTML representation |
| location | Text | Normal | Location description |
| url | Text | Normal | URL (possibly Google Maps) |
| Source | Text | Calculated | Data source |
| Info | Text | Calculated | Info field |
| Address_Label | Text | Calculated | Label for display |
| GPS_HTML_Error | Text | Normal | GPS error messages |
| GPS_Precision | Number | Normal | GPS precision value |
| createdby | Text | Normal | Created by user |
| modifiedby | Text | Normal | Modified by user |
| createddate | Date | Normal | Creation date |
| modified | Timestamp | Normal | Modified timestamp |

**Migration Notes:**
- GPS coordinates (longitude/latitude) support Google Maps integration
- Consider using a proper geocoding API in the web app
- The `html` field likely generates map HTML - will be replaced with React component

---

## Table: `development` (1,984 records)

Core table tracking advertising development projects.

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key |
| FKdevelopmenttype_id | Number | Normal | Development type link |
| name | Text | Calculated | Development name (auto-generated from details) |
| FKsite_id | Number | Normal | Link to site |
| projectno | Number | Normal | Wildstone project number (unique) |
| projectordevid | Number | Calculated | Display field: project # or ID |
| **Developer Information** |
| FKorganisation_id_developercompany | Number | Normal | Developer company link |
| wildstonedeveloperorcontact | Text | Normal | Wildstone developer name |
| FKcontact_id_nonwildstonedeveloper | Number | Normal | Non-Wildstone developer contact |
| **Media Owner Information** |
| FKorganisation_id_mediaowner | Number | Normal | Media owner company |
| FKcontact_id_mediaowner | Number | Normal | Media owner contact |
| FKorganisation_id_mediaowneragent | Number | Normal | Media owner's agent |
| FKcontact_id_mediaowneragent | Number | Normal | Agent contact |
| **Deal Information** |
| FKdealtype_id | Number | Normal | Deal type (acquisition/lease/etc.) |
| FKdevelopment_statusid | Number | Normal | Development status |
| developmentstatusmodified | Date | Normal | Status last changed |
| estimateoractual | Text | Normal | Whether figures are estimates |
| consultancyfinancials | Text | Normal | Financial description |
| **Current Lease (Existing Site)** |
| currentrentperannum | Number | Normal | Current rent £/year |
| currentrentpermonth | Number | Calculated | Current rent £/month |
| currentleasestartdate | Date | Normal | Current lease start |
| currentleaseenddate | Date | Normal | Current lease end |
| currentleaseterm | Number | Normal | Current lease term (years) |
| currentlease | Binary | Normal | Container: Current lease PDF |
| **Proposed Deal Financials** |
| rentalvalue | Number | Normal | Proposed rental value |
| rentalvalueconsultancy | Number | Normal | Consultancy rental value |
| profityear1 | Number | Normal | Year 1 profit |
| profittherafter | Number | Normal | Profit years 2+ |
| purchaseprice | Number | Normal | Purchase price (acquisition) |
| leaseperannum | Number | Normal | Lease cost per year |
| c_profityear1 | Number | Calculated | Calculated year 1 profit |
| c_profitthereafter | Number | Calculated | Calculated ongoing profit |
| c_totalprofit | Number | Calculated | Total profit calculation |
| feeproposal | Text | Normal | Fee proposal text |
| **Contract Information** |
| offeragreed | Date | Normal | Offer agreed date |
| leasestartdate | Date | Normal | New lease start date |
| term | Number | Normal | Lease term (years) |
| finishfinishdate | Date | Calculated | Lease end date |
| probability | Number | Normal | Deal probability % |
| contractissued | Date | Normal | Contract issued date |
| contractsigned | Date | Normal | Contract signed date |
| contract | Binary | Normal | Container: Contract PDF |
| matterno | Text | Normal | Legal matter number |
| contractannualrent | Text | Normal | Contract rent terms |
| contractterm | Text | Normal | Contract term details |
| leaseassignable | Text | Normal | Is lease assignable? |
| rpiincreases | Text | Normal | RPI increase terms |
| rentcommencement | Text | Normal | Rent commencement terms |
| **AFL (Agreement for Lease)** |
| aflsigned | Date | Normal | AFL signed date |
| aflexpirydate | Date | Normal | AFL expiry date |
| aflsignedcomment | Text | Normal | AFL comments |
| aflexpirydatecomment | Text | Normal | Expiry comments |
| **Legal** |
| FKcontact_id_lawyer | Number | Normal | Lawyer contact |
| FKorganisation_id_lawyer | Number | Normal | Law firm |
| FKcontractingentity_PKid | Number | Normal | Contracting entity |
| **Design** |
| designsignedoffdate | Date | Normal | Design approval date |
| designsignedoffby | Text | Normal | Approved by |
| design | Binary | Normal | Container: Design file |
| designfinalordraft | Text | Normal | Draft or Final |
| designsignedoff | Text | Normal | Approval status |
| **Planning Application (Full Planning)** |
| wildstoneplanner | Text | Normal | Wildstone planner assigned |
| FKcontact_id_caseofficer | Number | Normal | Planning case officer |
| planningcontractualsubmission | Text | Normal | Submission requirements |
| planningcontractualsubmissiondate | Date | Normal | Required submission date |
| planningscore | Number | Normal | Planning likelihood score |
| preappmeetingrequired | Text | Normal | Pre-app meeting needed? |
| draftapplicationcomplete | Date | Normal | Draft completed date |
| preappsubmitted | Date | Normal | Pre-app submitted date |
| preappmeetingdate | Date | Normal | Pre-app meeting date |
| preappresponsereceived | Date | Normal | Response received date |
| preappreference | Text | Normal | Pre-app reference |
| preappfeedback | Text | Normal | Pre-app feedback |
| preappdoc | Binary | Normal | Container: Pre-app documents |
| planningapplicationdescription | Text | Normal | Application description |
| planningapplicationdetail | Text | Normal | Detailed description |
| planningclientapproval | Text | Normal | Client approval status |
| planningapplicationsubmitted | Date | Normal | Application submitted |
| planningappregistration | Date | Normal | Registration date |
| planningapplicationconsultationend | Date | Calculated | Consultation end date |
| planningapprefla | Text | Normal | LA reference number |
| planningappdetermindate | Date | Normal | Determination date |
| planningapptargetdate | Date | Calculated | Target decision date |
| planningapplicationtargetoveride | Date | Normal | Manual override target |
| planningconditions | Text | Normal | Conditions text |
| planningconditionsnumber | Number | Normal | Number of conditions |
| FKstatus_id_planningapp | Number | Normal | Application status |
| planningappstatusmodified | Date | Normal | Status modified date |
| **Planning Appeal** |
| planningappealdeadline | Date | Calculated | Appeal deadline |
| planningappealdeadlineoveride | Date | Normal | Override deadline |
| planningappealsubmitted | Date | Normal | Appeal submitted |
| planningappealstart | Date | Normal | Appeal start date |
| planningappealrefla | Text | Normal | Appeal reference |
| planningappealprocedure | Text | Normal | Appeal procedure type |
| planningappealrepresentations | Date | Normal | Representations deadline |
| planningappealforecastdetermination | Date | Calculated | Forecast decision date |
| planningappealactualdetermination | Date | Normal | Actual decision date |
| planningappealhearing | Date | Normal | Hearing date |
| planningappealfinalcomments | Date | Normal | Final comments deadline |
| **Advertisement Application** |
| advertapplicationdescription | Text | Normal | Advert description |
| advertapplicationdetail | Text | Normal | Detailed description |
| advertapplicationsubmitted | Date | Normal | Application submitted |
| advertapplicationregistration | Date | Normal | Registration date |
| advertapplicationconsultationend | Date | Calculated | Consultation end |
| advertapprefla | Text | Normal | LA reference |
| advertappdeterminationdate | Date | Normal | Determination date |
| advertapptargetdate | Date | Calculated | Target date |
| advertconditions | Text | Normal | Conditions |
| advertconditionsnumber | Number | Normal | Number of conditions |
| FKstatus_ID_advertapplication | Number | Normal | Status |
| advertappstatusmodified | Date | Normal | Status modified |
| **Advertisement Appeal** |
| advertappealdeadline | Date | Calculated | Appeal deadline |
| advertappealsubmitted | Date | Normal | Appeal submitted |
| advertappealstart | Date | Normal | Appeal start |
| advertappealrefla | Text | Normal | Appeal reference |
| advertappealprocedure | Text | Normal | Procedure type |
| advertappealrepresentations | Date | Normal | Representations date |
| *...and many more fields* |

**Migration Notes:**
- This is the largest and most complex table
- Many calculated date fields for planning deadlines
- Heavy use of container fields for documents
- Planning workflow is critical business logic
- Consider splitting into related tables in PostgreSQL for better normalisation

---

## Table: `organisation` (1,077 records)

Companies and organisations involved in developments.

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key |
| name | Text | Normal | Organisation name |
| type | Text | Normal | Organisation type |
| FKaddress_id | Number | Normal | Address link |
| phone | Text | Normal | Phone number |
| website | Text | Normal | Website URL |
| notes | Text | Normal | General notes |
| createdby | Text | Normal | Created by user |
| modifiedby | Text | Normal | Modified by user |

**Organisation Types Include:**
- Site Owners
- Site Agents
- Local Planning Authorities
- Media Owners
- Developers
- Lawyers
- Build Contractors

---

## Table: `contact` (730 records)

People at organisations.

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key |
| FKorganisation_id | Number | Normal | Parent organisation |
| FKtitle_id | Number | Normal | Salutation (Mr, Mrs, etc.) |
| firstname | Text | Normal | First name |
| lastname | Text | Normal | Last name |
| fullname | Text | Calculated | Full name |
| jobtitle | Text | Normal | Job title |
| email | Text | Normal | Email address |
| phone | Text | Normal | Phone number |
| mobile | Text | Normal | Mobile number |
| role | Text | Normal | Role/position |
| notes | Text | Normal | Notes |
| decisionlevel | Text | Normal | Decision-making level |

---

## Table: `developmentdetail` (2,116 records)

Detailed specifications for developments (panel types, sizes, etc.).

| Field Name | Data Type | Field Type | Description |
|------------|-----------|------------|-------------|
| PKid | Number | Normal | Primary key |
| FKdevelopement_id | Number | Normal | Parent development |
| FKpaneltype_id | Number | Normal | Panel type |
| FKpanelsize_id | Number | Normal | Panel size |
| FKpanelorientation_id | Number | Normal | Orientation |
| FKstructure_id | Number | Normal | Structure type |
| sides | Number | Normal | Number of sides |
| digital | Text | Normal | Is digital? |
| illuminated | Text | Normal | Is illuminated? |
| height | Number | Normal | Height |
| width | Number | Normal | Width |
| quantity | Number | Normal | Quantity |

**Migration Notes:**
- More records than developments = multiple panel configs per development
- Critical for development naming calculation

---

## Lookup Tables (Reference Data)

### dealtype (4 records)
Values: Acquisition, Lease, Consultancy, etc.

### developmentstatus (19 records)
Workflow status values for developments

### applicationstatus (13 records)
Planning application status values

### paneltype (8 records)
Billboard, Digital Screen, etc.

### panelsize (12 records)
48-sheet, 96-sheet, etc.

### panelorientation (3 records)
Portrait, Landscape, Square

### structure (8 records)
Monopole, Gantry, etc.

---

*This document covers the primary tables. Additional tables follow similar patterns.*
