import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// This is an API route that checks if the database connection is working.
//
// API routes in Next.js live in the app/api folder. Each route.ts file
// defines endpoints that can be called from the browser or other services.
//
// The GET function handles HTTP GET requests to /api/health

export async function GET() {
  try {
    // Try to count records in a simple table to verify database connection
    const siteStatusCount = await db.siteStatus.count()

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      message: `Database connected successfully. Found ${siteStatusCount} site status records.`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    // If there's an error, return details to help debug
    console.error('Database health check failed:', error)

    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
