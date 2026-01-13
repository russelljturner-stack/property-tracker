/**
 * API Route: PATCH /api/developments/[id]/marketing
 *
 * Updates the marketing fields of a development.
 * Mainly handles media owner selection.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Fields that can be updated through this endpoint
const ALLOWED_FIELDS = [
  "mediaOwnerId",
  "mediaOwnerAgentId",
]

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get development ID
    const { id } = await params
    const developmentId = parseInt(id, 10)

    if (isNaN(developmentId)) {
      return NextResponse.json({ message: "Invalid development ID" }, { status: 400 })
    }

    // Check development exists
    const development = await db.development.findUnique({
      where: { id: developmentId },
      select: { id: true },
    })

    if (!development) {
      return NextResponse.json({ message: "Development not found" }, { status: 404 })
    }

    // Parse request body
    const body = await request.json()

    // Filter and validate fields
    const updateData: Record<string, unknown> = {}
    const errors: Record<string, string> = {}

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) {
        continue
      }

      // All fields are foreign key IDs
      if (value !== null && value !== undefined && value !== "") {
        const num = parseInt(value as string, 10)
        if (isNaN(num)) {
          errors[key] = "Must be a valid ID"
          continue
        }
        updateData[key] = num
      } else {
        updateData[key] = null
      }
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    // Check we have something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    // Add timestamp
    updateData.updatedAt = new Date()

    // Perform update
    const updated = await db.development.update({
      where: { id: developmentId },
      data: updateData,
      select: {
        id: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "Updated successfully",
      id: updated.id,
      updatedAt: updated.updatedAt,
    })
  } catch (error) {
    console.error("Error updating marketing data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
