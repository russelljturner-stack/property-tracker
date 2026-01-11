// Script to create or reset a user password
//
// Run with: npx tsx scripts/reset-user.ts
//
// This script will:
// 1. Check if the user exists
// 2. If not, create them
// 3. Reset their password to a known value

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const EMAIL = "admin@example.com"
const PASSWORD = "password123"  // Change this after logging in!
const NAME = "Admin User"

async function main() {
  console.log("Connecting to database...")

  // Hash the password
  const passwordHash = await bcrypt.hash(PASSWORD, 10)

  // Try to find existing user
  const existingUser = await prisma.user.findUnique({
    where: { email: EMAIL },
  })

  if (existingUser) {
    // Update existing user's password
    await prisma.user.update({
      where: { email: EMAIL },
      data: {
        passwordHash,
        isActive: true,
      },
    })
    console.log(`\nPassword reset for existing user: ${EMAIL}`)
  } else {
    // Create new user
    await prisma.user.create({
      data: {
        email: EMAIL,
        name: NAME,
        passwordHash,
        isActive: true,
      },
    })
    console.log(`\nCreated new user: ${EMAIL}`)
  }

  console.log(`\n✓ Login credentials:`)
  console.log(`  Email: ${EMAIL}`)
  console.log(`  Password: ${PASSWORD}`)
  console.log(`\n⚠ Remember to change your password after logging in!`)
}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
