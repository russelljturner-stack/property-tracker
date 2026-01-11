import { PrismaClient } from '@prisma/client'

// This file creates a single database connection that can be reused
// throughout your application. In development, Next.js reloads files
// frequently, so we store the client globally to avoid creating
// multiple connections.

// Declare a global variable to hold the Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create the Prisma client, or reuse an existing one
export const db = globalForPrisma.prisma ?? new PrismaClient()

// In development, save the client to the global variable
// so it persists between hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}
