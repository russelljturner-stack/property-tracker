/**
 * API Route: PATCH /api/developments/[id]/design
 *
 * Updates the design fields of a development.
 * This handles partial updates - only fields included in the request body are updated.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

// Fields that can be updated through this endpoint
const ALLOWED_FIELDS = [
  "designUrl",
  "designFinalOrDraft",
  "designSignedOff",
  "designSignedOffDate",
  "designSignedOffBy",
]

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication using NextAuth v5's auth() function
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get development ID from URL params
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

    // Filter to only allowed fields
    const updateData: Record<string, unknown> = {}
    const errors: Record<string, string> = {}

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_FIELDS.includes(key)) {
        continue // Skip unknown fields
      }

      // Handle date fields
      if (key === "designSignedOffDate") {
        if (value !== null && value !== undefined && value !== "") {
          const date = new Date(value as string)
          if (isNaN(date.getTime())) {
            errors[key] = "Must be a valid date"
            continue
          }
          updateData[key] = date
        } else {
          updateData[key] = null
        }
      }
      // Handle string fields
      else {
        updateData[key] = value === "" ? null : value
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ message: "Validation failed", errors }, { status: 400 })
    }

    // If no valid fields to update, return error
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 })
    }

    // Add updated timestamp
    updateData.updatedAt = new Date()

    // Perform the update
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
    console.error("Error updating design data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
