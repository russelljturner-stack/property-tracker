/**
 * Database Seed Script - Comprehensive Test Data
 *
 * This script populates the database with realistic sample data
 * covering all key tables so the UI can be thoroughly tested.
 *
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with comprehensive test data...\n');

  // =========================================================================
  // STEP 1: Clear existing data (in dependency order)
  // =========================================================================
  console.log('Clearing existing data...');

  // Child records first
  await prisma.developmentNote.deleteMany({});
  await prisma.developmentTask.deleteMany({});
  await prisma.developmentDetail.deleteMany({});
  await prisma.developmentBuildPart.deleteMany({});
  await prisma.planningDoc.deleteMany({});
  await prisma.contractDocument.deleteMany({});
  await prisma.tenderOffer.deleteMany({});
  await prisma.sitePhoto.deleteMany({});
  await prisma.siteOwnerContact.deleteMany({});
  await prisma.siteAgentContact.deleteMany({});
  await prisma.contact_Development_MediaOwner.deleteMany({});

  // Main entities
  await prisma.development.deleteMany({});
  await prisma.site.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.organisation.deleteMany({});
  await prisma.address.deleteMany({});

  // Lookup tables
  await prisma.townCity.deleteMany({});
  await prisma.county.deleteMany({});
  await prisma.panelSize.deleteMany({});
  await prisma.panelType.deleteMany({});
  await prisma.panelOrientation.deleteMany({});
  await prisma.structureType.deleteMany({});
  await prisma.taskType.deleteMany({});
  await prisma.dealType.deleteMany({});
  await prisma.developmentType.deleteMany({});
  await prisma.applicationStatus.deleteMany({});
  await prisma.siteStatus.deleteMany({});
  await prisma.developmentStatus.deleteMany({});
  await prisma.sitePipelineStatus.deleteMany({});

  console.log('  Done\n');

  // =========================================================================
  // STEP 2: Create Test User
  // =========================================================================
  console.log('Creating test users and roles...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full access to all features',
      canViewSites: true,
      canEditSites: true,
      canDeleteSites: true,
      canViewDevelopments: true,
      canEditDevelopments: true,
      canDeleteDevelopments: true,
      canViewContacts: true,
      canEditContacts: true,
      canViewReports: true,
      canExportData: true,
      canManageUsers: true,
      isAdmin: true,
    },
  });

  const developerRole = await prisma.role.upsert({
    where: { name: 'Developer' },
    update: {},
    create: {
      name: 'Developer',
      description: 'Property developer - manages sites and developments',
      canViewSites: true,
      canEditSites: true,
      canViewDevelopments: true,
      canEditDevelopments: true,
      canViewContacts: true,
      canEditContacts: true,
      canViewReports: true,
    },
  });

  const plannerRole = await prisma.role.upsert({
    where: { name: 'Planner' },
    update: {},
    create: {
      name: 'Planner',
      description: 'Planning specialist - focuses on planning applications',
      canViewSites: true,
      canViewDevelopments: true,
      canEditDevelopments: true,
      canViewContacts: true,
      canViewReports: true,
    },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { passwordHash },
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash,
      isActive: true,
      roleId: developerRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { passwordHash },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash,
      isActive: true,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: 'planner@example.com' },
    update: { passwordHash },
    create: {
      email: 'planner@example.com',
      name: 'Planning Team',
      passwordHash,
      isActive: true,
      roleId: plannerRole.id,
    },
  });

  console.log('  Created 3 users: test@example.com, admin@example.com, planner@example.com\n');

  // =========================================================================
  // STEP 3: Create Lookup Tables
  // =========================================================================
  console.log('Creating lookup tables...');

  // Counties
  const counties = await Promise.all([
    prisma.county.create({ data: { name: 'Greater London', sortOrder: 1 } }),
    prisma.county.create({ data: { name: 'Greater Manchester', sortOrder: 2 } }),
    prisma.county.create({ data: { name: 'West Midlands', sortOrder: 3 } }),
    prisma.county.create({ data: { name: 'West Yorkshire', sortOrder: 4 } }),
    prisma.county.create({ data: { name: 'Buckinghamshire', sortOrder: 5 } }),
    prisma.county.create({ data: { name: 'City of Glasgow', sortOrder: 6 } }),
    prisma.county.create({ data: { name: 'Tyne and Wear', sortOrder: 7 } }),
    prisma.county.create({ data: { name: 'South Yorkshire', sortOrder: 8 } }),
    prisma.county.create({ data: { name: 'Merseyside', sortOrder: 9 } }),
  ]);

  // Towns/Cities
  const towns = await Promise.all([
    prisma.townCity.create({ data: { name: 'London', sortOrder: 1 } }),
    prisma.townCity.create({ data: { name: 'Manchester', sortOrder: 2 } }),
    prisma.townCity.create({ data: { name: 'Birmingham', sortOrder: 3 } }),
    prisma.townCity.create({ data: { name: 'Leeds', sortOrder: 4 } }),
    prisma.townCity.create({ data: { name: 'Milton Keynes', sortOrder: 5 } }),
    prisma.townCity.create({ data: { name: 'Glasgow', sortOrder: 6 } }),
    prisma.townCity.create({ data: { name: 'Newcastle upon Tyne', sortOrder: 7 } }),
    prisma.townCity.create({ data: { name: 'Sheffield', sortOrder: 8 } }),
    prisma.townCity.create({ data: { name: 'Liverpool', sortOrder: 9 } }),
    prisma.townCity.create({ data: { name: 'Bristol', sortOrder: 10 } }),
  ]);

  // Site statuses
  const siteStatuses = await Promise.all([
    prisma.siteStatus.create({ data: { name: 'Live', description: 'Active site', sortOrder: 1 } }),
    prisma.siteStatus.create({ data: { name: 'Dead', description: 'Archived/inactive', sortOrder: 2 } }),
  ]);

  // Site pipeline statuses
  const pipelineStatuses = await Promise.all([
    prisma.sitePipelineStatus.create({ data: { name: 'Opportunity identified', sortOrder: 1 } }),
    prisma.sitePipelineStatus.create({ data: { name: 'Contact made with land owner / agent', sortOrder: 2 } }),
    prisma.sitePipelineStatus.create({ data: { name: 'Land owner / agent can\'t be contacted', sortOrder: 3, isParked: true } }),
    prisma.sitePipelineStatus.create({ data: { name: 'Offer in negotiation', sortOrder: 4 } }),
    prisma.sitePipelineStatus.create({ data: { name: 'Offers declined - no deal reached', sortOrder: 5, isParked: true } }),
  ]);

  // Development statuses
  const devStatuses = await Promise.all([
    prisma.developmentStatus.create({ data: { name: 'Offer accepted', sortOrder: 1, colour: '#17a2b8' } }),
    prisma.developmentStatus.create({ data: { name: 'Head of terms agreed', sortOrder: 2, colour: '#17a2b8' } }),
    prisma.developmentStatus.create({ data: { name: 'ASGF required', sortOrder: 3, colour: '#ffc107' } }),
    prisma.developmentStatus.create({ data: { name: 'Awaiting ASGF outcome', sortOrder: 4, colour: '#ffc107' } }),
    prisma.developmentStatus.create({ data: { name: 'Planning / advert application submitted', sortOrder: 5, colour: '#6f42c1' } }),
    prisma.developmentStatus.create({ data: { name: 'Planning / advert consent refused', sortOrder: 6, colour: '#dc3545' } }),
    prisma.developmentStatus.create({ data: { name: 'Planning / advert consent granted', sortOrder: 7, colour: '#28a745' } }),
    prisma.developmentStatus.create({ data: { name: 'Contracts in negotiation', sortOrder: 8, colour: '#fd7e14' } }),
    prisma.developmentStatus.create({ data: { name: 'Contracts exchanged', sortOrder: 9, colour: '#28a745' } }),
    prisma.developmentStatus.create({ data: { name: 'Out to tender', sortOrder: 10, colour: '#20c997' } }),
    prisma.developmentStatus.create({ data: { name: 'Site in development', sortOrder: 11, colour: '#6610f2' } }),
    prisma.developmentStatus.create({ data: { name: 'Site operational', sortOrder: 12, colour: '#28a745' } }),
    prisma.developmentStatus.create({ data: { name: 'Development on hold', sortOrder: 13, colour: '#6c757d' } }),
    prisma.developmentStatus.create({ data: { name: 'Development dropped', sortOrder: 14, colour: '#dc3545' } }),
  ]);

  // Application statuses (for planning/advert applications)
  const appStatuses = await Promise.all([
    prisma.applicationStatus.create({ data: { name: 'Not submitted', sortOrder: 1, colour: '#6c757d' } }),
    prisma.applicationStatus.create({ data: { name: 'Submitted - awaiting validation', sortOrder: 2, colour: '#17a2b8' } }),
    prisma.applicationStatus.create({ data: { name: 'Validated', sortOrder: 3, colour: '#17a2b8' } }),
    prisma.applicationStatus.create({ data: { name: 'Under consideration', sortOrder: 4, colour: '#ffc107' } }),
    prisma.applicationStatus.create({ data: { name: 'Approved', sortOrder: 5, colour: '#28a745' } }),
    prisma.applicationStatus.create({ data: { name: 'Approved with conditions', sortOrder: 6, colour: '#28a745' } }),
    prisma.applicationStatus.create({ data: { name: 'Refused', sortOrder: 7, colour: '#dc3545' } }),
    prisma.applicationStatus.create({ data: { name: 'Appeal submitted', sortOrder: 8, colour: '#fd7e14' } }),
    prisma.applicationStatus.create({ data: { name: 'Appeal allowed', sortOrder: 9, colour: '#28a745' } }),
    prisma.applicationStatus.create({ data: { name: 'Appeal dismissed', sortOrder: 10, colour: '#dc3545' } }),
    prisma.applicationStatus.create({ data: { name: 'Withdrawn', sortOrder: 11, colour: '#6c757d' } }),
  ]);

  // Deal types
  const dealTypes = await Promise.all([
    prisma.dealType.create({ data: { name: 'Acquisition', description: 'Buying the site/lease', sortOrder: 1 } }),
    prisma.dealType.create({ data: { name: 'Lease', description: 'Leasing the site', sortOrder: 2 } }),
    prisma.dealType.create({ data: { name: 'Consultancy', description: 'Consultancy arrangement', sortOrder: 3 } }),
    prisma.dealType.create({ data: { name: 'Revenue Share', description: 'Revenue sharing deal', sortOrder: 4 } }),
  ]);

  // Development types
  const devTypes = await Promise.all([
    prisma.developmentType.create({ data: { name: 'New Build', description: 'Brand new installation', sortOrder: 1 } }),
    prisma.developmentType.create({ data: { name: 'Upgrade', description: 'Upgrading existing panel', sortOrder: 2 } }),
    prisma.developmentType.create({ data: { name: 'Replacement', description: 'Replacing existing structure', sortOrder: 3 } }),
    prisma.developmentType.create({ data: { name: 'Relocation', description: 'Moving to new position', sortOrder: 4 } }),
  ]);

  // Panel types
  const panelTypes = await Promise.all([
    prisma.panelType.create({ data: { name: 'Digital LED', description: 'Digital LED screen', sortOrder: 1 } }),
    prisma.panelType.create({ data: { name: 'Paper & Paste', description: 'Traditional poster', sortOrder: 2 } }),
    prisma.panelType.create({ data: { name: 'Backlit', description: 'Illuminated static', sortOrder: 3 } }),
    prisma.panelType.create({ data: { name: 'Tri-face', description: 'Rotating three-face unit', sortOrder: 4 } }),
    prisma.panelType.create({ data: { name: 'Bus Shelter', description: '6-sheet bus shelter', sortOrder: 5 } }),
  ]);

  // Panel sizes
  const panelSizes = await Promise.all([
    prisma.panelSize.create({ data: { name: '6 Sheet', widthMm: 1200, heightMm: 1800, sortOrder: 1 } }),
    prisma.panelSize.create({ data: { name: '48 Sheet', widthMm: 6096, heightMm: 3048, sortOrder: 2 } }),
    prisma.panelSize.create({ data: { name: '96 Sheet', widthMm: 12192, heightMm: 3048, sortOrder: 3 } }),
    prisma.panelSize.create({ data: { name: 'Digital 6m x 3m', widthMm: 6000, heightMm: 3000, sortOrder: 4 } }),
    prisma.panelSize.create({ data: { name: 'Digital 12m x 3m', widthMm: 12000, heightMm: 3000, sortOrder: 5 } }),
  ]);

  // Panel orientations
  const orientations = await Promise.all([
    prisma.panelOrientation.create({ data: { name: 'Landscape', sortOrder: 1 } }),
    prisma.panelOrientation.create({ data: { name: 'Portrait', sortOrder: 2 } }),
    prisma.panelOrientation.create({ data: { name: 'Square', sortOrder: 3 } }),
  ]);

  // Structure types
  const structures = await Promise.all([
    prisma.structureType.create({ data: { name: 'Monopole', description: 'Single pole structure', sortOrder: 1 } }),
    prisma.structureType.create({ data: { name: 'Bipole', description: 'Two-pole structure', sortOrder: 2 } }),
    prisma.structureType.create({ data: { name: 'Wall Mounted', description: 'Fixed to building', sortOrder: 3 } }),
    prisma.structureType.create({ data: { name: 'Gantry', description: 'Bridge/gantry mount', sortOrder: 4 } }),
    prisma.structureType.create({ data: { name: 'Freestanding', description: 'Ground-based structure', sortOrder: 5 } }),
  ]);

  // Task types
  const taskTypes = await Promise.all([
    prisma.taskType.create({ data: { name: 'Call', description: 'Phone call required', sortOrder: 1 } }),
    prisma.taskType.create({ data: { name: 'Email', description: 'Email to send', sortOrder: 2 } }),
    prisma.taskType.create({ data: { name: 'Meeting', description: 'Meeting to attend', sortOrder: 3 } }),
    prisma.taskType.create({ data: { name: 'Site Visit', description: 'Visit the site', sortOrder: 4 } }),
    prisma.taskType.create({ data: { name: 'Document', description: 'Document to prepare', sortOrder: 5 } }),
    prisma.taskType.create({ data: { name: 'Review', description: 'Review/approval needed', sortOrder: 6 } }),
  ]);

  console.log('  Created all lookup tables\n');

  // =========================================================================
  // STEP 4: Create Organisations
  // =========================================================================
  console.log('Creating organisations...');

  // Local Authorities
  const localAuthorities = await Promise.all([
    prisma.organisation.create({ data: { name: 'City of London Corporation', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Manchester City Council', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Birmingham City Council', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Leeds City Council', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Milton Keynes Council', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Glasgow City Council', type: 'Local Authority' } }),
    prisma.organisation.create({ data: { name: 'Newcastle City Council', type: 'Local Authority' } }),
  ]);

  // Site Owners (landowners)
  const siteOwners = await Promise.all([
    prisma.organisation.create({ data: { name: 'Network Rail', type: 'Site Owner', phone: '0345 711 4141' } }),
    prisma.organisation.create({ data: { name: 'Transport for London', type: 'Site Owner', phone: '0343 222 1234' } }),
    prisma.organisation.create({ data: { name: 'Highways England', type: 'Site Owner', phone: '0300 123 5000' } }),
    prisma.organisation.create({ data: { name: 'Bruntwood Estates', type: 'Site Owner', phone: '0161 209 3456' } }),
    prisma.organisation.create({ data: { name: 'Legal & General Property', type: 'Site Owner', phone: '020 3124 2000' } }),
    prisma.organisation.create({ data: { name: 'Aviva Investors Property', type: 'Site Owner', phone: '020 7809 6000' } }),
    prisma.organisation.create({ data: { name: 'British Land PLC', type: 'Site Owner', phone: '020 7486 4466' } }),
  ]);

  // Site Agents
  const siteAgents = await Promise.all([
    prisma.organisation.create({ data: { name: 'CBRE', type: 'Site Agent', phone: '020 7182 2000' } }),
    prisma.organisation.create({ data: { name: 'JLL', type: 'Site Agent', phone: '020 7493 4933' } }),
    prisma.organisation.create({ data: { name: 'Savills', type: 'Site Agent', phone: '020 7499 8644' } }),
    prisma.organisation.create({ data: { name: 'Knight Frank', type: 'Site Agent', phone: '020 7629 8171' } }),
  ]);

  // Media Owners (advertisers)
  const mediaOwners = await Promise.all([
    prisma.organisation.create({ data: { name: 'JCDecaux UK', type: 'Media Owner', phone: '020 7298 8000' } }),
    prisma.organisation.create({ data: { name: 'Clear Channel UK', type: 'Media Owner', phone: '020 7478 2200' } }),
    prisma.organisation.create({ data: { name: 'Global Outdoor', type: 'Media Owner', phone: '020 7766 6000' } }),
    prisma.organisation.create({ data: { name: 'Ocean Outdoor', type: 'Media Owner', phone: '020 7292 0404' } }),
  ]);

  // Law Firms
  const lawFirms = await Promise.all([
    prisma.organisation.create({ data: { name: 'DLA Piper', type: 'Lawyer', phone: '020 7349 0296' } }),
    prisma.organisation.create({ data: { name: 'Addleshaw Goddard', type: 'Lawyer', phone: '020 7606 8855' } }),
    prisma.organisation.create({ data: { name: 'Eversheds Sutherland', type: 'Lawyer', phone: '020 7919 4500' } }),
  ]);

  console.log(`  Created ${localAuthorities.length + siteOwners.length + siteAgents.length + mediaOwners.length + lawFirms.length} organisations\n`);

  // =========================================================================
  // STEP 5: Create Contacts
  // =========================================================================
  console.log('Creating contacts...');

  // Site owner contacts
  const ownerContacts = await Promise.all([
    prisma.contact.create({ data: { firstName: 'James', lastName: 'Wilson', email: 'j.wilson@networkrail.co.uk', phone: '020 7557 8000', jobTitle: 'Property Manager', organisationId: siteOwners[0].id } }),
    prisma.contact.create({ data: { firstName: 'Sarah', lastName: 'Thompson', email: 's.thompson@tfl.gov.uk', phone: '020 3054 4000', jobTitle: 'Commercial Director', organisationId: siteOwners[1].id } }),
    prisma.contact.create({ data: { firstName: 'Michael', lastName: 'Brown', email: 'm.brown@highways.gov.uk', phone: '0300 123 5001', jobTitle: 'Asset Manager', organisationId: siteOwners[2].id } }),
    prisma.contact.create({ data: { firstName: 'Emma', lastName: 'Davies', email: 'e.davies@bruntwood.co.uk', phone: '0161 209 3457', jobTitle: 'Head of Property', organisationId: siteOwners[3].id } }),
    prisma.contact.create({ data: { firstName: 'Robert', lastName: 'Taylor', email: 'r.taylor@landg.com', phone: '020 3124 2001', jobTitle: 'Investment Manager', organisationId: siteOwners[4].id } }),
  ]);

  // Agent contacts
  const agentContacts = await Promise.all([
    prisma.contact.create({ data: { firstName: 'David', lastName: 'Jones', email: 'd.jones@cbre.com', phone: '020 7182 2001', jobTitle: 'Director', organisationId: siteAgents[0].id } }),
    prisma.contact.create({ data: { firstName: 'Lisa', lastName: 'Anderson', email: 'l.anderson@jll.com', phone: '020 7493 4934', jobTitle: 'Associate Director', organisationId: siteAgents[1].id } }),
    prisma.contact.create({ data: { firstName: 'Mark', lastName: 'White', email: 'm.white@savills.com', phone: '020 7499 8645', jobTitle: 'Partner', organisationId: siteAgents[2].id } }),
  ]);

  // Planning case officers
  const caseOfficers = await Promise.all([
    prisma.contact.create({ data: { firstName: 'Catherine', lastName: 'Green', email: 'c.green@cityoflondon.gov.uk', phone: '020 7606 3030', jobTitle: 'Senior Planning Officer', organisationId: localAuthorities[0].id } }),
    prisma.contact.create({ data: { firstName: 'Peter', lastName: 'Clark', email: 'p.clark@manchester.gov.uk', phone: '0161 234 5004', jobTitle: 'Planning Officer', organisationId: localAuthorities[1].id } }),
    prisma.contact.create({ data: { firstName: 'Jennifer', lastName: 'Hall', email: 'j.hall@birmingham.gov.uk', phone: '0121 303 1115', jobTitle: 'Development Control Officer', organisationId: localAuthorities[2].id } }),
    prisma.contact.create({ data: { firstName: 'Andrew', lastName: 'Scott', email: 'a.scott@leeds.gov.uk', phone: '0113 222 4409', jobTitle: 'Planning Case Officer', organisationId: localAuthorities[3].id } }),
  ]);

  // Lawyer contacts
  const lawyerContacts = await Promise.all([
    prisma.contact.create({ data: { firstName: 'Victoria', lastName: 'King', email: 'v.king@dlapiper.com', phone: '020 7349 0297', jobTitle: 'Partner', organisationId: lawFirms[0].id } }),
    prisma.contact.create({ data: { firstName: 'Christopher', lastName: 'Wright', email: 'c.wright@addleshawgoddard.com', phone: '020 7606 8856', jobTitle: 'Senior Associate', organisationId: lawFirms[1].id } }),
  ]);

  // Media owner contacts
  const mediaContacts = await Promise.all([
    prisma.contact.create({ data: { firstName: 'Sophie', lastName: 'Martin', email: 's.martin@jcdecaux.co.uk', phone: '020 7298 8001', jobTitle: 'Acquisitions Manager', organisationId: mediaOwners[0].id } }),
    prisma.contact.create({ data: { firstName: 'Thomas', lastName: 'Baker', email: 't.baker@clearchannel.co.uk', phone: '020 7478 2201', jobTitle: 'Property Director', organisationId: mediaOwners[1].id } }),
    prisma.contact.create({ data: { firstName: 'Rachel', lastName: 'Hughes', email: 'r.hughes@global.com', phone: '020 7766 6001', jobTitle: 'Commercial Manager', organisationId: mediaOwners[2].id } }),
  ]);

  console.log(`  Created ${ownerContacts.length + agentContacts.length + caseOfficers.length + lawyerContacts.length + mediaContacts.length} contacts\n`);

  // =========================================================================
  // STEP 6: Create Addresses
  // =========================================================================
  console.log('Creating addresses...');

  const addresses = await Promise.all([
    // London sites
    prisma.address.create({ data: { line1: '92 Cromwell Road', line2: 'South Kensington', townCityId: towns[0].id, countyId: counties[0].id, postcode: 'SW7 4AA', latitude: 51.4951, longitude: -0.1786 } }),
    prisma.address.create({ data: { line1: '15 Old Street', line2: 'Shoreditch', townCityId: towns[0].id, countyId: counties[0].id, postcode: 'EC1V 9HL', latitude: 51.5246, longitude: -0.0875 } }),
    prisma.address.create({ data: { line1: 'Euston Road', line2: 'Near King\'s Cross', townCityId: towns[0].id, countyId: counties[0].id, postcode: 'NW1 2RT', latitude: 51.5299, longitude: -0.1262 } }),
    // Manchester
    prisma.address.create({ data: { line1: '45 Piccadilly', townCityId: towns[1].id, countyId: counties[1].id, postcode: 'M1 2AB', latitude: 53.4808, longitude: -2.2426 } }),
    prisma.address.create({ data: { line1: 'Deansgate', line2: 'City Centre', townCityId: towns[1].id, countyId: counties[1].id, postcode: 'M3 4LQ', latitude: 53.4794, longitude: -2.2478 } }),
    // Birmingham
    prisma.address.create({ data: { line1: '78 New Street', townCityId: towns[2].id, countyId: counties[2].id, postcode: 'B2 4BA', latitude: 52.4774, longitude: -1.8983 } }),
    prisma.address.create({ data: { line1: 'Broad Street', townCityId: towns[2].id, countyId: counties[2].id, postcode: 'B1 2HF', latitude: 52.4760, longitude: -1.9056 } }),
    // Leeds
    prisma.address.create({ data: { line1: '23 The Headrow', townCityId: towns[3].id, countyId: counties[3].id, postcode: 'LS1 6PU', latitude: 53.7996, longitude: -1.5491 } }),
    // Milton Keynes
    prisma.address.create({ data: { line1: 'Junction 14, M1 Northbound', townCityId: towns[4].id, countyId: counties[4].id, postcode: 'MK10 0AB', latitude: 52.0267, longitude: -0.7560, location: 'M1 Motorway northbound, visible from A509' } }),
    // Glasgow
    prisma.address.create({ data: { line1: '156 Buchanan Street', townCityId: towns[5].id, countyId: counties[5].id, postcode: 'G1 2JX', latitude: 55.8617, longitude: -4.2583 } }),
    // Newcastle
    prisma.address.create({ data: { line1: 'Grey Street', townCityId: towns[6].id, countyId: counties[6].id, postcode: 'NE1 6EE', latitude: 54.9714, longitude: -1.6131 } }),
    // Sheffield
    prisma.address.create({ data: { line1: 'Fargate', townCityId: towns[7].id, countyId: counties[7].id, postcode: 'S1 2HD', latitude: 53.3811, longitude: -1.4701 } }),
    // Liverpool
    prisma.address.create({ data: { line1: 'Church Street', townCityId: towns[8].id, countyId: counties[8].id, postcode: 'L1 3AY', latitude: 53.4058, longitude: -2.9893 } }),
  ]);

  console.log(`  Created ${addresses.length} addresses\n`);

  // =========================================================================
  // STEP 7: Create Sites
  // =========================================================================
  console.log('Creating sites...');

  const sites = await Promise.all([
    // Sites with developments
    prisma.site.create({
      data: {
        name: 'Cromwell Road Digital',
        addressId: addresses[0].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[1].id,
        siteAgentId: siteAgents[0].id,
        localAuthorityId: localAuthorities[0].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Old Street Roundabout',
        addressId: addresses[1].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[0].id,
        localAuthorityId: localAuthorities[0].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Euston Road Tower',
        addressId: addresses[2].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[0].id,
        siteAgentId: siteAgents[1].id,
        localAuthorityId: localAuthorities[0].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Piccadilly Gardens',
        addressId: addresses[3].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[3].id,
        localAuthorityId: localAuthorities[1].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Deansgate Digital',
        addressId: addresses[4].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[3].id,
        localAuthorityId: localAuthorities[1].id,
        type: 'Advertisement',
        internalOwner: 'Planning Team',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Birmingham New Street',
        addressId: addresses[5].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[0].id,
        localAuthorityId: localAuthorities[2].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'M1 Junction 14',
        addressId: addresses[8].id,
        statusId: siteStatuses[0].id,
        siteOwnerId: siteOwners[2].id,
        localAuthorityId: localAuthorities[4].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    // Pipeline sites (no developments yet)
    prisma.site.create({
      data: {
        name: 'Broad Street Birmingham',
        addressId: addresses[6].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[3].id, // Offer in negotiation
        siteOwnerId: siteOwners[4].id,
        localAuthorityId: localAuthorities[2].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Leeds Headrow',
        addressId: addresses[7].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[1].id, // Contact made
        siteOwnerId: siteOwners[5].id,
        siteAgentId: siteAgents[2].id,
        localAuthorityId: localAuthorities[3].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Glasgow Buchanan Street',
        addressId: addresses[9].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[0].id, // Opportunity identified
        localAuthorityId: localAuthorities[5].id,
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Newcastle Grey Street',
        addressId: addresses[10].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[2].id, // Can't contact (parked)
        siteOwnerId: siteOwners[6].id,
        localAuthorityId: localAuthorities[6].id,
        type: 'Advertisement',
        internalOwner: 'Planning Team',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Sheffield Fargate',
        addressId: addresses[11].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[0].id, // Opportunity identified
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
    prisma.site.create({
      data: {
        name: 'Liverpool Church Street',
        addressId: addresses[12].id,
        statusId: siteStatuses[0].id,
        pipelineStatusId: pipelineStatuses[4].id, // Declined (parked)
        type: 'Advertisement',
        internalOwner: 'Test User',
      }
    }),
  ]);

  // Add site owner contacts
  await prisma.siteOwnerContact.create({ data: { siteId: sites[0].id, contactId: ownerContacts[1].id, isPrimary: true } });
  await prisma.siteOwnerContact.create({ data: { siteId: sites[1].id, contactId: ownerContacts[0].id, isPrimary: true } });
  await prisma.siteOwnerContact.create({ data: { siteId: sites[2].id, contactId: ownerContacts[0].id, isPrimary: true } });
  await prisma.siteOwnerContact.create({ data: { siteId: sites[3].id, contactId: ownerContacts[3].id, isPrimary: true } });
  await prisma.siteOwnerContact.create({ data: { siteId: sites[5].id, contactId: ownerContacts[0].id, isPrimary: true } });
  await prisma.siteOwnerContact.create({ data: { siteId: sites[6].id, contactId: ownerContacts[2].id, isPrimary: true } });

  // Add site agent contacts
  await prisma.siteAgentContact.create({ data: { siteId: sites[0].id, contactId: agentContacts[0].id, isPrimary: true } });
  await prisma.siteAgentContact.create({ data: { siteId: sites[2].id, contactId: agentContacts[1].id, isPrimary: true } });
  await prisma.siteAgentContact.create({ data: { siteId: sites[8].id, contactId: agentContacts[2].id, isPrimary: true } });

  // Add site photos (2-3 per site for testing)
  // Using picsum.photos for placeholder images
  console.log('Creating site photos...');
  await Promise.all([
    // Site 0: Cromwell Road Digital - 3 photos
    prisma.sitePhoto.create({ data: { siteId: sites[0].id, photoUrl: 'https://picsum.photos/seed/site0a/800/600', caption: 'Street view - looking north', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[0].id, photoUrl: 'https://picsum.photos/seed/site0b/800/600', caption: 'Proposed location close-up', isPrimary: false, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[0].id, photoUrl: 'https://picsum.photos/seed/site0c/800/600', caption: 'Context - surrounding area', isPrimary: false, uploadedBy: 'Test User' } }),

    // Site 1: Old Street Roundabout - 3 photos
    prisma.sitePhoto.create({ data: { siteId: sites[1].id, photoUrl: 'https://picsum.photos/seed/site1a/800/600', caption: 'Roundabout approach', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[1].id, photoUrl: 'https://picsum.photos/seed/site1b/800/600', caption: 'Traffic flow view', isPrimary: false, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[1].id, photoUrl: 'https://picsum.photos/seed/site1c/800/600', caption: 'Evening lighting conditions', isPrimary: false, uploadedBy: 'Test User' } }),

    // Site 2: Euston Road Tower - 2 photos
    prisma.sitePhoto.create({ data: { siteId: sites[2].id, photoUrl: 'https://picsum.photos/seed/site2a/800/600', caption: 'Tower elevation', isPrimary: true, uploadedBy: 'Planning Team' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[2].id, photoUrl: 'https://picsum.photos/seed/site2b/800/600', caption: 'Ground level context', isPrimary: false, uploadedBy: 'Planning Team' } }),

    // Site 3: Piccadilly Gardens - 3 photos
    prisma.sitePhoto.create({ data: { siteId: sites[3].id, photoUrl: 'https://picsum.photos/seed/site3a/800/600', caption: 'Gardens overview', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[3].id, photoUrl: 'https://picsum.photos/seed/site3b/800/600', caption: 'Footfall area', isPrimary: false, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[3].id, photoUrl: 'https://picsum.photos/seed/site3c/800/600', caption: 'Night view', isPrimary: false, uploadedBy: 'Test User' } }),

    // Site 4: Deansgate Digital - 2 photos
    prisma.sitePhoto.create({ data: { siteId: sites[4].id, photoUrl: 'https://picsum.photos/seed/site4a/800/600', caption: 'High street position', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[4].id, photoUrl: 'https://picsum.photos/seed/site4b/800/600', caption: 'Pedestrian view', isPrimary: false, uploadedBy: 'Test User' } }),

    // Site 5: Birmingham New Street - 3 photos
    prisma.sitePhoto.create({ data: { siteId: sites[5].id, photoUrl: 'https://picsum.photos/seed/site5a/800/600', caption: 'Station entrance view', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[5].id, photoUrl: 'https://picsum.photos/seed/site5b/800/600', caption: 'Commuter flow', isPrimary: false, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[5].id, photoUrl: 'https://picsum.photos/seed/site5c/800/600', caption: 'Visibility assessment', isPrimary: false, uploadedBy: 'Test User' } }),

    // Site 6: M1 Junction 14 - 2 photos
    prisma.sitePhoto.create({ data: { siteId: sites[6].id, photoUrl: 'https://picsum.photos/seed/site6a/800/600', caption: 'Motorway approach', isPrimary: true, uploadedBy: 'Test User' } }),
    prisma.sitePhoto.create({ data: { siteId: sites[6].id, photoUrl: 'https://picsum.photos/seed/site6b/800/600', caption: 'Junction visibility', isPrimary: false, uploadedBy: 'Test User' } }),
  ]);

  console.log(`  Created ${sites.length} sites\n`);

  // =========================================================================
  // STEP 8: Create Developments
  // =========================================================================
  console.log('Creating developments...');

  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const developments = await Promise.all([
    // Dev 1: In planning - very active
    prisma.development.create({
      data: {
        projectNo: 1001,
        siteId: sites[0].id,
        statusId: devStatuses[4].id, // Planning submitted
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Test User',
        internalPlanner: 'Planning Team',
        planningAppStatusId: appStatuses[3].id, // Under consideration
        planningAppRefLa: 'P/2025/1234',
        planningApplicationSubmitted: daysAgo(30),
        planningAppDeterminDate: daysFromNow(30),
        advertAppStatusId: appStatuses[3].id, // Under consideration
        advertAppRefLa: 'A/2025/5678',
        advertApplicationSubmitted: daysAgo(30),
        advertAppDeterminationDate: daysFromNow(30),
        offerAgreed: daysAgo(90),
        leasePerAnnum: 25000,
        term: 15,
        probability: 75,
        rentalValue: 150000,
        caseOfficerId: caseOfficers[0].id,
        lawyerId: lawFirms[0].id,
        lawyerContactId: lawyerContacts[0].id,
        mediaOwnerId: mediaOwners[0].id,
        updatedAt: daysAgo(1),
      }
    }),
    // Dev 2: Consent granted, contracts stage
    prisma.development.create({
      data: {
        projectNo: 1002,
        siteId: sites[1].id,
        statusId: devStatuses[7].id, // Contracts in negotiation
        dealTypeId: dealTypes[0].id, // Acquisition
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Test User',
        internalPlanner: 'Planning Team',
        planningAppStatusId: appStatuses[5].id, // Approved with conditions
        planningAppRefLa: 'P/2024/9012',
        planningApplicationSubmitted: daysAgo(180),
        planningConditions: 'Standard lighting conditions apply',
        planningConditionsNumber: 3,
        advertAppStatusId: appStatuses[4].id, // Approved
        advertAppRefLa: 'A/2024/3456',
        advertApplicationSubmitted: daysAgo(180),
        designSignedOff: 'Yes',
        designSignedOffDate: daysAgo(60),
        designSignedOffBy: 'Client Design Team',
        offerAgreed: daysAgo(240),
        contractIssued: daysAgo(14),
        leasePerAnnum: 35000,
        term: 20,
        purchasePrice: 500000,
        probability: 90,
        rentalValue: 220000,
        caseOfficerId: caseOfficers[0].id,
        lawyerId: lawFirms[0].id,
        lawyerContactId: lawyerContacts[0].id,
        mediaOwnerId: mediaOwners[1].id,
        updatedAt: daysAgo(3),
      }
    }),
    // Dev 3: Out to tender
    prisma.development.create({
      data: {
        projectNo: 1003,
        siteId: sites[2].id,
        statusId: devStatuses[9].id, // Out to tender
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[1].id, // Upgrade
        internalDeveloper: 'Test User',
        planningAppStatusId: appStatuses[4].id, // Approved
        planningAppRefLa: 'P/2024/7890',
        planningApplicationSubmitted: daysAgo(200),
        designSignedOff: 'Yes',
        designSignedOffDate: daysAgo(90),
        contractSigned: daysAgo(45),
        offerAgreed: daysAgo(300),
        leasePerAnnum: 45000,
        leaseStartDate: daysFromNow(60),
        term: 15,
        rentalValue: 280000,
        mediaOwnerId: mediaOwners[2].id,
        updatedAt: daysAgo(7),
      }
    }),
    // Dev 4: In build
    prisma.development.create({
      data: {
        projectNo: 1004,
        siteId: sites[3].id,
        statusId: devStatuses[10].id, // Site in development
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Test User',
        internalPlanner: 'Planning Team',
        planningAppStatusId: appStatuses[4].id, // Approved
        advertAppStatusId: appStatuses[4].id, // Approved
        designSignedOff: 'Yes',
        designSignedOffDate: daysAgo(120),
        contractSigned: daysAgo(90),
        offerAgreed: daysAgo(365),
        buildStartDate: daysAgo(30),
        buildCompletionDate: daysFromNow(60),
        buildContractor: 'ABC Construction Ltd',
        leasePerAnnum: 30000,
        term: 20,
        rentalValue: 200000,
        caseOfficerId: caseOfficers[1].id,
        mediaOwnerId: mediaOwners[0].id,
        updatedAt: daysAgo(2),
      }
    }),
    // Dev 5: Recently completed / operational
    prisma.development.create({
      data: {
        projectNo: 1005,
        siteId: sites[4].id,
        statusId: devStatuses[11].id, // Site operational
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Planning Team',
        planningAppStatusId: appStatuses[4].id, // Approved
        advertAppStatusId: appStatuses[4].id, // Approved
        designSignedOff: 'Yes',
        contractSigned: daysAgo(180),
        offerAgreed: daysAgo(400),
        buildStartDate: daysAgo(120),
        buildCompletionDate: daysAgo(30),
        buildLiveDate: daysAgo(14),
        buildContractor: 'XYZ Builders',
        leasePerAnnum: 40000,
        leaseStartDate: daysAgo(14),
        term: 15,
        rentalValue: 260000,
        mediaOwnerId: mediaOwners[1].id,
        updatedAt: daysAgo(14),
      }
    }),
    // Dev 6: STALLED - no update in 45+ days
    prisma.development.create({
      data: {
        projectNo: 1006,
        siteId: sites[5].id,
        statusId: devStatuses[1].id, // Head of terms agreed
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Test User',
        offerAgreed: daysAgo(100),
        leasePerAnnum: 22000,
        term: 10,
        probability: 50,
        updatedAt: daysAgo(50), // STALLED - 50 days no update
      }
    }),
    // Dev 7: Planning refused, appeal submitted
    prisma.development.create({
      data: {
        projectNo: 1007,
        siteId: sites[6].id,
        statusId: devStatuses[5].id, // Planning refused
        dealTypeId: dealTypes[1].id, // Lease
        developmentTypeId: devTypes[0].id, // New Build
        internalDeveloper: 'Test User',
        internalPlanner: 'Planning Team',
        planningAppStatusId: appStatuses[7].id, // Appeal submitted
        planningAppRefLa: 'P/2024/4567',
        planningApplicationSubmitted: daysAgo(150),
        planningAppealSubmitted: daysAgo(20),
        advertAppStatusId: appStatuses[6].id, // Refused
        offerAgreed: daysAgo(200),
        leasePerAnnum: 50000,
        term: 20,
        probability: 40,
        rentalValue: 300000,
        caseOfficerId: caseOfficers[3].id,
        updatedAt: daysAgo(5),
      }
    }),
  ]);

  console.log(`  Created ${developments.length} developments\n`);

  // =========================================================================
  // STEP 9: Create Development Details (Panel Info)
  // =========================================================================
  console.log('Creating development details (panels)...');

  await Promise.all([
    // Dev 1: Single digital panel
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[0].id,
        panelTypeId: panelTypes[0].id, // Digital LED
        panelSizeId: panelSizes[3].id, // 6m x 3m digital
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[0].id, // Monopole
        quantity: 1,
        sides: 2,
        digital: 'Yes',
        illuminated: 'Yes',
      }
    }),
    // Dev 2: Large digital
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[1].id,
        panelTypeId: panelTypes[0].id, // Digital LED
        panelSizeId: panelSizes[4].id, // 12m x 3m digital
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[3].id, // Gantry
        quantity: 1,
        sides: 1,
        digital: 'Yes',
        illuminated: 'Yes',
      }
    }),
    // Dev 3: Multiple traditional panels
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[2].id,
        panelTypeId: panelTypes[2].id, // Backlit
        panelSizeId: panelSizes[1].id, // 48 sheet
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[0].id, // Monopole
        quantity: 2,
        sides: 2,
        digital: 'No',
        illuminated: 'Yes',
      }
    }),
    // Dev 4: Digital in build
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[3].id,
        panelTypeId: panelTypes[0].id, // Digital LED
        panelSizeId: panelSizes[3].id, // 6m x 3m digital
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[2].id, // Wall mounted
        quantity: 1,
        sides: 1,
        digital: 'Yes',
        illuminated: 'Yes',
      }
    }),
    // Dev 5: Operational digital
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[4].id,
        panelTypeId: panelTypes[0].id, // Digital LED
        panelSizeId: panelSizes[3].id, // 6m x 3m digital
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[0].id, // Monopole
        quantity: 1,
        sides: 2,
        digital: 'Yes',
        illuminated: 'Yes',
      }
    }),
    // Dev 6: Proposed 48 sheet
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[5].id,
        panelTypeId: panelTypes[1].id, // Paper & Paste
        panelSizeId: panelSizes[1].id, // 48 sheet
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[0].id, // Monopole
        quantity: 1,
        sides: 1,
        digital: 'No',
        illuminated: 'No',
      }
    }),
    // Dev 7: Large roadside (appeal)
    prisma.developmentDetail.create({
      data: {
        developmentId: developments[6].id,
        panelTypeId: panelTypes[0].id, // Digital LED
        panelSizeId: panelSizes[4].id, // 12m x 3m
        orientationId: orientations[0].id, // Landscape
        structureTypeId: structures[1].id, // Bipole
        quantity: 1,
        sides: 2,
        digital: 'Yes',
        illuminated: 'Yes',
      }
    }),
  ]);

  console.log('  Created development panel details\n');

  // =========================================================================
  // STEP 10: Create Tasks
  // =========================================================================
  console.log('Creating tasks...');

  await Promise.all([
    // Dev 1 tasks (planning stage)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[0].id,
        description: 'Chase planning officer for decision update',
        dueDate: daysFromNow(2),
        taskTypeId: taskTypes[0].id, // Call
        assignedTo: 'Test User',
        assignedById: 'Admin User',
        needsReview: true,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[0].id,
        description: 'Prepare response to neighbour objections',
        dueDate: daysFromNow(7),
        taskTypeId: taskTypes[4].id, // Document
        assignedTo: 'Planning Team',
        needsReview: false,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[0].id,
        description: 'Review lighting assessment report',
        dueDate: daysAgo(3), // OVERDUE
        taskTypeId: taskTypes[5].id, // Review
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    // Dev 2 tasks (contracts stage)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[1].id,
        description: 'Review contract amendments from lawyer',
        dueDate: daysFromNow(3),
        taskTypeId: taskTypes[5].id, // Review
        assignedTo: 'Test User',
        assignedById: 'Admin User',
        needsReview: true,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[1].id,
        description: 'Schedule contract signing meeting',
        dueDate: daysFromNow(10),
        taskTypeId: taskTypes[2].id, // Meeting
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    // Dev 3 tasks (tender stage)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[2].id,
        description: 'Review tender responses from media owners',
        dueDate: daysAgo(1), // OVERDUE
        taskTypeId: taskTypes[5].id, // Review
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[2].id,
        description: 'Negotiate final terms with preferred bidder',
        dueDate: daysFromNow(14),
        taskTypeId: taskTypes[2].id, // Meeting
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    // Dev 4 tasks (build stage)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[3].id,
        description: 'Site visit to check build progress',
        dueDate: daysFromNow(5),
        taskTypeId: taskTypes[3].id, // Site Visit
        assignedTo: 'Test User',
        assignedById: 'Admin User',
        needsReview: true,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[3].id,
        description: 'Confirm electrical connection date',
        dueDate: daysFromNow(20),
        taskTypeId: taskTypes[0].id, // Call
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    // Dev 6 tasks (stalled)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[5].id,
        description: 'Follow up on design brief',
        dueDate: daysAgo(30), // Very overdue
        taskTypeId: taskTypes[1].id, // Email
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
    // Dev 7 tasks (appeal)
    prisma.developmentTask.create({
      data: {
        developmentId: developments[6].id,
        description: 'Prepare appeal statement',
        dueDate: daysFromNow(21),
        taskTypeId: taskTypes[4].id, // Document
        assignedTo: 'Planning Team',
        needsReview: false,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[6].id,
        description: 'Instruct planning consultant for appeal',
        dueDate: daysFromNow(7),
        taskTypeId: taskTypes[0].id, // Call
        assignedTo: 'Test User',
        assignedById: 'Planning Team',
        needsReview: true,
      }
    }),
    // Completed tasks
    prisma.developmentTask.create({
      data: {
        developmentId: developments[0].id,
        description: 'Submit planning application',
        dueDate: daysAgo(30),
        completedDate: daysAgo(30),
        complete: true,
        taskTypeId: taskTypes[4].id, // Document
        assignedTo: 'Planning Team',
        needsReview: false,
      }
    }),
    prisma.developmentTask.create({
      data: {
        developmentId: developments[1].id,
        description: 'Obtain design sign-off',
        dueDate: daysAgo(60),
        completedDate: daysAgo(60),
        complete: true,
        taskTypeId: taskTypes[5].id, // Review
        assignedTo: 'Test User',
        needsReview: false,
      }
    }),
  ]);

  console.log('  Created 14 tasks (4 need review, 3 overdue, 2 complete)\n');

  // =========================================================================
  // STEP 11: Create Notes
  // =========================================================================
  console.log('Creating development notes...');

  await Promise.all([
    // Dev 1 notes
    prisma.developmentNote.create({
      data: {
        developmentId: developments[0].id,
        noteText: 'Planning officer confirmed application is progressing well. No major objections received so far. Decision expected within target date.',
        noteDate: daysAgo(5),
        noteBy: 'Planning Team',
      }
    }),
    prisma.developmentNote.create({
      data: {
        developmentId: developments[0].id,
        noteText: 'Received call from case officer requesting additional lighting assessment. Forwarded to lighting consultant.',
        noteDate: daysAgo(10),
        noteBy: 'Test User',
      }
    }),
    prisma.developmentNote.create({
      data: {
        developmentId: developments[0].id,
        noteText: 'Initial meeting with TfL property team went well. They are supportive of the digital upgrade proposal.',
        noteDate: daysAgo(60),
        noteBy: 'Test User',
      }
    }),
    // Dev 2 notes
    prisma.developmentNote.create({
      data: {
        developmentId: developments[1].id,
        noteText: 'Contract draft received from DLA Piper. Some amendments needed around break clauses - discussed with client.',
        noteDate: daysAgo(7),
        noteBy: 'Test User',
      }
    }),
    prisma.developmentNote.create({
      data: {
        developmentId: developments[1].id,
        noteText: 'Planning conditions discharged. All pre-commencement conditions now satisfied.',
        noteDate: daysAgo(30),
        noteBy: 'Planning Team',
      }
    }),
    // Dev 3 notes
    prisma.developmentNote.create({
      data: {
        developmentId: developments[2].id,
        noteText: 'Three tender responses received. JCDecaux offer highest rent but shorter term. Clear Channel offering longer commitment.',
        noteDate: daysAgo(3),
        noteBy: 'Test User',
      }
    }),
    // Dev 4 notes
    prisma.developmentNote.create({
      data: {
        developmentId: developments[3].id,
        noteText: 'Build progressing on schedule. Foundation works complete, structure being erected this week.',
        noteDate: daysAgo(7),
        noteBy: 'Test User',
      }
    }),
    prisma.developmentNote.create({
      data: {
        developmentId: developments[3].id,
        noteText: 'Minor delay due to weather - extended completion by 1 week. Still within acceptable timeframe.',
        noteDate: daysAgo(14),
        noteBy: 'Test User',
      }
    }),
    // Dev 5 notes
    prisma.developmentNote.create({
      data: {
        developmentId: developments[4].id,
        noteText: 'Site now live! First campaign already running. Client very happy with position and visibility.',
        noteDate: daysAgo(14),
        noteBy: 'Planning Team',
      }
    }),
    // Dev 6 notes (stalled)
    prisma.developmentNote.create({
      data: {
        developmentId: developments[5].id,
        noteText: 'Still waiting for design brief from client. Chased again but no response.',
        noteDate: daysAgo(50),
        noteBy: 'Test User',
      }
    }),
    // Dev 7 notes (appeal)
    prisma.developmentNote.create({
      data: {
        developmentId: developments[6].id,
        noteText: 'Appeal submitted on grounds of highway safety assessment being flawed. Inspector appointed.',
        noteDate: daysAgo(20),
        noteBy: 'Planning Team',
      }
    }),
    prisma.developmentNote.create({
      data: {
        developmentId: developments[6].id,
        noteText: 'Planning application refused on highway safety grounds. Will appeal - believe decision is unreasonable.',
        noteDate: daysAgo(60),
        noteBy: 'Planning Team',
      }
    }),
  ]);

  console.log('  Created 12 development notes\n');

  // =========================================================================
  // STEP 12: Add Media Owner Contacts
  // =========================================================================
  console.log('Linking media owner contacts to developments...');

  await Promise.all([
    prisma.contact_Development_MediaOwner.create({
      data: { developmentId: developments[0].id, contactId: mediaContacts[0].id }
    }),
    prisma.contact_Development_MediaOwner.create({
      data: { developmentId: developments[1].id, contactId: mediaContacts[1].id }
    }),
    prisma.contact_Development_MediaOwner.create({
      data: { developmentId: developments[2].id, contactId: mediaContacts[2].id }
    }),
    prisma.contact_Development_MediaOwner.create({
      data: { developmentId: developments[3].id, contactId: mediaContacts[0].id }
    }),
  ]);

  console.log('  Done\n');

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('========================================');
  console.log('Seeding complete!');
  console.log('========================================\n');
  console.log('Test data summary:');
  console.log('  - 3 users (test@example.com, admin@example.com, planner@example.com)');
  console.log('  - All passwords: password123');
  console.log('  - 13 sites (7 with developments, 6 pipeline)');
  console.log('  - 7 developments at various stages');
  console.log('  - 14 tasks (4 need review, 3 overdue)');
  console.log('  - 12 development notes');
  console.log('  - 25+ organisations (local authorities, site owners, agents, media owners, law firms)');
  console.log('  - 15+ contacts with full details');
  console.log('\nDevelopments by stage:');
  console.log('  - #1001: Planning submitted (active)');
  console.log('  - #1002: Contracts in negotiation');
  console.log('  - #1003: Out to tender');
  console.log('  - #1004: Site in development (building)');
  console.log('  - #1005: Site operational (live)');
  console.log('  - #1006: Head of terms agreed (STALLED - 50 days no update)');
  console.log('  - #1007: Planning refused (appeal submitted)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
