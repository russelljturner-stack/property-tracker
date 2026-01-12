/**
 * Database Seed Script
 *
 * This script populates lookup tables with initial data.
 * Run with: npm run db:seed
 *
 * WHAT THIS DOES:
 * - Creates the Site Pipeline Status options (for sites before a Development exists)
 * - Creates the Development Status options (for tracking development progress)
 * - Uses "upsert" which means: create if doesn't exist, update if it does
 *   This makes the script safe to run multiple times.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...\n');

  // Clear existing test data (in reverse order of dependencies)
  console.log('Clearing existing test data...');
  await prisma.developmentTask.deleteMany({});
  await prisma.developmentDetail.deleteMany({});
  await prisma.development.deleteMany({});
  await prisma.site.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.townCity.deleteMany({});
  await prisma.panelSize.deleteMany({});
  await prisma.panelType.deleteMany({});
  await prisma.taskType.deleteMany({});
  await prisma.siteStatus.deleteMany({});
  await prisma.developmentStatus.deleteMany({});
  await prisma.sitePipelineStatus.deleteMany({});
  console.log('  Cleared existing data\n');

  // -------------------------------------------------------------------------
  // Test User (for login)
  // -------------------------------------------------------------------------
  console.log('Creating test user...');

  // Create a Developer role
  const developerRole = await prisma.role.upsert({
    where: { name: 'Developer' },
    update: {},
    create: {
      name: 'Developer',
      description: 'Property developer - can manage sites and developments',
      canViewSites: true,
      canEditSites: true,
      canDeleteSites: false,
      canViewDevelopments: true,
      canEditDevelopments: true,
      canDeleteDevelopments: false,
      canViewContacts: true,
      canEditContacts: true,
      canViewReports: true,
    },
  });

  // Create a test user with a known password
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: { passwordHash }, // Update password in case it changed
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash,
      isActive: true,
      roleId: developerRole.id,
    },
  });
  console.log('  Created test user: test@example.com / password123\n');

  // -------------------------------------------------------------------------
  // Site Pipeline Status
  // These track a site's progress BEFORE a Development is created
  // -------------------------------------------------------------------------
  console.log('Creating Site Pipeline Statuses...');

  const sitePipelineStatuses = [
    {
      name: 'Opportunity identified',
      description: 'Site first logged - needs research',
      sortOrder: 1,
      isParked: false
    },
    {
      name: 'Contact made with land owner / agent',
      description: 'In discussion with landowner or their agent',
      sortOrder: 2,
      isParked: false
    },
    {
      name: 'Land owner / agent can\'t be contacted',
      description: 'Parked - unable to reach decision maker, try again later',
      sortOrder: 3,
      isParked: true  // This is a "parked" status
    },
    {
      name: 'Offer in negotiation',
      description: 'Active discussions on terms with decision maker',
      sortOrder: 4,
      isParked: false
    },
    {
      name: 'Offers declined - no deal reached',
      description: 'Parked - landowner declined, may revisit in future',
      sortOrder: 5,
      isParked: true  // This is a "parked" status
    },
  ];

  for (const status of sitePipelineStatuses) {
    await prisma.sitePipelineStatus.upsert({
      where: { name: status.name },
      update: {
        description: status.description,
        sortOrder: status.sortOrder,
        isParked: status.isParked
      },
      create: status,
    });
  }
  console.log(`  Created ${sitePipelineStatuses.length} pipeline statuses\n`);

  // -------------------------------------------------------------------------
  // Development Status
  // These track a Development's progress through the workflow
  // -------------------------------------------------------------------------
  console.log('Creating Development Statuses...');

  const developmentStatuses = [
    // Negotiation stage
    { name: 'Offer accepted', description: 'Deal agreed, development created', sortOrder: 1, colour: '#17a2b8' },
    { name: 'Head of terms agreed', description: 'Formal terms documented', sortOrder: 2, colour: '#17a2b8' },
    { name: 'ASGF required', description: 'Advertising Safety Guidance Form needed (roadside)', sortOrder: 3, colour: '#ffc107' },
    { name: 'Awaiting ASGF outcome', description: 'Waiting on ASGF approval', sortOrder: 4, colour: '#ffc107' },

    // Planning stage
    { name: 'Planning / advert application submitted', description: 'Application with local authority', sortOrder: 5, colour: '#6f42c1' },
    { name: 'Planning / advert consent refused', description: 'Need to appeal or redesign', sortOrder: 6, colour: '#dc3545' },
    { name: 'Planning / advert consent granted', description: 'Approved - can proceed', sortOrder: 7, colour: '#28a745' },

    // Contracts stage
    { name: 'Contracts in negotiation', description: 'Legal stage - negotiating contracts', sortOrder: 8, colour: '#fd7e14' },
    { name: 'Contracts exchanged', description: 'Legally committed', sortOrder: 9, colour: '#28a745' },

    // Marketing/Tendering stage
    { name: 'Out to tender', description: 'Finding advertisers', sortOrder: 10, colour: '#20c997' },

    // Build stage
    { name: 'Site in development', description: 'Construction underway', sortOrder: 11, colour: '#6610f2' },

    // Complete
    { name: 'Site operational', description: 'Live and earning', sortOrder: 12, colour: '#28a745' },

    // Terminal/paused states
    { name: 'Development on hold', description: 'Temporary pause', sortOrder: 13, colour: '#6c757d' },
    { name: 'Development dropped', description: 'Cancelled/abandoned', sortOrder: 14, colour: '#dc3545' },
  ];

  for (const status of developmentStatuses) {
    await prisma.developmentStatus.upsert({
      where: { name: status.name },
      update: {
        description: status.description,
        sortOrder: status.sortOrder,
        colour: status.colour
      },
      create: status,
    });
  }
  console.log(`  Created ${developmentStatuses.length} development statuses\n`);

  // -------------------------------------------------------------------------
  // Site Status (Live/Dead)
  // Basic status for whether a site record is active
  // -------------------------------------------------------------------------
  console.log('Creating Site Statuses...');

  const siteStatuses = [
    { name: 'Live', description: 'Active site record', sortOrder: 1 },
    { name: 'Dead', description: 'Inactive/archived site record', sortOrder: 2 },
  ];

  for (const status of siteStatuses) {
    await prisma.siteStatus.upsert({
      where: { name: status.name },
      update: { description: status.description, sortOrder: status.sortOrder },
      create: status,
    });
  }
  console.log(`  Created ${siteStatuses.length} site statuses\n`);

  // -------------------------------------------------------------------------
  // Task Types
  // -------------------------------------------------------------------------
  console.log('Creating Task Types...');

  const taskTypes = [
    { name: 'Call', description: 'Phone call required' },
    { name: 'Email', description: 'Email to send' },
    { name: 'Meeting', description: 'Meeting to attend' },
    { name: 'Site Visit', description: 'Visit the site' },
    { name: 'Internal', description: 'Internal task' },
  ];

  for (const taskType of taskTypes) {
    await prisma.taskType.upsert({
      where: { name: taskType.name },
      update: { description: taskType.description },
      create: taskType,
    });
  }
  console.log(`  Created ${taskTypes.length} task types\n`);

  // -------------------------------------------------------------------------
  // Panel Types and Sizes
  // -------------------------------------------------------------------------
  console.log('Creating Panel Types and Sizes...');

  const panelTypes = [
    { name: 'Digital', description: 'LED digital screen' },
    { name: 'Paper & Paste', description: 'Traditional poster' },
    { name: 'Backlit', description: 'Illuminated poster' },
  ];

  for (const pt of panelTypes) {
    await prisma.panelType.upsert({
      where: { name: pt.name },
      update: { description: pt.description },
      create: pt,
    });
  }

  const panelSizes = [
    { name: '48 Sheet', description: '6m x 3m standard billboard' },
    { name: '96 Sheet', description: '12m x 3m large billboard' },
    { name: '6 Sheet', description: '1.2m x 1.8m small format' },
  ];

  for (const ps of panelSizes) {
    await prisma.panelSize.upsert({
      where: { name: ps.name },
      update: { description: ps.description },
      create: ps,
    });
  }
  console.log(`  Created panel types and sizes\n`);

  // -------------------------------------------------------------------------
  // TEST DATA: Addresses, Sites, Developments, Tasks
  // This creates realistic-looking test data so you can see the dashboard working
  // -------------------------------------------------------------------------
  console.log('Creating test data (addresses, sites, developments, tasks)...\n');

  // Get status IDs for reference
  const liveStatus = await prisma.siteStatus.findUnique({ where: { name: 'Live' } });
  const pipelineStatus1 = await prisma.sitePipelineStatus.findUnique({ where: { name: 'Opportunity identified' } });
  const pipelineStatus2 = await prisma.sitePipelineStatus.findUnique({ where: { name: 'Contact made with land owner / agent' } });
  const pipelineStatus3 = await prisma.sitePipelineStatus.findUnique({ where: { name: 'Offer in negotiation' } });
  const pipelineStatusParked = await prisma.sitePipelineStatus.findUnique({ where: { name: 'Land owner / agent can\'t be contacted' } });

  const devStatusPlanning = await prisma.developmentStatus.findUnique({ where: { name: 'Planning / advert application submitted' } });
  const devStatusDesign = await prisma.developmentStatus.findUnique({ where: { name: 'Head of terms agreed' } });
  const devStatusTender = await prisma.developmentStatus.findUnique({ where: { name: 'Out to tender' } });
  const devStatusBuild = await prisma.developmentStatus.findUnique({ where: { name: 'Site in development' } });
  const devStatusGranted = await prisma.developmentStatus.findUnique({ where: { name: 'Planning / advert consent granted' } });

  const digitalType = await prisma.panelType.findUnique({ where: { name: 'Digital' } });
  const paperType = await prisma.panelType.findUnique({ where: { name: 'Paper & Paste' } });
  const size48 = await prisma.panelSize.findUnique({ where: { name: '48 Sheet' } });
  const size96 = await prisma.panelSize.findUnique({ where: { name: '96 Sheet' } });

  const callType = await prisma.taskType.findUnique({ where: { name: 'Call' } });
  const emailType = await prisma.taskType.findUnique({ where: { name: 'Email' } });
  const meetingType = await prisma.taskType.findUnique({ where: { name: 'Meeting' } });
  const siteVisitType = await prisma.taskType.findUnique({ where: { name: 'Site Visit' } });

  // Create towns/cities first
  const london = await prisma.townCity.upsert({
    where: { name: 'London' },
    update: {},
    create: { name: 'London' }
  });
  const manchester = await prisma.townCity.upsert({
    where: { name: 'Manchester' },
    update: {},
    create: { name: 'Manchester' }
  });
  const miltonKeynes = await prisma.townCity.upsert({
    where: { name: 'Milton Keynes' },
    update: {},
    create: { name: 'Milton Keynes' }
  });
  const birmingham = await prisma.townCity.upsert({
    where: { name: 'Birmingham' },
    update: {},
    create: { name: 'Birmingham' }
  });
  const leeds = await prisma.townCity.upsert({
    where: { name: 'Leeds' },
    update: {},
    create: { name: 'Leeds' }
  });
  const glasgow = await prisma.townCity.upsert({
    where: { name: 'Glasgow' },
    update: {},
    create: { name: 'Glasgow' }
  });
  const newcastle = await prisma.townCity.upsert({
    where: { name: 'Newcastle' },
    update: {},
    create: { name: 'Newcastle' }
  });

  console.log('  Created 7 towns/cities');

  // Create addresses
  const address1 = await prisma.address.create({
    data: { line1: '92 Cromwell Road', townCityId: london.id, postcode: 'SW7 4AA' }
  });
  const address2 = await prisma.address.create({
    data: { line1: '45 High Street', townCityId: manchester.id, postcode: 'M1 2AB' }
  });
  const address3 = await prisma.address.create({
    data: { line1: 'Junction 12, M1 Northbound', townCityId: miltonKeynes.id, postcode: 'MK10 1AA' }
  });
  const address4 = await prisma.address.create({
    data: { line1: '78 Station Road', townCityId: birmingham.id, postcode: 'B1 3CD' }
  });
  const address5 = await prisma.address.create({
    data: { line1: '23 Kings Way', townCityId: leeds.id, postcode: 'LS1 4EF' }
  });
  const address6 = await prisma.address.create({
    data: { line1: '156 Queen Street', townCityId: glasgow.id, postcode: 'G1 5GH' }
  });
  const address7 = await prisma.address.create({
    data: { line1: 'A1 Southbound, Junction 45', townCityId: newcastle.id, postcode: 'NE1 6IJ' }
  });

  console.log('  Created 7 addresses');

  // Create sites - mix of pipeline sites and sites with developments
  const site1 = await prisma.site.create({
    data: {
      name: '92 Cromwell Road',
      addressId: address1.id,
      statusId: liveStatus?.id,
      pipelineStatusId: pipelineStatus3?.id, // Offer in negotiation
      type: 'Advertisement',
    }
  });

  const site2 = await prisma.site.create({
    data: {
      name: 'Manchester High Street',
      addressId: address2.id,
      statusId: liveStatus?.id,
      // No pipeline status - has a development
      type: 'Advertisement',
    }
  });

  const site3 = await prisma.site.create({
    data: {
      name: 'M1 Junction 12',
      addressId: address3.id,
      statusId: liveStatus?.id,
      // No pipeline status - has a development
      type: 'Advertisement',
    }
  });

  const site4 = await prisma.site.create({
    data: {
      name: 'Birmingham Station Road',
      addressId: address4.id,
      statusId: liveStatus?.id,
      // No pipeline status - has a development
      type: 'Advertisement',
    }
  });

  const site5 = await prisma.site.create({
    data: {
      name: 'Leeds Kings Way',
      addressId: address5.id,
      statusId: liveStatus?.id,
      pipelineStatusId: pipelineStatus1?.id, // Opportunity identified
      type: 'Advertisement',
    }
  });

  const site6 = await prisma.site.create({
    data: {
      name: 'Glasgow Queen Street',
      addressId: address6.id,
      statusId: liveStatus?.id,
      pipelineStatusId: pipelineStatus2?.id, // Contact made
      type: 'Advertisement',
    }
  });

  const site7 = await prisma.site.create({
    data: {
      name: 'A1 Junction 45',
      addressId: address7.id,
      statusId: liveStatus?.id,
      pipelineStatusId: pipelineStatusParked?.id, // Parked - can't contact
      type: 'Advertisement',
    }
  });

  console.log('  Created 7 sites (4 pipeline, 3 with developments)');

  // Create developments
  const dev1 = await prisma.development.create({
    data: {
      projectNo: 1001,
      siteId: site2.id,
      statusId: devStatusPlanning?.id,
      internalDeveloper: 'Test User',
      updatedAt: new Date(), // Recent activity
    }
  });

  const dev2 = await prisma.development.create({
    data: {
      projectNo: 1002,
      siteId: site3.id,
      statusId: devStatusTender?.id,
      internalDeveloper: 'Test User',
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    }
  });

  const dev3 = await prisma.development.create({
    data: {
      projectNo: 1003,
      siteId: site4.id,
      statusId: devStatusDesign?.id,
      internalDeveloper: 'Test User',
      updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago - STALLED
    }
  });

  const dev4 = await prisma.development.create({
    data: {
      projectNo: 1004,
      siteId: site2.id, // Same site, different development (upgrade)
      statusId: devStatusGranted?.id,
      internalDeveloper: 'Test User',
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    }
  });

  console.log('  Created 4 developments (1 stalled)');

  // Create development details (panel info)
  await prisma.developmentDetail.create({
    data: {
      developmentId: dev1.id,
      panelTypeId: digitalType?.id,
      panelSizeId: size48?.id,
      quantity: 1,
    }
  });

  await prisma.developmentDetail.create({
    data: {
      developmentId: dev2.id,
      panelTypeId: digitalType?.id,
      panelSizeId: size96?.id,
      quantity: 2,
    }
  });

  await prisma.developmentDetail.create({
    data: {
      developmentId: dev3.id,
      panelTypeId: paperType?.id,
      panelSizeId: size48?.id,
      quantity: 1,
    }
  });

  await prisma.developmentDetail.create({
    data: {
      developmentId: dev4.id,
      panelTypeId: digitalType?.id,
      panelSizeId: size48?.id,
      quantity: 1,
    }
  });

  console.log('  Created development details (panel info)');

  // Create tasks
  await prisma.developmentTask.create({
    data: {
      developmentId: dev1.id,
      description: 'Chase planning officer for update',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Due in 2 days
      taskTypeId: callType?.id,
      assignedTo: 'Test User',
      assignedById: 'Manager',
      needsReview: true, // NEW - needs review
    }
  });

  await prisma.developmentTask.create({
    data: {
      developmentId: dev1.id,
      description: 'Prepare planning appeal if refused',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 2 weeks
      taskTypeId: emailType?.id,
      assignedTo: 'Test User',
      needsReview: false,
    }
  });

  await prisma.developmentTask.create({
    data: {
      developmentId: dev2.id,
      description: 'Review tender responses',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // OVERDUE - yesterday
      taskTypeId: meetingType?.id,
      assignedTo: 'Test User',
      needsReview: false,
    }
  });

  await prisma.developmentTask.create({
    data: {
      developmentId: dev3.id,
      description: 'Site visit to check measurements',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Due in 5 days
      taskTypeId: siteVisitType?.id,
      assignedTo: 'Test User',
      assignedById: 'Manager',
      needsReview: true, // NEW - needs review
    }
  });

  await prisma.developmentTask.create({
    data: {
      developmentId: dev4.id,
      description: 'Send contract to legal',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Due tomorrow
      taskTypeId: emailType?.id,
      assignedTo: 'Test User',
      needsReview: false,
    }
  });

  console.log('  Created 5 tasks (2 need review, 1 overdue)\n');

  console.log('Seeding complete!');
  console.log('\nTest data summary:');
  console.log('  - 4 pipeline sites (sites without developments)');
  console.log('  - 4 active developments');
  console.log('  - 1 stalled development (no activity 45 days)');
  console.log('  - 5 tasks (2 need review, 1 overdue)');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
