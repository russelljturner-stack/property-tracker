// This script creates a test user so you can log into the application.
//
// RUN THIS SCRIPT WITH:
//   npx tsx prisma/scripts/seed-test-user.ts
//
// It creates:
// - An "Admin" role with full permissions
// - A test user: admin@example.com / password123

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test user...')

  // Create or update Admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},  // Don't change if exists
    create: {
      name: 'Admin',
      description: 'Full administrative access',
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
  })

  console.log('Admin role created/found:', adminRole.name)

  // Hash the password
  // IMPORTANT: In production, use a strong unique password!
  const passwordHash = await bcrypt.hash('password123', 12)

  // Create or update test user
  const testUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      passwordHash,  // Reset password if user exists
    },
    create: {
      email: 'admin@example.com',
      name: 'Test Admin',
      passwordHash,
      isActive: true,
      roleId: adminRole.id,
    },
  })

  console.log('Test user created/updated:', testUser.email)
  console.log('')
  console.log('You can now log in with:')
  console.log('  Email:    admin@example.com')
  console.log('  Password: password123')
  console.log('')
  console.log('IMPORTANT: Change this password before using in production!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
